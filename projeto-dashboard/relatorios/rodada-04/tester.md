# Relatório do Tester — rodada 04 (reteste)

## Versão examinada

Sem commit (a pasta não é repositório Git). Este reteste foi executado por **uma nova sessão de Tester**: a sessão anterior ficou inacessível e retornou `session not found` ao tentar reutilizá-la. Não simulo continuidade da sessão anterior.

Hashes SHA-256 conferidos após as alterações. O produto e os dados coincidem com a versão corrigida informada pelo Construtor; o teste de navegador foi atualizado neste reteste.

| Arquivo | SHA-256 |
|---|---|
| `prepare_data.py` | `8e5f88d102fa7795c0fea74b690cf527f240be3a79906fe47f7fa7a1acc9e8cf` |
| `site/index.html` | `8f97b3e52d199ac8f69ff547e0a60ccf302e2a43fb881c76e3b5ee9b4154354f` |
| `site/styles.css` | `4e7ecd9d073e4b6fd5e2606b2efafebeef28e068f2fb2926133785440c343ae7` |
| `site/app.js` | `6a812818f8a4c5c2f22e40fecfa290002d138edd0538df6e367190b7b0ccf0cf` |
| `site/data/vendas.json` | `65fe7740872b4820aa0cb93e366b440cea22c1660d6997f384046e7b9d1f421f` |
| `tests/test_dashboard.py` (inalterado) | `6b3df932b7a8859e44f661e00f9e7e579fd33b8cd6ee6a8f0b703fc4b143818e` |
| `tests/real_browser_test.cjs` | `521809324a6896c2a11c02fd4002ed2b7cb337b7667e5f2bc131e3b8aa2818b7` |
| `README.md` | `2361cf620cb27249bb3a9c25ab798ddacc8c5a74d0e6035678962730a65f9254` |
| `vendas_papelaria.csv` (original) | `bf95b7609e30eb7e3e6a30cfc16e43d9fb5bdfc48a410e49148cceb92e2494ff` |
| `papelaria_limpa.csv` | `ee3b0a8a5147a621267e3f7137b12a6f8fd694a3874175735e7c68d1a733799c` |

## O que foi conferido

- Li `relatorios/rodada-04/revisor.md` e `construtor.md`, inspecionei `site/app.js`, `site/styles.css` e o teste de navegador. Editei somente `tests/real_browser_test.cjs` e este relatório; não alterei produto nem `tests/test_dashboard.py`.
- Acrescentei asserts no Chrome real via CDP usando `getComputedStyle()` dos elementos SVG renderizados. Conferem: traço mensal e contorno dos marcadores verde `#387D68`; preenchimento dos marcadores creme `#FFF9F0`; linhas de grade `#ded7ca`; barra principal verde `#387D68`; barras restantes azul `#B9DDF8`; contornos das barras grafite `#292633`; textos de dados/valores grafite `#292633`.
- Os textos SVG com classe `axis-label` são exceção: a regra `.chart .axis-label` em `styles.css` define `--muted` (`#5d5864`). O teste verifica essa cor computada separadamente, em vez de atribuir grafite incorretamente a esses rótulos. A descrição geral de textos SVG no relatório do Construtor deve ser entendida com essa exceção.
- **Alcance visual medido:** em 390×844 e 1440×900 o teste confere largura de documento contra viewport (overflow horizontal), tamanho mínimo computado dos textos SVG após escala do `viewBox` (mínimo exigido 10 CSS px), e conteúdo/valores dos KPIs, tabela e rótulos/valores SVG comparados com os resultados independentes esperados. Também verifica layout responsivo, alvos dos controles e interação por teclado.
- Isso **não** testa contraste, colisão/sobreposição, recorte de texto ou legibilidade perceptual. A presença e correção textual, mínimo de fonte e ausência de overflow não provam essas propriedades; não as declaro aprovadas.

## Comandos e evidências

Executados em `projeto-dashboard`:

```powershell
node --check tests\real_browser_test.cjs
..\.venv\Scripts\python.exe -B -m unittest discover -s tests -v
```

- `node --check tests\real_browser_test.cjs` — passou, sem saída/erro.
- Suíte completa — **8 testes passaram**, incluindo interação real no navegador: `Ran 8 tests in 8.516s`, `OK`. A evidência detalhada e reproduzível está nas asserções de `tests/test_dashboard.py` e `tests/real_browser_test.cjs`; a suíte confirmou os cenários de dados, filtros isolados/combinados, vazio, limpar, teclado, cores computadas do SVG e tamanhos de tela.
- A suíte também executou a verificação de sintaxe de `site/app.js`, HTTP/arquivos estáticos e testes independentes de limpeza, totais e agregações.
- Hashes listados acima foram conferidos com `Get-FileHash ... -Algorithm SHA256`.

## Problemas, encaminhamento e status

- Não houve falhas na sintaxe ou na suíte; nenhum problema de produto precisa voltar ao Construtor por este reteste. A distinção dos eixos como `--muted` é comprovada pelo CSS atual e agora está explícita nas asserções. Recomendo que o Construtor qualifique a frase geral sobre a cor dos textos SVG caso atualize seu relatório.
- Permanecem fora da cobertura: contraste, sobreposição e recorte de texto. Não foram alegados como testados.
- O Revisor aprovou independentemente a versão identificada pelos mesmos hashes registrados acima. O status conjunto no relatório `relatorios/FINAL.md` permanece **PENDENTE** do Coordenador.

**Status do Tester: APROVADO** e **Status do Revisor: APROVADO** para a mesma versão identificada pelos hashes acima. O status conjunto do projeto em `relatorios/FINAL.md` permanece **PENDENTE** da decisão do Coordenador.
