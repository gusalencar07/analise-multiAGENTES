# Relatórios, fluxos de trabalho e dashboard de vendas

Repositório público com os relatórios de análise da papelaria, o fluxo da equipe, as skills usadas no processo e o dashboard estático preparado para Render.

## Conteúdo publicado

- `AGENTS.md`: fluxo de trabalho, responsabilidades, critérios e relatórios por rodada.
- `.opencode/skills/`: definições Markdown de `explore-data`, `data-visualization` e `validate-data`.
- `resumo.md` e `verificacao.md`: perfil e verificação independente dos dados.
- `projeto-dashboard/relatorios/`: relatório final e histórico das rodadas.
- `projeto-dashboard/site/`: arquivos estáticos do relatório interativo de vendas e seus dados preparados.
- `render.yaml` e `DEPLOY_RENDER.md`: configuração do Render Static Site e instruções para vinculá-lo à conta.

O repositório publica apenas a documentação Markdown, a configuração do Render e os arquivos necessários para servir o dashboard estático. CSVs originais, imagens, scripts de análise/testes, ambiente `.venv`, caches e demais arquivos locais ficam excluídos. Os relatórios descrevem dados demonstrativos de vendas; não representam dados comerciais verificados externamente.

## Observação sobre as skills

`validate-data/SKILL.md` está incluído como encontrado no workspace. Seu conteúdo é igual ao de `data-visualization/SKILL.md`; os relatórios registram essa inconsistência, sem corrigir ou mascarar o arquivo original.

## Fluxo documentado

Consulte `AGENTS.md` para as instruções completas. O processo usa as três funções Construtor, Tester e Revisor, preserva relatórios por rodada e só declara aprovação quando todos validam a mesma versão. Para configurar a hospedagem, siga `DEPLOY_RENDER.md`.
