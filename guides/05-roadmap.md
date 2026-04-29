# Roadmap

## Legenda

- `[ ]` Pendente.
- `[~]` Em andamento.
- `[x]` Concluido.

## Diretriz core-first

A primeira entrega de produto deve provar o core de viabilidade com mocks, fixtures JSON e uma simulacao local. Essa prova inclui formulas aplicadas com quando e como usa-las. Cadastros, login, auth, dashboard administrativo, billing e hardening entram apenas depois que esse fluxo demonstrar viabilidade.

## Fase 0 - Fundacao documental e operacional

Objetivo: alinhar tese, arquitetura, escopo e validacao antes de implementar.

Tasks:

- `[x]` Criar pacote inicial de guides.
- `[x]` Definir core como `Mecanica > Pendulo simples`.
- `[x]` Registrar stack recomendada e alternativas.
- `[x]` Registrar riscos e premissas abertas.
- `[x]` Inicializar projeto frontend com React + TypeScript + Vite.
- `[x]` Configurar Material UI e tema dark graphite.

Criterio de saida:

- Guides existem e validam como pacote core-first.
- Primeiro slice de implementacao esta claro.

## Fase 1 - Prova do core: pendulo simples

Objetivo: entregar uma simulacao completa local que sincronize parametros, animacao, vetores, graficos, tabela, formulas aplicadas e teoria.

Tasks:

- `[x]` Criar shell da aplicacao com sidebar, topbar, area central e painel de controles.
- `[x]` Criar registry local de areas e simulacoes via JSON.
- `[x]` Implementar `Mecanica > Pendulo simples` no registry.
- `[x]` Implementar modelo numerico do pendulo com integrador deterministico.
- `[x]` Gerar samples de tempo, angulo, velocidade, posicao e energia.
- `[x]` Renderizar cena do pendulo em Three.js.
- `[x]` Exibir vetores de peso, tensao e velocidade.
- `[x]` Integrar graficos de angulo, velocidade e energia com adapter live-canvas progressivo.
- `[x]` Exibir tabela sincronizada de amostras.
- `[x]` Criar guia de formulas do pendulo com equacoes, variaveis, unidades, condicoes de uso e exemplos.
- `[x]` Criar apendice teorico em MDX/Markdown com KaTeX.
- `[x]` Adicionar controles: play/pause, reset, comprimento, massa, gravidade, angulo inicial, velocidade angular, amortecimento e toggles.
- `[x]` Adicionar blocos chevron recolhiveis para graficos, tabela, formulas e teoria, suspendendo processamento quando fechados.
- `[x]` Manter a tabela de amostras com quantidade fixa de linhas visiveis durante playback.
- `[x]` Criar testes do motor numerico e smoke test da tela.

Criterio de saida:

- O pendulo pode ser explorado por parametros.
- Cena, graficos, tabela, formulas e teoria usam o mesmo estado de simulacao.
- Blocos de saida pesada podem ser recolhidos sem manter graficos, tabela, KaTeX ou Markdown processando em segundo plano.
- O usuario entende o fenomeno sem sair da tela.

## Fase 2 - Reuso do modelo de simulacao e catalogo curricular

Objetivo: provar que a arquitetura suporta mais de uma simulacao sem duplicar a estrutura principal e preparar o catalogo planejado de fisica basica sem marcar conteudo como pronto antes da hora.

Tasks:

- `[x]` Extrair contrato comum `SimulationDefinition`.
- `[x]` Adicionar `topicPath` para representar caminhos como `Mecanica > Cinematica > MRU`.
- `[x]` Criar status de catalogo `planned`, `scaffolded` e `available`.
- `[x]` Criar fixtures locais para as quatro areas principais: `Mecanica`, `Termodinamica`, `Oscilacoes e Ondas` e `Eletromagnetismo`.
- `[x]` Registrar todas as simulacoes planejadas como itens indisponiveis ate terem motor, cena, graficos, tabela, formulas e teoria.
- `[x]` Adicionar segunda simulacao de Mecanica, preferencialmente `Mecanica > Dinamica > Plano inclinado com atrito` ou `Oscilacoes e Ondas > Oscilacoes > Massa-mola`.
- `[x]` Reusar shell, controles, graficos, tabela e guia de formulas.
- `[x]` Extrair o padrao reutilizavel de runtime visual: renderer com loop proprio, UI React em cadencia reduzida, buffers reutilizados e metricas de FPS/frame time.
- `[x]` Ajustar docs com aprendizados da primeira simulacao.

