CREATE TABLE IF NOT EXISTS HASHES (
  HASH VARCHAR(6) NOT NULL PRIMARY KEY,
  AVAILABLE BOOLEAN NOT NULL,
  CREATED_AT TIMESTAMPTZ DEFAULT NOW()
);