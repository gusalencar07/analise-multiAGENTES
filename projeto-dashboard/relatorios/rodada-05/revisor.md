# Re-revisão independente — rodada 05

## Versão examinada

Sem commit. Após inspecionar os relatórios atualizados, `site/app.js`, `site/styles.css` e `tests/real_browser_test.cjs`, recalculei hashes SHA-256. Produto/dados e teste atual coincidem com o relatório final do Tester:

| Arquivo | SHA-256 |
|---|---|
| `site/index.html` | `8f97b3e52d199ac8f69ff547e0a60ccf302e2a43fb881c76e3b5ee9b4154354f` |
| `site/styles.css` | `40809e91c2032111df81a6c10813bf8537dc8bd1fa692ab684c1f6c73fca9785` |
| `site/app.js` | `d5a14c14bbf4501a0fe7f4763b5f1c10eb16beb3f68726d2e8f4224506866fa2` |
| `site/data/vendas.json` | `65fe7740872b4820aa0cb93e366b440cea22c1660d6997f384046e7b9d1f421f` |
| `tests/test_dashboard.py` | `6b3df932b7a8859e44f661e00f9e7e579fd33b8cd6ee6a8f0b703fc4b143818e` |
| `tests/real_browser_test.cjs` | `87e04f3075efb5da1685c24494cb19524864d8a94b43c84146b6553022df679d` |
| `prepare_data.py` | `8e5f88d102fa7795c0fea74b690cf527f240be3a79906fe47f7fa7a1acc9e8cf` |
| `papelaria_limpa.csv` | `ee3b0a8a5147a621267e3f7137b12a6f8fd694a3874175735e7c68d1a733799c` |
| `vendas_papelaria.csv` | `bf95b7609e30eb7e3e6a30cfc16e43d9fb5bdfc48a410e49148cceb92e2494ff` |

O Construtor registra o hash intermediário `086d…` do harness, enquanto o Tester registra `87e…` após ampliar os asserts de toque. O hash atual coincide com o Tester; o próprio relatório do Construtor descreve a suíte completa como pendente naquele ponto e o Tester registra a execução posterior. Não há divergência entre o produto atual e a versão testada/aprovada pelo Tester.

## Re-revisão e evidências

- **Correção touch/foco:** `app.js` só abre tooltip no evento `focus` se a marca corresponder a `:focus-visible`. Isso evita tooltip persistente pelo foco de toque no Chrome testado, sem tirar o caminho de teclado. O harness envia `Input.dispatchTouchEvent` `touchStart`/`touchEnd` em marcas reais em modo `hover:none`/`pointer:coarse`; confirma eventos touch, foco da marca, tooltip ainda oculta e estilo sem realce hover. Em seguida limpa foco/estado.
- **Teclado/ARIA:** CDP envia Tab e Shift+Tab reais nos dois gráficos, verifica tooltip em foco de teclado, realce e fechamento no blur. Os asserts incluem `tabindex`, role/nome, `<title>`, `aria-describedby` e tooltip `role=status`, `aria-live=polite` inicialmente oculta.
- **Mouse e limites:** `Input.dispatchMouseEvent` move o ponteiro para pontos/barras, confirma conteúdo e estilo calculado, depois move para fora e valida `pointerleave`/reset. Em 390×844 e 1440×900 aciona extremos Jan/Mar e primeira/última barra; confere `getBoundingClientRect()` da tooltip contra o container e viewport, não apenas overflow da página.
- **Redução de movimento:** o harness emula `prefers-reduced-motion: reduce` e confere duração zero nas transições; restaura `no-preference` antes dos outros cenários.
- **Dados e apresentação:** JSON, CSVs e preparação mantêm os hashes registrados. A suíte compara cálculos independentes, filtros, KPIs, tabela, cores SVG e valores dos gráficos; HTML e CSS preservam foco no relatório e a responsividade. Os filtros são cenarizados e há também tecla Espaço real para acionar um filtro; a utilidade `setFilters` usa alteração/change sintético para percorrer todos os cenários combinados.

## Comandos executados nesta revisão

Na pasta `projeto-dashboard`:

| Comando | Resultado |
|---|---|
| `..\.venv\Scripts\python.exe -B -m unittest discover -s tests -v` | **8 testes passaram** (`Ran 8 tests in 11.760s`, `OK`), incluindo Chrome/CDP e os cenários do harness atual. |
| `node --check site\app.js` | Passou, sem erro. |
| `node --check tests\real_browser_test.cjs` | Passou, sem erro. |
| `Get-FileHash site\index.html,site\styles.css,site\app.js,site\data\vendas.json,tests\test_dashboard.py,tests\real_browser_test.cjs,prepare_data.py, ..\papelaria_limpa.csv, ..\vendas_papelaria.csv -Algorithm SHA256` (saída formatada para nome/hash) | Hashes coincidem com a tabela e o relatório final do Tester. |

## Limites e status

Touch/coarse foi emulado por CDP no Chrome headless, não em hardware físico ou em outro navegador; movimento reduzido foi verificado como preferência CSS computada, não como avaliação perceptual. Esses limites estão documentados e não deixam pendente os comportamentos pedidos nesta rodada. A versão corrigida mantém teclado, mouse, tooltips, filtros/rerender e dados; não encontrei falha ou cobertura prometida sem evidência no harness atual.

As instruções de `explore-data` foram usadas para conferir grão/dimensões; a skill `data-visualization` foi consultada. `validate-data` é cópia idêntica da skill visual, não uma revisão independente adicional. Não alterei produto, testes, relatórios dos outros agentes ou `FINAL.md`; atualizei somente este relatório.

**Status do Revisor: APROVADO para os hashes desta revisão.** Aprovação independente apenas; o Coordenador decide o status conjunto.
