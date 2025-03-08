# Estratégia de Geração e Uso de Hashes

- Geramos com antecedência um número X de hash, assim controlamos a disponibilidade das hashes, evitando um loop grande para saber se a hash já foi usada ou não.
- Na tabela de hash iremos pegar a primeira hash disponível, retornar o valor e salvar na tabela de hashuser

# Trafego Estimado

- 500 RPM
- 10 novas urls por minutos

# Armazenamento estimado no PostgreSQl

- **Tabelas:**
  - `HASHUSER`
    - hash: varchar(6) => PK => index
    - user_id: uuid = varchar(36)
    - url_original: varchar(255)
    - created_at: TIMESTAMPTZ
    - updated_at: TIMESTAMPTZ
  - `HASHES`
    - hash: varchar(6) => PK => index
    - available: boolean
    - created_at: TIMESTAMPTZ
- **Custo por caracter no banco de dados**
  - `varchar()` => 4 bytes por carácter
  - `TIMESTAMPTZ DEFAULT NOW()` => 8 bytes por registro
  - `boolean` => 1 bytes por registro
- **Custo estimado de armazenamento por registro:**
  - `HASHES`
    - custo estimado por registro na tabela `Hash` = 33 bytes
    - 6.000.000 registros x 33 bytes = 198000000 bytes = 188.78MB
  - `HASHUSER`
    - custo estimado por registro na tabela `HASHUSER` = 684 bytes = 0,000652 MB
    - 10 url por minutos x 60 minutos x 24 horas x 365 dias = 5.256.000 url
    - o total de armazenamento necessário em um ano seria = 5.256.000 url x 0,000652 MB = 3,35GB
