# nota

- Geramos com antecedência um número X de hash, é controlamos a disponibilidade da hash, evitando um loop grande para saber se a hash já foi usada ou não.
- Uma cron vai verificar a quantidade de hash disponíveis, após verificar uma baixa disponibilidade, a cron vai populando a tabela com mais hash.
- Ir na tabela de hash pegar a primeira hash disponível e salvar na tabela de hash do usuário

revisar repository

# Trafego Estimado

500 RPM

10 novas urls por minutos

# Armazenamento estimado no PostgreSQl

- **Tabelas:**
  - `HashUser`
    - hash: varchar(6) => PK => index
    - user_id: uuid = varchar(36)
    - url_original: varchar(255)
    - created_at: TIMESTAMPTZ
    - updated_at: TIMESTAMPTZ
  - `Hash`
    - hash: varchar(6) => PK => index
    - available: boolean
    - created_at: TIMESTAMPTZ
- **Custo por caracter no banco de dados**
  - `varchar()` => 4 bytes por carácter
  - `TIMESTAMPTZ DEFAULT NOW()` => 8 bytes por registro
  - `boolean` => 1 bytes por registro
- **Custo estimado de armazenamento por registro:**
  - `Hash`
    - custo estimado por registro na tabela `Hash` = 33 bytes
    - 2.000.000 registros x 33 bytes = 72000000 bytes = 68,66 MB
  - `HashUser`
    - custo estimado por registro na tabela `HashUser` = 684 bytes = 0,000652 MB
    - 10 url por minutos x 60 minutos x 24 horas x 365 dias = 5.256.000 url
    - o total de armazenamento necessário em um ano seria = 5.256.000 url x 0,000652 MB = 3,35GB
