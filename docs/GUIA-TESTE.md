# AgendaFácil — Guia completo de teste e demonstração

> Pra apresentar, validar e depurar tudo que foi entregue nas fases 0 a 7.
> Sempre que aparecer **comando**, rode na raiz do workspace
> (`/home/kauan/Desktop/utfpr/celilac-dsc-2026-01`) salvo nota em contrário.

---

## 1. Mapa do que foi entregue

| Fase | O quê | Onde mora |
|---|---|---|
| 0 | Monorepo + docker-compose na raiz | `docker-compose.yml`, `.env`, `.env.example` |
| 1 | Frontend web (Vite + React + TS + Tailwind v4) | `agenda-facil-frontend/` |
| 2 | Design system Cal.com aplicado (tokens + primitivos) | `agenda-facil-frontend/{DESIGN.md,src/components/ui,src/index.css}` |
| 3 | Auth UI web (login + cadastro + recuperar) | `agenda-facil-frontend/src/{api,auth,components/dialogs,components/AuthMenu.tsx}` |
| 4 | Onboarding web (3 slides + gate) | `agenda-facil-frontend/src/{pages/Onboarding.tsx,components/OnboardingGate.tsx,lib/onboarding.ts}` |
| 5 | Prompt do Stitch (mobile design) | `docs/stitch-prompt.md` |
| 6 | Skeleton Flutter Android | `agenda-facil-mobile/` |
| 7 | Mobile auth UI (Onboarding + Login + Register + Recover + Home) | `agenda-facil-mobile/lib/features/auth` |

Plano faseado completo (com checkboxes por fase): `docs/plano/INDEX.md`.

---

## 2. Pré-requisitos

| Para testar... | Instale |
|---|---|
| Backend + frontend web (Docker) | Docker + Docker Compose |
| Frontend local (sem Docker) | Node 20+ e pnpm (`npm i -g pnpm`) |
| Mobile no emulador | Flutter 3.44+ **e** Android SDK + emulator |

**Status do que já está na máquina:**

- ✅ Docker + Postgres prontos
- ✅ Node + pnpm instalados (frontend rodou com `pnpm dev`)
- ✅ Flutter 3.44.3 instalado via snap
- ⚠ Android SDK **não instalado** — necessário só para `flutter run` no
  emulador. Sem ele, ainda dá pra rodar `flutter analyze` e `flutter test`.

---

## 3. Subindo tudo

### 3.1 Variáveis de ambiente

Já existe `.env` na raiz com defaults sãos:

```env
DB_USERNAME=agendafacil
DB_PASSWORD=agendafacil
DB_DATABASE=agendafacil_db
JWT_SECRET=agenda-facil-dev-secret
VITE_API_URL=http://localhost:3000
```

Não precisa editar para testes locais.

### 3.2 Backend + banco (Docker — recomendado)

```bash
docker compose up -d postgres backend
docker compose logs -f backend     # ver logs
```

Backend sobe em `http://localhost:3000`. Postgres em `localhost:5432`.

Pra parar:

```bash
docker compose down                    # mantém o volume do banco
docker compose down -v                 # apaga TUDO (banco zerado)
```

### 3.3 Frontend web

**Opção A — local (mais rápido, HMR melhor):**

```bash
cd agenda-facil-frontend
pnpm install            # só na primeira vez
pnpm dev
```

App em `http://localhost:5173`. Para apontar para outro backend:

```bash
VITE_API_URL=http://localhost:3000 pnpm dev
```

**Opção B — via Docker (mesma rede do backend):**

```bash
docker compose up -d --build frontend
```

### 3.4 Mobile (depois que o Android SDK estiver pronto)

```bash
cd agenda-facil-mobile
flutter pub get
flutter emulators --launch <ID>   # ou abre Android Studio
flutter run
```

Por padrão o app aponta para `http://10.0.2.2:3000` (emulator → host).
Para apontar para outro host:

```bash
flutter run --dart-define=API_URL=http://192.168.0.5:3000
```

---

## 4. Como testar — Backend

### 4.1 Swagger interativo

Abra `http://localhost:3000/api` no navegador. Documenta todos os
endpoints; dá pra disparar requests direto pela UI.

### 4.2 Smoke test via curl

```bash
# Criar usuário
curl -s -X POST http://localhost:3000/usuarios \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Maria Silva","email":"maria@example.com","senha":"senha123"}' | jq

# Login → guarda o token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"maria@example.com","senha":"senha123"}' | jq -r .access_token)
echo "$TOKEN"

# Rota protegida
curl -s http://localhost:3000/auth/me -H "Authorization: Bearer $TOKEN" | jq

# Listar agendamentos (vazio por enquanto)
curl -s http://localhost:3000/agendamentos -H "Authorization: Bearer $TOKEN" | jq
```

### 4.3 Erros esperados

| Caso | Status | Mensagem |
|---|---|---|
| E-mail já cadastrado | 409 | "E-mail já cadastrado" |
| Senha curta no cadastro | 400 | `senha must be longer than or equal to 6 characters` |
| Login senha errada | 401 | "Credenciais inválidas" |
| Rota protegida sem token | 401 | "Token ausente ou inválido" |

---

## 5. Como testar — Frontend web

### 5.1 Rotas disponíveis

| URL | O quê |
|---|---|
| `/` | Landing (redireciona pra `/onboarding` se primeira visita) |
| `/onboarding` | 3 slides + dots + setas + "Pular" |
| `/_design` | Página de validação visual: paleta, tipografia, primitivos, dialog e toast |
| `/?signup=1` | Landing já com **RegisterDialog** aberto |
| `/?signin=1` | Landing já com **LoginDialog** aberto |

### 5.2 Cenários de teste manual

#### Cenário 1 — Primeira visita (onboarding completo)

1. Limpe o `localStorage` do site (DevTools → Application → Local Storage → "Clear").
2. Acesse `http://localhost:5173/`. Deve **redirecionar** para `/onboarding`.
3. Clique nos dots para pular entre slides; clique nas setas; veja a animação dos dots.
4. No último slide, clique **"Começar"**.
5. Deve ir para `/?signup=1` com o **RegisterDialog aberto**.
6. Preencha e cadastre — toast verde no canto superior direito.
7. Header passa a mostrar o avatar + e-mail + botão "Sair".

#### Cenário 2 — Pular onboarding

1. `localStorage` limpo → `/` → vê onboarding → clica **"Pular"**.
2. Vai pra `/` (landing) sem dialog aberto.
3. Próxima visita a `/` **não mostra** onboarding (flag `agenda-facil:onboarding-seen` em `localStorage`).

#### Cenário 3 — Validação do formulário de cadastro

Abra `/?signup=1`. Teste:

| Input | Valor | Resultado esperado |
|---|---|---|
| Nome | vazio | "Informe seu nome." |
| Nome | "A" | "O nome precisa ter ao menos 2 caracteres." |
| E-mail | "abc" | "Informe um e-mail válido." |
| Senha | "123" | "A senha precisa ter ao menos 6 caracteres." |
| Senha | digitando | medidor de força colorido (vermelho → amarelo → verde) |
| Dicas | painel à direita | sempre visível em telas ≥ md |

#### Cenário 4 — Login com erro

1. `/?signin=1` → preencha email cadastrado, senha errada.
2. Submit → toast vermelho top-right: "Não foi possível entrar." + "Verifique seu e-mail e senha."

#### Cenário 5 — Cadastro com e-mail duplicado

1. Cadastre `joao@x.com`.
2. Tente cadastrar de novo com o mesmo email.
3. Toast vermelho: "Este e-mail já está em uso." (mapeia 409 do backend).

#### Cenário 6 — Recuperar senha

