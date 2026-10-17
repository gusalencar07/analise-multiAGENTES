# Perfil e tratamento de vendas_papelaria.csv



## Visão geral

- Original: **182 linhas e 8 colunas**, sem contar o cabeçalho.

- Cópia tratada: **180 linhas e 9 colunas**.

- Grão: uma linha por venda; chave esperada: `id_venda`. Não se trata de itens de uma mesma venda.

- IDs distintos no original: 180; na cópia: 180.

- Período: 01/01/2026 a 31/03/2026; 90 dias com vendas.

- Arquivo original: 10788 bytes. Não há metadados no CSV que permitam determinar a atualização de negócio ou sua frequência.

- Fonte exclusiva: CSV local; nenhuma conexão ou integração com banco de dados.

- Cálculos executados com `.venv/Scripts/python.exe` e pandas. O perfil usa todos os registros, sem amostragem.



## Perfil das colunas no original

Tipos inferidos semanticamente; a leitura preservou os campos como texto para comparar duplicatas antes de qualquer normalização. Distintos exclui campos vazios; cardinalidade = distintos / linhas.

| Coluna | Classe | Tipo inferido | Vazios | Distintos | Cardinalidade |
| --- | --- | --- | --- | --- | --- |
| id_venda | Identificador | texto | 0 (0.00%) | 180 | 98.90% |
| data | Temporal | data ISO | 0 (0.00%) | 90 | 49.45% |
| cidade | Dimensão | texto | 0 (0.00%) | 6 | 3.30% |
| categoria | Dimensão | texto | 0 (0.00%) | 4 | 2.20% |
| produto | Dimensão | texto | 0 (0.00%) | 6 | 3.30% |
| quantidade | Métrica | inteiro | 0 (0.00%) | 5 | 2.75% |
| preco_unitario | Métrica | decimal | 0 (0.00%) | 6 | 3.30% |
| forma_pagamento | Dimensão | texto | 4 (2.20%) | 3 | 1.65% |



## Problemas encontrados e tratamento

1. **Duplicatas exatas:** 2 ocorrências excedentes, IDs V0010, V0020. Comparação de todas as oito colunas originais, incluindo `id_venda`, antes da limpeza. Mantida a primeira ocorrência; não foi aplicada deduplicação por atributos comerciais nem somente pelo ID.

2. **Espaços em cidade:** 6 registros na cópia de trabalho tiveram espaços iniciais/finais removidos com `strip`; espaços internos não foram alterados.

3. **Categorias inconsistentes:** 3 registros padronizados. Valores finais permitidos: Livros, Papelaria e Acessórios; `acessórios` passou a `Acessórios`.

4. **Pagamento vazio:** 4 registros (2.22% das vendas após deduplicação), preenchidos com `Não informado`. Não houve inferência do meio de pagamento.

5. **Chave após limpeza:** 0 IDs com registros distintos conflitantes. `id_venda` é único e não vazio.

6. **Validações:** 0 datas inválidas; 0 datas futuras; 0 quantidades não positivas; 0 preços não positivos. Não foram identificados outros campos vazios.

- `valor_venda = quantidade * preco_unitario` foi acrescentado sem modificar os preços ou quantidades originais. Nenhum outro registro foi removido e a ordem restante foi preservada.

- Datas e demais campos não receberam alterações. CSV de saída em UTF-8, separado por vírgulas e com ponto decimal.



## Estatísticas das métricas na cópia tratada

| Métrica | Mínimo | Máximo | Média | Mediana | Desvio padrão amostral | Zeros | Negativos |
| --- | --- | --- | --- | --- | --- | --- | --- |
| quantidade | 1,00 | 5,00 | 3,04 | 3,00 | 1,42 | 0 | 0 |
| preco_unitario | 3,50 | 95,00 | 36,22 | 22,00 | 28,79 | 0 | 0 |
| valor_venda | 3,50 | 475,00 | 111,44 | 84,00 | 114,11 | 0 | 0 |

| Métrica | p1 | p5 | p25 | p75 | p95 | p99 |
| --- | --- | --- | --- | --- | --- | --- |
| quantidade | 1,00 | 1,00 | 2,00 | 4,00 | 5,00 | 5,00 |
| preco_unitario | 3,50 | 3,50 | 18,00 | 55,00 | 95,00 | 95,00 |
| valor_venda | 3,50 | 7,00 | 36,00 | 135,75 | 380,00 | 475,00 |

- Valor total vendido: **20.059,00**, em **180 vendas** (`id_venda` únicos), com **548** unidades vendidas. A moeda não é explicitada no CSV; os gráficos apresentam os valores em reais conforme solicitado. Valor vendido não é lucro: custos e despesas não foram fornecidos.



## Distribuição por categoria

| Categoria | Vendas | Valor total |
| --- | --- | --- |
| Acessórios | 65 | 10.517,00 |
| Livros | 54 | 7.438,00 |
| Papelaria | 61 | 2.104,00 |



## Cobertura temporal

| Mês | Vendas | Valor total |
| --- | --- | --- |
| 2026-01 | 62 | 6.235,00 |
| 2026-02 | 56 | 6.181,00 |
| 2026-03 | 62 | 7.643,00 |

