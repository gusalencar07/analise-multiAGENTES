# Relatório do Tester — rodada 02

## Versão examinada

Sem commit (diretório sem Git). SHA-256 conferidos localmente; hashes do produto coincidem com o relatório do Construtor.

| Arquivo | SHA-256 |
|---|---|
| `prepare_data.py` | `8e5f88d102fa7795c0fea74b690cf527f240be3a79906fe47f7fa7a1acc9e8cf` |
| `site/index.html` | `6f94e6f4c79b4ff2872d057649f960e0f02790d0cf31f071979d9c559128461d` |
| `site/styles.css` | `0ee5099d6bf8cd82df3798ad3cbbb93b5e118c20aee7538d1f2a080a664275b9` |
| `site/app.js` | `729ababecbf8e3e490ab3821bf1bf599bfd5244537f7ceb0896fab3e1c3a5425` |
| `site/data/vendas.json` | `65fe7740872b4820aa0cb93e366b440cea22c1660d6997f384046e7b9d1f421f` |
| `README.md` | `2361cf620cb27249bb3a9c25ab798ddacc8c5a74d0e6035678962730a65f9254` |
| `tests/test_dashboard.py` | `6b3df932b7a8859e44f661e00f9e7e579fd33b8cd6ee6a8f0b703fc4b143818e` |
| `tests/real_browser_test.cjs` | `8fff971b20cccdc6e19d466f055d739d7cfaf05c83953a7f7d6c83d4a7c57eff` |
| `vendas_papelaria.csv` (original) | `bf95b7609e30eb7e3e6a30cfc16e43d9fb5bdfc48a410e49148cceb92e2494ff` |
| `papelaria_limpa.csv` | `ee3b0a8a5147a621267e3f7137b12a6f8fd694a3874175735e7c68d1a733799c` |

## Comandos e evidências

Na pasta `projeto-dashboard`, executei a suíte completa solicitada:

```powershell
..\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

**Resultado: 8 testes passaram, sem falhas.** Repeti a suíte depois de conferir os hashes. Também executei:

```powershell
node --check site\app.js
node --check tests\real_browser_test.cjs
```

Ambos terminaram com código 0. Evidências cobertas pela suíte:

- SHA-256 do original e do CSV limpo, esquema/tipos/ausências, IDs e duplicatas segundo as regras documentadas; dados preparados confrontados com o CSV. O script de preparação foi executado em espelho temporário e gerou JSON byte a byte igual ao entregue, sem alterar o produto.
- Recálculo independente com `csv` e `Decimal`: 180 vendas, total R$ 20.059,00, médias e agrupamentos; exemplo sintético conhecido também conferido.
- Servidor HTTP local: `/`, CSS, JavaScript e JSON responderam 200; recurso inexistente respondeu 404. Em Chrome real não foram observados erros de JavaScript nem falhas de carregamento.
- Interação em **Google Chrome 155.0.8059.84**, headless, via DevTools Protocol: KPIs, gráficos (rótulos visuais e acessíveis) e todas as linhas da tabela comparados com referências independentes; filtros isolados de cada cidade e categoria, nove combinações, seleção vazia, mensagem de vazio, botão limpar, teclado (Espaço) e ausência de `NaN`/infinito.
- Viewports reais **390×844** e **1440×900**: sem overflow horizontal, grids responsivos, controles utilizáveis; o teste calcula o tamanho renderizado dos textos SVG pela escala do `viewBox` e confirma que o mínimo de **10 px** é respeitado nos dois tamanhos.

As skills `explore-data` e `validate-data` não foram usadas nem alegadas. Nenhum teste obrigatório ficou pendente nesta rodada.

## Issues, encaminhamento e status

Não reproduzi o problema de legibilidade reportado na rodada 01; a verificação real de SVG nos dois viewports passou após a correção. Nenhum defeito novo identificado; **sem retorno ao Construtor**. Isso aprova somente a versão e o escopo testados, não substitui revisão do Revisor ou aprovação conjunta.

**Status do Tester: APROVADO.** Revisão do Revisor e status conjunto final: **PENDENTES**.
