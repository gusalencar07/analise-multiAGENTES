# Deploy do relatório no Render

O repositório já contém a configuração `render.yaml` de um **Render Static Site**. O diretório publicado é `projeto-dashboard/site/`; não há build de aplicação nem serviço de backend.

## Conectar na conta Render

1. Entre no [Render Dashboard](https://dashboard.render.com/).
2. Escolha **New → Blueprint** e conecte o repositório `gusalencar07/analise-multiAGENTES`.
3. Confirme o serviço `papelaria-relatorio-vendas` definido em `render.yaml` e aplique a configuração.
4. Aguarde o build/deploy terminar e abra a URL `*.onrender.com` exibida pelo Render.

Se já existir um Static Site vinculado ao mesmo repositório e branch `main`, o push dos arquivos do site pode iniciar o deploy automático. Confira o resultado no painel antes de compartilhar a URL.

## Publicação e dados

O site usa somente HTML, CSS, JavaScript e `data/vendas.json`. O diretório de publicação contém apenas esses arquivos estáticos; CSVs originais, `.venv`, scripts Python e testes não são publicados. Os dados são demonstrativos e não foram confirmados contra um sistema comercial externo.

O repositório pode ser atualizado com um novo commit na branch `main`; o Render fará novo deploy se a integração automática estiver habilitada. A criação inicial do serviço e permissões de acesso ao GitHub exigem autenticação na conta Render.
