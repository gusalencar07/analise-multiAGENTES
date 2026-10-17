# Relatório do Construtor — rodada 05

## Versão examinada

Sem commit (a pasta não é repositório Git). SHA-256 da versão após as alterações:

| Arquivo | SHA-256 |
|---|---|
| `site/index.html` (inalterado) | `8f97b3e52d199ac8f69ff547e0a60ccf302e2a43fb881c76e3b5ee9b4154354f` |
| `site/styles.css` | `40809e91c2032111df81a6c10813bf8537dc8bd1fa692ab684c1f6c73fca9785` |
| `site/app.js` | `d5a14c14bbf4501a0fe7f4763b5f1c10eb16beb3f68726d2e8f4224506866fa2` |
| `site/data/vendas.json` (inalterado) | `65fe7740872b4820aa0cb93e366b440cea22c1660d6997f384046e7b9d1f421f` |
| `tests/test_dashboard.py` (inalterado) | `6b3df932b7a8859e44f661e00f9e7e579fd33b8cd6ee6a8f0b703fc4b143818e` |
| `tests/real_browser_test.cjs` (versão final atualizada pelo Tester) | `87e04f3075efb5da1685c24494cb19524864d8a94b43c84146b6553022df679d` |

## Alterações

- Editei somente `site/app.js` e `site/styles.css`; não alterei HTML, dados, cálculos, filtros, tabela, textos/ARIA descritivos existentes, nem as cores da paleta.
- Mantive o gráfico de linha para a tendência temporal mensal e as barras horizontais ordenadas para comparar categorias. Valores, rótulos SVG e formatação monetária permanecem iguais.
- Cada ponto mensal (`circle`) e cada barra (`rect`) agora recebe `.chart-mark`, `data-tooltip-label`, `data-tooltip-value`, `tabindex="0"`, `aria-label`, `aria-describedby` e um elemento SVG `<title>`. Os nomes de dimensão e valores são os mesmos já usados nos rótulos, com valor formatado em BRL.
- Cada container de gráfico cria sua própria `.chart-tooltip` com `[hidden]`, `role="status"` e `aria-live="polite"`; ao focar ou apontar para uma marca, mostra dimensão e valor e posiciona a tooltip junto à marca. Ela oculta no `pointerleave` ou `blur` quando não há outra interação ativa naquele gráfico. O estado sem dados também mantém a tooltip oculta no container.
- Hover de destaque é limitado a dispositivos com ponteiro fino e capacidade de hover. Marcas aumentam discretamente de escala e espessura; foco mantém realce visível sem depender apenas da cor. Transições são desativadas quando `prefers-reduced-motion: reduce` está ativo.
- Consultei as instruções locais de visualização e apliquei os critérios de linha temporal, barras comparativas com rótulos/unidade, paleta existente e informação que não depende apenas da cor. Não foi necessária nova análise ou alteração dos dados.

## Verificações executadas

Na pasta `projeto-dashboard`:

| Comando/verificação | Resultado |
|---|---|
| `node --check site\app.js` | Passou, sem erro de sintaxe. |
| `..\.venv\Scripts\python.exe -B -m unittest discover -s tests -v` (implementação inicial; `app.js` `366c8d6bcc6a1af19e0a4d64b219dbfcf830235502ea483928e5cbc8401ae290`, antes da atualização do harness pelo Tester) | **8 testes passaram** em 10.976s. Essa execução antecede os asserts de hover/touch relatados pelo Tester e não valida o defeito desta correção. |
| `Get-FileHash site\app.js,site\styles.css,site\data\vendas.json,tests\test_dashboard.py,tests\real_browser_test.cjs -Algorithm SHA256` (conferência inicial da correção) | App, CSS, dados e teste Python conferidos; o harness então tinha o hash intermediário `086d5e0947d5c17865227c41218a1a13916abfe1dd6e4deedd5d44f05225b01d`. O Tester depois atualizou o harness para o hash final `87e04f3075efb5da1685c24494cb19524864d8a94b43c84146b6553022df679d`, usado nos retestes aprovados. |

## Encaminhamento e status

