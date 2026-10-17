# Relatório do Tester — rodada 05 (reteste após correção touch)

## Versão examinada

Sem commit (a pasta não é repositório Git). Li `relatorios/rodada-05/construtor.md` e confirmei em `site/app.js` a alteração do handler: foco só mostra tooltip quando a marca corresponde a `:focus-visible`. Executei o reteste contra este hash corrigido e acrescentei ao harness um assert explícito de que o toque realmente foca a marca, para assegurar que o caminho corrigido é exercitado.

| Arquivo | SHA-256 |
|---|---|
| `site/index.html` | `8f97b3e52d199ac8f69ff547e0a60ccf302e2a43fb881c76e3b5ee9b4154354f` |
| `site/styles.css` | `40809e91c2032111df81a6c10813bf8537dc8bd1fa692ab684c1f6c73fca9785` |
| `site/app.js` | `d5a14c14bbf4501a0fe7f4763b5f1c10eb16beb3f68726d2e8f4224506866fa2` |
| `site/data/vendas.json` | `65fe7740872b4820aa0cb93e366b440cea22c1660d6997f384046e7b9d1f421f` |
| `tests/test_dashboard.py` (inalterado) | `6b3df932b7a8859e44f661e00f9e7e579fd33b8cd6ee6a8f0b703fc4b143818e` |
| `tests/real_browser_test.cjs` | `87e04f3075efb5da1685c24494cb19524864d8a94b43c84146b6553022df679d` |
| `prepare_data.py` | `8e5f88d102fa7795c0fea74b690cf527f240be3a79906fe47f7fa7a1acc9e8cf` |
| `papelaria_limpa.csv` | `ee3b0a8a5147a621267e3f7137b12a6f8fd694a3874175735e7c68d1a733799c` |
| `vendas_papelaria.csv` (original) | `bf95b7609e30eb7e3e6a30cfc16e43d9fb5bdfc48a410e49148cceb92e2494ff` |

## O que foi conferido

- Não alterei o produto, `tests/test_dashboard.py`, `FINAL.md`, `.gitignore` nem relatórios dos outros agentes. Nesta atualização editei somente `tests/real_browser_test.cjs` e este relatório.
- O teste direcionado e a suíte completa executaram o harness CDP no Chrome real contra o `app.js` corrigido. Os eventos `touchstart`/`touchend` são enviados a ponto e barra em modo `hover:none`/`pointer:coarse`; ambos focam a marca, mas terminam com tooltip oculta e estilo computado sem realce hover. Isso verifica diretamente que foco originado de touch não mostra tooltip, sem substituir o caminho de foco de teclado.
- Tab/Shift+Tab reais continuam cobrindo tooltip e realce em foco de teclado, além de blur. Mouse real continua cobrindo conteúdo, realce computado, `pointerleave` e ocultação.
- Permanecem aprovados no harness: dados e cores; atributos de acessibilidade (tooltip `role=status`, `aria-live=polite`, estado inicialmente oculto, `<title>`, `aria-label`, `aria-describedby`); limites de `getBoundingClientRect()` da tooltip visível dentro do chart e da viewport; marcas extremas Jan/Mar e primeira/última barra em 390×844 e 1440×900 após rerender; filtros, HTTP, erros JavaScript e `prefers-reduced-motion`.

## Comandos e evidências

Executados em `projeto-dashboard` (o teste direcionado usa `projeto-dashboard\tests` como diretório de trabalho):

```powershell
node --check tests\real_browser_test.cjs
..\.venv\Scripts\python.exe -B -m unittest discover -s tests -v
Get-FileHash site\index.html,site\styles.css,site\app.js,site\data\vendas.json,tests\test_dashboard.py,tests\real_browser_test.cjs,prepare_data.py, ..\papelaria_limpa.csv, ..\vendas_papelaria.csv -Algorithm SHA256 | ForEach-Object { '{0}  {1}' -f (Split-Path $_.Path -Leaf), $_.Hash.ToLower() }
```

No diretório `projeto-dashboard\tests`:

```powershell
..\..\.venv\Scripts\python.exe -B -m unittest -v test_dashboard.DashboardTests.test_real_browser_kpis_charts_table_filters_empty_clear_responsive_keyboard
```

O teste direcionado foi executado com o diretório de trabalho `projeto-dashboard\tests` e o executável `..\..\.venv\Scripts\python.exe`, conforme o comando relativo correspondente.

- `node --check tests\real_browser_test.cjs` — passou, sem erro.
- Teste direcionado `test_real_browser_kpis_charts_table_filters_empty_clear_responsive_keyboard` — passou: **1 teste**, `Ran 1 test in 8.807s`, `OK`, incluindo hover/touch/teclado no Chrome.
- Suíte completa `..\.venv\Scripts\python.exe -B -m unittest discover -s tests -v` — **8 testes passaram**, `Ran 8 tests in 12.091s`, `OK`.
- `Get-FileHash` — hashes da versão testada conferidos e registrados acima.
- O teste anterior falhou no app hash `366c8d6b…401ae290` por tooltip persistente após toque. No app corrigido hash `d5a14c14…06866fa2`, a reprodução touch passou sem relaxar os asserts.

## Encaminhamento e status

- Não há defeito pendente para retornar ao Construtor nesta execução. O Tester confirmou a correção específica de foco por `:focus-visible` com toque real e teclado real.
- O Revisor aprovou independentemente esta mesma versão, conforme `relatorios/rodada-05/revisor.md` e os hashes idênticos listados neste relatório.

**Status do Tester: APROVADO** e **Status do Revisor: APROVADO** para a mesma versão identificada pelos hashes listados acima. O status conjunto e o `relatorios/FINAL.md` do Coordenador serão registrados depois pelo Coordenador.
