# Fase 7 — Mobile: onboarding + auth

**Origem:** mensagem do prof. (23/06, 07:52) — em conjunção com a Fase 6.

## Objetivo

Aplicar o design system gerado no Stitch (Fase 5) ao Flutter (Fase 6) e
implementar onboarding + login + cadastro + recuperar senha integrados
ao backend.

## Passos

1. Importar tokens do Stitch (cores, tipografia) pra
   `lib/core/theme/app_theme.dart`
2. Criar telas:
   - `OnboardingScreen` (3 slides com PageView)
   - `LoginScreen` (e-mail, senha, link recuperar, link cadastrar)
   - `RegisterScreen` (form com role `user` implícito)
   - `RecoverPasswordScreen` (e-mail + mensagem "em breve")
3. Rotas com `go_router`:
   - `/` → checa token; se logado vai pra `/home`, senão `/onboarding`
   - `/onboarding`, `/login`, `/register`, `/recover`, `/home`
4. Service `AuthService`:
   - `login(email, senha)` → Dio POST `/auth/login`
   - Salva token em `flutter_secure_storage`
   - `register(...)`, `logout()`
5. Interceptor Dio pra anexar `Authorization: Bearer <token>`
6. Mensagens em pt-BR (`intl` ou map estático)

## Critério de aceitação

- [x] Telas reais implementadas (Onboarding PageView 3 slides,
      Login, Register com medidor de força e dicas, Recover stub)
- [x] AuthController (ChangeNotifier) + AuthState selado
      Initial/Unauthenticated/Authenticated
- [x] Dio com Bearer interceptor + secure_storage para token
- [x] Router com refreshListenable + redirect:
      `/` → splash → redireciona baseado no estado
- [x] HomeScreen mostra email + botão Sair
- [x] Toast no topo (`showTopToast` via Overlay)
- [x] `flutter analyze` limpo, `flutter test` passa
- [ ] Validar ao vivo no emulator Android (precisa SDK + emulator
      + backend rodando em `localhost:3000`)

## Notas

- Emulator Android acessa o host via `10.0.2.2` (não `localhost`).
- Configurar `network_security_config.xml` pra permitir HTTP em dev.
- Para produção mudar pra HTTPS.