- **Correção solicitada pelo Tester:** o relatório `relatorios/rodada-05/tester.md` registrou que Chrome em touch/coarse focava marcas `tabindex=0`, fazendo o evento `focus` mostrar uma tooltip persistente. Alterei o handler para exibi-la em `focus` somente quando `mark.matches(":focus-visible")`; foco real de teclado permanece suportado e foco originado por toque não ativa a tooltip.
- O Tester editou `tests/real_browser_test.cjs` para cobrir o defeito; o Construtor não alterou testes. A reprodução inicial do Tester falhou na versão anterior do app (`366c8d6bcc6a1af19e0a4d64b219dbfcf830235502ea483928e5cbc8401ae290`).

### Verificações desta correção

| Comando/verificação | Resultado |
|---|---|
| `node --check site\app.js` | Passou, sem erro de sintaxe. |
| Tentativa inicial do teste específico com caminho `..\.venv\Scripts\python.exe` a partir de `projeto-dashboard\tests` | Não executou: caminho relativo incorreto (`CommandNotFound`). Corrigido no comando seguinte. |
| `..\..\.venv\Scripts\python.exe -B -m unittest -v test_dashboard.DashboardTests.test_real_browser_kpis_charts_table_filters_empty_clear_responsive_keyboard` (executado na pasta `projeto-dashboard\tests`) | **1 teste de navegador real passou** em 8.518s contra o harness intermediário `086d5e0947d5c17865227c41218a1a13916abfe1dd6e4deedd5d44f05225b01d`, incluindo o cenário touch/coarse. A execução final do Tester usou o harness `87e04f3075efb5da1685c24494cb19524864d8a94b43c84146b6553022df679d`. |
| `Get-FileHash site\app.js,site\styles.css,site\data\vendas.json,tests\test_dashboard.py,tests\real_browser_test.cjs -Algorithm SHA256` | Hashes conferidos e registrados acima. Dados e testes não foram alterados pelo Construtor. |
| `..\.venv\Scripts\python.exe -B -m unittest discover -s tests -v` (Tester, relatório final) | **8 testes passaram** em 12.091s (`OK`) sobre app `d5a14c14...6866fa2` e harness `87e04f30...22df679d`. Tester declara **APROVADO**. |
| `node --check site\app.js` e `node --check tests\real_browser_test.cjs` | Passaram conforme os relatórios do Tester/Revisor; a suíte também contém a verificação de sintaxe do app. |
| Verificação independente do Coordenador | **8 testes passaram** em 11.832s; node checks passaram, conforme informação do Coordenador. |
| `Get-FileHash ...` (versão final) | Hashes do produto e dos testes finais conferem com a tabela e os relatórios Tester/Revisor. |

- O histórico do defeito touch foi preservado: a primeira versão `app.js` `366c8d6b…401ae290` falhou porque o foco originado por toque abria uma tooltip persistente; o Tester reproduziu a falha no harness intermediário `086d5e…5225b01d`. A correção usa `mark.matches(":focus-visible")`; o teste direcionado passou e o Tester acrescentou um assert para confirmar que touch realmente foca a marca. A versão final do harness é `87e04f3075efb5da1685c24494cb19524864d8a94b43c84146b6553022df679d`.
- **Status do Construtor: APROVADO** para `site/index.html` `8f97b3e52d199ac8f69ff547e0a60ccf302e2a43fb881c76e3b5ee9b4154354f`, `site/styles.css` `40809e91c2032111df81a6c10813bf8537dc8bd1fa692ab684c1f6c73fca9785`, `site/app.js` `d5a14c14bbf4501a0fe7f4763b5f1c10eb16beb3f68726d2e8f4224506866fa2`, `site/data/vendas.json` `65fe7740872b4820aa0cb93e366b440cea22c1660d6997f384046e7b9d1f421f`, `tests/test_dashboard.py` `6b3df932b7a8859e44f661e00f9e7e579fd33b8cd6ee6a8f0b703fc4b143818e` e `tests/real_browser_test.cjs` `87e04f3075efb5da1685c24494cb19524864d8a94b43c84146b6553022df679d`.
- **Tester: APROVADO** e **Revisor: APROVADO** para esses mesmos hashes de produto e testes, conforme `relatorios/rodada-05/tester.md` e `relatorios/rodada-05/revisor.md`. Os testes completos passaram nas execuções registradas. Não declaro aqui o status FINAL do Coordenador.