Criterio de saida:

- Duas simulacoes usam o mesmo shell.
- O custo de adicionar uma nova simulacao fica claro.
- O catalogo planejado aparece separado de simulacoes disponiveis.

## Fase 3 - Expansao de Mecanica

Objetivo: cobrir o bloco principal de Mecanica basica com modelos analiticos e numericos leves, mantendo o pendulo como simulacao modelo.

Tasks:

- `[x]` Implementar `Mecanica > Cinematica > Movimento retilineo uniforme`.
- `[x]` Implementar `Mecanica > Cinematica > Movimento uniformemente variado e queda livre`.
- `[x]` Implementar `Mecanica > Cinematica > Lancamento obliquo`.
- `[x]` Implementar `Mecanica > Cinematica > Movimento circular uniforme`.
- `[x]` Implementar `Mecanica > Dinamica > Plano inclinado com atrito`.
- `[x]` Implementar `Mecanica > Dinamica > Maquina de Atwood`.
- `[x]` Implementar `Mecanica > Dinamica > Forca centripeta em curva`.
- `[x]` Implementar `Mecanica > Energia e momento > Trabalho e energia em trilho`.
- `[ ]` Implementar `Mecanica > Energia e momento > Colisoes 1D e 2D`.
- `[ ]` Implementar `Mecanica > Estatica > Equilibrio de particula`.
- `[ ]` Implementar `Mecanica > Estatica > Torque, alavancas e centro de massa`.
- `[ ]` Implementar `Mecanica > Rotacao > Rotacao de corpo rigido`.
- `[ ]` Implementar `Mecanica > Rotacao > Rolamento sem escorregamento`.
- `[ ]` Implementar `Mecanica > Gravitacao > Campo gravitacional e orbitas`.
- `[ ]` Implementar `Mecanica > Fluidos basicos > Hidrostatica e empuxo`.
- `[ ]` Implementar `Mecanica > Fluidos basicos > Continuidade e Bernoulli`.
- `[ ]` Criar presets didaticos por subarea mecanica.
- `[ ]` Validar que todos os modelos mecanicos declaram limites e aproximacoes.

Criterio de saida:

- O catalogo de Mecanica tem cobertura didatica ampla.
- Simulacoes analiticas e numericas reutilizam o mesmo shell.
- Todas as simulacoes mecanicas funcionais possuem formulas, teoria e testes proporcionais.

## Fase 4 - Oscilacoes e Ondas

Objetivo: validar sistemas periodicos, propagacao de ondas, som e optica basica com modelos visuais leves.

Tasks:

- `[ ]` Implementar `Oscilacoes e Ondas > Oscilacoes > Massa-mola`.
- `[ ]` Implementar `Oscilacoes e Ondas > Oscilacoes > Oscilador amortecido`.
- `[ ]` Implementar `Oscilacoes e Ondas > Oscilacoes > Oscilador forcado e ressonancia`.
- `[ ]` Implementar `Oscilacoes e Ondas > Oscilacoes > Osciladores acoplados`.
- `[ ]` Implementar `Oscilacoes e Ondas > Ondas mecanicas > Onda em corda`.
- `[ ]` Implementar `Oscilacoes e Ondas > Ondas mecanicas > Superposicao e interferencia`.
- `[ ]` Implementar `Oscilacoes e Ondas > Ondas mecanicas > Ondas estacionarias`.
- `[ ]` Implementar `Oscilacoes e Ondas > Som > Batimentos`.
- `[ ]` Implementar `Oscilacoes e Ondas > Som > Efeito Doppler`.
- `[ ]` Implementar `Oscilacoes e Ondas > Optica > Reflexao e refracao`.
- `[ ]` Implementar `Oscilacoes e Ondas > Optica > Lentes e espelhos`.
- `[ ]` Implementar `Oscilacoes e Ondas > Optica > Difracao e interferencia da luz`.
- `[ ]` Avaliar PixiJS para ondas 2D densas e padroes de interferencia.
- `[ ]` Avaliar Web Audio API para simulacoes sonoras opcionais.

Criterio de saida:

- O produto cobre os fenomenos basicos de oscilacao, onda mecanica, som e optica.
- PixiJS e Web Audio API so entram se houver ganho didatico claro.

## Fase 5 - Termodinamica

