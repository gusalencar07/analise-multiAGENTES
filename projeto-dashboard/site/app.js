"use strict";

const DATA_URL = "data/vendas.json";
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const monthNames = new Map([["2026-01", "Jan/2026"], ["2026-02", "Fev/2026"], ["2026-03", "Mar/2026"]]);
const chartColors = Object.freeze({ green: "#387D68", blue: "#B9DDF8", graphite: "#292633", cream: "#FFF9F0" });
const filterGroups = [
  { containerId: "city-filters", field: "cidade", label: "Cidade" },
  { containerId: "category-filters", field: "categoria", label: "Categoria" },
  { containerId: "product-filters", field: "produto", label: "Produto" },
  { containerId: "payment-filters", field: "forma_pagamento", label: "Forma de pagamento" },
];
const svgNS = "http://www.w3.org/2000/svg";
let sales = [];

function element(tag, attributes = {}, text = "") {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  if (text) node.textContent = text;
  return node;
}

function renderFilter(containerId, field, values) {
  const container = document.getElementById(containerId);
  for (const [index, value] of values.entries()) {
    const input = element("input", { type: "checkbox", value, id: `${field}-${index}`, checked: "" });
    input.addEventListener("change", updateDashboard);
    const label = element("label", { class: "check-option", for: input.id });
    label.append(input, document.createTextNode(value));
    container.append(label);
  }
}

function selectedValues(containerId) {
  return new Set([...document.querySelectorAll(`#${containerId} input:checked`)].map((input) => input.value));
}

function getAvailableValues(containerId) {
  return [...document.querySelectorAll(`#${containerId} input`)].map((input) => input.value);
}

function filteredSales() {
  const selected = new Map(filterGroups.map(({ containerId }) => [containerId, selectedValues(containerId)]));
  if ([...selected.values()].some((values) => values.size === 0)) return [];

  const period = document.getElementById("period-filter").value;
  const query = document.getElementById("product-search").value.trim().toLocaleLowerCase("pt-BR");
  return sales.filter((sale) => {
    if (!filterGroups.every(({ containerId, field }) => selected.get(containerId).has(sale[field]))) return false;
    if (period !== "all" && sale.data.slice(0, 7) !== period) return false;
    if (query && !sale.produto.toLocaleLowerCase("pt-BR").includes(query)) return false;
    return true;
  });
}

function monthLabel(month) {
  return monthNames.get(month) || month;
}

function summarizeBy(rows, getLabel) {
  const grouped = new Map();
  for (const row of rows) {
    const label = getLabel(row);
    if (!grouped.has(label)) grouped.set(label, { label, total: 0, sales: 0, units: 0 });
    const group = grouped.get(label);
    group.total += Number(row.valor_venda);
    group.sales += 1;
    group.units += Number(row.quantidade);
  }
  return [...grouped.values()];
}

function volumeDescription(group) {
  const saleWord = group.sales === 1 ? "venda" : "vendas";
  const unitWord = group.units === 1 ? "unidade" : "unidades";
  return `${integer.format(group.sales)} ${saleWord} · ${integer.format(group.units)} ${unitWord}`;
}

function activeFilterSummary() {
  const active = [];
  const period = document.getElementById("period-filter").value;
  if (period !== "all") active.push(`Período: ${monthLabel(period)}`);

  const query = document.getElementById("product-search").value.trim();
  if (query) active.push(`Busca de produto: “${query}”`);

  for (const { containerId, label } of filterGroups) {
    const selected = [...selectedValues(containerId)];
    const available = getAvailableValues(containerId);
    if (selected.length === available.length) continue;
    active.push(selected.length ? `${label}: ${selected.join(", ")}` : `${label}: nenhuma opção selecionada`);
  }

  return active.length ? `Filtros ativos: ${active.join("; ")}.` : "Filtros ativos: nenhum.";
}

