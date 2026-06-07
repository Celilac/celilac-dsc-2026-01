# Workflow: Detalhar Issue Específica

**Objetivo:**
Este workflow é acionado quando o usuário deseja visualizar os detalhes, o escopo e os critérios de aceite de uma issue específica do repositório, informando apenas o seu número.

**Instruções para a IA:**
Sempre que o usuário informar um número de issue e pedir para detalhá-la (ou pedir para rodar este workflow passando o número), siga os passos abaixo:

1. **Buscar Dados da Issue:** Execute o comando `gh issue view <NUMERO_DA_ISSUE>` na raiz do projeto.
2. **Interpretar e Formatar:** Leia o conteúdo retornado e formate a saída em Markdown amigável contendo:
   - Título da Issue com o seu respectivo número.
   - Caso de Uso relacionado (se houver).
   - Descrição e Escopo.
   - Critérios de Aceite.
   - Qualquer outra limitação ("Fora de escopo").
3. **Cruzamento de Contexto (Opcional, porém recomendado):**
   - Se aplicável, faça uma rápida avaliação se algum item dos critérios de aceite já foi acidentalmente ou propositalmente resolvido no estado atual da base de código e informe ao usuário.
4. **Próximo Passo:** Pergunte ao usuário se ele gostaria de iniciar uma sessão de desenvolvimento (TDD ou não) para resolver aquela issue, ou se deseja tirar dúvidas sobre os requisitos.
