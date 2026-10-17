# Relatório do Revisor — rodada 02

## Versão examinada

Sem commit (a pasta não é repositório Git). Conferi os SHA-256 atuais. Os hashes dos oito arquivos abaixo coincidem com o relatório do Tester da rodada 02:

| Arquivo | SHA-256 atual |
|---|---|
| `prepare_data.py` | `8e5f88d102fa7795c0fea74b690cf527f240be3a79906fe47f7fa7a1acc9e8cf` |
| `site/index.html` | `6f94e6f4c79b4ff2872d057649f960e0f02790d0cf31f071979d9c559128461d` |
| `site/styles.css` | `0ee5099d6bf8cd82df3798ad3cbbb93b5e118c20aee7538d1f2a080a664275b9` |
| `site/app.js` | `729ababecbf8e3e490ab3821bf1bf599bfd5244537f7ceb0896fab3e1c3a5425` |
| `site/data/vendas.json` | `65fe7740872b4820aa0cb93e366b440cea22c1660d6997f384046e7b9d1f421f` |
| `README.md` | `2361cf620cb27249bb3a9c25ab798ddacc8c5a74d0e6035678962730a65f9254` |
| `tests/test_dashboard.py` | `6b3df932b7a8859e44f661e00f9e7e579fd33b8cd6ee6a8f0b703fc4b143818e` |
| `tests/real_browser_test.cjs` | `8fff971b20cccdc6e19d466f055d739d7cfaf05c83953a7f7d6c83d4a7c57eff` |

Os hashes do CSV original (`bf95b7609e30eb7e3e6a30cfc16e43d9fb5bdfc48a410e49148cceb92e2494ff`) e da cópia limpa (`ee3b0a8a5147a621267e3f7137b12a6f8fd694a3874175735e7c68d1a733799c`) são os registrados pelo Tester e conferidos pelos testes de integridade.

**Divergência documental:** `rodada-02/construtor.md` identifica `tests/real_browser_test.cjs` como inalterado e repete o hash da rodada 01 (`1eee13ce677d90df70de930a9e293d6f753c5e078c0084acca029a41091d4bd8`). O arquivo atual tem hash `8fff…7eff`, que coincide com o relatório do Tester da rodada 02, não com o hash listado pelo Construtor. Os hashes de produto listados pelo Construtor (app, CSS e README) coincidem com os atuais; o relatório não registra hashes de `prepare_data.py`, HTML ou JSON. Portanto, a versão atual de produto e a suíte do Tester estão identificadas, mas os relatórios de Construtor e Tester não comprovam exatamente a mesma versão da suíte.

## O que conferi

