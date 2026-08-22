# Simulation Fidelity Adjustment Guide

## Objetivo

Este guia define como ajustar simulacoes que parecam apenas animacoes parametrizadas. Uma simulacao `analysis` ou `ready` deve resolver o modelo fisico declarado, gerar samples derivados desse modelo e so entao renderizar cena, graficos, tabela, vetores, formulas e teoria.

## Regra central

O renderer nunca inventa a fisica. Ele recebe `SimulationSample` e desenha o estado calculado pelo motor. Se um parametro altera o regime fisico, como atrito zero, fim de curso, perda de contato, colisao, saturacao de forca ou limite geometricamente impossivel, o motor deve mudar o sample e a cena deve mostrar essa mudanca.

## Escopo obrigatorio

Este guia e gate de pronto para qualquer task que crie, altere, revise ou promova uma simulacao. A task so pode ser considerada concluida quando registrar que o checklist abaixo foi aplicado ou quando justificar explicitamente que um item nao se aplica ao modelo declarado.

Isso vale para:

- simulacoes novas;
- simulacoes `analysis` ou `ready` alteradas por parametro, fixture, motor, renderer, graficos, tabela, formulas, teoria ou warnings;
- promocao de status `planned` para `analysis` ou de `analysis` para `ready`;
- refactors de motor ou renderer que possam mudar samples, trajetorias, vetores ou leituras exibidas;
- revisoes retroativas de simulacoes ja entregues.

## Checklist de auditoria

Para cada simulacao funcional, conferir:

- Parametros: todo controle fisico e de runtime declara unidade quando houver, minimo, maximo, passo, valor padrao e `description` para a tooltip de interrogacao. A descricao deve dizer o que a variavel e, como entra no modelo e o que muda ao alterar o valor. Valores fisicamente validos como `mu = 0`, velocidade inicial zero ou forca aplicada zero nao devem ser bloqueados por conveniencia visual.
- Modelo: o motor declara quais equacoes usa, quais aproximacoes assume e quais regimes existem.
- Regimes: quando uma condicao deixa de ser satisfeita, o motor troca de regime em vez de continuar a animacao ideal. Exemplos: corpo sai da curva se `m v^2 / r > mu m g`; bloco para se a energia/velocidade zera; massa de Atwood para no fim do curso visual.
- Samples: graficos, tabela, vetores, metricas e formulas usam os mesmos campos do sample. Grandezas exibidas nao podem ser recalculadas soltas na UI. Controles de runtime como velocidade de passagem do tempo podem desacelerar ou pausar a leitura, mas nao podem trocar a fonte fisica nem gerar samples alternativos.
- Cena: linhas, massas, vetores e trajetorias devem seguir o sample. Linhas de referencia sao aceitaveis, mas precisam ser visualmente secundarias e nao podem contradizer o movimento real.
- Graficos: comparar demanda fisica, limite disponivel e valor real quando houver saturacao. Exemplo: na curva, mostrar forca centripeta requerida, atrito maximo e atrito lateral usado.
- Avisos: quando um limite e excedido, `warnings` deve explicar o regime aplicado, nao apenas contar um erro.
- Teoria e formulas: devem dizer quando a equacao vale, quando vira apenas demanda ideal e quando o modelo muda de regime.
- Testes: cada regime fisico precisa de teste unitario do motor e, quando tiver renderer, smoke visual proporcional.

## Guia visual para massas, fios e restricoes

Sistemas com fios, polias, hastes ou trilhos devem parecer diagramas fisicos, nao objetos soltos no espaco:

- A restricao fica fixa quando o modelo diz que ela e fixa. Uma polia ideal nao acompanha as massas.
- Fios ficam presos aos pontos tangentes ou de contato e mantem trechos verticais/horizontais coerentes com a geometria.
- Massas didaticas devem usar volume simples e legivel, preferencialmente cubos/blocos quando o diagrama tradicional usa blocos.
- Suportes, polias e guias usam cor neutra; vetores usam a paleta de grandezas.
- Evitar linhas diagonais ou trajetorias auxiliares quando elas nao representam a restricao fisica.

Aplicacao imediata: a Maquina de Atwood deve mostrar suporte fixo, polia fixa, fio passando pelo arco superior da polia e massas em blocos alinhados aos trechos verticais do fio.

## Guia visual para alavancas e gangorras

Sistemas de torque, alavancas e centro de massa devem parecer uma gangorra ou bancada de alavanca, nao uma barra solta no espaco:

