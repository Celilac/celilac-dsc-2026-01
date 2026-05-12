# Workflow: Commit, Push e Sugestão de PR

**Objetivo:**
Este workflow é acionado quando uma tarefa ou issue foi concluída e o usuário deseja realizar o commit das alterações, enviá-las para uma nova branch (devido a restrições na branch `main`) e obter uma sugestão de título e descrição para a Pull Request.

**Instruções para a IA:**
Sempre que o usuário solicitar o commit e push das alterações realizadas, siga os passos abaixo:

1. **Identificar o Contexto:**
   - Verifique qual a issue atual em que se está trabalhando (consulte o `task.md` ou as últimas interações).
   - Defina um nome de branch sugerido (ex: `feature/uc12-13-docker-backend`) ou use o nome solicitado pelo usuário.

2. **Preparar as Alterações:**
   - Execute `git status` para visualizar os arquivos modificados e não rastreados.
   - Adicione apenas os arquivos pertinentes à tarefa atual (`git add <arquivos>`).

3. **Realizar o Commit:**
   - Crie uma mensagem de commit clara e concisa seguindo o padrão **Conventional Commits** (ex: `feat(products): implementar containerização do backend`).
   - Inclua o número da issue na mensagem se disponível.

4. **Executar o Push:**
   - Crie a nova branch: `git checkout -b <NOME_DA_BRANCH>`.
   - Realize o push para a origin: `git push origin <NOME_DA_BRANCH>`.
   - Informe ao usuário o link para criação da PR fornecido pelo Git.

5. **Gerar Metadados da PR:**
   - Proponha um **Título** para a Pull Request.
   - Proponha uma **Descrição** detalhada contendo:
     - Resumo do que foi implementado.
     - Lista de critérios de aceite atendidos.
     - Verificações realizadas (testes, logs, etc.).
     - Referência às issues relacionadas (ex: `Closes #XX`).

6. **Finalização:**
   - Confirme se o push foi concluído e pergunte se o usuário deseja ajuda com a abertura da PR ou se quer retornar para a branch principal.