Objetivo: cobrir temperatura, calor, gases, primeira lei, segunda lei e transferencia de calor com diagramas de estado e modelos de equilibrio.

Tasks:

- `[ ]` Implementar `Termodinamica > Temperatura > Escalas termometricas e equilibrio`.
- `[ ]` Implementar `Termodinamica > Temperatura > Dilatacao termica`.
- `[ ]` Implementar `Termodinamica > Calorimetria > Mistura termica`.
- `[ ]` Implementar `Termodinamica > Calorimetria > Mudancas de fase`.
- `[ ]` Implementar `Termodinamica > Gases > Gas ideal`.
- `[ ]` Implementar `Termodinamica > Gases > Transformacoes gasosas`.
- `[ ]` Implementar `Termodinamica > Primeira lei > Trabalho, calor e energia interna`.
- `[ ]` Implementar `Termodinamica > Maquinas termicas > Ciclos termicos e rendimento`.
- `[ ]` Implementar `Termodinamica > Segunda lei > Ciclo de Carnot`.
- `[ ]` Implementar `Termodinamica > Transferencia de calor > Conducao, conveccao e radiacao basicas`.
- `[ ]` Criar padrao de diagramas `P-V`, `T-V`, curvas de aquecimento e fluxos de energia.
- `[ ]` Validar avisos de modelo para gas ideal, equilibrio termico e processos reversiveis.

Criterio de saida:

- As simulacoes termodinamicas conectam formulas, diagramas e limites de modelo.
- Processos termodinamicos mostram trabalho, calor e energia de forma sincronizada.

## Fase 6 - Eletromagnetismo

Objetivo: cobrir eletrostatica, circuitos, magnetismo, inducao e ondas eletromagneticas com superposicao, circuitos simples e visualizacao de campos.

Tasks:

- `[ ]` Implementar `Eletromagnetismo > Eletrostatica > Lei de Coulomb e campo eletrico`.
- `[ ]` Implementar `Eletromagnetismo > Eletrostatica > Potencial eletrico e equipotenciais`.
- `[ ]` Implementar `Eletromagnetismo > Eletrostatica > Capacitor de placas paralelas`.
- `[ ]` Implementar `Eletromagnetismo > Circuitos DC > Lei de Ohm e associacao de resistores`.
- `[ ]` Implementar `Eletromagnetismo > Circuitos DC > Circuito RC transiente`.
- `[ ]` Implementar `Eletromagnetismo > Circuitos AC > Circuito RLC`.
- `[ ]` Implementar `Eletromagnetismo > Magnetismo > Campo magnetico por corrente`.
- `[ ]` Implementar `Eletromagnetismo > Magnetismo > Forca magnetica`.
- `[ ]` Implementar `Eletromagnetismo > Inducao > Lei de Faraday-Lenz`.
- `[ ]` Implementar `Eletromagnetismo > Inducao > Motor e gerador didatico`.
- `[ ]` Implementar `Eletromagnetismo > Ondas EM > Onda eletromagnetica plana`.
- `[ ]` Implementar `Eletromagnetismo > Circuitos AC > Fasores e potencia AC`.
- `[ ]` Validar renderizacao de campos e equipotenciais com Three.js ou PixiJS.
- `[ ]` Validar curvas de tensao, corrente, carga, energia e resposta em frequencia com Plotly.js.

Criterio de saida:

- O produto cobre cargas, campos, circuitos, magnetismo e inducao em nivel introdutorio.
- Visualizacoes de campo nao prometem precisao de simulador profissional.

## Fase 7 - Visualizacoes avancadas e motores opcionais

Objetivo: introduzir bibliotecas especializadas quando houver necessidade real comprovada pelas simulacoes.

Tasks:

- `[ ]` Avaliar PixiJS para particulas, fluidos didaticos, ondas 2D e mapas de campo densos.
- `[ ]` Avaliar Rapier para colisoes, juntas e corpos rigidos.
- `[ ]` Avaliar Matter.js para mecanica 2D simples quando Rapier for pesado.
- `[ ]` Avaliar Manim para assets ou videos explicativos pre-renderizados.
- `[ ]` Avaliar D3.js para visualizacoes customizadas que Plotly nao resolva bem.
- `[ ]` Documentar fronteira de uso de cada biblioteca aprovada.

Criterio de saida:

- Cada nova biblioteca tem um motivo claro e uma fronteira de uso.

## Fase 8 - Produto ampliado

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