1. Login dialog → "Esqueci minha senha".
2. Email válido → toast verde "Se este e-mail estiver cadastrado, enviaremos as instruções em instantes."
3. (É um stub — backend ainda não tem endpoint real.)

#### Cenário 7 — Persistência de sessão

1. Faça login.
2. Recarregue a página (F5).
3. Continua logado (token salvo em `localStorage["agenda-facil:token"]`,
   `useAuth` chama `GET /auth/me` no mount para revalidar).

#### Cenário 8 — Logout

1. Logado → clica "Sair" no canto direito.
2. Toast cinza "Você saiu da sua conta."
3. Header volta a mostrar "Entrar" + "Criar conta".

### 5.3 Página `/_design` (sanity do design system)

Acesse `http://localhost:5173/_design`. Você vê:

- **Superfícies** — cards com canvas, surface-soft, surface-card, surface-strong, surface-dark
- **Texto** — swatches dos tons de texto (ink, body, muted, muted-soft)
- **Acentos & semântico** — brand-accent, badge pastels, success/warning/error
- **Tipografia** — escala display-xl → caption
- **Buttons** — primary, secondary, ghost, destructive, disabled, sm, lg
- **Formulário** — Input com validação de e-mail ao vivo
- **Dialog & Toast** — botões "Abrir dialog", "Toast sucesso/erro/info"

Tudo o que aparece aqui é o que está disponível como primitivo em
`@/components/ui` para uso nas telas reais.

### 5.4 Comandos úteis

```bash
cd agenda-facil-frontend

pnpm dev          # dev server com HMR
pnpm build        # tsc + vite build (CI-grade check)
pnpm lint         # eslint
pnpm format       # prettier --write
```

---

## 6. Como testar — Mobile (Flutter)

> Tudo abaixo precisa do Android SDK instalado e `flutter doctor` verde.

### 6.1 Compilação estática (não precisa SDK Android)

```bash
cd agenda-facil-mobile
flutter analyze    # static analysis
flutter test       # smoke widget test
```

Ambos devem rodar sem erro.

### 6.2 Fluxo no emulador

1. Suba o backend: `docker compose up -d postgres backend` (na raiz)
2. Lance o emulador Android: `flutter emulators --launch <id>` ou via
   Android Studio (AVD Manager)
3. `flutter run` dentro de `agenda-facil-mobile/`

### 6.3 Cenários de teste no mobile

Idênticos aos da web, com adaptação mobile:

| Tela | Como chegar | O que checar |
|---|---|---|
| Onboarding | Primeira execução / token ausente | 3 slides, swipe lateral, dots animados, "Pular", "Começar" |
| Login | "Pular" / "Já tem uma conta? Entrar" | Validação, link recuperar, link cadastrar, toast erro 401 |
| Cadastro | "Começar" no onboarding ou "Criar conta" no login | Medidor de força, painel de dicas, validação por campo |
| Recover | "Esqueci minha senha" no login | Stub de sucesso |
| Home | Após login bem-sucedido | Saudação com e-mail + botão "Sair" no AppBar |

### 6.4 Toasts no topo

A web usa toast top-right (sonner). O mobile usa um helper próprio
(`core/widgets/top_toast.dart`) que injeta um `OverlayEntry` no topo
— alinhado com a decisão da web. Aparecem após login/cadastro/erros.

### 6.5 Token

Guardado em `flutter_secure_storage` (no Android usa EncryptedSharedPreferences).
Persiste entre cold starts. Sair limpa.

### 6.6 Trocar URL do backend

```bash
flutter run --dart-define=API_URL=http://192.168.0.5:3000
```

Útil quando você quer rodar em aparelho físico apontando para o
backend local da rede.

---

## 7. O que **não** está pronto

Para evitar surpresa na apresentação:

- ❌ Backend não tem endpoint de recuperação de senha → UI é stub
- ❌ Mobile: telas de agendamentos completas (lista, criar, detalhe) —
  ficaram para fases futuras
