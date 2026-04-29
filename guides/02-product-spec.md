# Product Spec

## Objetivo da experiencia

Permitir que o usuario explore um fenomeno fisico mudando parametros e observando simultaneamente:

- animacao do sistema fisico;
- vetores e outras representacoes visuais;
- graficos derivados da simulacao;
- tabela de amostras;
- formulas envolvidas no processo, com indicacao de quando e como usa-las;
- apendice teorico com formulas, interpretacao e limites do modelo.

## Perfis de usuario

- Aluno explorador: quer mexer em valores e entender causa e efeito.
- Professor demonstrador: quer explicar em aula com visual claro e parametros controlaveis.
- Autor tecnico: quer validar se uma simulacao comunica corretamente um conceito.

## Navegacao principal

A aplicacao deve agrupar simulacoes por area do conhecimento em uma sidebar:

- Mecanica, com subareas como Cinematica, Dinamica, Estatica, Energia e momento, Rotacao, Gravitacao e Fluidos basicos.
- Termodinamica, com Temperatura, Calorimetria, Gases, Leis da Termodinamica, Maquinas termicas e Transferencia de calor.
- Oscilacoes e Ondas, com Oscilacoes, Ondas mecanicas, Som e Optica basica.
- Eletromagnetismo, com Eletrostatica, Circuitos, Magnetismo, Inducao e Ondas eletromagneticas.

No MVP, apenas `Mecanica > Pendulo simples` precisa estar funcional. As demais areas podem aparecer como itens planejados, desde que nao confundam com simulacoes prontas.

## Catalogo curricular planejado

O catalogo detalhado de simulacoes fica em `09-simulation-catalog-plan.md`. A experiencia de produto deve suportar:

- area principal;
- subarea;
- caminho de topico, como `Mecanica > Cinematica > Lancamento obliquo`;
- status claro entre planejado, em preparacao e disponivel;
- filtros ou agrupamentos por area, nivel e tipo de modelo quando o catalogo crescer.

Itens planejados podem aparecer na sidebar como bloqueados, desabilitados ou marcados como `planejado`. Eles nao devem parecer clicaveis como simulacoes completas enquanto nao tiverem motor, visualizacao, graficos, tabela, formulas e teoria.

## Tela da simulacao

Layout recomendado:

- Sidebar fixa ou recolhivel com areas e simulacoes.
- Topbar compacta com nome da area, nome da simulacao e acoes globais.
- Area central com viewport/canvas da simulacao.
- Painel lateral de parametros com sliders, inputs numericos, toggles e presets.
- Bloco chevron de graficos sincronizados, recolhivel pelo proprio cabecalho.
- Bloco chevron de tabela de amostras, recolhivel pelo proprio cabecalho.
- Bloco chevron de formulas aplicadas, conectado aos parametros e dados exibidos.
- Bloco chevron de apendice teorico.
- Blocos chevron de saida pesada devem iniciar recolhidos por padrao, para o usuario abrir apenas o que quer observar.

## Controles esperados no pendulo simples

- Play/pause.
- Reset.
- Presets de demonstracao.
- Comprimento do fio.
- Massa.
- Gravidade.
- Angulo inicial.
- Velocidade angular inicial.
- Amortecimento.
- Tempo maximo do ciclo de simulacao.
- Janela temporal dos graficos em segundos, exibindo as amostras recentes.
- Toggle de vetores.
- Toggle de trilha.
- Toggle de energia.
- Blocos chevron para graficos, tabela, formulas e teoria, iniciando fechados e permitindo abrir/minimizar saidas pesadas quando for preciso aliviar a UI.

## Representacoes esperadas

