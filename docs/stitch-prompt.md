# Prompt para o Stitch (Google) — Design system mobile do AgendaFácil

> **Como usar:** copie todo o conteúdo abaixo da linha `---` e cole em
> `stitch.withgoogle.com` em um novo projeto Android. Edite só se quiser
> ajustar tela específica.

---

# AgendaFácil — Mobile design system (Android)

## Contexto de domínio

Crie um design system completo para um app mobile Android chamado
**AgendaFácil**, plataforma de agendamento de serviços pessoais para
**salões de beleza, barbearias e clínicas estéticas**. O app conecta
**clientes finais** (que reservam horários) e **profissionais
autônomos** (que oferecem serviços e administram a própria agenda).

O tom do produto é **moderno, confiável e acolhedor** — nem corporativo
demais, nem infantil. A vibe lembra Cal.com (agendamento limpo) com
calor de marca de bem-estar (beleza, autocuidado). Evite estética
"genérica de IA": prefira hierarquia clara, generoso espaço em branco,
tipografia precisa e poucas cores de destaque.

## Público-alvo

- **Cliente (CLIENTE):** pessoa de 18 a 55 anos, urbana, que valoriza
  praticidade e quer marcar serviços sem trocar mensagens. Foco em
  velocidade, transparência de preços/horários e lembretes.
- **Profissional (PROFISSIONAL):** dono(a) de salão, barbeiro(a),
  esteticista autônomo(a). Precisa ver a agenda do dia, confirmar/
  concluir atendimentos e bloquear horários rapidamente.
- Idioma: **pt-BR em toda a UI**. Formatos: datas no padrão brasileiro
  (`dd/MM`, "Hoje", "Amanhã", "Quinta, 25 jun"), moeda em real (R$).

## Telas-alvo (gere todas)

### Fluxo público (sem login)

1. **Splash** — wordmark "AgendaFácil" centralizado, fundo `surface-soft`,
   spinner sutil.
2. **Onboarding** — 3 slides com ilustração leve + título + texto.
   Slides:
   1. "Agende em segundos" — encontre profissionais e marque sem
      complicação.
   2. "Confirme com poucos cliques" — disponibilidade em tempo real.
   3. "Receba lembretes" — não esqueça nenhum horário.
   Indicador de progresso (dots/pill expansível no ativo), botão
   "Pular" no canto superior direito, CTA primário "Começar" no
   último slide.
3. **Login** — campos e-mail + senha, botão "Entrar" primário, link
   "Esqueci minha senha", link "Criar conta" abaixo.
4. **Cadastro** — campos nome, e-mail, senha (com medidor de força),
   telefone opcional. Botão "Criar minha conta". Bloco de "dicas de
   senha forte" expandível (em mobile, não em coluna lateral — usar
   acordeão).
5. **Recuperar senha** — só campo e-mail + CTA "Enviar instruções" +
   link "Voltar para o login".

### Fluxo do CLIENTE (logado)

6. **Home (cliente)** — saudação personalizada ("Olá, Maria"),
   bloco "Próximo agendamento" em destaque (card com data, hora,
   profissional, serviço, status pill), grade de categorias (Cabelo,
   Barba, Unhas, Estética), seção "Profissionais perto de você".
   **Bottom nav** com 4 ícones: Início, Agenda, Buscar, Perfil.
7. **Buscar / Catálogo** — barra de busca no topo, chips de filtro
   horizontais (Categoria, Distância, Avaliação), lista vertical de
   cards "Profissional" com foto circular, nome, serviços principais,
   nota com estrelas, preço a partir de.
8. **Perfil do profissional (público)** — header com foto grande,
   nome, bio curta, nota, lista de serviços (nome, duração, preço),
   horários disponíveis nos próximos 7 dias, CTA primário fixo no
   rodapé "Agendar".
9. **Seleção de serviço + horário** — duas etapas em um fluxo:
   a) lista de serviços com radio cards (nome, duração, preço);
   b) calendário compacto (mês com dias) + grid de slots de horário
      (10:00, 10:30...) — slot indisponível riscado.
   CTA "Confirmar agendamento" no rodapé com sumário (data, hora,
   preço).
10. **Confirmação de agendamento** — tela cheia com checkmark verde
    animado (estático no design), resumo do agendamento, CTAs
    "Adicionar à agenda do celular" e "Voltar ao início".
11. **Minha agenda (cliente)** — tabs no topo: "Próximos", "Histórico",
    "Cancelados". Lista vertical de cards com data + hora + serviço +
    profissional + status pill. Tap no card abre detalhe.
12. **Detalhe do agendamento** — header com data/hora grande, card
    com profissional + serviço + valor, seção "Observações" (texto),
    actions: "Cancelar agendamento" (destrutivo, secundário),
    "Adicionar lembrete", "Ver perfil do profissional".
13. **Perfil (cliente)** — avatar, nome, e-mail, telefone, lista de
    seções: "Dados pessoais", "Métodos de pagamento" (placeholder),
    "Notificações", "Sair".

### Fluxo do PROFISSIONAL (logado)

