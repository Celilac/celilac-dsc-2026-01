# Prompt Template: Criação de Teste TDD (Fase RED)

Este prompt foi desenhado para ser utilizado por agentes IA (como o GitHub Copilot, Claude, GPT-4, etc.) para garantir a criação rigorosa de testes automatizados seguindo o primeiro estágio do TDD (RED), sem que a IA se adiante implementando a funcionalidade real (GREEN).

Copie o bloco abaixo, substitua as variáveis em colchetes `[ ]` pelo contexto da sua issue e envie para a IA.

---

````markdown
Você atuará como agente de implementação no repositório do projeto [NOME_DO_PROJETO].

## Contexto

Estamos trabalhando no caso de uso:

**[CÓDIGO_E_NOME_DO_CASO_DE_USO]** (Ex: UC12 — Cadastrar produto)

A sub-issue atual é:

**[CÓDIGO_E_NOME_DA_ISSUE]** (Ex: UC12-01 — Criar teste para cadastrar produto com dados válidos)

Esta issue representa EXCLUSIVAMENTE a etapa **TDD RED**.  
Portanto, o objetivo NÃO é implementar a funcionalidade completa ainda.

O objetivo é criar um teste automatizado que represente o comportamento esperado e que FALHE inicialmente.

---

## Dados da Issue

### Título
[TÍTULO_DA_ISSUE]

### Descrição
[DESCRIÇÃO_DETALHADA_DO_QUE_DEVE_SER_TESTADO]

### Cenário
Dado que [CONDIÇÃO_INICIAL], quando [AÇÃO_REALIZADA], então [COMPORTAMENTO_ESPERADO].

### Entrada mínima do teste
```json
{
  "campo1": "valor1",
  "campo2": 123
}
```

### Resultado esperado
```json
{
  "[nomeDaEntidade]Id": "generated-id",
  "campo1": "valor1",
  "campo2": 123,
  "status": "criado"
}
```

---

## Convenções do Projeto (MUITO IMPORTANTE)

1. **Padrão de ID:** Todas as entidades utilizam o formato `[nomeDaEntidade]Id` (ex: `productId`, `orderId`), não utilize `id` genérico.
2. **Framework:** [NOME_DO_FRAMEWORK] (Ex: NestJS com Jest).
3. **Nomenclatura de Arquivos:** Testes de serviços devem terminar em `.service.spec.ts`.
4. [ADICIONE_OUTRA_REGRA_DO_SEU_PROJETO_AQUI]

---

## Critérios de Aceite

O teste deve:
* ser criado antes da implementação real;
* falhar inicialmente ao ser rodado;
* validar que o dado foi manipulado e retornado com os tipos e campos esperados;
* validar a estrutura do objeto de resposta de acordo com o "Resultado esperado";
* não depender diretamente de banco de dados real neste momento;
* focar no comportamento esperado, não em detalhes internos de implementação da classe.

---

## Instruções Técnicas para o Agente

1. Verifique a estrutura atual do projeto antes de criar arquivos.
2. Identifique se já existe módulo, service, controller ou pasta relacionada à entidade.
3. Caso já exista estrutura de testes, siga o padrão existente.
4. Caso ainda não exista, crie o teste no local mais adequado para um projeto [NOME_DO_FRAMEWORK].
5. Priorize um teste unitário focado no comportamento (ex: serviço).
6. O teste deve representar a expectativa de uso futuro da classe.
7. Se a classe/serviço ainda não existir, NÃO implemente ela de forma funcional.
   * Crie apenas um "Stub" (uma casca da classe lançando um erro como `Method not implemented`) para que a injeção não trave o framework de testes.
   * O teste deve falhar por ausência de implementação funcional.
8. Não criar integrações reais de banco de dados ou ORMs (PostgreSQL, Prisma, TypeORM, etc).
9. Não alterar escopo para cenários negativos (caminho triste) a não ser que isso seja o escopo desta issue específica.
10. Não resolver as próximas issues.

---

## Resultado Esperado da Execução

Após criar o teste, execute a suíte de testes do projeto.

O resultado esperado é: **o teste deve falhar inicialmente.**
Aviso de erro de compilação da IDE (por falta de tipagem/interfaces) faz parte da etapa RED e não deve ser corrigido agora.

**Não faça alterações funcionais para o teste passar (GREEN) nesta issue.**

---

## Entrega Esperada

Ao final, apresente:

1. Arquivo(s) criado(s) ou alterado(s).
2. Resumo do teste criado.
3. Resultado da execução dos testes no terminal.
4. Evidência em texto de que o teste falhou inicialmente.
5. Confirmação clara de que nenhuma implementação funcional (GREEN) foi feita.

A entrega deve deixar explícito que esta issue conclui APENAS a etapa **RED** do TDD.
````