- Cena animada do pendulo.
- Vetores de peso, tensao e velocidade linear com legenda visivel de cor, modulo e significado.
- Grafico de angulo por tempo com janela movel dos ultimos N segundos.
- Grafico de velocidade angular por tempo com a mesma janela movel.
- Grafico de velocidade linear tangencial por tempo com a mesma janela movel.
- Grafico de aceleracao por tempo, exibindo componentes tangencial, radial e modulo total.
- Grafico de energia cinetica, potencial e total com a mesma janela movel.
- Tabela com tempo, angulo, velocidade angular, velocidade linear, aceleracoes, posicao e energia, mantendo quantidade fixa de linhas visiveis para evitar oscilacao de layout durante o playback.
- Formulas do processo analisado, com variaveis, unidades, condicoes de uso e exemplo curto.
- Apendice teorico com equacoes, unidades, contexto de uso e limites da aproximacao.

## Formulas e uso orientado

Cada simulacao funcional deve apresentar um guia de formulas, nao apenas uma lista de equacoes. Para cada formula, informar:

- expressao matematica renderizada com KaTeX;
- nome e significado fisico;
- variaveis e unidades;
- quando usar;
- quando nao usar ou quando a aproximacao deixa de ser valida;
- quais parametros da UI alimentam a formula;
- quais graficos, vetores ou colunas de tabela derivam dela;
- exemplo numerico curto quando fizer sentido.

No pendulo simples, o guia deve cobrir pelo menos:

- equacao de movimento angular;
- aproximacao de pequeno angulo, quando usada;
- periodo aproximado;
- energia potencial, cinetica e total;
- posicao cartesiana da massa;
- velocidade linear tangencial e aceleracoes tangencial/radial/total;
- vetores principais, como peso, tensao e velocidade.

## Estados de tela

- Inicial: carrega preset padrao do pendulo ja em modo rodando, com acao visivel para pausar/reproduzir.
- Rodando: integrador avanca no tempo e UI mostra estado atual.
- Pausado: usuario pode ajustar parametros e inspecionar dados.
- Resetado: volta aos parametros atuais com tempo zero.
- Erro de parametro: indica valor invalido sem quebrar a cena.
- Recurso planejado: areas futuras aparecem desabilitadas ou marcadas como planejadas.

## Comportamento com mocks/fixtures

Na fase core, dados de catalogo, parametros, presets e texto teorico podem vir de JSON/MDX locais. Nao deve haver dependencia de backend.

## Criterios de aceite do MVP

- O usuario consegue abrir `Mecanica > Pendulo simples` pela sidebar.
- O canvas mostra a animacao do pendulo.
- Alterar controles muda a simulacao e regenera dados derivados.
- Alterar o tempo do ciclo muda a duracao maxima antes do playback reiniciar.
- Alterar a janela dos graficos muda quantos segundos recentes ficam visiveis.
- Graficos e tabela refletem os mesmos samples quando suas saidas estao ligadas.
- Graficos, tabela, formulas e teoria podem ser recolhidos por chevron; quando um bloco pesado esta recolhido, seu conteudo deve ser desmontado e seu processamento suspenso.
- Esses blocos chevron iniciam fechados por padrao e precisam alternar aberto/fechado ao clicar no cabecalho.
- A tabela de amostras mantem uma quantidade constante de linhas enquanto esta aberta, preenchendo slots vazios quando ainda nao ha amostras suficientes.
- Vetores podem ser ligados e desligados.
- Vetores exibidos devem ter legenda junto ao viewport, incluindo cor, modulo atual e leitura fisica.
- Formulas exibidas explicam quando usar cada equacao e quais dados da simulacao a alimentam.
- O apendice teorico aparece ao lado ou abaixo da simulacao sem substituir a experiencia principal.
- A interface usa Material UI em dark graphite com acento cyan/teal e leitura confortavel.

## Limites do MVP

- Nao precisa salvar simulacoes do usuario.
- Nao precisa compartilhar links configurados.
- Nao precisa autenticar usuarios.
- Nao precisa ter mais de uma simulacao funcional.
- Nao precisa de simulacao fisica de alta fidelidade alem do modelo declarado.
