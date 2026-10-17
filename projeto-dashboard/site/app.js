"use strict";

const DATA_URL = "data/vendas.json";
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const monthNames = new Map([["2026-01", "Jan/2026"], ["2026-02", "Fev/2026"], ["2026-03", "Mar/2026"]]);
const chartColors = Object.freeze({ green: "#387D68", blue: "#B9DDF8", graphite: "#292633", cream: "#FFF9F0" });
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

function filteredSales() {
  const cities = selectedValues("city-filters");
  const categories = selectedValues("category-filters");
  if (!cities.size || !categories.size) return [];
  return sales.filter((sale) => cities.has(sale.cidade) && categories.has(sale.categoria));
}

function addSvg(parent, name, attributes = {}, text = "") {
  const node = document.createElementNS(svgNS, name);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  if (text) node.textContent = text;
  parent.append(node);
  return node;
}

function chartTooltip(container) {
  return element("div", {
    id: `${container.id}-tooltip`,
    class: "chart-tooltip",
    role: "status",
    "aria-live": "polite",
    hidden: "",
  });
}

function createTooltipController(container, tooltip) {
  let focusedMark = null;
  let hoveredMark = null;

  function hide() {
    tooltip.hidden = true;
    tooltip.textContent = "";
    tooltip.style.left = "";
    tooltip.style.top = "";
  }

  function show(mark) {
    tooltip.textContent = `${mark.dataset.tooltipLabel}: ${mark.dataset.tooltipValue}`;
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

  return function bindTooltip(mark) {
    const label = mark.dataset.tooltipLabel;
    const value = mark.dataset.tooltipValue;
    const accessibleLabel = `${label}: ${value}`;
    mark.setAttribute("tabindex", "0");
    mark.setAttribute("role", "img");
    mark.setAttribute("aria-label", accessibleLabel);
    mark.setAttribute("aria-describedby", tooltip.id);
    addSvg(mark, "title", {}, accessibleLabel);

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

function chartSvg(container, description, width = 520, height = 245) {
  container.replaceChildren();
  const svg = addSvg(container, "svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": description });
  const tooltip = chartTooltip(container);
  container.append(tooltip);
  return { svg, bindTooltip: createTooltipController(container, tooltip) };
}

function renderMonthlyChart(rows) {
  const container = document.getElementById("monthly-chart");
  if (!rows.length) return showChartEmpty(container);
  const totals = new Map([...monthNames.keys()].map((month) => [month, 0]));
  for (const row of rows) {
    const month = row.data.slice(0, 7);
    totals.set(month, (totals.get(month) || 0) + Number(row.valor_venda));
  }
  const values = [...totals].map(([month, total]) => ({ label: monthNames.get(month) || month, total }));
  const maximum = Math.max(...values.map((point) => point.total), 1);
  const width = container.clientWidth || 520;
  const { svg, bindTooltip } = chartSvg(container, `Gráfico de linha do valor vendido por mês: ${values.map((point) => `${point.label}, ${brl.format(point.total)}`).join("; ")}`, width, 255);
  const left = 72, right = width - 14, top = 38, bottom = 205;
  for (let tick = 0; tick <= 4; tick++) {
    const y = bottom - (bottom - top) * tick / 4;
    addSvg(svg, "line", { x1: left, y1: y, x2: right, y2: y, stroke: "#d6e0e6", "stroke-width": 1 });
    addSvg(svg, "text", { x: left - 8, y: y + 4, "text-anchor": "end", class: "axis-label" }, brl.format(maximum * tick / 4).replace(",00", ""));
  }
  const points = values.map((point, index) => ({
    ...point,
    x: values.length === 1 ? (left + right) / 2 : left + (right - left) * index / (values.length - 1),
    y: bottom - (bottom - top) * point.total / maximum,
  }));
  addSvg(svg, "polyline", { points: points.map((point) => `${point.x},${point.y}`).join(" "), fill: "none", stroke: chartColors.green, "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" });
  for (const [index, point] of points.entries()) {
    const value = brl.format(point.total);
    const mark = addSvg(svg, "circle", {
      class: "chart-mark",
      cx: point.x,
      cy: point.y,
      r: 6,
      fill: chartColors.cream,
      stroke: chartColors.green,
      "stroke-width": 3,
      "data-tooltip-label": point.label,
      "data-tooltip-value": value,
    });
    bindTooltip(mark);
    const anchor = index === 0 ? "start" : index === points.length - 1 ? "end" : "middle";
    addSvg(svg, "text", { x: point.x, y: point.y - 12, "text-anchor": anchor, "font-weight": "700" }, value);
    addSvg(svg, "text", { x: point.x, y: bottom + 24, "text-anchor": "middle", class: "axis-label" }, point.label);
  }
}

function renderCategoryChart(rows) {
  const container = document.getElementById("category-chart");
  if (!rows.length) return showChartEmpty(container);
  const totals = new Map();
  for (const row of rows) totals.set(row.categoria, (totals.get(row.categoria) || 0) + Number(row.valor_venda));
  const values = [...totals].map(([label, total]) => ({ label, total })).sort((a, b) => b.total - a.total);
  const maximum = Math.max(...values.map((point) => point.total), 1);
  const height = Math.max(190, values.length * 56 + 30);
  const width = container.clientWidth || 520;
  const { svg, bindTooltip } = chartSvg(container, `Gráfico de barras do valor vendido por categoria: ${values.map((point) => `${point.label}, ${brl.format(point.total)}`).join("; ")}`, width, height);
  const left = 110, right = width - 95;
  values.forEach((point, index) => {
    const y = 20 + index * 56;
    addSvg(svg, "text", { x: left - 10, y: y + 22, "text-anchor": "end" }, point.label);
    const value = brl.format(point.total);
    const mark = addSvg(svg, "rect", {
      class: "chart-mark",
      x: left,
      y,
      width: Math.max(0, (right - left) * point.total / maximum),
      height: 30,
      rx: 4,
      fill: index === 0 ? chartColors.green : chartColors.blue,
      stroke: chartColors.graphite,
      "stroke-width": 1,
      "data-tooltip-label": point.label,
      "data-tooltip-value": value,
    });
    bindTooltip(mark);
    addSvg(svg, "text", { x: width - 4, y: y + 21, "text-anchor": "end", "font-weight": "700" }, value);
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
      [row.cidade, ""], [row.categoria, ""], [row.produto, ""],
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
  document.getElementById("empty-state").hidden = count > 0;
  renderMonthlyChart(rows);
  renderCategoryChart(rows);
  renderTable(rows);
}

async function start() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    sales = await response.json();
    const cities = [...new Set(sales.map((row) => row.cidade))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    const categories = [...new Set(sales.map((row) => row.categoria))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    renderFilter("city-filters", "cidade", cities);
    renderFilter("category-filters", "categoria", categories);
    document.getElementById("clear-filters").addEventListener("click", () => {
      document.querySelectorAll(".checkbox-list input").forEach((input) => { input.checked = true; });
      updateDashboard();
    });
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
