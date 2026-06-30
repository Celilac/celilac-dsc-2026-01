# Fase 1 — Skeleton do frontend

**Origem:** mensagem do prof. (16/06, 07:57) — "No mesmo nível onde está o
backend, crie um projeto React com Vite e Tailwind."

## Objetivo

Criar `agenda-facil-frontend/` com Vite + React + TS + Tailwind v4, ESLint,
Prettier e Dockerfile.dev, integrado ao compose da raiz com HMR funcionando.

## Stack

- Vite 6
- React 19 + React DOM 19
- TypeScript 5
- Tailwind v4 via `@tailwindcss/vite` plugin
- ESLint 9 (flat config) + `eslint-plugin-react-hooks`
- Prettier 3
- pnpm

## Passos

1. Criar `agenda-facil-frontend/` com:
   - `package.json` (scripts `dev`, `build`, `preview`, `lint`, `format`)
   - `tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json`
   - `vite.config.ts` com plugin `@tailwindcss/vite` + alias `@/` → `src/`
   - `index.html`
   - `src/main.tsx`, `src/App.tsx`, `src/index.css` (`@import "tailwindcss"`)
   - `src/vite-env.d.ts`
   - `eslint.config.js`, `.prettierrc`, `.gitignore`, `.dockerignore`
2. Criar `agenda-facil-frontend/Dockerfile.dev`
   (node:20-alpine, pnpm, `pnpm dev --host 0.0.0.0`)
3. Adicionar service `frontend` ao `docker-compose.yml` da raiz
   - Porta 5173 → host 5173
   - Bind mount do source (HMR)
   - Volume nomeado pra `node_modules` (evita sobrescrever o do container)
4. Rodar `pnpm install` localmente
5. Rodar `pnpm dev` e validar `http://localhost:5173`
6. Rodar `docker compose up -d --build frontend` e validar HMR

## Critério de aceitação

- [x] `pnpm dev` local serve `http://localhost:5173`
- [x] Tailwind funciona (classe `bg-red-500` aplica vermelho na tela)
- [x] HMR responde a mudanças em `src/App.tsx`
- [ ] Mesmo comportamento via `docker compose up frontend` (validar manualmente)

## Notas

- Tailwind v4 não usa mais `tailwind.config.js`; tokens vão em `@theme {}`
  dentro do CSS (será aplicado na Fase 2).
- Alias `@/` precisa estar em 2 lugares: `tsconfig.app.json#paths` e
  `vite.config.ts#resolve.alias`.
