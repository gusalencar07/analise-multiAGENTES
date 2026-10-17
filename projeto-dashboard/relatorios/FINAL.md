# Relatório final — Papelê Studio · vendas

## Status conjunto: **APROVADO**

Construtor, Tester, Revisor e Coordenador aprovaram a mesma versão da rodada 05. O projeto não tem commit de produto nesta rodada; os hashes SHA-256 abaixo identificam a versão local validada.

| Arquivo | SHA-256 |
|---|---|
| `prepare_data.py` | `8e5f88d102fa7795c0fea74b690cf527f240be3a79906fe47f7fa7a1acc9e8cf` |
| `site/index.html` | `8f97b3e52d199ac8f69ff547e0a60ccf302e2a43fb881c76e3b5ee9b4154354f` |
| `site/styles.css` | `40809e91c2032111df81a6c10813bf8537dc8bd1fa692ab684c1f6c73fca9785` |
| `site/app.js` | `d5a14c14bbf4501a0fe7f4763b5f1c10eb16beb3f68726d2e8f4224506866fa2` |
| `site/data/vendas.json` | `65fe7740872b4820aa0cb93e366b440cea22c1660d6997f384046e7b9d1f421f` |
| `tests/test_dashboard.py` | `6b3df932b7a8859e44f661e00f9e7e579fd33b8cd6ee6a8f0b703fc4b143818e` |
| `tests/real_browser_test.cjs` | `87e04f3075efb5da1685c24494cb19524864d8a94b43c84146b6553022df679d` |
| `papelaria_limpa.csv` (fonte) | `ee3b0a8a5147a621267e3f7137b12a6f8fd694a3874175735e7c68d1a733799c` |

## Entrega

- O site mantém o **relatório de vendas como foco**: filtros por cidade e categoria, três indicadores, dois gráficos e tabela detalhada. Os gráficos agora têm tooltip de dimensão e valor, realce no hover, interação acessível por teclado e suporte a movimento reduzido. Toque em dispositivo coarse não deixa a tooltip presa.
- A identidade editorial Papelê usa creme, amarelo manteiga, verde menta, azul céu, grafite e verde profundo; não foram adicionadas seções de loja.
- A base preparada tem 180 vendas, total vendido de **R$ 20.059,00** e ticket médio de **R$ 111,44**. Valor vendido não é lucro. O período mostrado (1º jan–31 mar 2026) é contexto estático, não um filtro interativo.
- CSVs originais e entregas anteriores foram preservados.

## Testes e revisão

Na pasta `projeto-dashboard`, a suíte completa passou: **8 testes**, incluindo cálculos independentes, exemplo conhecido, preparação e preservação dos dados, HTTP, interação em Chrome real, filtros, teclado, tooltips nos dois gráficos, mouse/toque, foco/blur, atributos ARIA, limites das tooltips em **390×844** e **1440×900**, e movimento reduzido. Também passaram:

```powershell
node --check site\app.js
node --check tests\real_browser_test.cjs
..\.venv\Scripts\python.exe -B -m unittest discover -s tests -v
```

Touch e `prefers-reduced-motion` foram simulados via Chrome/CDP, não em hardware físico. Os testes validam bounds e estilos computados; não declaram legibilidade perceptual ou contraste formal como medidos.

Relatórios desta versão: `rodada-05/construtor.md`, `rodada-05/tester.md` e `rodada-05/revisor.md`. O fluxo e as skills estão documentados em `AGENTS.md` e `.opencode/skills/`; `validate-data/SKILL.md` é cópia de `data-visualization/SKILL.md`, conforme registrado no repositório documental.

## Como abrir

No PowerShell, dentro da pasta `projeto-dashboard`:

```powershell
..\.venv\Scripts\python.exe prepare_data.py
python -m http.server 8000 --directory site
```

Abra <http://localhost:8000>. `projeto-dashboard/site/` é a pasta publicável para hospedagem estática; a publicação não está incluída nesta etapa.
