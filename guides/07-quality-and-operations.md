# Quality And Operations

## Filosofia de qualidade

Testar primeiro o core fisico e a sincronizacao entre dados, formulas e visualizacao. UI polish, auth, dashboard e operacao avancada devem vir depois que a simulacao central for confiavel.

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
- Testes de invariantes fisicos dentro do modelo declarado.
- Testes de validacao de parametros e unidades.
- Testes de geracao de samples para graficos e tabela.
- Testes de campos derivados de cinematica quando eles alimentarem graficos, tabela, legendas ou formulas.
- Testes de recorte temporal para graficos/tabela quando houver janela movel configuravel.
- Testes de que blocos chevron recolhidos desmontam graficos, tabela, formulas e teoria em vez de apenas ocultar visualmente.
- Testes de que viewport, graficos, tabela, formulas e apendice teorico podem ser maximizados, escondem os demais paineis e restauram o shell ao minimizar.
- Testes de que a sidebar renderiza o catalogo planejado por menus de area, subarea e simulacoes com status claro.
- Testes de que a sidebar abre as simulacoes `available` pelo mesmo shell compartilhado.
- Testes de que a tabela de amostras mantem quantidade fixa de linhas visiveis enquanto esta aberta.
- Testes de consistencia entre formulas documentadas, parametros e dados gerados.
- Testes de contrato para `SimulationDefinition`.
- Smoke test da tela principal abrindo o pendulo.
- Checagem de que o loop de animacao nao força re-render do shell completo, graficos, tabela, formulas ou teoria a cada frame.
- Checagem de que alteracoes de parametros nao desmontam graficos ou viewport pesados sem necessidade.
- Checagem de que cenas reutilizam o helper `visualRuntime` para interpolacao de timeline, loop renderer-first e metricas de FPS/frame time.

## Criterio de qualidade para novas simulacoes

Depois da prova do core, cada nova simulacao promovida para `available` deve ter:

- testes unitarios do modelo fisico ou solucao analitica;
- teste de parametros, unidades e limites do modelo;
- verificacao de que graficos, tabela, cena e formulas usam os mesmos samples;
- smoke test de abertura pelo catalogo;
- revisao do apendice teorico e do guia de formulas;
- checagem visual proporcional ao renderer usado.
- revisao de performance do renderer, incluindo ownership do `requestAnimationFrame`, reutilizacao de buffers e limite de densidade visual.

## Validacoes visuais

- Canvas nao pode estar em branco.
- Viewports Three.js devem renderizar cena 3D com pixels nao-background, responder a arraste horizontal mudando a visualizacao da camera e responder a scroll sobre o canvas com zoom da camera.
- Vetores devem acompanhar o movimento.
- Vetores devem ter legenda visivel com cor, modulo atual e significado fisico.
- Metricas instantaneas e legenda de vetores devem aparecer acima do canvas do viewport.
- Graficos devem atualizar quando parametros mudam.
- Graficos devem exibir valores numericos do eixo Y e legendas de series com grandezas por extenso; unidades podem usar simbolos fisicos abreviados.
- Graficos derivados de velocidade linear e aceleracao devem seguir a mesma janela temporal e a mesma fonte de samples dos demais graficos.
- O olho de cada grafico deve mover o grafico para o slot lateral do viewport, manter a curva sincronizada com a simulacao e remover o slot ao acionar novamente.
- Graficos com janela movel devem manter apenas os ultimos N segundos visiveis depois que o tempo atual ultrapassar a largura do plot.
- Graficos nao devem piscar por remount/purge em mudancas normais de parametro.
- Graficos progressivos devem parecer continuos, sem avanco em blocos grandes que sugiram travamento.
- Blocos de graficos, tabela, formulas e teoria devem abrir/fechar por chevron sem deixar processamento pesado ativo quando recolhidos.
- Blocos chevron de saida pesada devem iniciar fechados e testes devem cobrir abrir e fechar pelo cabecalho.
- O modo maximizado de viewport, graficos, tabela, formulas e apendice teorico deve mostrar apenas o painel em foco dentro da janela e voltar ao layout anterior ao minimizar.
- A sidebar deve permitir expandir areas e subareas planejadas sem confundir itens planejados com simulacoes disponiveis.
- A sidebar deve permitir trocar entre pendulo simples e plano inclinado com atrito sem abandonar o shell compartilhado.
- A tabela de amostras nao deve variar sua altura durante playback por mudar a quantidade de linhas.
- Formulas devem permanecer legiveis e indicar quando usar cada equacao.
- Layout nao deve quebrar em desktop comum.
- Controles devem permanecer legiveis no tema dark.
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
