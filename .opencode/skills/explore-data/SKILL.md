---
nome: explorar-dados
Descrição: Analise e explore um conjunto de dados para entender seu formato, qualidade e padrões. Use esta ferramenta ao se deparar com uma nova tabela ou arquivo, verificar taxas de valores nulos e distribuição de colunas, identificar problemas de qualidade de dados, como duplicatas ou valores suspeitos, ou decidir quais dimensões e métricas analisar.
dica de argumento: "<tabela ou arquivo>"
---

# /explore-data - Analise e explore um conjunto de dados

> Se você vir espaços reservados desconhecidos ou precisar verificar quais ferramentas estão conectadas, consulte [CONNECTORS.md](../../CONNECTORS.md).

Gere um perfil de dados abrangente para uma tabela ou arquivo carregado. Compreenda seu formato, qualidade e padrões antes de iniciar a análise.

## Utilização

```
/explore-data <nome_da_tabela ou arquivo>
```

## Fluxo de trabalho

### 1. Acessar os dados

**Se um servidor MCP de data warehouse estiver conectado:**

1. Resolver o nome da tabela (lidar com prefixos de esquema, sugerir correspondências se houver ambiguidade)
2. Consultar metadados da tabela: nomes das colunas, tipos e descrições, se disponíveis.
3. Execute consultas de perfilamento nos dados em tempo real.

**Caso seja fornecido um arquivo (CSV, Excel, Parquet, JSON):**

1. Leia o arquivo e carregue-o em um conjunto de dados de trabalho.
2. Inferir os tipos de coluna a partir dos dados

**Caso nenhuma das duas opções seja válida:**

1. Peça ao usuário para fornecer o nome da tabela (com o respectivo data warehouse conectado) ou para carregar um arquivo.
2. Se descreverem um esquema de tabela, forneçam orientações sobre quais consultas de perfilamento executar.

### 2. Compreender a estrutura

Antes de analisar quaisquer dados, compreenda sua estrutura:

**Questões ao nível da mesa:**
- Quantas linhas e colunas?
- Qual é o padrão de grãos (uma fileira por quê)?
- Qual é a chave primária? Ela é única?
- Quando os dados foram atualizados pela última vez?
- Até que período retrocedem os dados?

**Classificação de colunas** — classifique cada coluna como uma das seguintes:
- **Identificador**: Chaves únicas, chaves estrangeiras, IDs de entidade
- **Dimensão**: Atributos categóricos para agrupamento/filtragem (status, tipo, região, categoria)
- **Métrica**: Valores quantitativos para medição (receita, contagem, duração, pontuação)
- **Temporal**: Datas e registros de data e hora (created_at, updated_at, event_date)
- **Texto**: Campos de texto livre (descrição, notas, nome)
- **Booleano**: Indicadores verdadeiro/falso
- **Estrutural**: JSON, arrays, estruturas aninhadas

### 3. Gerar Perfil de Dados

Execute as seguintes verificações de perfil:

**Métricas ao nível da tabela:**
- Número total de linhas
- Detalhamento da contagem e dos tipos de colunas
- Tamanho aproximado da tabela (se disponível nos metadados)
- Cobertura do intervalo de datas (mínimo/máximo das colunas de data)

**Todas as colunas:**
- Contagem de valores nulos e taxa de valores nulos
- Contagem distinta e proporção de cardinalidade (distintos / total)
- Valores mais comuns (5 a 10 principais com frequências)
- Valores menos comuns (os 5 inferiores para identificar anomalias)

**Colunas numéricas (métricas):**
```
mínimo, máximo, média, mediana (p50)
desvio padrão
percentis: p1, p5, p25, p75, p95, p99
contagem zero
contagem negativa (se inesperada)
```

**Colunas de texto (dimensões, texto):**
```
comprimento mínimo, comprimento máximo, comprimento médio
contagem de strings vazias
Análise de padrões (os valores seguem um formato?)
Consistência de maiúsculas e minúsculas (todas em maiúsculas, todas em minúsculas, mistas?)
contagem de espaços em branco iniciais/finais
```

**Colunas de data/hora:**
```
data mínima, data máxima
datas nulas
datas futuras (se inesperadas)
Distribuição por mês/semana
lacunas em séries temporais
```

**Colunas booleanas:**
```
contagem verdadeira, contagem falsa, contagem nula
taxa verdadeira
```

**Apresente o perfil como uma tabela de resumo clara**, agrupada por tipo de coluna (dimensões, métricas, datas, IDs).

### 4. Identificar problemas de qualidade de dados

Aplique a estrutura de avaliação de qualidade abaixo. Sinalize possíveis problemas:

- **Altas taxas de valores nulos**: Colunas com >5% de valores nulos (aviso), >20% de valores nulos (alerta)
- **Surpresas de baixa cardinalidade**: Colunas que deveriam ter alta cardinalidade, mas não têm (por exemplo, um "user_id" com apenas 50 valores distintos)
- **Surpresas de alta cardinalidade**: Colunas que deveriam ser categóricas, mas possuem muitos valores distintos.
- **Valores suspeitos**: Valores negativos onde apenas valores positivos eram esperados, datas futuras em dados históricos, valores claramente provisórios (ex.: "N/A", "TBD", "teste", "999999")
- **Detecção de duplicados**: Verifica se existe uma chave natural e se ela possui duplicados.
- **Assimetria da distribuição**: Distribuições numéricas extremamente assimétricas que podem afetar as médias.
- **Problemas de codificação**: Letras maiúsculas e minúsculas misturadas em campos categóricos, espaços em branco à direita, formatos inconsistentes.

### 5. Descubra relações e padrões

Após a análise do perfil de cada coluna individual:

- **Candidatos a chave estrangeira**: colunas de identificação que podem estar vinculadas a outras tabelas.
- **Hierarquias**: Colunas que formam caminhos naturais de detalhamento (país > estado > cidade)
- **Correlações**: Colunas numéricas que se movem juntas
- **Colunas derivadas**: Colunas que parecem ter sido calculadas a partir de outras.
- **Colunas redundantes**: Colunas com informações idênticas ou quase idênticas.

### 6. Sugira dimensões e métricas interessantes

Com base no perfil da coluna, recomendamos:

- **Melhores colunas dimensionais** para segmentar dados (colunas categóricas com cardinalidade razoável, de 3 a 50 valores)
- **Colunas métricas principais** para medição (colunas numéricas com distribuições significativas)
- **Colunas de tempo** adequadas para análise de tendências
- **Agrupamentos naturais** ou hierarquias aparentes nos dados
- **Possíveis chaves de junção** que ligam a outras tabelas (colunas de ID, chaves estrangeiras)

### 7. Recomendar análises de acompanhamento

Sugira de 3 a 5 análises específicas que o usuário poderia executar em seguida:

- "Análise de tendência em [métrica] por [coluna_de_tempo] agrupada por [dimensão]"
- "Análise detalhada da distribuição em [skewed_column] para entender os valores discrepantes"
- "Investigação da qualidade dos dados em [coluna_problemática]"
- "Análise de correlação entre [métrica_a] e [métrica_b]"
- "Análise de coorte usando [coluna_data] e [coluna_status]"

## Formato de saída

```
## Perfil de dados: [nome_da_tabela]

### Visão geral
- Linhas: 2.340.891
- Colunas: 23 (8 dimensões, 6 métricas, 4 datas, 5 IDs)
- Período: 15/03/2021 a 22/01/2024

### Detalhes da coluna
[tabela resumo]

### Problemas de qualidade de dados
[problemas sinalizados com gravidade]

### Explorações Recomendadas
[lista numerada de análises de acompanhamento sugeridas]
```

---

## Estrutura de Avaliação da Qualidade

### Pontuação de Completude

Avalie cada coluna:
- **Completo** (>99% não nulo): Verde
- **Quase completo** (95-99%): Amarelo -- investigar os casos nulos
- **Incompleto** (80-95%): Laranja -- entender o porquê e se isso importa
- **Escasseso** (<80%): Vermelho -- pode não ser utilizável sem imputação

### Verificações de consistência

Procurar:
- **Inconsistência no formato de valores**: O mesmo conceito representado de forma diferente ("EUA", "EUA", "Estados Unidos", "nós")
- **Inconsistência de tipo**: Números armazenados como strings, datas em vários formatos.
- **Integridade referencial**: Chaves estrangeiras que não correspondem a nenhum registro pai.
- **Violações das regras de negócio**: Quantidades negativas, datas de término anteriores às datas de início, percentagens > 100
- **Consistência entre colunas**: Status = "concluído", mas completed_at é nulo

### Indicadores de Precisão

Sinais de alerta que sugerem problemas de precisão:
- **Valores de espaço reservado**: 0, -1, 999999, "N/A", "TBD", "teste", "xxx"
- **Valores padrão**: Frequência suspeitamente alta de um único valor
- **Dados desatualizados**: A data de atualização não mostra alterações recentes em um sistema ativo.
- **Valores impossíveis**: Idades > 150, datas em um futuro distante, durações negativas
- **Viés de arredondamento**: Todos os valores terminados em 0 ou 5 (sugere estimativa, não medição)

### Avaliação de Pontualidade

- Quando a tabela foi atualizada pela última vez?
- Qual é a frequência de atualização esperada?
- Existe algum atraso entre o momento do evento e o momento do carregamento?
- Existem lacunas na série temporal?

## Técnicas de Descoberta de Padrões

### Análise de Distribuição

Para colunas numéricas, caracterize a distribuição:
- **Normal**: Média e mediana próximas, distribuição em forma de sino.
- **Assimetria à direita**: Cauda longa de valores altos (comum para receita e duração da sessão)
- **Assimetria à esquerda**: Cauda longa de valores baixos (menos comum)
- **Bimodal**: Dois picos (sugere duas populações distintas)
- **Lei de potência**: Poucos valores muito grandes, muitos valores pequenos (comum na atividade do usuário)
- **Uniforme**: Frequência aproximadamente igual em toda a faixa (geralmente sintética ou aleatória)

