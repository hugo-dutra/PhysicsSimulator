# Quality And Operations

## Filosofia de qualidade

Testar primeiro o core fisico e a sincronizacao entre dados, formulas e visualizacao. UI polish, auth, dashboard e operacao avancada devem vir depois que a simulacao central for confiavel.

O `Simulation Fidelity Adjustment Guide` e gate obrigatorio para toda task de simulacao. A validacao de uma task nao deve considerar apenas que a tela abre: ela precisa demonstrar que parametros, regimes, samples, renderer, graficos, tabela, formulas, teoria e warnings continuam contando a mesma fisica.

## Checks esperados

O repositorio tem projeto frontend inicializado. Comandos esperados:

```bash
npm run build
npm run test
npm run lint
```

Se forem usados testes e2e:

```bash
npm run test:e2e
```

## Estrategia de testes do core

- Testes unitarios para o integrador do pendulo.
- Testes unitarios para o modelo analitico/numerico por trechos do plano inclinado com atrito.
- Testes unitarios para o motor analitico compartilhado de Cinematica, cobrindo MRU, MUV/queda livre, lancamento obliquo e MCU.
- Testes unitarios para os modelos analiticos/numericos compartilhados de Dinamica/Energia/Estatica/Rotacao/Gravitacao/Fluidos/Oscilacoes, cobrindo massa-mola vertical, oscilador amortecido, oscilador forcado/ressonancia, osciladores acoplados, Maquina de Atwood, forca centripeta em curva, trabalho/energia em trilho, colisoes 1D/2D, equilibrio de particula, torque/alavancas/centro de massa, rotacao de corpo rigido, rolamento, campo gravitacional/orbitas, hidrostatica/empuxo e continuidade/Bernoulli.
- Testes de invariantes fisicos dentro do modelo declarado.
- Testes de validacao de parametros e unidades.
- Testes de valores limite fisicamente validos, como atrito zero, forca aplicada zero e velocidades iniciais nulas quando o modelo permitir.
- Testes de contrato garantindo que todo parametro fisico e de runtime possua descricao de ajuda para a tooltip de interrogacao.
- Testes de troca de regime quando uma restricao fisica falhar, como perda de aderencia em curva ou parada em fim de curso.
- Testes de geracao de samples para graficos e tabela.
- Testes de campos derivados de cinematica quando eles alimentarem graficos, tabela, legendas ou formulas.
- Testes de recorte temporal para graficos/tabela quando houver janela movel configuravel.
- Testes de que o bloco de leituras e legenda detalhada do viewport inicia fechado, desmonta metricas/valores quando fechado e monta novamente ao abrir.
- Testes de que blocos chevron recolhidos desmontam graficos, tabela, formulas e teoria em vez de apenas ocultar visualmente.
- Testes de que viewport, graficos, tabela, formulas e apendice teorico podem ser maximizados, escondem os demais paineis e restauram o shell ao minimizar.
- Testes de que a sidebar renderiza o catalogo planejado por menus de area, subarea e simulacoes com status claro.
- Testes de que a sidebar abre as simulacoes `analysis` e `ready` pelo mesmo shell compartilhado.
- Testes de que subareas com `analysis` iniciam abertas, enquanto subareas apenas `ready` ou `planned` iniciam recolhidas.
- Testes de que a tabela de amostras mantem quantidade fixa de linhas visiveis enquanto esta aberta.
- Testes de consistencia entre formulas documentadas, parametros e dados gerados.
- Testes de contrato para `SimulationDefinition`.
- Smoke test da tela principal abrindo o pendulo.
- Checagem de que o loop de animacao nao força re-render do shell completo, graficos, tabela, formulas ou teoria a cada frame.
- Checagem de que alteracoes de parametros nao desmontam graficos ou viewport pesados sem necessidade.
- Checagem de que cenas reutilizam o helper `visualRuntime` para interpolacao de timeline, loop renderer-first e metricas de FPS/frame time.

## Criterio de qualidade para novas simulacoes

Depois da prova do core, cada nova simulacao promovida para `analysis` ou `ready` deve ter:

- auditoria do `Simulation Fidelity Adjustment Guide` registrada na task;
- testes unitarios do modelo fisico ou solucao analitica;
- teste de parametros, unidades e limites do modelo;
- teste de descricao de ajuda nos parametros, cobrindo o que a variavel representa e o efeito esperado ao altera-la;
- teste de regime nominal e de pelo menos um limite/transicao quando o modelo tiver regimes;
- teste de zeros fisicamente validos, como atrito zero, forca aplicada zero ou velocidade inicial zero quando o modelo permitir;
- verificacao de que graficos, tabela, cena e formulas usam os mesmos samples;
- warnings que expliquem o regime fisico aplicado quando houver saturacao, perda de restricao, parada em limite visual ou fim de curso;
- smoke test de abertura pelo catalogo;
- revisao do apendice teorico e do guia de formulas;
- checagem visual proporcional ao renderer usado.
- revisao de performance do renderer, incluindo ownership do `requestAnimationFrame`, reutilizacao de buffers e limite de densidade visual.

## Validacoes visuais