- Li `AGENTS.md`, os relatórios de Construtor e Tester das rodadas 01 e 02 e todos os arquivos atuais do produto e dos testes: `README.md`, `prepare_data.py`, `site/index.html`, `site/styles.css`, `site/app.js`, `site/data/vendas.json`, `tests/test_dashboard.py` e `tests/real_browser_test.cjs`.
- Revisei grão e limpeza documentados: a linha representa venda; a cópia limpa conserva 180 IDs únicos; o original tem 182 linhas e as duas linhas excedentes correspondem a duplicatas exatas. A preparação verifica esquema, vazios, datas, números positivos e `valor_venda = quantidade × preco_unitario`; não deduplica novamente. Valor vendido não é apresentado como lucro e limitações/moeda estão descritas.
- Recalculei independentemente, lendo o CSV limpo com `csv` e `Decimal`: 180 linhas, total `R$ 20.059,00`, ticket médio `R$ 111,44`; totais mensais janeiro `R$ 6.235,00`, fevereiro `R$ 6.181,00`, março `R$ 7.643,00`; por categoria, Acessórios `R$ 10.517,00`, Livros `R$ 7.438,00`, Papelaria `R$ 2.104,00`. Reproduzi também um exemplo pequeno conhecido (2 × R$ 1,25 e 3 × R$ 4,00): total `R$ 14,50`, 2 vendas, média `R$ 7,25`. Os resultados coincidem com a apresentação e os cenários de teste.
- Auditei as asserções do teste de navegador: verifica KPIs, SVGs e linhas da tabela contra expectativas calculadas do CSV; filtros isolados e as nove combinações cidade/categoria; seleção sem opções, mensagem vazia, limpar filtros; interação de Espaço e foco visível; ausência de `NaN`/infinito; erro JavaScript; dois tamanhos de viewport, overflow, grids, alvos dos controles e tamanho visual mínimo de texto dos gráficos (10 CSS px). O conjunto atual não tem interseções cidade/categoria sem vendas; seleções vazias são testadas desmarcando todas as opções de cada grupo.
- Revisei a entrega semântica/acessível: idioma `pt-BR`, link para pular ao conteúdo, títulos/seções, `fieldset`/`legend`, checkboxes nativos associados a rótulos, foco visível, resultado com `aria-live`, gráficos com `role="img"` e rótulos acessíveis, legenda de tabela e mensagem de vazio com `role="status"`. CSS prevê layout móvel e tabela com rolagem horizontal interna. A auditoria foi de código e dos critérios automatizados; não executei auditoria dedicada com leitor de tela.
- Skills `explore-data` e `validate-data` estão ausentes em `.agents/skills/`; não foram usadas nem alegadas.

## Comandos e evidências

Executados na pasta `projeto-dashboard`:

| Comando/verificação | Resultado |
|---|---|
| `Get-FileHash ... -Algorithm SHA256` nos oito arquivos listados | Coincidem com Tester rodada 02; divergência do hash do teste de navegador no relatório do Construtor confirmada. |
| `..\.venv\Scripts\python.exe -m unittest discover -s tests -v` | **8 testes passaram**. Inclui teste real em Chrome; HTTP local, dados, combinações, vazio, limpar, teclado e viewports. |
| `node --check site\app.js; node --check tests\real_browser_test.cjs` | Ambos sem erros de sintaxe. |
| Recálculo independente inline com Python (`csv` + `Decimal`) | Totais reais e exemplo sintético acima reproduzidos. |
| Leitura/análise de `tests/real_browser_test.cjs` e comparação com `tests/test_dashboard.py` | Os caminhos de interação e critérios descritos acima estão implementados; execução pela suíte concluída. |

Evidências persistentes: `tests/test_dashboard.py`, `tests/real_browser_test.cjs` e os relatórios de rodada 02 do Construtor e Tester. A saída desta execução foi o terminal; não criei arquivos de evidência adicionais nem alterei produto/testes existentes.

## Problemas e encaminhamento

1. **Para o Construtor/coordenador:** corrigir ou esclarecer `projeto-dashboard/relatorios/rodada-02/construtor.md` quanto ao hash e à versão de `tests/real_browser_test.cjs` que executou. Se o Tester atualizou o teste após a execução do Construtor, registrar essa sequência e identificar a suíte efetivamente executada em cada versão. A divergência não aponta defeito no produto; impede confirmar que os relatórios dos dois agentes descrevem exatamente a mesma versão completa.
2. Não encontrei falha reproduzível no produto nem nos testes atuais. A suíte integral passou e o teste de Chrome cobriu os critérios obrigatórios de interação declarados. O Construtor ainda registra status provisório pendente, e a divergência de versão acima permanece sem resolução.

## Status

**REPROVADO — pendência de consistência de versão nos relatórios.** Produto e suíte atuais coincidem com os hashes do Tester e passaram nas verificações executadas; não concedo aprovação enquanto o relatório do Construtor não esclarecer o hash discrepante, conforme o requisito de comprovar a mesma versão/hash atual. Revisão dedicada com leitor de tela: **PENDENTE** (não exigida pela suíte obrigatória, mas não realizada).