- O ponto de apoio fica fixo e visivel no pivo declarado pelo modelo.
- A barra gira no plano vertical quando o torque resultante e usado como indicacao didatica de desequilibrio.
- Massas didaticas ficam apoiadas sobre a barra nos bracos calculados pelo sample.
- Peso esquerdo, peso direito e forca aplicada nascem dos pontos de aplicacao correspondentes, nao do centro geometrico da cena.
- O centro de massa aparece como marcador proprio sobre a barra e usa o mesmo `centerOfMassMeters` dos graficos, tabela e formulas.
- O torque resultante pode ser representado como vetor ou indicacao secundaria, mas nao deve substituir os pesos e bracos que explicam sua origem.

Aplicacao imediata: `Mecanica > Estatica > Torque, alavancas e centro de massa` deve mostrar uma gangorra com apoio fixo, blocos de massa, ponto de forca aplicada, centro de massa e vetores derivados do mesmo sample.

## Guia visual para trilhos e energia

Simulacoes de trabalho, energia e dissipacao em trilhos devem parecer uma bancada fisica de laboratorio, nao uma particula solta sobre uma linha abstrata:

- O trilho/guia fica fixo e coerente com a geometria declarada pelo modelo.
- O corpo didatico fica alinhado ao trilho e usa volume simples, como bloco ou carrinho.
- Marcas de distancia, altura ou fim de curso sao referencias secundarias, sem substituir o movimento real calculado.
- Rastros de calor, dissipacao, perda ou trabalho so podem crescer a partir de campos do sample, como `thermalEnergyJoules`, `energyLossPercent` e `appliedWorkJoules`.
- Painel compacto de energia dentro do viewport pode resumir `K`, `U_g`, energia termica/perdida, trabalho aplicado quando existir e energia mecanica total, desde que leia os mesmos campos usados pelos graficos, tabela e formulas.

Aplicacao imediata: `Mecanica > Energia e momento > Trabalho e energia em trilho` deve mostrar uma rampa em U fixa, corpo alinhado a tangente local da guia, rastro de perda por dissipacao e painel de energia/perda percentual derivados de `KinematicsSample`.

## Guia visual para molas verticais

Sistemas massa-mola verticais devem parecer um diagrama fisico pendurado, nao uma mola decorativa:

- O suporte superior fica fixo e neutro, como teto ou barra horizontal.
- A mola helicoidal fica presa ao suporte e a massa, deformando em comprimento conforme a coordenada vertical calculada no sample.
- A massa didatica deve ser esferica quando o objetivo visual for o sistema massa-mola vertical solicitado.
- A posicao de equilibrio deve aparecer como referencia secundaria, especialmente porque a gravidade desloca o repouso estatico em `mg/k`.
- Vetores de peso, forca elastica, velocidade e aceleracao devem acompanhar a massa esferica e usar a mesma fonte de sample dos graficos e tabela.
- Se houver amortecimento ou limite geometrico de extensao/compressao, o motor deve declarar o regime e a cena deve refletir esse estado.

Aplicacao imediata: `Oscilacoes e Ondas > Oscilacoes > Massa-mola vertical` deve mostrar uma mola presa no topo, oscilando no eixo vertical com massa esferica na extremidade inferior.

## Guia visual para ondas longitudinais em molas

Ondas longitudinais em mola devem comunicar que o meio material oscila na mesma direcao da propagacao:

- A mola fica alinhada ao eixo declarado da simulacao e a perturbacao percorre esse eixo.
- As espiras se comprimem e se rarefazem a partir do deslocamento longitudinal calculado no sample; nao deve haver oscilacao transversal usada como atalho visual.
- Fonte, probe, vetores de deslocamento/velocidade/aceleracao e medida de comprimento de onda devem estar paralelos ao eixo da mola.
- A velocidade da onda deve vir do modelo declarado, seja `v = sqrt(C/mu)` para rigidez longitudinal e densidade linear, seja `v = lambda f` no modo didatico.
- Compressao local, forca elastica, energia didatica, graficos, tabela, formulas e teoria devem usar os mesmos campos do sample.
- Amplitude zero e frequencia zero sao casos fisicamente validos e devem produzir mola reta ou perfil estatico com warning, nao erro visual.

Aplicacao imediata: `Oscilacoes e Ondas > Ondas mecanicas > Onda longitudinal em mola` deve mostrar uma mola diagonal comprimindo e expandindo paralelamente ao eixo de propagacao.

## Guia para perda de restricao

Quando o usuario escolhe parametros que tornam a restricao impossivel, a simulacao deve mostrar o evento fisico:

- Calcular a demanda ideal.
- Calcular o limite disponivel.
- Se `demanda <= limite`, manter o movimento restrito.
- Se `demanda > limite`, trocar para o regime fisico simplificado declarado.
- Manter a curva/trilho/guia ideal como referencia secundaria quando isso ajudar a ver que o corpo saiu da restricao.

Aplicacao imediata: em Forca centripeta em curva, `mu = 0` e valido. Se `v^2 / r > mu g`, o corpo deixa a curva ideal; com `mu = 0`, segue em linha reta pela tangente.