- Dias sem registros entre a primeira e a última data: 0. Ausência de registros, se houvesse, não provaria ausência de vendas.



## Frequências e padrões no original

Valores exibidos entre aspas para tornar visíveis os espaços; vazio é `""`. Empates de frequência não indicam anomalia.

### id_venda

- Mais comuns (até 5): "V0010": 2, "V0020": 2, "V0001": 1, "V0002": 1, "V0003": 1.

- Menos comuns (até 5): "V0001": 1, "V0002": 1, "V0003": 1, "V0004": 1, "V0005": 1.

- Comprimento textual mínimo/máximo/médio: 5/5/5.00; campos com espaços nas bordas: 0.

### data

- Mais comuns (até 5): "2026-01-05": 3, "2026-01-10": 3, "2026-01-01": 2, "2026-01-02": 2, "2026-01-03": 2.

- Menos comuns (até 5): "2026-01-01": 2, "2026-01-02": 2, "2026-01-03": 2, "2026-01-04": 2, "2026-01-06": 2.

- Comprimento textual mínimo/máximo/médio: 10/10/10.00; campos com espaços nas bordas: 0.

### cidade

- Mais comuns (até 5): "Campinas": 69, "Santos": 59, "Sorocaba": 48, " Santos ": 2, " Campinas ": 2.

- Menos comuns (até 5): " Santos ": 2, " Campinas ": 2, " Sorocaba ": 2, "Sorocaba": 48, "Santos": 59.

- Comprimento textual mínimo/máximo/médio: 6/10/7.40; campos com espaços nas bordas: 6.

### categoria

- Mais comuns (até 5): "Papelaria": 63, "Acessórios": 62, "Livros": 54, "acessórios": 3.

- Menos comuns (até 5): "acessórios": 3, "Livros": 54, "Acessórios": 62, "Papelaria": 63.

- Comprimento textual mínimo/máximo/médio: 6/10/8.47; campos com espaços nas bordas: 0.

### produto

- Mais comuns (até 5): "Estojo": 39, "Livro de aventuras": 34, "Caneta": 32, "Caderno": 31, "Mochila": 26.

- Menos comuns (até 5): "Livro de receitas": 20, "Mochila": 26, "Caderno": 31, "Caneta": 32, "Livro de aventuras": 34.

- Comprimento textual mínimo/máximo/médio: 6/18/9.76; campos com espaços nas bordas: 0.

### quantidade

- Mais comuns (até 5): "4": 44, "1": 38, "5": 35, "2": 34, "3": 31.

- Menos comuns (até 5): "3": 31, "2": 34, "5": 35, "1": 38, "4": 44.

- Comprimento textual mínimo/máximo/médio: 1/1/1.00; campos com espaços nas bordas: 0.

### preco_unitario

- Mais comuns (até 5): "22": 39, "42": 34, "3.5": 32, "18": 31, "95": 26.

- Menos comuns (até 5): "55": 20, "95": 26, "18": 31, "3.5": 32, "42": 34.

- Comprimento textual mínimo/máximo/médio: 2/3/2.18; campos com espaços nas bordas: 0.

### forma_pagamento

- Mais comuns (até 5): "Pix": 68, "Dinheiro": 57, "Cartão": 53, "": 4.

- Menos comuns (até 5): "": 4, "Cartão": 53, "Dinheiro": 57, "Pix": 68.

- Comprimento textual mínimo/máximo/médio: 0/8/5.37; campos com espaços nas bordas: 0.



## Relações e próximos passos

- Na cópia limpa, cada produto está associado a uma categoria padronizada e a um preço unitário; no original há variação de caixa em `Acessórios`/`acessórios`. Isso não garante preços fixos em outros períodos. Não há outras tabelas locais para verificar integridade referencial.

- `valor_venda` é uma métrica derivada, não uma nova observação. Identificadores não devem entrar como medidas numéricas.

- Correlações de Pearson entre métricas (não implicam causalidade; a relação com o valor é parcialmente mecânica):

| Métrica A | Métrica B | r |
| --- | --- | --- |
| quantidade | preco_unitario | 0.0290 |
| quantidade | valor_venda | 0.4708 |
| preco_unitario | valor_venda | 0.8116 |

- Valores elevados podem refletir produtos mais caros, não erros; não foram excluídos outliers nem imputadas métricas.

1. Comparar evolução mensal de valor vendido por cidade e categoria, considerando os diferentes números de dias por mês.

2. Comparar ticket médio e quantidade por produto e forma de pagamento.

3. Investigar os pagamentos não informados com a fonte responsável, sem atribuir um meio de pagamento presumido.

4. Avaliar a concentração do valor em produtos mais caros; há apenas três meses, insuficientes para concluir sazonalidade anual.



## Preservação e verificações

- SHA-256 do original antes/depois: `bf95b7609e30eb7e3e6a30cfc16e43d9fb5bdfc48a410e49148cceb92e2494ff`.

- O hash do original foi conferido após a gravação da cópia. As saídas foram relidas e validadas.
