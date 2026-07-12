# Plano de evolução — AgendaFácil

Plano faseado a partir das mensagens do Prof. Everton (16/06 e 23/06/2026).
Cada fase é auto-contida pra ser executada em sessões diferentes.

> **Regras vigentes:**
> - `main` do backend = implementação MINIMAL acadêmica
> - Rigor de spec (SDD/TCC) vive só no branch `sdd`
> - **Nunca dar `git push` automático** — sempre pedir confirmação

---

## Estrutura final do monorepo

```
celilac-dsc-2026-01/
├── agenda-facil-backend/   (NestJS — já existe, repo Git próprio)
├── agenda-facil-frontend/  (React + Vite + Tailwind — Fase 1)
├── agenda-facil-mobile/    (Flutter Android-only — Fase 6)
├── docker-compose.yml      (raiz — Fase 0)
└── .env                    (raiz — Fase 0)
```

## Decisões já tomadas

- **Design system base:** Cal.com (via getdesign.md)
- **Stack web:** Vite 6 + React 19 + TypeScript 5 + Tailwind v4
- **Stack mobile:** Flutter (Android-only), `--org br.com.celilac`
- **Pacote web:** `pnpm` (parity com backend)
- **Toast:** topo direito (sonner)
- **Idioma:** pt-BR em toda UI

---

## Status das fases

- [x] **Fase 0** — [Reestruturação do monorepo](fase-0-monorepo.md)
- [x] **Fase 1** — [Frontend skeleton (Vite + React + TS + Tailwind)](fase-1-frontend-skeleton.md)
- [x] **Fase 2** — [Design system Cal.com aplicado](fase-2-design-cal.md)
- [x] **Fase 3** — [Auth UI (login + cadastro + recuperar)](fase-3-auth-ui.md)
- [x] **Fase 4** — [Onboarding](fase-4-onboarding.md)
- [x] **Fase 5** — [Prompt do Stitch (mobile design)](fase-5-stitch-prompt.md)
- [x] **Fase 6** — [Flutter skeleton](fase-6-flutter-skeleton.md)
- [x] **Fase 7** — [Mobile auth UI](fase-7-mobile-auth.md)

---

## Como retomar em uma nova sessão

1. Abrir este arquivo
2. Identificar a próxima fase com `[ ]`
3. Abrir o `.md` correspondente
4. Seguir a seção "Passos" e marcar `[x]` na "Checklist de saída"
5. Ao terminar, atualizar o status aqui no INDEX