14. **Home (profissional)** — saudação, card "Hoje" com contagem de
    atendimentos do dia + faturamento previsto, próxima sessão em
    destaque, timeline vertical da agenda do dia com slots e
    status pills.
15. **Agenda completa** — calendário tipo Cal.com (visão semana ou
    dia, alternável via tabs). Eventos como cards horizontais
    coloridos por status (CONFIRMADO = ink, CONCLUIDO = success,
    CANCELADO = muted com strikethrough).
16. **Detalhe de atendimento (profissional)** — semelhante ao detalhe
    do cliente, mas com actions "Concluir atendimento" (primário) e
    "Cancelar" (destrutivo); campo "Observações" editável.
17. **Bloquear horário** — modal/sheet inferior com data + hora
    início + hora fim + motivo (opcional), CTA "Bloquear".
18. **Meus serviços** — lista de serviços oferecidos com nome,
    duração, preço, ações editar/remover, FAB "+" para criar novo.
19. **Perfil (profissional)** — análogo ao do cliente + seções extras:
    "Meus horários" (jornada de trabalho), "Avaliações recebidas".

### Estados utilitários

20. **Empty states** para cada lista (nenhum agendamento, nenhuma
    busca, etc.) — ilustração leve + título + CTA.
21. **Tela de erro genérica** (offline, 500) — ilustração + título
    "Algo deu errado" + CTA "Tentar de novo".

## Identidade visual

### Paleta — alinhada ao Cal.com (web), com signature do AgendaFácil

**Neutros (predominantes):**
- `canvas`: #FFFFFF (fundo principal)
- `surface-soft`: #F8F9FA (fundos secundários, bottom nav)
- `surface-card`: #F5F5F5 (cards passivos, chips)
- `surface-strong`: #E5E7EB (divisórias, dots inativos)
- `hairline`: #E5E7EB (borda 1px)

**Texto:**
- `ink`: #111111 (títulos, CTA primário)
- `body`: #374151 (texto corrido)
- `muted`: #6B7280 (legendas, hints)

**Action / Brand:**
- `primary`: #111111 (igual ao ink — CTA preto sólido, no estilo Cal.com)
- `primary-active`: #242424

**Cor signature do AgendaFácil (acento sutil — NÃO usar em CTA):**
- `signature`: #6D28D9 (violeta profundo) — usar **só** em destaque
  pequeno (badge "Recomendado", indicador de "Próximo agendamento",
  ícone do app). É o único toque cromático que diferencia o AgendaFácil
  do Cal.com puro. Mantém a sensação de beleza/autocuidado sem virar
  cosmético-clichê. Alternativa se preferir: `#D946EF` (magenta
  vibrante) — mais consumer-feminino; ou `#E11D48` (rose) — mais
  beleza/estética. **Escolha uma e use com parcimônia.**

**Semântico:**
- `success`: #10B981 (status CONCLUIDO)
- `warning`: #F59E0B
- `error`: #EF4444 (cancelar, destrutivo)
- `info`: #3B82F6

**Pastéis (avatares fallback / chips de categoria):**
- `pastel-orange`: #FB923C, `pastel-pink`: #EC4899,
  `pastel-violet`: #8B5CF6, `pastel-emerald`: #34D399

### Tipografia

- **Família única: Inter** (variable, todos os pesos). Não use Roboto.
- Hierarquia:
  - Display XL (32sp / weight 600 / tracking -0.5) — títulos hero
  - Display L (28sp / 600 / -0.4) — títulos de tela
  - Title L (22sp / 600 / -0.3) — seções
  - Title M (18sp / 600 / 0) — cards
  - Title S (16sp / 600 / 0)
  - Body M (16sp / 400 / 0) — corpo
  - Body S (14sp / 400 / 0)
  - Caption (13sp / 500 / 0) — labels, badges
  - Button (14sp / 600 / 0)

### Espaçamento (base 4dp)

`4 · 8 · 12 · 16 · 24 · 32 · 48`. Padding interno padrão de card: 16dp.
Gutter entre cards: 12dp. Margem lateral das telas: 20dp.

### Border radius

- 8dp — botões, inputs, chips pequenos
- 12dp — cards de conteúdo
- 16dp — sheets inferiores, modais, cards de destaque
- pill (full) — chips de status, badges, avatares

### Elevação

- Sem sombras pesadas. Use borda `hairline` 1px ou diferença sutil de
  surface. Sombras só em FAB (`0 4dp 12dp rgba(0,0,0,0.12)`) e em
  bottom-sheet modal.

## Componentes desejados (gere variantes)

1. **Button**
   - Primary (bg `primary`, text `canvas`, height 48dp, radius 8dp)
   - Secondary (bg `canvas`, 1px `hairline`, text `ink`)
   - Ghost (transparente, text `ink`)
   - Destructive (bg `error`, text `canvas`)
   - Sizes: `md` (48dp), `sm` (40dp)
   - States: default, pressed, disabled
2. **FAB** — circular 56dp, bg `primary`, ícone branco. Sombra leve.
3. **TextField** — outlined, label flutuante, height 56dp (com label) /
   48dp (sem). Border 1px `hairline` → `ink` no foco; `error` em erro.
