# Prompt: Geração de Documentação Técnica e Padrões de Projeto

Este prompt deve ser utilizado para instruir o seu assistente de IA (como o Gemini, Claude, Cursor, etc.) a analisar o projeto na fase inicial e gerar uma documentação técnica robusta. Essa documentação estabelecerá as regras de desenvolvimento que guiarão o restante do projeto, tanto para você quanto para a própria IA em interações futuras.

---

## 📝 O Prompt

Copie e cole o texto abaixo para o seu assistente de IA:

> "Investigue todo o diretório do nosso projeto atual e elabore uma documentação técnica detalhada que servirá de guia arquitetural tanto para a equipe de desenvolvedores quanto para futuros agentes de IA que irão gerar código para esta base. 
> 
> A documentação deve ser salva na pasta `docs/` com o nome `technical-documentation.md` (criando a pasta se não existir) e precisa conter obrigatoriamente:
> 
> 1. **Visão Geral e Stack Tecnológico**: Um resumo das ferramentas que já estão configuradas no projeto (ex: NestJS, TypeScript, TypeORM, Jest, ESLint, etc).
> 2. **Arquitetura e Estrutura**: Uma explicação sobre como os arquivos estão separados em módulos de domínio e o uso do padrão de repositórios (interfaces vs implementações).
> 3. **Modelagem de Domínio e Regras de Negócio**: Detalhamento das entidades atuais (ex: Order e Payment) e explicação das regras de negócio atreladas ao caso de uso principal já implementado (ex: validações necessárias para Confirmar um pedido).
> 4. **Padrões e Guidelines (CRÍTICO)**: 
>    - Estabeleça regras claras sobre injeção de dependência via tokens e o fluxo de lançamento de exceções de domínio customizadas.
>    - Crie uma seção de destaque absoluta obrigando o uso do **TDD (Test-Driven Development)**. Deixe explicitamente registrado que o ciclo **Red-Green-Refactor** é mandatório e que NENHUMA funcionalidade ou refatoração futura deve ser iniciada sem que os testes unitários (`*.spec.ts`) sejam escritos primeiro, falhando, e depois aprovados pela lógica de produção.
> 
> Após finalizar a criação deste novo documento, avalie se existem arquivos de documentação iniciais que se tornaram redundantes (como por exemplo um arquivo `docs/visao-geral.md`). Se a informação deles já estiver contemplada no novo documento que você gerou, exclua o arquivo antigo para mantermos o repositório limpo."

---

## 💡 Por que este prompt é efetivo?

1. **Contexto Autônomo**: Ele instrui a IA a fazer o trabalho pesado de ler a base de código e inferir a arquitetura ao invés de você ter que explicar tudo.
2. **Design para Agentes (Agent-First)**: Ao pedir que a documentação sirva "para futuros agentes de IA", você obriga a IA a escrever regras estruturadas (Guidelines). Em conversas futuras, a IA lerá esse arquivo e saberá exatamente as regras que ela mesma deve obedecer para gerar código no seu projeto.
3. **Trava de Qualidade (TDD)**: O prompt eleva o TDD a uma regra inegociável do projeto. Nas próximas vezes que você pedir uma funcionalidade nova, a IA, lendo essa documentação, começará naturalmente pelos arquivos de teste.
4. **Higiene do Repositório**: Ensina o conceito de "não acumular débito de documentação", forçando a IA a sugerir a deleção de arquivos que ficaram obsoletos.
