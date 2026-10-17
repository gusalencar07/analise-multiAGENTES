# Addendum do Construtor — rodada 03

## Esclarecimento da divergência

O `construtor.md` da rodada 02 identificou incorretamente `tests/real_browser_test.cjs` como inalterado na versão então examinada. A execução da correção pelo Construtor ocorreu **antes** da rodada 02 do Tester e usou a versão antiga do teste de navegador: SHA-256 `1eee13ce677d90df70de930a9e293d6f753c5e078c0084acca029a41091d4bd8` (o mesmo hash listado nos relatórios da rodada 01). Portanto, os 8 testes que o Construtor registrou como executados foram contra essa versão antiga, não contra o teste atual `8fff…`.

Sequência conforme os relatórios preservados:

1. Na rodada 01, o Tester executou a suíte com `real_browser_test.cjs` `1eee…`; 7 testes passaram e 1 falhou pelo tamanho visual dos textos SVG.
2. O Construtor ajustou o produto e executou a suíte completa da rodada 02 antes do Tester. A versão de teste de navegador nessa execução era `1eee…`; o relatório do Construtor registrou 8 testes aprovados localmente, mas não era ainda a versão atualizada da suíte.
3. Antes de sua execução da rodada 02, o Tester atualizou `real_browser_test.cjs` para SHA-256 `8fff971b20cccdc6e19d466f055d739d7cfaf05c83953a7f7d6c83d4a7c57eff` e executou integralmente `unittest discover`; seu relatório registra 8 testes aprovados, incluindo a medição dos rótulos SVG em 390×844 e 1440×900.
4. O relatório do Revisor da rodada 02 também declara execução da suíte atual e registra 8 testes aprovados, mas manteve status **REPROVADO** até o esclarecimento desta diferença de versão documental.

Assim, a indicação “inalterado” no relatório anterior é imprecisa quanto à versão atual, mas a versão executada pelo Construtor pode ser identificada: teste de navegador `1eee…`. O Construtor não afirma ter executado a versão `8fff…`.

## Hashes SHA-256 atuais

Conferidos nesta rodada com `..\.venv\Scripts\python.exe -c "import hashlib,pathlib; ..."` na pasta `projeto-dashboard`:

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
| `vendas_papelaria.csv` | `bf95b7609e30eb7e3e6a30cfc16e43d9fb5bdfc48a410e49148cceb92e2494ff` |
| `papelaria_limpa.csv` | `ee3b0a8a5147a621267e3f7137b12a6f8fd694a3874175735e7c68d1a733799c` |

Hashes históricos do teste de navegador: versão executada pelo Construtor antes da atualização do Tester — `1eee13ce677d90df70de930a9e293d6f753c5e078c0084acca029a41091d4bd8`; versão atual — `8fff971b20cccdc6e19d466f055d739d7cfaf05c83953a7f7d6c83d4a7c57eff`.

## Comandos e resultados registrados

- **Executados pelo Construtor na rodada 02, antes da atualização da suíte:** `..\.venv\Scripts\python.exe -m unittest discover -s tests -v` (8 passaram na versão antiga); `node --check site\app.js`; `node --check tests\real_browser_test.cjs` (sem erros na versão então presente). O Construtor não repetiu esses comandos para este addendum.
- **Executados pelo Tester na rodada 02 sobre a versão atual `8fff…`, conforme `rodada-02/tester.md`:** `..\.venv\Scripts\python.exe -m unittest discover -s tests -v` (8 passaram); `node --check site\app.js`; `node --check tests\real_browser_test.cjs` (ambos código 0). O Tester relata validação real em Chrome nos dois viewports e aprovação de sua rodada.
- **Revisor, conforme `rodada-02/revisor.md`:** executou a suíte atual, com 8 testes aprovados, e `node --check` para produto e teste; seu status naquele relatório foi **REPROVADO** devido à divergência documental, agora esclarecida por este addendum.
- Nesta rodada, o Construtor conferiu os hashes atuais; não executou novamente a suíte.

## Status e encaminhamento

A validação independente do Tester está registrada como **APROVADA** em `rodada-02/tester.md` para a suíte atual (`real_browser_test.cjs` `8fff…`) e os hashes de produto listados acima. `rodada-03/revisor.md` confirma os mesmos hashes, reexecutou os 8 testes e registra **APROVADO**. A divergência histórica está esclarecida: a rodada 02 do Construtor executou a suíte anterior (`1eee…`), antes da atualização do Tester.

Após essas evidências, **Status do Construtor: APROVADO para a versão atual identificada pelos hashes deste addendum, do Tester e do Revisor**. Nesta atualização não fiz novas alterações no produto ou nos testes e não executei a suíte atual `8fff…`; a aprovação aqui se baseia nos resultados independentes registrados. A decisão de status final conjunto permanece com o Coordenador.
