# Corporate Orders Backend - Documentação Técnica

Esta documentação fornece uma visão técnica detalhada do projeto **Corporate Orders Backend**, estabelecendo as bases arquiteturais, regras de negócio atuais e diretrizes para a equipe de desenvolvimento e agentes de IA que irão estender o código no futuro.

## 1. Visão Geral do Projeto

O projeto é uma API backend focada no gerenciamento de pedidos corporativos. Atualmente, o projeto está em sua fase inicial (MVP) e implementa a infraestrutura básica e o caso de uso principal **UC07 — Confirmar pedido**.

## 2. Stack Tecnológico

A aplicação foi construída com as seguintes tecnologias e ferramentas:

*   **Linguagem:** TypeScript
*   **Framework principal:** NestJS (v11)
*   **Banco de Dados:** PostgreSQL
*   **ORM:** TypeORM
*   **Testes:** Jest (Unitários e E2E configurados)
*   **Qualidade de Código:** ESLint e Prettier
*   **Gerenciador de Pacotes:** pnpm

## 3. Arquitetura e Estrutura de Diretórios

A aplicação segue uma arquitetura modular baseada em domínios, um padrão recomendado para projetos NestJS para manter baixo acoplamento e alta coesão.

A estrutura do diretório `src` está organizada da seguinte forma:

```text
src/
├── common/             # Exceções, Enums, DTOs compartilhados, utilitários
│   ├── orders/
│   └── payments/
├── modules/            # Módulos de domínio de negócio
│   ├── orders/         # Módulo de Pedidos
│   └── payments/       # Módulo de Pagamentos
├── app.controller.ts   # Entrypoint de rotas base (se houver)
├── app.module.ts       # Módulo raiz, orquestrador de dependências (Config, TypeORM)
└── main.ts             # Arquivo de bootstrap da aplicação
```

Cada módulo de domínio (ex: `orders`) segue uma estrutura interna padronizada:
*   `dto/`: Objetos de Transferência de Dados para entrada e saída das rotas.
*   `entities/`: Modelos de dados mapeados para o banco (TypeORM).
*   `repositories/`: Contratos (Interfaces) e implementações de repositórios, isolando a camada de banco de dados da camada de serviço.
*   `services/`: Contém a lógica de negócios e casos de uso.
*   `*.controller.ts`: Definição dos endpoints REST.
*   `*.module.ts`: Declaração de provedores, controladores e importações do módulo.

## 4. Modelagem de Domínio

O domínio atual é composto por duas entidades principais:

### 4.1. Order (Pedido)
Entidade: `OrderEntity` (Tabela `orders`)
*   `order_id` (UUID): Identificador único.
*   `customer_id` (String): Identificador do cliente.
*   `status` (Enum): Situação do pedido (`PENDING` ou `CONFIRMED`).
*   Timestamps padrão (`created_at`, `updated_at`, `deleted_at`).

### 4.2. Payment (Pagamento)
Entidade: `PaymentEntity` (Tabela `payments`)
*   `payment_id` (UUID): Identificador único.
*   `order_id` (String): Referência ao pedido associado.
*   `status` (Enum): Situação do pagamento (`PENDING`, `APPROVED`, `REJECTED`).
*   `amount` (Numeric): Valor do pagamento.
*   `paid_at` (Timestamp): Data/hora de confirmação do pagamento.
*   Timestamps padrão.

## 5. Regras de Negócio: UC07 — Confirmar Pedido

A lógica principal implementada atualmente encontra-se no `OrdersService.confirmOrder(orderId)`. O fluxo obedece rigorosamente às seguintes regras e validações:

1.  **Existência do Pedido:** Verifica se o pedido informado existe. Se não, lança `OrderNotFoundException`.
2.  **Status do Pedido:** Verifica se o pedido já não está confirmado. Se estiver, lança `OrderAlreadyConfirmedException`.
3.  **Existência do Pagamento:** Busca o pagamento associado ao pedido (`findByOrderId`). Se não houver pagamento registrado, lança `PaymentNotFoundException`.
4.  **Status do Pagamento:** O pagamento **deve** estar com o status `APPROVED`. Caso contrário, lança `PaymentNotApprovedException`.
5.  **Efetivação:** Se todas as regras passarem, o status do pedido é alterado para `CONFIRMED`, o campo `updatedAt` é atualizado e o pedido é salvo no banco de dados.

*Nota: Todas essas regras estão cobertas por testes unitários exaustivos em `orders.service.spec.ts`.*

## 6. Padrões de Implementação (Guidelines para Agentes e Desenvolvedores)

Para garantir a manutenibilidade e consistência do código em implementações futuras, siga as seguintes diretrizes:

### 6.1. Injeção de Dependência e Repositórios
*   **NÃO** injete repositórios do TypeORM diretamente nos serviços (`@InjectRepository`).
*   Utilize o padrão Repository (Interfaces). Injete a interface utilizando tokens (`@Inject(ORDERS_REPOSITORY)`).
*   Isso facilita a criação de mocks para testes unitários, como já demonstrado nos testes existentes.

### 6.2. Tratamento de Erros e Exceções
*   Crie exceções customizadas de domínio na pasta `src/common/<dominio>/exceptions/`.
*   Nomeie as exceções de forma clara e descritiva (ex: `PaymentNotApprovedException`).
*   Os serviços devem lançar essas exceções de domínio, deixando que camadas superiores (Filtros de Exceção do Nest ou Controladores) as tratem e convertam para códigos HTTP adequados.

### 6.3. Testes e TDD (Test-Driven Development)
*   **Adoção do TDD (OBRIGATÓRIO):** Este projeto segue rigorosamente a prática de Desenvolvimento Guiado por Testes (TDD). **Qualquer nova funcionalidade, regra de negócio ou correção de bug deve, obrigatoriamente, iniciar pela escrita de testes.**
*   **Ciclo Red-Green-Refactor:** Agentes de IA e desenvolvedores devem seguir este ciclo estritamente:
    1.  **Red:** Escreva os testes unitários (`*.spec.ts`) para o comportamento esperado antes de criar o código de produção correspondente. Garanta que o teste falhe.
    2.  **Green:** Escreva o código de produção (ex: nos `Services`) apenas o suficiente para que os testes passem.
    3.  **Refactor:** Melhore a qualidade, clareza e estrutura do código mantendo a cobertura verde dos testes.
*   **Mocks:** Utilize o utilitário `jest.Mocked` para criar mocks tipados das interfaces de repositórios, garantindo a execução isolada e rápida das validações.

### 6.4. Configuração e Variáveis de Ambiente
*   Use o `@nestjs/config` (`ConfigModule`) para gerenciar variáveis de ambiente.
*   Nunca acesse `process.env` diretamente dentro de serviços ou controladores.
*   As configurações de banco de dados (`DB_HOST`, `DB_PORT`, etc.) são obrigatórias no ambiente para a correta inicialização da aplicação.

## 7. Próximos Passos Sugeridos

Com base na estrutura atual, os próximos passos naturais de desenvolvimento poderiam incluir:

1.  **Criação de Pedidos:** Implementar o fluxo de inserção de novos pedidos (`POST /orders`).
2.  **Processamento de Pagamento:** Implementar rotas/webhooks para atualizar o status de pagamentos de `PENDING` para `APPROVED` ou `REJECTED`.
3.  **Global Exception Filters:** Mapear as exceções customizadas (`OrderNotFoundException`, etc.) para códigos HTTP semânticos (404, 400, 422) utilizando filtros globais do NestJS.
4.  **Integração Swagger:** Documentar os endpoints da API utilizando `@nestjs/swagger`.
