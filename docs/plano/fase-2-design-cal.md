# Fase 2 — Design system Cal.com aplicado

**Origem:** mensagens do prof. (16/06, 08:55 + 23/06) sobre dialog, toast,
e-mail, plus pedido geral de melhorar visual via getdesign.md.

## Objetivo

Aplicar o design system do Cal.com como base do frontend, definir tokens
(cores, tipografia, raios, sombras, espaços) e implementar primitivos.

## Passos

1. Rodar `npx getdesign@latest add cal-com` na raiz de `agenda-facil-frontend/`
   - Vai gerar `DESIGN.md` na raiz do frontend
2. Ler `DESIGN.md` e extrair:
   - paleta (neutros + accent)
   - escala tipográfica
   - raios (Cal.com usa `--radius` ~6px)
   - sombras
3. Traduzir tokens pra Tailwind v4 (`@theme {}` em `src/index.css`)
4. Implementar primitivos em `src/components/ui/`:
   - `Button` (variants: primary, secondary, ghost, destructive)
   - `Input` + `Label` + `Field` (com erro inline)
   - `Card`
   - `Dialog` (Radix UI — base acessível)
   - `Toast` (sonner — topo direito)
5. Setup `sonner` em `<App />` (posição `top-right`)
6. Criar página inicial mostrando paleta + tipografia (sanity check)

## Critério de aceitação

- [x] `DESIGN.md` existe no frontend (gerado via `npx getdesign add cal`)
- [x] Tokens estão em `@theme` no CSS (`src/index.css`)
- [x] Primitivos exportados de `@/components/ui`
      (Button, Input, Label, Field, Card, Dialog, Toaster)
- [x] `<Toaster position="top-right" />` no App
- [x] Página de paleta acessível em `/_design` — validar visualmente

## Notas

- Cal.com tem dois temas (claro + escuro). Implementar só o claro nesta fase;
  dark mode fica pra fase futura se sobrar tempo.
- Radix UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-label`) +
  `class-variance-authority` + `tailwind-merge` são a stack canônica.