- Canvas nao pode estar em branco.
- Viewports Three.js devem renderizar cena 3D com pixels nao-background, responder a arraste horizontal mudando yaw, responder a arraste vertical mudando pitch para ver por cima/baixo e responder a Shift + scroll sobre o canvas com zoom da camera.
- Viewports Three.js com grade devem manter eixos X, Y e Z de referencia no canto inferior esquerdo do plano, com cores distintas, alfa visual e legenda fixa no canto superior esquerdo do canvas.
- Vetores devem acompanhar o movimento.
- Quando uma simulacao declara perda de restricao, a cena deve mostrar a trajetoria real calculada pelo motor e deixar a guia ideal apenas como referencia secundaria.
- Na massa-mola vertical, o suporte superior deve permanecer fixo, a mola deve deformar de acordo com a posicao vertical calculada e a massa esferica deve acompanhar o mesmo sample usado por graficos, tabela, formulas e vetores.
- Em `Trabalho e energia em trilho`, o smoke visual deve confirmar que o corpo aparece como bloco/carrinho alinhado a tangente da rampa em U, que a guia 3D tem referencia de altura/distancia, que o rastro acompanha a dissipacao do sample e que o painel compacto de `K`, `U_g`, `E_perdida`, energia total mecanica e percentual de perda aparece no viewport quando energia esta ligada.
- Em `Onda em corda`, `Superposicao e interferencia` e `Ondas estacionarias`, o smoke visual deve confirmar que o perfil 1D aparece no canvas, que o probe acompanha o mesmo sample usado por graficos/tabela/formulas e que componentes/envelope aparecem apenas quando a simulacao declara esse overlay.
- Quando a simulacao tiver parametros-limite relevantes, o smoke visual ou teste proporcional deve cobrir pelo menos um caso-limite didatico, nao apenas o preset nominal.
- Vetores devem ter legenda visivel com cor, modulo atual e significado fisico.
- Metricas instantaneas e legenda detalhada de vetores devem aparecer acima do canvas do viewport apenas quando o bloco retratil de leituras estiver aberto; por padrao esse bloco fica fechado e os componentes de valores ficam desmontados.
- A animacao deve exibir legenda compacta dos vetores principais no canto superior direito, com traco na cor do vetor, grandeza representada e unidade abreviada quando houver.
- Graficos devem atualizar quando parametros mudam.
- Graficos devem exibir valores numericos do eixo Y e legendas de series com grandezas por extenso; unidades podem usar simbolos fisicos abreviados.
- Clicar em cada item da legenda do grafico deve alternar a visibilidade daquela serie sem desmontar o grafico inteiro nem alterar samples, tabela, cena ou formulas.
- Graficos derivados de velocidade linear e aceleracao devem seguir a mesma janela temporal e a mesma fonte de samples dos demais graficos.
- O olho de cada grafico deve mover o grafico para o slot lateral do viewport, manter a curva sincronizada com a simulacao e remover o slot ao acionar novamente.
- Graficos com janela movel devem manter apenas os ultimos N segundos visiveis depois que o tempo atual ultrapassar a largura do plot.
- Graficos nao devem piscar por remount/purge em mudancas normais de parametro.
- Graficos progressivos devem parecer continuos, sem avanco em blocos grandes que sugiram travamento.
- Blocos de graficos, tabela, formulas e teoria devem abrir/fechar por chevron sem deixar processamento pesado ativo quando recolhidos.
- Blocos chevron de saida pesada devem iniciar fechados e testes devem cobrir abrir e fechar pelo cabecalho.
- O modo maximizado de viewport, graficos, tabela, formulas e apendice teorico deve mostrar apenas o painel em foco dentro da janela e voltar ao layout anterior ao minimizar.
- A sidebar deve permitir expandir areas e subareas planejadas sem confundir itens planejados com simulacoes em analise ou prontas.
- A sidebar deve iniciar abertas apenas as subareas com simulacoes em `analysis`; subareas somente `ready` ou `planned` devem iniciar recolhidas.
- A sidebar deve permitir trocar entre as simulacoes de `Oscilacoes e Ondas > Oscilacoes` (pendulo simples, massa-mola vertical, oscilador amortecido, oscilador forcado/ressonancia e osciladores acoplados), plano inclinado com atrito, as simulacoes de Cinematica prontas ou em analise, Maquina de Atwood, forca centripeta em curva, trabalho/energia em trilho, colisoes 1D/2D, equilibrio de particula, torque/alavancas/centro de massa e rotacao de corpo rigido sem abandonar o shell compartilhado.
- A tabela de amostras nao deve variar sua altura durante playback por mudar a quantidade de linhas.
- Formulas devem permanecer legiveis e indicar quando usar cada equacao.
- Layout nao deve quebrar em desktop comum.
- Controles devem permanecer legiveis no tema dark.
- Todo controle de parametro deve exibir o icone de interrogacao e abrir tooltip legivel com a descricao contratual do parametro.
- Indicadores de FPS ou frame time devem ficar disponiveis durante desenvolvimento quando houver animacao continua.
- A animacao nao deve depender de re-render React em alta frequencia para parecer fluida.

## Riscos operacionais

- Dependencias graficas podem aumentar bundle.
- Three.js + Plotly.js/live-canvas + MUI podem exigir cuidado de performance.
- WebGPU nao deve ser requisito inicial.
- Conteudo teorico e formulas podem ficar desatualizados se nao forem versionados junto da simulacao.

## Observabilidade minima

Na fase local:

- erros de parametro visiveis na UI;
- logs de erro no console durante desenvolvimento;
- mensagens claras quando uma simulacao estiver planejada;
- medicao simples de FPS ou frame time para simulacoes com loop continuo ou quando a cena ficar pesada.

## Criterio de pronto por fase

Fase 1 esta pronta quando:

- o pendulo roda localmente;
- tests do motor numerico passam;
- build passa;
- smoke visual confirma canvas, controles, graficos, tabela e formulas;
- a animacao segue o padrao de renderer desacoplado do shell React;
- teoria explica o modelo implementado e quando usar cada formula.