- ❌ Mobile: bottom nav, FAB, calendar widget — desenhados no prompt
  do Stitch mas não implementados em Flutter ainda
- ❌ Dark mode em ambas as plataformas
- ❌ Internacionalização real (intl) — strings em pt-BR direto no código
- ❌ Testes automatizados de integração — só smoke tests

---

## 8. Troubleshooting

### 8.1 Backend

**`docker compose up backend` falha com `dist/main` não encontrado:**

Bug recorrente já resolvido. Caso volte:

```bash
cd agenda-facil-backend
rm -f tsconfig.build.tsbuildinfo
rm -rf dist
docker compose build backend --no-cache
```

**Postgres já está rodando em outra porta:**

```bash
docker ps --format '{{.Names}} {{.Ports}}'
docker stop <nome-do-container>
```

### 8.2 Frontend

**HMR não recarrega no Docker:**

Já configuramos `usePolling: true` no `vite.config.ts` e bind mount no
compose. Se ainda assim falhar, rode local (`pnpm dev`).

**`pnpm dev` reclama de porta ocupada:**

```bash
lsof -ti:5173 | xargs -r kill -9
```

**Token rejeitado / loop de "Sair":**

Token expirou ou JWT_SECRET mudou. Limpe:

```js
// no DevTools console
localStorage.removeItem('agenda-facil:token')
```

### 8.3 Mobile

**`flutter doctor` vermelho em Android toolchain:**

Instale Android Studio (mais simples) ou os Command Line Tools, e:

```bash
flutter doctor --android-licenses    # aceita tudo
```

**Emulator não enxerga o backend:**

Verifique que está usando `http://10.0.2.2:3000` e que o `network_security_config.xml` permite cleartext para `10.0.2.2`. Para aparelho físico, use o IP da máquina na rede local + `--dart-define=API_URL=`.

---

## 9. Comandos one-liner para a apresentação

Roteiro mínimo para demo ao vivo:

```bash
# 1. Subir backend + db
docker compose up -d postgres backend
sleep 5
curl -s http://localhost:3000/api -o /dev/null -w "Swagger: %{http_code}\n"

# 2. Subir frontend local (HMR rápido pra demo)
cd agenda-facil-frontend && pnpm dev &

# 3. Abrir 4 abas
xdg-open http://localhost:3000/api &        # Swagger
xdg-open http://localhost:5173/             # Onboarding
xdg-open http://localhost:5173/_design &    # Design system
```

Depois:

1. Mostra Swagger (UC01 e UC02)
2. Mostra `/onboarding` rolando os slides
3. Clica "Começar" → cadastra um usuário ao vivo
4. Mostra que ficou logado → recarrega → continua logado
5. Mostra "Sair" → volta pra `/` deslogado
6. Abre `/_design` pra explicar o sistema de tokens

Tudo isso em ~5 minutos.

---

## 10. Arquivos-chave para o relatório / banca

| Pergunta provável | Aponte para |
|---|---|
| "Por que essa stack?" | `docs/plano/INDEX.md` + `docs/plano/fase-1-frontend-skeleton.md` |
| "Como vocês ancoraram o design?" | `agenda-facil-frontend/DESIGN.md` + `docs/plano/fase-2-design-cal.md` |
| "Onde vive a autenticação?" | `agenda-facil-frontend/src/auth/AuthContext.tsx` (web) e `agenda-facil-mobile/lib/features/auth/application/auth_state.dart` (mobile) |
| "Como o frontend fala com o backend?" | `agenda-facil-frontend/src/api/client.ts` + `agenda-facil-mobile/lib/core/api/api_client.dart` |
| "O que vai pro mobile no Stitch?" | `docs/stitch-prompt.md` (copy/paste a partir do `---`) |
| "Como o app decide para onde mandar o usuário?" | `agenda-facil-frontend/src/components/OnboardingGate.tsx` + `agenda-facil-mobile/lib/core/router/app_router.dart` |
