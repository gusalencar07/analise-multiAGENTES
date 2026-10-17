# Verificação da análise da papelaria

## Escopo e método
- Lidos integralmente: `vendas_papelaria.csv`, `papelaria_limpa.csv`, `resumo.md` e `graficos.py`.
- Interpretador: `.venv/Scripts/python.exe`. Apenas arquivos locais, sem bancos de dados ou consultas externas.
- Recálculo independente com a biblioteca padrão (`csv`, `Decimal`, `Counter`); não reutiliza os totais de pandas nem os números do relatório como fonte de cálculo.
- A skill solicitada `validate-data` foi carregada, mas seu conteúdo está identificado como `data-visualization`; por isso a conferência segue as verificações explicitamente descritas neste documento.

## Reconciliação das vendas
| Base / cálculo | Registros de vendas | Total vendido |
| --- | ---: | ---: |
| Original sem deduplicar (contém repetições) | 182 | R$ 20.066,00 |
| Original após remover apenas duplicatas exatas | 180 | R$ 20.059,00 |
| Cópia: quantidade × preço, recalculado | 180 | R$ 20.059,00 |
| Cópia: soma do valor_venda salvo | 180 | R$ 20.059,00 |

- Quantidade correta de vendas: **180**, confirmada pela contagem de linhas e de IDs distintos. **548 é o número de unidades vendidas, não de vendas.**
- As duas ocorrências excedentes (V0010 e V0020) valem R$ 7,00 no total. Usar o original sem deduplicação superestimaria o valor vendido e a contagem de vendas.
- Os 180 registros limpos foram comparados, campo a campo e na ordem, à transformação autorizada do original. Não houve exclusões ou alterações adicionais.

## Soma por categoria
| Categoria | Vendas | Valor vendido |
| --- | ---: | ---: |
| Acessórios | 65 | R$ 10.517,00 |
| Livros | 54 | R$ 7.438,00 |
| Papelaria | 61 | R$ 2.104,00 |
| **Total** | **180** | **R$ 20.059,00** |

Diferença para o total geral: **R$ 0,00**.

## Soma por cidade
| Cidade | Vendas | Valor vendido |
| --- | ---: | ---: |
| Campinas | 70 | R$ 8.578,00 |
| Santos | 60 | R$ 6.937,50 |
| Sorocaba | 50 | R$ 4.543,50 |
| **Total** | **180** | **R$ 20.059,00** |

## Código dos gráficos
- `graficos.py` resolve o CSV na pasta do próprio script e lê `papelaria_limpa.csv`, não o original. Agrega a soma de `valor_venda` por categoria e cidade, sem filtros ou deduplicação adicional.
- Executada a função `main()` do código real com monitoramento de `read_csv` e interceptação de `Figure.savefig`. Conferidos os caminhos lidos, nomes de saída, alturas de todas as barras, títulos, rótulos em reais e início das barras/eixos em zero. Os PNGs não foram sobrescritos nesta auditoria.
- Não foi realizada uma nova inspeção visual/pixel a pixel dos PNGs existentes; a execução monitorada valida o código e as figuras geradas em memória, não autentica o conteúdo dos arquivos de imagem já salvos.

## Verificações efetivamente executadas
| Verificação | Resultado |
| --- | --- |
| Estrutura original 182 × 8 e cópia 180 × 9 | OK |
| Esquema preservado, acrescentando apenas valor_venda | OK |
| Somente duplicatas exatas V0010 e V0020 removidas | OK |
| Todos os campos e a ordem correspondem à limpeza autorizada | OK |
| Seis cidades, três categorias e quatro pagamentos tratados | OK |
| IDs únicos e não vazios na cópia | OK |
| valor_venda correto em todas as linhas | OK |
| Três caminhos independentes concordam no total tratado | OK |
| Diferença do bruto é exatamente o valor das duplicatas | OK |
| Somas por categoria e cidade reconciliam com o total | OK |
| Contagens por categoria e cidade reconciliam com as vendas | OK |
| Total e unidades coincidem com resumo.md | OK |
| Tabela de categorias de resumo.md confere | OK |
| Tabela mensal de resumo.md confere | OK |
| Período e cobertura de 90 dias confirmados | OK |
| Não há datas futuras ou métricas não positivas | OK |
| Produto tem uma categoria e um preço na base limpa | OK |
| Hash atual do original coincide com o registrado em resumo.md | OK |
| categorias.png: alturas iguais ao recálculo independente | OK |
| categorias.png: barras e eixo começam em zero | OK |
| categorias.png: título em português e rótulos em reais | OK |
| cidades.png: alturas iguais ao recálculo independente | OK |
| cidades.png: barras e eixo começam em zero | OK |
| cidades.png: título em português e rótulos em reais | OK |
| Código dos gráficos lê somente papelaria_limpa.csv | OK |
| Código gera os dois nomes esperados | OK |
| Código não apresenta valor vendido como lucro | OK |
| Quatro arquivos de entrada permaneceram intactos durante a auditoria | OK |

## Revisão das conclusões e correções
- Acessórios lidera em valor vendido entre categorias; Campinas lidera entre cidades. São conclusões restritas a 01/01/2026–31/03/2026 e a esta base.
- Valor vendido não é lucro: não foram fornecidos custos, despesas, tributos ou margens. R$ é a convenção de apresentação solicitada; o CSV não registra explicitamente a moeda.
- A relação produto–categoria é consistente na cópia normalizada; no original, a mesma categoria apresenta diferenças de caixa (`Acessórios`/`acessórios`).
- Não há base para afirmar causalidade, sazonalidade anual ou superioridade de rentabilidade. As sugestões de análises no resumo são propostas, não resultados comprovados.
- Não foram encontrados erros nos totais, contagens de vendas por categoria, tabela mensal ou código dos gráficos. Nenhuma correção numérica foi necessária. Em `resumo.md`, foram explicitadas a distinção entre 180 vendas e 548 unidades, a convenção monetária solicitada e a diferença entre valor vendido e lucro. Também foi corrigida a ambiguidade da conclusão produto–categoria: ela se refere à cópia normalizada, não à grafia literal do original.

## Limites desta conferência
- Não foram recalculados nesta auditoria todos os percentis, desvios padrão, frequências textuais ou coeficientes de correlação do perfil original. A conferência das tabelas do resumo se limitou aos totais, categorias e meses descritos acima.
- Não foi verificada a veracidade comercial das vendas em sistemas externos, nem a completude do arquivo frente ao movimento real. O hash do original coincide com o documentado anteriormente; isso não é uma autenticação externa da fonte.

Os hashes dos quatro arquivos de entrada foram comparados antes das clarificações editoriais em `resumo.md`. Depois dessa etapa, somente o resumo foi atualizado; os dois CSVs e `graficos.py` permaneceram sem alterações.

## SHA-256 dos CSVs preservados
- `vendas_papelaria.csv`: `bf95b7609e30eb7e3e6a30cfc16e43d9fb5bdfc48a410e49148cceb92e2494ff`.
- `papelaria_limpa.csv`: `ee3b0a8a5147a621267e3f7137b12a6f8fd694a3874175735e7c68d1a733799c`.