## Guia visual para a analogia de tecido do espaco-tempo

Visualizacoes de gravidade com uma malha deformavel devem separar explicitamente a fisica orbital da analogia visual:

- A orbita, campo, forca, potencial e energia continuam sendo calculados pelo motor declarado.
- O poco central permanece fixo na massa central; o poco do corpo orbital acompanha exatamente a posicao calculada no sample.
- Intensidades de deformacao e potencial especifico pertencem ao sample. O renderer apenas mapeia esses campos para a geometria reutilizavel da malha.
- A largura visual do poco central pode usar o raio maximo da trajetoria de referencia para tornar a curvatura perceptivel perto da orbita, mas deve permanecer estavel durante o playback e nao pode retroagir sobre a dinamica.
- A tesselação deve ser densa o suficiente para evitar funis facetados, mantendo o buffer de posicoes reutilizado e uma taxa de quadros utilizavel no smoke visual.
- Controles de opacidade da malha devem aceitar zero, declarar que sao somente visuais, ter tooltip e nunca alterar pocos, samples fisicos ou trajetoria; o padrao atual e 60%.
- Amplificacao visual do poco menor precisa ser um parametro declarado e deve avisar que a escala nao e fisica.
- Zerar profundidade ou amplificacao achata o poco correspondente sem mudar posicao, periodo, velocidade, forca ou energia.
- A teoria deve explicar que a superficie 2D nao e um tecido material, nao desenha literalmente uma dimensao espacial extra e nao substitui uma metrica relativistica.

Aplicacao imediata: `Mecanica > Gravitacao > Campo gravitacional e orbitas` mostra um poco fixo sob a massa central e outro, amplificado, seguindo o planeta na malha wireframe.

## Guia visual para a analogia de malha gravitacional volumetrica

A segunda visualizacao de gravidade representa o espaco como cubos interligados e deve preservar as seguintes invariantes:

- Na grade-base, toda aresta e paralela a X, Y ou Z; nao existem diagonais internas nem planos desconectados.
- A intensidade, o raio do nucleo e o alcance visual de cada deformacao derivam dos campos de massa/deformacao do mesmo `KinematicsSample` usado por graficos e tabela.
- Dentro do nucleo dependente da massa, varios vertices coincidem exatamente no centro da massa, tornando visivel que as linhas convergem ao mesmo ponto.
- Fora do nucleo, a curva decai suavemente. O alcance marca onde a deformacao fica perceptivel na analogia, nao uma distancia fisica finita onde o campo comeca ou termina.
- A massa orbital acompanha a posicao do sample e pode usar amplificacao didatica declarada; nenhuma escala visual retroage sobre orbita, campo, forca, periodo ou energia.
- Zerar a intensidade visual restaura a grade ortogonal, inclusive nos centros, sem alterar os samples fisicos.
- A quantidade de cubos deve permanecer estavel. Para suavizar curvas, o renderer pode subdividir visualmente cada aresta e recalcular seus pontos intermediarios pelo mesmo mapeamento, sem adicionar novas celulas ao espaco.
- A cor pode codificar a intensidade da analogia: teal na grade quase reta, amarelo/laranja na transicao e vermelho onde influencia visual e desvio geometrico sao maiores. O heatmap deriva apenas dos mesmos pocos visuais e nao deve ser rotulado como uma medicao local exata de `g`.
- A geometria e o material devem ser reutilizados no loop, com densidade limitada e smoke de FPS/console antes de promocao.

Aplicacao imediata: `Mecanica > Gravitacao > Curvatura gravitacional em malha 3D` usa uma grade cubica unica, com convergencia central e orbital e escalas de influencia proporcionais a raiz cubica das massas de referencia.

## Plano de ajuste das demais simulacoes

Ao revisar uma simulacao existente, seguir esta ordem:

1. Auditar parametros, garantir tooltips de interrogacao em todos eles e permitir zeros fisicamente validos.
2. Listar regimes fisicos possiveis e limites de transicao.
3. Garantir que o motor gera samples diferentes para cada regime.
4. Ajustar renderer para desenhar o sample real e uma referencia ideal apenas quando for didatico.
5. Atualizar formulas, teoria, limites e warnings.
6. Adicionar testes unitarios para o regime nominal e para pelo menos um limite.
7. Registrar no `progress.md` ou na trilha da task quais regimes/limites foram conferidos.
8. Rodar build, testes, lint e smoke visual quando houver cena.

Nenhuma nova simulacao deve ser promovida para `analysis`, nem permanecer como `analysis` ou `ready` apos mudanca relevante, sem passar por este guia. As simulacoes em `analysis` devem ser revisitadas com este guia antes de virarem `ready`, e a promocao para `ready` tambem exige teste manual do dono do projeto.
