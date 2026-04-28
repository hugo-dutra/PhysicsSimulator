# Issues, Risks And Open Premises

## Riscos da prova core

- A sincronizacao entre animacao, graficos, tabela e teoria pode ficar complexa se o estado nao tiver uma fonte unica.
- Three.js e Plotly.js juntos podem pesar no bundle se forem importados sem cuidado.
- O pendulo pode parecer simples demais se nao incluir vetores, energia e graficos suficientes para provar a proposta.
- Um tema dark mal calibrado pode prejudicar leitura de formulas e tabelas.
- Expandir para fluidos e magnetismo cedo demais pode diluir o foco antes de validar o shell.

## Premissas nao validadas

- Usuarios preferem uma experiencia integrada a ferramentas separadas.
- MUI entrega densidade e polish suficientes para uma interface cientifica.
- Three.js e suficiente como renderizador principal para as primeiras simulacoes.
- Plotly.js cobre a maior parte dos graficos cientificos necessarios.
- MDX/Markdown com KaTeX e suficiente para o apendice teorico inicial.

## Decisoes pendentes

- Confirmar se o primeiro core sera pendulo simples ou massa-mola. Recomendacao atual: pendulo simples.
- Escolher entre `#2DD4BF` e `#38BDF8` como cor primaria.
- Definir se a teoria aparece como aba, painel inferior ou painel lateral alternavel.
- Definir se a aplicacao deve ser apenas web ou tambem empacotavel como desktop no futuro.
- Definir estrategia final de testes e2e apos inicializar o frontend.

## Gaps deixados para depois

- Login/auth.
- Persistencia de parametros do usuario.
- Exportacao de graficos/tabelas.
- Compartilhamento de simulacoes por link.
- Editor de conteudo teorico.
- Dashboard de professor.
- Observabilidade de producao.

## Itens para nao esquecer

- Toda nova simulacao deve declarar limites do modelo fisico.
- Toda simulacao deve compartilhar dados entre graficos, tabela e cena.
- O catalogo deve separar simulacoes disponiveis de simulacoes planejadas.
- A documentacao deve ser atualizada quando a stack ou o core mudar.