### Padrões Temporais

Para dados de séries temporais, procure por:
- **Tendência**: Movimento sustentado de alta ou de baixa
- **Sazonalidade**: Padrões repetitivos (semanais, mensais, trimestrais, anuais)
- **Efeitos do dia da semana**: Diferenças entre dias de semana e fins de semana
- **Efeitos de feriados**: Quedas ou picos em torno de feriados conhecidos.
- **Pontos de mudança**: Mudanças repentinas no nível ou na tendência.
- **Anomalias**: Pontos de dados individuais que quebram o padrão

### Descoberta de Segmentação

Identificar segmentos naturais por:
- Identificar colunas categóricas com 3 a 20 valores distintos
- Comparação da distribuição de métricas entre os valores dos segmentos
- Procurando segmentos com comportamentos significativamente diferentes
- Testar se os segmentos são homogêneos ou contêm subsegmentos

### Exploração de Correlação

Entre colunas numéricas:
- Calcular a matriz de correlação para todos os pares de métricas
- Sinalize correlações fortes (|r| > 0,7) para investigação.
Observação: Correlação não implica causalidade -- sinalize isso explicitamente.
- Verificar a existência de relações não lineares (por exemplo, quadráticas, logarítmicas)

## Compreensão e Documentação do Esquema

### Modelo de Documentação de Esquema

Ao documentar um conjunto de dados para uso da equipe:

```markdown
## Tabela: [schema.table_name]

**Descrição**: [O que esta tabela representa]
**Grão**: [Uma fileira por...]
**Chave primária**: [coluna(s)]
**Número de linhas**: [aproximado, com data]
**Frequência de atualização**: [em tempo real / por hora / diariamente / semanalmente]
**Proprietário**: [equipe ou pessoa responsável]

### Colunas principais

| Coluna | Tipo | Descrição | Valores de exemplo | Observações |
|--------|------|-------------|----------------|-------|
| user_id | STRING | Identificador único do usuário | "usr_abc123" | Chave estrangeira para users.id |
| event_type | STRING | Tipo de evento | "clique", "visualização", "compra" | 15 valores distintos |
| Receita | DECIMAL | Receita de transações em USD | 29,99, 149,00 | Nulo para eventos que não sejam de compra |
| created_at | TIMESTAMP | Quando o evento ocorreu | 2024-01-15 14:23:01 | Particionado nesta coluna |

### Relacionamentos
- Participa do grupo `users` com base no `user_id`
- Faz a junção com `products` usando `product_id`.
- Pai de `event_details` (relacionamento 1:muitos com base em event_id)

### Problemas Conhecidos
- [Liste quaisquer problemas conhecidos de qualidade de dados]
- [Observe quaisquer armadilhas para os analistas]

### Padrões de consulta comuns
- [Casos de uso típicos para esta tabela]
```

### Consultas de Exploração de Esquema

Ao conectar-se a um data warehouse, use estes padrões para descobrir o esquema:

```sql
-- Listar todas as tabelas em um esquema (PostgreSQL)
SELECIONE nome_da_tabela, tipo_da_tabela
A PARTIR DE information_schema.tables
ONDE table_schema = 'public'
ORDENAR POR nome_da_tabela;

-- Detalhes da coluna (PostgreSQL)
SELECT nome_da_coluna, tipo_de_dados, is_nullable, valor_padrão_da_coluna
A PARTIR DE information_schema.columns
ONDE nome_da_tabela = 'minha_tabela'
ORDENAR POR posição_ordinal;

-- Tamanhos de tabelas (PostgreSQL)
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
DE pg_catalog.pg_station_user_tables
ORDENAR POR pg_total_relation_size(relid) DESC;

-- Contagem de linhas para todas as tabelas (padrão geral)
-- Executar por tabela: SELECT COUNT(*) FROM nome_da_tabela
```

### Linhagem e Dependências

Ao explorar um ambiente de dados desconhecido:

1. Comece com as tabelas de "saída" (o que os relatórios ou painéis consomem)
2. Rastrear a montante: Quais tabelas alimentam esses fluxos?
3. Identificar camadas de matéria-prima/preparação/mercado
4. Mapeie a cadeia de transformação dos dados brutos para as tabelas analíticas.
5. Observe onde os dados são enriquecidos, filtrados ou agregados.

## Pontas

- Para tabelas muito grandes (mais de 100 milhões de linhas), as consultas de perfil usam amostragem por padrão -- mencione se precisar de contagens exatas.
- Ao explorar um novo conjunto de dados pela primeira vez, este comando fornece uma visão geral antes de escrever consultas específicas.
- Os indicadores de qualidade são heurísticos — nem todos os indicadores representam um problema real, mas cada um merece uma análise rápida.