function addSvg(parent, name, attributes = {}, text = "") {
  const node = document.createElementNS(svgNS, name);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  if (text) node.textContent = text;
  parent.append(node);
  return node;
}

function chartTooltip(container) {
  const tooltip = element("div", {
    id: `${container.id}-tooltip`,
    class: "chart-tooltip",
    role: "status",
    "aria-live": "polite",
    hidden: "",
  });
  tooltip.append(
    element("span", { class: "chart-tooltip-title" }),
    element("strong", { class: "chart-tooltip-value" }),
    element("span", { class: "chart-tooltip-details" }),
  );
  return tooltip;
}

function createTooltipController(container, tooltip) {
  let focusedMark = null;
  let hoveredMark = null;

  function hide() {
    tooltip.hidden = true;
    tooltip.querySelector(".chart-tooltip-title").textContent = "";
    tooltip.querySelector(".chart-tooltip-value").textContent = "";
    tooltip.querySelector(".chart-tooltip-details").textContent = "";
    tooltip.style.left = "";
    tooltip.style.top = "";
  }

  function show(mark) {
    tooltip.querySelector(".chart-tooltip-title").textContent = mark.dataset.tooltipLabel;
    tooltip.querySelector(".chart-tooltip-value").textContent = mark.dataset.tooltipValue;
    tooltip.querySelector(".chart-tooltip-details").textContent = mark.dataset.tooltipDetail;
    tooltip.hidden = false;

    const containerRect = container.getBoundingClientRect();
    const markRect = mark.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const centerX = markRect.left - containerRect.left + markRect.width / 2;
    const left = Math.max(8, Math.min(centerX - tooltipRect.width / 2, containerRect.width - tooltipRect.width - 8));
    const above = markRect.top - containerRect.top - tooltipRect.height - 10;
    const below = markRect.bottom - containerRect.top + 10;
    const top = above >= 8 ? above : Math.min(below, containerRect.height - tooltipRect.height - 8);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${Math.max(8, top)}px`;
  }

  function restoreOrHide() {
    const activeMark = focusedMark || hoveredMark;
    if (activeMark) show(activeMark);
    else hide();
  }

  return function bindTooltip(mark, group) {
    const label = group.label;
    const value = brl.format(group.total);
    const detail = volumeDescription(group);
    const accessibleDescription = `${label}: ${value}. ${detail}.`;

    mark.setAttribute("class", "chart-mark");
    mark.setAttribute("data-tooltip-label", label);
    mark.setAttribute("data-tooltip-value", value);
    mark.setAttribute("data-tooltip-detail", detail);
    mark.setAttribute("tabindex", "0");
    mark.setAttribute("role", "img");
    mark.setAttribute("aria-label", accessibleDescription);
    mark.setAttribute("aria-describedby", tooltip.id);
    addSvg(mark, "title", {}, accessibleDescription);

    mark.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      hoveredMark = mark;
      show(mark);
    });
    mark.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "touch" && hoveredMark === mark) show(mark);
    });
    mark.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch" || hoveredMark !== mark) return;
      hoveredMark = null;
      restoreOrHide();
    });
    mark.addEventListener("focus", () => {
      if (!mark.matches(":focus-visible")) return;
      focusedMark = mark;
      show(mark);
    });
    mark.addEventListener("blur", () => {
      if (focusedMark === mark) focusedMark = null;
      restoreOrHide();
    });
  };
}

function chartSvg(container, description, width, height) {
  container.replaceChildren();
  const svg = addSvg(container, "svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": description });
  const tooltip = chartTooltip(container);
  container.append(tooltip);
  return { svg, bindTooltip: createTooltipController(container, tooltip) };
}

function formatGroupForDescription(group) {
  return `${group.label}: ${brl.format(group.total)}, ${volumeDescription(group)}`;
}

function renderMonthlyChart(rows) {
  const container = document.getElementById("monthly-chart");
  if (!rows.length) return showChartEmpty(container);

  const grouped = new Map(summarizeBy(rows, (row) => row.data.slice(0, 7)).map((group) => [group.label, group]));
  const months = [...new Set(sales.map((row) => row.data.slice(0, 7)))].sort();
  const values = months.map((month) => grouped.get(month) || { label: month, total: 0, sales: 0, units: 0 });
  const maximum = Math.max(...values.map((point) => point.total), 1);
  const width = container.clientWidth || 520;
  const summary = values.map((point) => formatGroupForDescription({ ...point, label: monthLabel(point.label) })).join("; ");
  const description = `Linha temporal do valor total vendido em reais por mês. ${summary}`;
  const { svg, bindTooltip } = chartSvg(container, description, width, 255);
  const left = 72, right = width - 14, top = 38, bottom = 205;

  for (let tick = 0; tick <= 4; tick++) {
    const y = bottom - (bottom - top) * tick / 4;
    addSvg(svg, "line", { x1: left, y1: y, x2: right, y2: y, stroke: "#d6e0e6", "stroke-width": 1 });
    addSvg(svg, "text", { x: left - 8, y: y + 4, "text-anchor": "end", class: "axis-label" }, brl.format(maximum * tick / 4).replace(",00", ""));
  }

  const points = values.map((point, index) => ({
    ...point,
    label: monthLabel(point.label),
    x: values.length === 1 ? (left + right) / 2 : left + (right - left) * index / (values.length - 1),
    y: bottom - (bottom - top) * point.total / maximum,
  }));
  addSvg(svg, "polyline", { points: points.map((point) => `${point.x},${point.y}`).join(" "), fill: "none", stroke: chartColors.green, "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" });

  for (const [index, point] of points.entries()) {
    const mark = addSvg(svg, "circle", { cx: point.x, cy: point.y, r: 6, fill: chartColors.cream, stroke: chartColors.green, "stroke-width": 3 });
    bindTooltip(mark, point);
    const anchor = index === 0 ? "start" : index === points.length - 1 ? "end" : "middle";
    addSvg(svg, "text", { x: point.x, y: point.y - 12, "text-anchor": anchor, "font-weight": "700" }, brl.format(point.total));
    addSvg(svg, "text", { x: point.x, y: bottom + 24, "text-anchor": "middle", class: "axis-label" }, point.label);
  }
}

function renderBarChart(containerId, rows, field, dimensionName) {
  const container = document.getElementById(containerId);
  if (!rows.length) return showChartEmpty(container);

  const values = summarizeBy(rows, (row) => row[field]).sort((a, b) => b.total - a.total || a.label.localeCompare(b.label, "pt-BR"));
  const description = `Barras horizontais do valor total vendido em reais por ${dimensionName}, ordenadas do maior para o menor. ${values.map(formatGroupForDescription).join("; ")}`;
  const height = Math.max(190, values.length * 48 + 35);
  const width = container.clientWidth || 520;
  const { svg, bindTooltip } = chartSvg(container, description, width, height);
  const left = Math.min(150, Math.max(118, width * 0.34));
  const right = width - 96;

  values.forEach((group, index) => {
    const y = 18 + index * 48;
    addSvg(svg, "text", { x: left - 10, y: y + 19, "text-anchor": "end" }, group.label);
    const mark = addSvg(svg, "rect", {
      x: left,
      y,
      width: Math.max(0, (right - left) * group.total / Math.max(...values.map((item) => item.total), 1)),
      height: 27,
      rx: 4,
      fill: index === 0 ? chartColors.green : chartColors.blue,
      stroke: chartColors.graphite,
      "stroke-width": 1,
    });
    bindTooltip(mark, group);
    addSvg(svg, "text", { x: width - 4, y: y + 19, "text-anchor": "end", "font-weight": "700" }, brl.format(group.total));
  });
}

function showChartEmpty(container) {
  container.replaceChildren(element("p", { class: "chart-empty" }, "Sem dados para desenhar este gráfico."));
  container.append(chartTooltip(container));
}

function renderTable(rows) {
  const tbody = document.getElementById("sales-rows");
  const fragment = document.createDocumentFragment();
  for (const row of rows) {
    const tr = document.createElement("tr");
    for (const [value, className] of [
      [new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${row.data}T00:00:00Z`)), ""],
      [row.cidade, ""], [row.categoria, ""], [row.produto, ""], [row.forma_pagamento, ""],
      [integer.format(Number(row.quantidade)), "numeric"], [brl.format(Number(row.valor_venda)), "numeric"],
    ]) {
      const td = element("td", className ? { class: className } : {}, value);
      tr.append(td);
    }
    fragment.append(tr);
  }
  tbody.replaceChildren(fragment);
}

