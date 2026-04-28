# Roadmap

## Legenda

- `[ ]` Pendente.
- `[~]` Em andamento.
- `[x]` Concluido.

## Diretriz core-first

A primeira entrega de produto deve provar o core de viabilidade com mocks, fixtures JSON e uma simulacao local. Cadastros, login, auth, dashboard administrativo, billing e hardening entram apenas depois que esse fluxo demonstrar viabilidade.

## Fase 0 - Fundacao documental e operacional

Objetivo: alinhar tese, arquitetura, escopo e validacao antes de implementar.

Tasks:

- `[x]` Criar pacote inicial de guides.
- `[x]` Definir core como `Mecanica > Pendulo simples`.
- `[x]` Registrar stack recomendada e alternativas.
- `[x]` Registrar riscos e premissas abertas.
- `[ ]` Inicializar projeto frontend com React + TypeScript + Vite.
- `[ ]` Configurar Material UI e tema dark graphite.

Criterio de saida:

- Guides existem e validam como pacote core-first.
- Primeiro slice de implementacao esta claro.

## Fase 1 - Prova do core: pendulo simples

Objetivo: entregar uma simulacao completa local que sincronize parametros, animacao, vetores, graficos, tabela e teoria.

Tasks:

- `[ ]` Criar shell da aplicacao com sidebar, topbar, area central e painel de controles.
- `[ ]` Criar registry local de areas e simulacoes via JSON.
- `[ ]` Implementar `Mecanica > Pendulo simples` no registry.
- `[ ]` Implementar modelo numerico do pendulo com integrador deterministico.
- `[ ]` Gerar samples de tempo, angulo, velocidade, posicao e energia.
- `[ ]` Renderizar cena do pendulo em Three.js.
- `[ ]` Exibir vetores de peso, tensao e velocidade.
- `[ ]` Integrar Plotly.js para graficos de angulo, velocidade e energia.
- `[ ]` Exibir tabela sincronizada de amostras.
- `[ ]` Criar apendice teorico em MDX/Markdown com KaTeX.
- `[ ]` Adicionar controles: play/pause, reset, comprimento, massa, gravidade, angulo inicial, velocidade angular, amortecimento e toggles.
- `[ ]` Criar testes do motor numerico e smoke test da tela.

Criterio de saida:

- O pendulo pode ser explorado por parametros.
- Cena, graficos, tabela e teoria usam o mesmo estado de simulacao.
- O usuario entende o fenomeno sem sair da tela.

## Fase 2 - Reuso do modelo de simulacao

Objetivo: provar que a arquitetura suporta mais de uma simulacao sem duplicar a estrutura principal.

Tasks:

- `[ ]` Extrair contrato comum `SimulationDefinition`.
- `[ ]` Adicionar segunda simulacao de Mecanica, preferencialmente massa-mola ou plano inclinado.
- `[ ]` Reusar shell, controles, graficos e tabela.
- `[ ]` Ajustar docs com aprendizados da primeira simulacao.

Criterio de saida:

- Duas simulacoes usam o mesmo shell.
- O custo de adicionar uma nova simulacao fica claro.

## Fase 3 - Primeiras areas alem de Mecanica

Objetivo: validar a navegacao por areas do conhecimento com simulacoes simples.

Tasks:

- `[ ]` Adicionar uma simulacao introdutoria de Termodinamica, como gas ideal.
- `[ ]` Adicionar uma simulacao introdutoria de Eletricidade, como circuito RC/RLC ou campo eletrico simples.
- `[ ]` Refinar padrao de apendice teorico por area.
- `[ ]` Validar responsividade e usabilidade em sala de aula.

Criterio de saida:

- O produto parece uma plataforma, nao uma demo isolada.

## Fase 4 - Visualizacoes avancadas

Objetivo: introduzir bibliotecas especializadas quando houver necessidade real.

Tasks:

- `[ ]` Avaliar PixiJS para particulas, fluidos didaticos e cenas 2D densas.
- `[ ]` Avaliar Rapier para colisoes e corpos rigidos.
- `[ ]` Avaliar Manim para assets ou videos explicativos pre-renderizados.
- `[ ]` Avaliar D3.js para visualizacoes customizadas que Plotly nao resolva bem.

Criterio de saida:

- Cada nova biblioteca tem um motivo claro e uma fronteira de uso.

## Fase 5 - Produto ampliado

Objetivo: adicionar funcoes acessorias somente depois da prova da experiencia central.

Tasks:

- `[ ]` Persistencia local ou remota de parametros.
- `[ ]` Exportacao de dados ou imagem.
- `[ ]` Links compartilhaveis com parametros.
- `[ ]` Login/auth se houver necessidade real de contas.
- `[ ]` Turmas, trilhas de aula ou dashboard de professor.
- `[ ]` Observabilidade e hardening de producao.

Criterio de saida:

- Acessorios aumentam valor sem comprometer a clareza do core.
