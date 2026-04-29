# Simulation Fidelity Adjustment Guide

## Objetivo

Este guia define como ajustar simulacoes que parecam apenas animacoes parametrizadas. Uma simulacao `available` deve resolver o modelo fisico declarado, gerar samples derivados desse modelo e so entao renderizar cena, graficos, tabela, vetores, formulas e teoria.

## Regra central

O renderer nunca inventa a fisica. Ele recebe `SimulationSample` e desenha o estado calculado pelo motor. Se um parametro altera o regime fisico, como atrito zero, fim de curso, perda de contato, colisao, saturacao de forca ou limite geometricamente impossivel, o motor deve mudar o sample e a cena deve mostrar essa mudanca.

## Escopo obrigatorio

Este guia e gate de pronto para qualquer task que crie, altere, revise ou promova uma simulacao. A task so pode ser considerada concluida quando registrar que o checklist abaixo foi aplicado ou quando justificar explicitamente que um item nao se aplica ao modelo declarado.

Isso vale para:

- simulacoes novas;
- simulacoes `available` alteradas por parametro, fixture, motor, renderer, graficos, tabela, formulas, teoria ou warnings;
- promocao de status `planned` ou `scaffolded` para `available`;
- refactors de motor ou renderer que possam mudar samples, trajetorias, vetores ou leituras exibidas;
- revisoes retroativas de simulacoes ja entregues.

## Checklist de auditoria

Para cada simulacao funcional, conferir:

- Parametros: todo controle fisico declara unidade, minimo, maximo, passo e valor padrao. Valores fisicamente validos como `mu = 0`, velocidade inicial zero ou forca aplicada zero nao devem ser bloqueados por conveniencia visual.
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

1. Auditar parametros e permitir zeros fisicamente validos.
2. Listar regimes fisicos possiveis e limites de transicao.
3. Garantir que o motor gera samples diferentes para cada regime.
4. Ajustar renderer para desenhar o sample real e uma referencia ideal apenas quando for didatico.
5. Atualizar formulas, teoria, limites e warnings.
6. Adicionar testes unitarios para o regime nominal e para pelo menos um limite.
7. Registrar no `progress.md` ou na trilha da task quais regimes/limites foram conferidos.
8. Rodar build, testes, lint e smoke visual quando houver cena.

Nenhuma nova simulacao deve ser promovida para `available`, nem permanecer como `available` apos mudanca relevante, sem passar por este guia. As simulacoes ja `available` devem ser revisitadas com este guia antes de novas promocoes amplas do catalogo.
