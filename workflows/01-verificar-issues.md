# Workflow: Consultar e Planejar Issues

**Objetivo:** 
Este workflow serve para verificar as issues em aberto no repositório utilizando o GitHub CLI (`gh`), ler os detalhes de uma issue específica e propor os próximos passos de implementação.

**Instruções para a IA:**
Sempre que o usuário solicitar a execução deste workflow, siga rigorosamente os passos abaixo:

1. **Listar Issues:** Execute o comando `gh issue list --state open` na raiz do projeto.
2. **Selecionar Próxima Tarefa:** Identifique a próxima issue lógica a ser atacada (priorize a continuidade numérica ou do caso de uso atual).
3. **Buscar Detalhes:** Execute o comando `gh issue view <NUMERO_DA_ISSUE>` para extrair a descrição completa e os critérios de aceite.
4. **Apresentar ao Usuário:**
   - Faça um breve resumo de como está a fila de issues.
   - Mostre o Título, o Escopo e os Critérios de Aceite da issue principal sugerida.
   - Pergunte ao usuário se ele aprova iniciar o desenvolvimento seguindo as regras de TDD (Teste primeiro, depois código).
