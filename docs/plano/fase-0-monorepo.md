# Fase 0 — Reestruturação do monorepo

**Origem:** mensagem do prof. (16/06, 07:57) — "O docker-compose está dentro do
backend. Preciso que ele vá para o root e já agregue o serviço do frontend
dele, habilitando o watch."

## Objetivo

Promover `docker-compose.yml` para a raiz do workspace e preparar o slot
do frontend (será preenchido na Fase 1).

## Passos

1. Criar `/docker-compose.yml` na raiz cobrindo:
   - `postgres` (igual ao do backend)
   - `backend` (build context `./agenda-facil-backend`)
   - `frontend` (build context `./agenda-facil-frontend`, comentado se a pasta
     ainda não existir — descomenta na Fase 1)
2. Criar `/.env` na raiz com as variáveis compartilhadas
   (DB_*, JWT_SECRET, VITE_API_URL)
3. Apagar `agenda-facil-backend/docker-compose.yml`
4. Atualizar `agenda-facil-backend/README.md` (seção Docker → "use o compose
   da raiz: `docker compose up -d --build`")

## Critério de aceitação

- [x] `docker compose config` na raiz não dá erro
- [x] `docker compose up -d postgres backend` sobe ambos
- [x] Backend continua respondendo em `localhost:3000`

## Notas

- O backend tem `.git` próprio. A remoção do `docker-compose.yml` lá fica
  só no working tree; só commita quando o user pedir.
- A raiz também é repo git (separado) — `docker-compose.yml` raiz fica
  no workspace git.
