# Fase 4 — Onboarding (web)

**Origem:** mensagem do prof. (23/06, 07:52) — "Crie uma tela de onboarding
e outra de login, com criação de usuário, autenticação e recuperar senha."

## Objetivo

Criar fluxo de onboarding (3 slides) que leva o usuário ao cadastro.

## Passos

1. Rota `/onboarding` (react-router-dom):
   - Slide 1: "Agende serviços de beleza em segundos"
   - Slide 2: "Confirme com poucos cliques"
   - Slide 3: "Receba lembretes automaticamente"
2. Dots + setas de navegação
3. CTA final "Começar" → abre `<RegisterDialog />` (Fase 3)
4. Link "Pular" no canto superior direito (vai pra landing `/`)
5. Persistir `localStorage.onboardingSeen = true` ao concluir/pular
6. Redirect: se logado OU `onboardingSeen`, `/onboarding` vira `/`

## Critério de aceitação

- [x] 3 slides navegáveis (dots + setas + clique nos dots)
- [x] "Começar" navega para `/?signup=1` → AuthMenu abre RegisterDialog
- [x] "Pular" e "Começar" gravam `localStorage["agenda-facil:onboarding-seen"]`
- [x] `<OnboardingGate />` redireciona `/` → `/onboarding` se nunca visto
      e usuário não autenticado (sem loop, porque `markOnboardingSeen()` é
      chamada antes do `navigate()`)

## Notas

- Manter simples — sem animações complexas, só fade.
- Cal.com não tem onboarding consumer — inspirar em Stripe ou Linear.
