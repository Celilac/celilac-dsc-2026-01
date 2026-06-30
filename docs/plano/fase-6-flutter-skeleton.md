# Fase 6 — Skeleton Flutter Android

**Origem:** mensagem do prof. (23/06, 07:57) — "Usando o mcp server context7,
crie no mesmo nível do frontend e do backend, um projeto flutter, para
android apenas. Use a organização br.com.celilac."

## Objetivo

Criar `agenda-facil-mobile/` com Flutter, Android-only, pronto pra rodar
e integrado ao backend.

## Passos

1. Consultar context7 (`mcp__plugin_context7_context7__query-docs`):
   - Setup atual Flutter 3.x (`flutter create` flags)
   - Riverpod 2 ou Bloc (pra state management)
   - Dio (cliente HTTP)
   - go_router (navegação)
2. Rodar `flutter create --org br.com.celilac --platforms=android agenda-facil-mobile`
3. Estrutura feature-first:
   ```
   lib/
   ├── main.dart
   ├── core/
   │   ├── api/        (Dio + interceptor JWT)
   │   ├── theme/      (cores, tipografia, espaços)
   │   └── router/     (go_router)
   └── features/
       ├── auth/       (login, register, recover)
       ├── agendamentos/ (lista, criar, detalhe)
       └── perfil/
   ```
4. Adicionar deps no `pubspec.yaml`:
   - `flutter_riverpod` ou `flutter_bloc`
   - `dio`
   - `go_router`
   - `flutter_secure_storage` (token JWT)
   - `intl` (pt-BR)
5. `flutter pub get` + `flutter run` (no emulador Android)
6. NÃO adicionar ao docker-compose (Flutter roda local com emulator)

## Critério de aceitação

- [x] Flutter 3.44.3 instalado (`flutter --version` ✓)
- [ ] `flutter doctor` 100% verde — **falta Android SDK + licenças**
      (instalar Android Studio ou só cmdline-tools antes do `flutter run`)
- [x] `flutter analyze` sem issues, `flutter test` passa
- [x] `--org br.com.celilac` aplicado (namespace + applicationId =
      `br.com.celilac.agenda_facil_mobile`)
- [x] Apenas `android/` na raiz (sem `ios/`, `web/`, etc)
- [x] AndroidManifest com `label="AgendaFácil"`, permissão INTERNET,
      network_security_config permitindo HTTP só para 10.0.2.2 /
      localhost (dev)
- [ ] App abre no emulator Android — validar manualmente após
      instalar Android SDK

## Notas

- iOS, web, macOS, linux, windows desabilitados pelo `--platforms=android`.
- Se aparecer pasta `ios/` ou outras, deletar manualmente.
- Usar `intl` ao invés de `easy_localization` (menos deps).
