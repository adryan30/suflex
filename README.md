# Challenge Suflex


## Descrição

Repositório para subtemeter resposta para processo seletivo para empresa [Suflex](https://www.suflex.com.br/).

Consiste em uma API GraphQL/Rest utilizada para listagem de produtos disponibilizados para o desafio e seus respectivos dias até o vencimento.

Foi utilizado:
- [Nest.js](https://nestjs.com/) como framework backend
- [PostgreSQL](https://www.postgresql.org/) para o banco de dados
- [Jest](https://jestjs.io/pt-BR/) como framework de testes
- [GraphQL](https://graphql.org/) como "query language" da API
- [Docker](https://www.docker.com/) para containerização da aplicação
- [Docker Compose](https://docs.docker.com/compose/) para osquestração dos containers
- [AWS](https://aws.amazon.com/pt/) para hospedagem online e demonstração com o GraphQL Playground
- [NGINX](https://www.nginx.com/) como "proxy server" para deploy na AWS


## Instalação

```bash
# Clone esse repositório
$ git clone https://github.com/adryan30/suflex.git

# Instale as dependências
$ yarn install

# Crie o arquivo .env com os dados de banco de dados
# O .env.example já possui configurações adequada para funcionar com docker-compose
$ cp .env.example .env
```

## Executando o app

```bash
# Modo de desenvolvimento
$ docker compose up

# Modo de testes
$ docker compose -f docker-compose.test.yml up

# Modo de produção
$ docker compose -f docker-compose.prod.yml up
```

## Contato

- Autor - [Adryan Almeida](https://github.com/adryan30)
- Email - [adryan.software@gmail.com](mailto:adryan.software@gmail.com)