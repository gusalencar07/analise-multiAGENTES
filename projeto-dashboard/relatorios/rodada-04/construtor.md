# Relatório do Construtor — rodada 04

## Versão após correção solicitada pelo Revisor

Sem commit (a pasta não é repositório Git). SHA-256 dos arquivos relevantes após as alterações:

| Arquivo | SHA-256 |
|---|---|
| `site/index.html` | `8f97b3e52d199ac8f69ff547e0a60ccf302e2a43fb881c76e3b5ee9b4154354f` |
| `site/styles.css` | `4e7ecd9d073e4b6fd5e2606b2efafebeef28e068f2fb2926133785440c343ae7` |
| `site/app.js` | `6a812818f8a4c5c2f22e40fecfa290002d138edd0538df6e367190b7b0ccf0cf` |
| `site/data/vendas.json` (inalterado) | `65fe7740872b4820aa0cb93e366b440cea22c1660d6997f384046e7b9d1f421f` |
| `tests/test_dashboard.py` (inalterado) | `6b3df932b7a8859e44f661e00f9e7e579fd33b8cd6ee6a8f0b703fc4b143818e` |
| `tests/real_browser_test.cjs` (atualizado pelo Tester) | `521809324a6896c2a11c02fd4002ed2b7cb337b7667e5f2bc131e3b8aa2818b7` |
| `papelaria_limpa.csv` (preservado, fora da pasta do projeto) | `ee3b0a8a5147a621267e3f7137b12a6f8fd694a3874175735e7c68d1a733799c` |

Os hashes de `site/index.html`, `site/styles.css`, `site/app.js` e `site/data/vendas.json` permanecem iguais aos conferidos pelo Tester para esta versão. Nesta atualização documental não alterei arquivos do produto.

## Alterações

- Nesta correção atualizei somente `site/app.js` no produto, a pedido do Revisor. As alterações editoriais em `site/index.html` e `site/styles.css` permanecem inalteradas. Mantive os IDs de integração dos testes, a sequência filtros → três KPIs → gráficos → tabela e todos os componentes e explicações dos dados.
- Dei ao cabeçalho e aos componentes uma apresentação editorial Papelê Studio, usando Creme `#FFF9F0`, amarelo `#FFE59A`, menta `#BCEBD5`, azul `#B9DDF8`, grafite `#292633` e verde `#387D68`. O foco permanece no relatório; não há conteúdo de storefront.
- Corrigi os acentos SVG sem alterar dados, cálculos, seletores/IDs, filtros ou formatos testados: linha e marcadores do gráfico mensal usam verde `#387D68` (marcadores com preenchimento Creme `#FFF9F0`); a barra da maior categoria usa verde `#387D68`, as demais usam azul céu `#B9DDF8` com contorno grafite `#292633`. Textos de dados/valores usam grafite `#292633`; rótulos dos eixos usam o tom neutro secundário `--muted` (`#5d5864`) conforme `styles.css`. O relatório do Tester confirma asserts das cores computadas para estes itens e para as linhas de grade (`#ded7ca`).
- Mantive alvos de toque, indicação visível de foco, filtros utilizáveis por teclado, tabela rolável em telas estreitas e grades responsivas compatíveis com os contratos dos testes.
- O período exibido continua sendo 1º jan–31 mar 2026. **Não existe controle funcional de seleção de período** na versão recebida: o dashboard implementa filtros por cidade e categoria. Mantive o período como contexto estático e não criei um controle sem comportamento; esta correção de cores não adiciona lógica de período. Caso se espere um filtro de período interativo, fica **PENDENTE** para uma tarefa que autorize alterar a lógica.
- Não alterei dados, preparação, testes, README nem relatórios anteriores.

## Verificações executadas

Na pasta `projeto-dashboard`:

| Comando | Resultado |
|---|---|
| `..\.venv\Scripts\python.exe -B -m unittest discover -s tests -v` (Tester, conforme `rodada-04/tester.md`) | **8 testes passaram** em 8.516s, incluindo teste de navegador real, asserts de cores SVG e verificação de sintaxe do `site/app.js`. Tester: **APROVADO** para o hash de app listado acima. |
| `node --check tests\real_browser_test.cjs` (Tester, conforme `rodada-04/tester.md`) | Passou, sem erro de sintaxe. |
| `Get-FileHash ... -Algorithm SHA256` (Tester) | Hashes conferidos no relatório do Tester; HTML, CSS, app e dados coincidem com esta versão. |
| Verificação independente final do Coordenador (informada para esta atualização) | 8 testes passaram em 8.379s; verificações `node --check` passaram. |

## Pendências e status

- Tester: **APROVADO** para `site/app.js` `6a812818f8a4c5c2f22e40fecfa290002d138edd0538df6e367190b7b0ccf0cf`, conforme `relatorios/rodada-04/tester.md`. O teste atualizado verifica as cores SVG computadas, incluindo `--muted` `#5d5864` nos rótulos dos eixos.
- Limite visual registrado pelo Tester: a suíte verifica tamanho mínimo do texto, overflow, conteúdo e cores computadas, mas não comprova contraste, sobreposição ou recorte de texto; essas propriedades não são declaradas aprovadas.
- A revisão final do Revisor para esta versão está **APROVADA**, conforme `relatorios/rodada-04/revisor.md`.
- O filtro interativo de período não existe na versão recebida e não foi criado dentro das restrições desta tarefa.
- **Status do Construtor: APROVADO** para esta versão exata: `site/index.html` `8f97b3e52d199ac8f69ff547e0a60ccf302e2a43fb881c76e3b5ee9b4154354f`; `site/styles.css` `4e7ecd9d073e4b6fd5e2606b2efafebeef28e068f2fb2926133785440c343ae7`; `site/app.js` `6a812818f8a4c5c2f22e40fecfa290002d138edd0538df6e367190b7b0ccf0cf`; `site/data/vendas.json` `65fe7740872b4820aa0cb93e366b440cea22c1660d6997f384046e7b9d1f421f`; `tests/test_dashboard.py` `6b3df932b7a8859e44f661e00f9e7e579fd33b8cd6ee6a8f0b703fc4b143818e`; `tests/real_browser_test.cjs` `521809324a6896c2a11c02fd4002ed2b7cb337b7667e5f2bc131e3b8aa2818b7`.
- **Tester: APROVADO** e **Revisor: APROVADO** para os mesmos hashes de produto e testes listados acima, conforme `relatorios/rodada-04/tester.md` e `relatorios/rodada-04/revisor.md`. A suíte independente final do Coordenador também passou (8 testes; `node --check` aprovados). Este é o status do Construtor; o status conjunto final cabe ao Coordenador.
