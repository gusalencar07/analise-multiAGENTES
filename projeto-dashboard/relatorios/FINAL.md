# Relatório final — Papelê Studio · vendas

## Status conjunto: **APROVADO**

Construtor, Tester, Revisor e Coordenador aprovaram a mesma versão da rodada 04. O projeto não está em um repositório Git; os hashes SHA-256 identificam a versão validada.

| Arquivo | SHA-256 |
|---|---|
| `prepare_data.py` | `8e5f88d102fa7795c0fea74b690cf527f240be3a79906fe47f7fa7a1acc9e8cf` |
| `site/index.html` | `8f97b3e52d199ac8f69ff547e0a60ccf302e2a43fb881c76e3b5ee9b4154354f` |
| `site/styles.css` | `4e7ecd9d073e4b6fd5e2606b2efafebeef28e068f2fb2926133785440c343ae7` |
| `site/app.js` | `6a812818f8a4c5c2f22e40fecfa290002d138edd0538df6e367190b7b0ccf0cf` |
| `site/data/vendas.json` | `65fe7740872b4820aa0cb93e366b440cea22c1660d6997f384046e7b9d1f421f` |
| `tests/test_dashboard.py` | `6b3df932b7a8859e44f661e00f9e7e579fd33b8cd6ee6a8f0b703fc4b143818e` |
| `tests/real_browser_test.cjs` | `521809324a6896c2a11c02fd4002ed2b7cb337b7667e5f2bc131e3b8aa2818b7` |
| `papelaria_limpa.csv` (fonte) | `ee3b0a8a5147a621267e3f7137b12a6f8fd694a3874175735e7c68d1a733799c` |

## Entrega

- O site em `site/` mantém o **relatório de vendas como foco**: filtros por cidade e categoria, três indicadores, dois gráficos e tabela detalhada. A identidade editorial Papelê usa creme, amarelo manteiga, verde menta, azul céu, grafite e verde profundo; não foram adicionadas seções de loja.
- A base preparada tem 180 vendas, total vendido de **R$ 20.059,00** e ticket médio de **R$ 111,44**. Valor vendido não é lucro. O período mostrado (1º jan–31 mar 2026) é contexto estático, não um filtro interativo.
- CSVs originais e entregas anteriores foram preservados. A rodada anterior aprovada permanece documentada nos relatórios históricos; esta versão visual atualizada foi validada separadamente na rodada 04.

## Testes e revisão

Na pasta `projeto-dashboard`, a suíte completa passou: **8 testes**, incluindo cálculos independentes, exemplo conhecido, preparação e preservação dos dados, HTTP, interação em Chrome, filtros, teclado e telas 390×844 e 1440×900. Também passaram:

```powershell
node --check site\app.js
node --check tests\real_browser_test.cjs
..\.venv\Scripts\python.exe -B -m unittest discover -s tests -v
```

O teste de navegador confere as cores computadas dos gráficos e o tamanho mínimo dos rótulos, além de overflow e conteúdo. **Não** comprova contraste, sobreposição, recorte de texto ou legibilidade perceptual; essas propriedades não são declaradas como verificadas.

Relatórios desta versão: `rodada-04/construtor.md`, `rodada-04/tester.md` e `rodada-04/revisor.md`. Os relatórios anteriores foram preservados. As skills `explore-data`, `data-visualization` e `validate-data` não estão presentes em `.agents/skills/` neste workspace e não foram alegadas como utilizadas nesta rodada.

## Como abrir

No PowerShell, dentro da pasta `projeto-dashboard`:

```powershell
..\.venv\Scripts\python.exe prepare_data.py
python -m http.server 8000 --directory site
```

Abra <http://localhost:8000>. `projeto-dashboard/site/` é a pasta publicável para hospedagem estática; a publicação não está incluída.