function updateDashboard() {
  const rows = filteredSales();
  const count = rows.length;
  const total = rows.reduce((sum, row) => sum + Number(row.valor_venda), 0);
  document.getElementById("total-value").textContent = brl.format(total);
  document.getElementById("sales-count").textContent = integer.format(count);
  document.getElementById("average-ticket").textContent = brl.format(count ? total / count : 0);
  document.getElementById("result-count").textContent = `${integer.format(count)} ${count === 1 ? "venda encontrada" : "vendas encontradas"}`;
  document.getElementById("filter-summary").textContent = activeFilterSummary();
  document.getElementById("empty-state").hidden = count > 0;
  renderMonthlyChart(rows);
  renderBarChart("category-chart", rows, "categoria", "categoria");
  renderBarChart("city-chart", rows, "cidade", "cidade");
  renderBarChart("product-chart", rows, "produto", "produto");
  renderBarChart("payment-chart", rows, "forma_pagamento", "forma de pagamento");
  renderTable(rows);
}

function renderPeriodOptions() {
  const select = document.getElementById("period-filter");
  const options = [...new Set(sales.map((row) => row.data.slice(0, 7)))].sort();
  select.replaceChildren(element("option", { value: "all" }, "Todos os meses"));
  for (const month of options) select.append(element("option", { value: month }, monthLabel(month)));
}