4. **Chip** — pill, padding 4×12, 3 variantes: filter (toggle),
   status (success/error/muted), category (pastel).
5. **Card** — radius 12dp, padding 16dp, três variants:
   - `soft` (bg `surface-card`, sem borda)
   - `outline` (bg `canvas`, borda `hairline`)
   - `elevated` (bg `canvas`, sombra muito sutil)
6. **List item** — 56-72dp altura, leading (avatar/ícone) + 2 linhas
   de texto + trailing (chevron/badge).
7. **Avatar** — circular, sizes 32 / 40 / 56. Fallback com iniciais
   sobre `pastel-*`.
8. **AppBar (top)** — 56dp, fundo `canvas`, título centralizado ou
   alinhado à esquerda, leading icon (voltar/menu) + trailing actions.
   Sem elevação por padrão.
9. **Bottom Navigation** — 4 ícones (Home, Agenda, Buscar, Perfil),
   72dp altura (com safe area), ativo em `ink`, inativo em `muted`,
   pill arredondado no item ativo.
10. **Bottom Sheet** — radius 16dp no topo, handle bar 4dp × 32dp,
    padding 24dp.
11. **Dialog** — radius 16dp, bg `canvas`, padding 24dp, máx 90% da
    largura.
12. **Toast / Snackbar** — `position=top`, bg `ink`, text `canvas`,
    radius 8dp, padding 12×16, ícone à esquerda. **NÃO usar bottom**
    (alinhado à decisão da web).
13. **Calendar (date picker)** — grid 7 colunas, dia selecionado em
    `primary`, hoje com underline, indisponíveis em `muted` + risco.
14. **Time slot grid** — chips 3 colunas × N linhas, slot selecionado
    em `primary`, indisponível em `muted-soft` + strikethrough.
15. **Status pill** — pequeno chip arredondado com dot colorido +
    label. 3 estados: `CONFIRMADO` (ink/info), `CONCLUIDO` (success),
    `CANCELADO` (error com strikethrough no contexto adjacente).
16. **Skeleton loader** — bloco com gradient animation pra lista,
    card, avatar.

## Acessibilidade

- Contraste mínimo **WCAG AA**: 4.5:1 para texto normal, 3:1 para
  texto grande. Verifique cada par bg/text.
- **Tap target mínimo 44 × 44dp** em todos os controles interativos.
- Estados de foco visíveis (anel de 2dp em `ink` com offset 2dp).
- Labels semânticos em todos os ícones isolados.
- Suporte a dynamic type (até 130%) sem quebra de layout.
- Modo escuro: **NÃO incluir nesta primeira geração** — só claro.

## Estilo de ilustração

- **Geométrico, flat, two-tone** (`ink` + `signature` ou `pastel-*`).
- Linhas finas 1.5-2dp. Sem gradients fortes, sem sombras coloridas.
- Para empty states e onboarding: ilustrações pequenas (max 160dp),
  centralizadas, com 1 elemento humano abstrato (mão segurando
  celular, calendário, estrelas).
- **NÃO usar:**
  - 3D / glassmorphism / neumorphism
  - Memphis / Y2K / glitch
  - Stock photo de pessoas
  - Cara de "AI assistant" (gradients holográficos, partículas)

## Especificações técnicas Android

- Plataforma: **Android only** (Material 3 como base, mas com tokens
  customizados acima sobrescrevendo as cores do M3)
- Mínimo: Android 8 (API 26)
- Densidade-alvo: xxhdpi
- Resoluções de referência: 412×915 (Pixel 6 lógico)
- Status bar: clara com ícones escuros sobre `canvas`
- Sistema de grid: 4dp baseline
- Animações: 200-300ms ease-out (suaves, não rápidas demais)

## Entregáveis esperados

Para cada tela listada, gere:
- Frame 412 × 915 com layout completo
- Variantes claras de estado (loading, empty, error onde fizer
  sentido)
- Tokens nomeados conforme as seções "Paleta" e "Tipografia"
- Components reutilizáveis (Button, Card, TextField, etc.) como
  master components

Para o sistema:
- Página dedicada "Foundations" (paleta, tipografia, espaçamento,
  border radius, elevação)
- Página dedicada "Components" (todas as variantes lado a lado)
- Páginas por fluxo: "Auth", "Cliente — Home & Catálogo",
  "Cliente — Agendamento", "Cliente — Minha agenda", "Profissional —
  Agenda", "Profissional — Atendimento", "Compartilhado — Perfil &
  Estados"

## O que NÃO fazer

- Não inventar features fora do escopo (chat ao vivo, marketplace
  de produtos, e-commerce — não faz parte do AgendaFácil).
- Não usar nenhuma cor primária que não esteja na paleta acima.
- Não copiar o visual literal do Cal.com — inspire-se no rigor
  tipográfico e na sobriedade, mas adicione calor humano via
  espaçamento, ilustrações e a cor `signature`.
- Não usar emojis como ícones do sistema (apenas em conteúdo do
  usuário, se for o caso).
