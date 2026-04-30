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
- Samples: graficos, tabela, vetores, metricas e formulas usam os mesmos campos do sample. Grandezas exibidas nao podem ser recalculadas soltas na UI.
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

## Guia visual para trilhos e energia

Simulacoes de trabalho, energia e dissipacao em trilhos devem parecer uma bancada fisica de laboratorio, nao uma particula solta sobre uma linha abstrata:

- O trilho/guia fica fixo e coerente com a geometria declarada pelo modelo.
- O corpo didatico fica alinhado ao trilho e usa volume simples, como bloco ou carrinho.
- Marcas de distancia, altura ou fim de curso sao referencias secundarias, sem substituir o movimento real calculado.
- Rastros de calor, dissipacao ou trabalho so podem crescer a partir de campos do sample, como `thermalEnergyJoules` e `appliedWorkJoules`.
- Painel compacto de energia dentro do viewport pode resumir `K`, `U_g`, energia termica, trabalho aplicado e saldo, desde que leia os mesmos campos usados pelos graficos, tabela e formulas.

Aplicacao imediata: `Mecanica > Energia e momento > Trabalho e energia em trilho` deve mostrar trilho 3D inclinado, corpo alinhado ao trilho, rastro termico por dissipacao e balanco energetico derivado de `KinematicsSample`.

## Guia visual para molas verticais

Sistemas massa-mola verticais devem parecer um diagrama fisico pendurado, nao uma mola decorativa:

- O suporte superior fica fixo e neutro, como teto ou barra horizontal.
- A mola helicoidal fica presa ao suporte e a massa, deformando em comprimento conforme a coordenada vertical calculada no sample.
- A massa didatica deve ser esferica quando o objetivo visual for o sistema massa-mola vertical solicitado.
- A posicao de equilibrio deve aparecer como referencia secundaria, especialmente porque a gravidade desloca o repouso estatico em `mg/k`.
- Vetores de peso, forca elastica, velocidade e aceleracao devem acompanhar a massa esferica e usar a mesma fonte de sample dos graficos e tabela.
- Se houver amortecimento ou limite geometrico de extensao/compressao, o motor deve declarar o regime e a cena deve refletir esse estado.

Aplicacao imediata: `Oscilacoes e Ondas > Oscilacoes > Massa-mola vertical` deve mostrar uma mola presa no topo, oscilando no eixo vertical com massa esferica na extremidade inferior.

## Guia para perda de restricao

Quando o usuario escolhe parametros que tornam a restricao impossivel, a simulacao deve mostrar o evento fisico:

- Calcular a demanda ideal.
- Calcular o limite disponivel.
- Se `demanda <= limite`, manter o movimento restrito.
- Se `demanda > limite`, trocar para o regime fisico simplificado declarado.
- Manter a curva/trilho/guia ideal como referencia secundaria quando isso ajudar a ver que o corpo saiu da restricao.

Aplicacao imediata: em Forca centripeta em curva, `mu = 0` e valido. Se `v^2 / r > mu g`, o corpo deixa a curva ideal; com `mu = 0`, segue em linha reta pela tangente.

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
