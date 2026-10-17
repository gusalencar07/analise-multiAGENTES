# Relatório do Tester — rodada 01

## Versão examinada

Sem commit (o diretório não é repositório Git). Versão do produto conferida pelos SHA-256 abaixo; correspondem aos hashes registrados pelo Construtor. Os testes não editaram arquivos do produto.

| Arquivo | SHA-256 |
|---|---|
| `prepare_data.py` | `8e5f88d102fa7795c0fea74b690cf527f240be3a79906fe47f7fa7a1acc9e8cf` |
| `site/index.html` | `6f94e6f4c79b4ff2872d057649f960e0f02790d0cf31f071979d9c559128461d` |
| `site/styles.css` | `0ee5099d6bf8cd82df3798ad3cbbb93b5e118c20aee7538d1f2a080a664275b9` |
| `site/app.js` | `af3a9090e294ff3c660eeb53dbaee1a5d8c8b38dad15368ac568783427c2f660` |
| `site/data/vendas.json` | `65fe7740872b4820aa0cb93e366b440cea22c1660d6997f384046e7b9d1f421f` |
| `vendas_papelaria.csv` (original) | `bf95b7609e30eb7e3e6a30cfc16e43d9fb5bdfc48a410e49148cceb92e2494ff` |
| `papelaria_limpa.csv` | `ee3b0a8a5147a621267e3f7137b12a6f8fd694a3874175735e7c68d1a733799c` |
| `tests/test_dashboard.py` | `6b3df932b7a8859e44f661e00f9e7e579fd33b8cd6ee6a8f0b703fc4b143818e` |
| `tests/real_browser_test.cjs` | `1eee13ce677d90df70de930a9e293d6f753c5e078c0084acca029a41091d4bd8` |

## O que foi conferido e evidências

Testes próprios em `projeto-dashboard/tests/`: `test_dashboard.py` e `real_browser_test.cjs`. O script de preparação foi executado em uma cópia temporária da estrutura de pastas; o JSON gerado ficou byte a byte igual ao do site, sem escrever na entrega examinada.

Comando final, executado a partir de `projeto-dashboard`:

```powershell
..\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

Resultado final: **7 testes passaram e 1 falhou** por um defeito de legibilidade no produto. Cobertura/evidências reproduzíveis:

- Hashes do CSV original e da cópia limpa conferidos; 182 linhas brutas, 180 limpas, duas ocorrências excedentes de duplicatas exatas (`V0010`, `V0020`), IDs preservados. Foram conferidas as regras documentadas de normalização, ausência de campos vazios e unicidade.
- Esquema, ordem de colunas, tipos, datas, valores finitos e correspondência campo a campo entre CSV limpo e JSON conferidos. A preparação reproduz o JSON atual sem alterá-lo.
- Recálculo independente com `csv` + `Decimal` a partir de quantidade × preço: 180 vendas, total **R$ 20.059,00**, ticket médio arredondado para **R$ 111,44**, totais por mês/categoria/cidade conferidos contra os dados preparados. Exemplo sintético conhecido: duas linhas, total **R$ 14,50** e média **R$ 7,25**.
- `node --check site/app.js` e `node --check tests/real_browser_test.cjs`: sem erros de sintaxe. HTTP local respondeu 200 para `/`, `/styles.css`, `/app.js` e `/data/vendas.json`; asset ausente respondeu 404.
- Interação real em **Google Chrome 155.0.8059.84**, headless, via Chrome DevTools Protocol (não simulador DOM): KPIs, texto de resultado, gráficos SVG acessíveis e todas as linhas da tabela comparados com referências calculadas independentemente do CSV. Passaram seleção isolada das três cidades, das três categorias, os nove pares cidade/categoria, cidade/categoria sem seleção, mensagem vazia, ausência de `NaN`/infinito, botão de limpar e checkbox acionado por Espaço com foco visível. Nenhum erro JavaScript observado.
- Responsividade real conferida em **390×844** e **1440×900**: sem overflow horizontal da página; grids móveis/desktop adequados; controles de filtro e botão com dimensões verificadas. **Falha:** o menor texto SVG renderizado mede **6,5 px** a 390 px e **9,9 px** a 1440 px. A medição usa a escala visual do SVG (`largura renderizada ÷ largura do viewBox × tamanho da fonte`). O teste exige pelo menos 10 px como piso automático de legibilidade; no celular o menor rótulo fica substancialmente abaixo disso.

O `pytest` não está instalado no `.venv` e, portanto, o comando de pytest do README não foi executado. A suíte completa foi executada com sucesso pelo `unittest` da biblioteca padrão, conforme comando acima. `explore-data` e `validate-data` estão ausentes neste contexto e não foram alegadas como utilizadas.

## Problemas, encaminhamento e status

**Retorno ao Construtor:** ajustar os gráficos para manter texto/rótulos legíveis em telas estreitas (por exemplo, evitar que o texto SVG seja reduzido proporcionalmente ao `viewBox`, ou reorganizar/adaptar os gráficos). Não alterei o produto nem reduzi o critério. Depois da correção, executar novamente a suíte completa, inclusive navegador real nos dois viewports.

Esta rodada não está aprovada pelo Tester enquanto os rótulos SVG ficarem abaixo do piso medido. A revisão do Revisor e o status conjunto final também permanecem pendentes.

**Status do Tester: REPROVADO — correção de legibilidade pendente com o Construtor.**
