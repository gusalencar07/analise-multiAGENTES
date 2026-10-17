# Relatório do Construtor — rodada 02

## Versão

Sem commit (sem repositório Git). SHA-256 da versão examinada:

| Arquivo | SHA-256 |
|---|---|
| `site/styles.css` | `0ee5099d6bf8cd82df3798ad3cbbb93b5e118c20aee7538d1f2a080a664275b9` |
| `site/app.js` | `729ababecbf8e3e490ab3821bf1bf599bfd5244537f7ceb0896fab3e1c3a5425` |
| `README.md` | `2361cf620cb27249bb3a9c25ab798ddacc8c5a74d0e6035678962730a65f9254` |
| `tests/test_dashboard.py` (inalterado) | `6b3df932b7a8859e44f661e00f9e7e579fd33b8cd6ee6a8f0b703fc4b143818e` |
| `tests/real_browser_test.cjs` (inalterado) | `1eee13ce677d90df70de930a9e293d6f753c5e078c0084acca029a41091d4bd8` |

## Correção e verificações

Os gráficos agora dimensionam o `viewBox` pela largura renderizada do contêiner e recalculam no redimensionamento. Assim, os textos SVG de 11–12 unidades mantêm tamanho visual acima do mínimo de 10 px, sem reduzir o critério; o gráfico de barras adapta margens e posição dos valores. O README descreve os comandos reais para preparação, suíte `unittest`, verificações `node --check` e servidor HTTP. Apenas `site/app.js` e `README.md` foram alterados; testes e relatórios anteriores foram preservados.

Comandos executados na pasta `projeto-dashboard`:

| Comando | Resultado |
|---|---|
| `..\.venv\Scripts\python.exe -m unittest discover -s tests -v` | **8 testes passaram**, incluindo Chrome real, viewports 390×844 e 1440×900, rótulos SVG, filtros, teclado e dados. |
| `node --check site\app.js` | Passou, sem erro de sintaxe. |
| `node --check tests\real_browser_test.cjs` | Passou, sem erro de sintaxe. |

## Encaminhamento e status

Resultado local do Construtor: verificações acima passaram. **Status provisório: PENDENTE de nova rodada independente do Tester e revisão do Revisor. Não é aprovação conjunta.**
