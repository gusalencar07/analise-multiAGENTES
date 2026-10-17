# Relatório do Construtor — rodada 01

## Versão examinada

Sem commit (diretório não é repositório Git). Versão identificada pelos SHA-256 dos arquivos relevantes:

| Arquivo | SHA-256 |
|---|---|
| `prepare_data.py` | `8e5f88d102fa7795c0fea74b690cf527f240be3a79906fe47f7fa7a1acc9e8cf` |
| `site/index.html` | `6f94e6f4c79b4ff2872d057649f960e0f02790d0cf31f071979d9c559128461d` |
| `site/styles.css` | `0ee5099d6bf8cd82df3798ad3cbbb93b5e118c20aee7538d1f2a080a664275b9` |
| `site/app.js` | `af3a9090e294ff3c660eeb53dbaee1a5d8c8b38dad15368ac568783427c2f660` |
| `site/data/vendas.json` | `65fe7740872b4820aa0cb93e366b440cea22c1660d6997f384046e7b9d1f421f` |
| `README.md` | `b93a020209c4f1cb6d5e8174070245cb36bc1e21afb0f23ed14f99ce5466270f` |

Entradas preservadas: `papelaria_limpa.csv` SHA-256 `ee3b0a8a5147a621267e3f7137b12a6f8fd694a3874175735e7c68d1a733799c`; `vendas_papelaria.csv` SHA-256 `bf95b7609e30eb7e3e6a30cfc16e43d9fb5bdfc48a410e49148cceb92e2494ff`.

## Entrega e verificações

- Criados `prepare_data.py`, `site/index.html`, `site/styles.css`, `site/app.js`, `site/data/vendas.json` e `README.md`.
- Preparação pandas valida esquema, campos não vazios, datas, números positivos, unicidade de `id_venda` e igualdade de `valor_venda` a quantidade × preço. Consome a cópia limpa sem deduplicação ou outras remoções.
- Dashboard contém KPIs (valor total vendido, vendas e ticket médio), gráficos mensais e por categoria, tabela e filtros por cidade/categoria; inclui limpar filtros, estado vazio, formatação pt-BR, controles por teclado e layout responsivo.
- Grão, regras de limpeza e limites estão descritos no dashboard. Valor vendido não é lucro. A skill `data-visualization` foi usada para orientar a apresentação. Skills `explore-data` e `validate-data` ausentes neste contexto; não foram alegadamente usadas.

Comandos executados na pasta `projeto-dashboard`:

| Comando/verificação | Resultado |
|---|---|
| `..\.venv\Scripts\python.exe prepare_data.py` | Concluído; 180 linhas preservadas; total R$ 20.059,00; JSON gerado. |
| Leitura independente do JSON com Python | 180 registros, 180 IDs distintos, soma 20.059,00 e nove colunas. |
| `node --check site\app.js` | Sem erros de sintaxe. |
| Servidor `python -m http.server` + requisições HTTP | HTTP 200 para `/`, `/styles.css`, `/app.js` e `/data/vendas.json`. |
| `..\.venv\Scripts\python.exe -m pytest --version` | PENDENTE: `pytest` não instalado; README agora inclui o comando de instalação. |
| Testes reais em navegador / interação | **PENDENTES**: ambiente sem Playwright, Selenium ou navegador detectável. |

## Problemas, encaminhamento e status

Testes de interação real, comportamento em larguras de tela e revisão independente permanecem pendentes; encaminhar ao Tester/Revisor. Não há aprovação conjunta nem alegação de aprovação dos testes obrigatórios. **Status do construtor: BLOQUEADO** até a execução desses testes em ambiente com navegador e conclusão da revisão independente.
