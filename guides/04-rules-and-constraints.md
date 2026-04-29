# Rules And Constraints

## Regras de produto

- Toda simulacao funcional deve ter visualizacao, parametros, graficos/tabela, formulas aplicadas e teoria.
- Toda simulacao deve declarar area do conhecimento, subarea, caminho de topico, nivel, objetivos didaticos, formulas usadas e limites do modelo.
- Itens planejados podem aparecer na sidebar, mas devem ser claramente marcados como indisponiveis ou planejados.
- A primeira entrega funcional deve ser `Mecanica > Pendulo simples`.
- A taxonomia principal do catalogo deve usar `Mecanica`, `Termodinamica`, `Oscilacoes e Ondas` e `Eletromagnetismo`; fluidos basicos entram como subarea, nao como prioridade separada antes do core.

## Regras de fisica

- Unidades devem ser explicitas.
- Parametros devem ter minimo, maximo, passo e valor padrao.
- Controles de runtime, como duracao do ciclo e janela do grafico, tambem devem declarar minimo, maximo, passo e valor padrao.
- Formulas devem declarar variaveis, unidades, significado fisico, quando usar e quando nao usar.
- Formulas exibidas devem corresponder ao modelo numerico implementado.
- O modelo numerico deve ser deterministico para os mesmos parametros.
- Tabela, graficos e animacao devem ser derivados da mesma fonte de dados.
- Quando houver aproximacao, a teoria e o guia de formulas devem explicar a aproximacao e seus limites.
- O produto educacional nao deve sugerir precisao de simulador profissional quando o modelo for didatico.

## Regras de UX

- Interface dark graphite com uma cor principal cyan/teal.
- Controles numericos usam slider e input quando precisao importar.
- Toggles para exibir vetores, trilha, energia e overlays.
- Icones em botoes sempre que houver comando conhecido como play, pause, reset, zoom ou download.
- Texto dentro de paineis deve ser compacto; evitar hero, landing page e blocos promocionais.
- UI deve evitar cards dentro de cards.
- O canvas e os graficos devem ter dimensoes estaveis para nao causar layout shift.
- A animacao deve parecer leve: updates de alta frequencia ficam no renderer, e a UI React recebe apenas leituras periodicas.
- Sliders e inputs que disparam timeline, graficos ou tabela pesados devem evitar recalculo a cada pixel de arraste; confirmar no commit do controle quando necessario.
- Graficos de series temporais longas devem usar janela temporal configuravel para evitar reescala ou crescimento indefinido de pontos visiveis.
- Graficos progressivos devem declarar cadencia de update, stride maximo, densidade minima de pontos visiveis e estrategia de desenho continuo para evitar redraw em blocos grandes.

## Restricoes tecnicas

- Nao depender de backend na Fase 1.
- Nao introduzir auth, cadastro ou persistencia antes da prova core.
- Nao misturar muitos motores visuais no MVP.
- Nao introduzir Rapier, Matter.js, PixiJS, D3.js ou Manim sem uma simulacao concreta que justifique a dependencia.
- Nao usar WebGPU como requisito de producao inicial; WebGL deve ser o baseline.
- Nao travar contratos de API remota cedo demais.
- Nao colocar `requestAnimationFrame` de playback no `SimulationShell` quando isso causar re-render de layout, graficos, tabela, formulas ou teoria a cada frame.
- Nao recriar renderers, materiais, geometrias, buffers ou series Plotly no caminho quente da animacao sem justificativa medida.
- Nao desmontar/remontar graficos ou viewport como mecanismo padrao de reset de parametro; preferir atualizar dados e refs preservando os componentes pesados montados.
- Renderers interativos devem limitar custo de preenchimento e densidade visual, por exemplo com `devicePixelRatio` maximo, downsampling, trilhas limitadas e toggles de saidas pesadas.

## Dados mockados

Na fase core, catalogo, presets, parametros, formulas e conteudo teorico podem ser mockados com JSON/MDX locais. Isso e permitido e desejado para reduzir atrito.

## Fora de escopo inicial

- CFD realista.
- Eletromagnetismo numerico pesado.
- Simulacao profissional de engenharia.
- Colaboracao em tempo real.
- Avaliacoes, notas e turmas.
- Biblioteca completa de aulas.