function connectFilterControls() {
  for (const button of document.querySelectorAll("[data-select-group]")) {
    button.addEventListener("click", () => {
      document.querySelectorAll(`#${button.dataset.selectGroup} input`).forEach((input) => { input.checked = true; });
      updateDashboard();
    });
  }
  for (const button of document.querySelectorAll("[data-clear-group]")) {
    button.addEventListener("click", () => {
      document.querySelectorAll(`#${button.dataset.clearGroup} input`).forEach((input) => { input.checked = false; });
      updateDashboard();
    });
  }

  document.getElementById("period-filter").addEventListener("change", updateDashboard);
  document.getElementById("product-search").addEventListener("input", updateDashboard);
  document.getElementById("clear-filters").addEventListener("click", () => {
    document.querySelectorAll(".checkbox-list input").forEach((input) => { input.checked = true; });
    document.getElementById("period-filter").value = "all";
    document.getElementById("product-search").value = "";
    updateDashboard();
  });
}

async function start() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    sales = await response.json();

    const valuesByField = new Map(filterGroups.map(({ field }) => [field, [...new Set(sales.map((row) => row[field]))].sort((a, b) => a.localeCompare(b, "pt-BR"))]));
    for (const { containerId, field } of filterGroups) renderFilter(containerId, field, valuesByField.get(field));
    renderPeriodOptions();
    connectFilterControls();
    window.addEventListener("resize", updateDashboard);
    updateDashboard();
  } catch (error) {
    document.getElementById("result-count").textContent = "Não foi possível carregar os dados.";
    document.getElementById("empty-state").hidden = false;
    document.getElementById("empty-state").textContent = "Falha ao carregar os dados. Confirme que o site foi aberto por um servidor HTTP local.";
    console.error("Falha ao iniciar o painel:", error);
  }
}

start();
