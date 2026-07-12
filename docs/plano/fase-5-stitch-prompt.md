# Fase 5 — Prompt do Stitch (Google) para design system mobile

**Origem:** mensagem do prof. (23/06, 07:47) — "Investigue o workspace e
gere um prompt para eu usar no stitch da google, para que ele gere um
design system para uma aplicação mobile tendo como foco, o domínio de
nosso sistema."

## Objetivo

Gerar UM prompt único, ricamente contextualizado, pra colar no Stitch e
obter um design system mobile coerente com o domínio AgendaFácil.

## Passos

1. Investigar o workspace:
   - Casos de uso implementados (UC01 a UC11)
   - Entidades: `Usuario`, `Agendamento`, `Profissional`, `Servico`
   - Papéis: `CLIENTE`, `PROFISSIONAL`, `ADMIN`
   - Fluxos principais: criar/listar/cancelar/concluir agendamento, auth
2. Estruturar o prompt cobrindo:
   - **Contexto de domínio** (1 parágrafo): beleza/estética/barbearia
   - **Público-alvo** (clientes finais + profissionais)
   - **Telas-alvo** (onboarding, login, home, criar agendamento,
     detalhe de agendamento, perfil, configurações)
   - **Tom visual** (warm + profissional, não infantil, não corporativo)
   - **Paleta sugerida** (alinhada ao web — Cal.com base + cor signature
     própria do AgendaFácil)
   - **Tipografia** (Inter ou similar geometric sans)
   - **Componentes desejados** (button, input, card-agendamento, chip,
     bottom nav, FAB)
   - **Acessibilidade** (contraste WCAG AA, tap target 44px)
3. Salvar em `docs/stitch-prompt.md`

## Critério de aceitação

- [x] `docs/stitch-prompt.md` existe no workspace root
- [x] Pronto pra copy/paste no Stitch sem edição (do `---` em diante)

## Notas

- O Stitch (stitch.withgoogle.com) aceita prompts longos. Pode ser bem
  detalhado — o output é melhor quanto mais específico.
