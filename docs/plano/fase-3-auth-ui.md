# Fase 3 — Auth UI (login + cadastro + recuperar senha)

**Origem:** mensagens do prof. (16/06, 08:36 + 08:55).

## Objetivo

Implementar fluxo completo de autenticação na web integrado ao backend.

## Requisitos do professor (literais)

1. Login no topo direito da página principal, **fixo**
2. Cadastro com `role` default `user` (corrigir erro
   "role must be one of the following values: admin, user")
3. Toast **acima**, lado direito
4. Dialog **mais baixo** — dicas de senha forte à **direita**
5. Validação correta de e-mail
6. Mensagens **sempre em pt-BR**
7. Opção de recuperar senha visível

## Passos

1. Criar `src/api/auth.ts` com:
   - `login(email, senha)` → POST `/auth/login`
   - `register(payload)` → POST `/usuarios` (role default `user`)
   - `recoverPassword(email)` → stub (backend ainda não tem endpoint)
2. Hook `useAuth()` (zustand ou context) — guarda `token`, `user`
3. Persistir token em `localStorage`
4. Componente `<AuthMenu />` (top-right fixo no header):
   - Estado deslogado: botão "Entrar" + "Criar conta"
   - Estado logado: avatar + dropdown "Sair"
5. Dialog `<LoginDialog />`:
   - Campo e-mail (regex de validação)
   - Campo senha
   - Link "Esqueci minha senha"
   - Submit → `login()` → toast sucesso/erro
6. Dialog `<RegisterDialog />`:
   - Layout 2 colunas (form à esquerda, dicas senha forte à direita)
   - Email com validação (`type="email"` + regex)
   - Senha com indicador de força
   - Submit → `register()` com `role: 'user'` implícito
7. Dialog `<RecoverPasswordDialog />`:
   - Campo e-mail
   - Submit → mostra mensagem "Em breve enviaremos..." (sem backend ainda)
8. Mensagens em `src/i18n/messages.ts` (sem framework — objeto puro)

## Critério de aceitação

- [x] Login real → backend → token guardado (localStorage `agenda-facil:token`)
- [x] Cadastro sem `role` → backend default = CLIENTE (no agenda-facil
      a enum é CLIENTE/PROFISSIONAL, não admin/user)
- [x] Toast aparece top-right (sonner com `position="top-right"`)
- [x] Dialog de cadastro em 2 colunas (form esquerda + dicas senha direita)
- [x] E-mail inválido bloqueia submit (regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`)
- [x] Tudo em pt-BR (`src/i18n/messages.ts`)
- [x] Header com login fixo no canto superior direito (`<AuthMenu />`)
- [ ] Validar integração ao vivo com backend rodando (manual)

## Notas

- Backend já tem POST `/auth/login` (UC02) e POST `/usuarios` (UC01).
- "Recuperar senha" não tem endpoint → entregar só a UI com mensagem de
  "em breve" até ter spec do prof.
