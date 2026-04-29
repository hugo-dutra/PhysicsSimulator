# Data And API

## Entidades principais

- `KnowledgeArea`: area principal como Mecanica, Termodinamica, Oscilacoes e Ondas ou Eletromagnetismo.
- `SimulationTopicPath`: caminho hierarquico como `Mecanica > Cinematica > Lancamento obliquo`.
- `SimulationDefinition`: metadados, area, status, parametros, renderizador, graficos e teoria.
- `SimulationTechnologyPlan`: motor, renderer, bibliotecas opcionais e estrategia de graficos/conteudo esperados.
- `SimulationParameter`: nome, unidade, tipo, minimo, maximo, passo e valor padrao.
- `SimulationRuntimeParameter`: controle de runtime com o mesmo formato de parametro, para duracao do ciclo, janela de grafico e outros ajustes nao fisicos.
- `SimulationPreset`: conjunto nomeado de parametros para demonstracao.
- `SimulationRegime`: regime fisico declarado, com condicao de validade, limite de transicao, campos de sample afetados e warning associado quando houver troca de regime.
- `SimulationState`: estado instantaneo do sistema fisico.
- `SimulationSample`: amostra derivada para graficos e tabela, incluindo cinematicas calculadas pelo motor quando forem exibidas.
- `VectorOverlay`: vetor exibido na cena, como peso, tensao ou velocidade, acompanhado por cor, rotulo, modulo atual, unidade abreviada quando houver e metadados suficientes para legenda.
- `ChartSeries`: serie derivada dos samples.
- `FormulaReference`: formula usada pela simulacao, com variaveis, unidades, condicoes de uso e relacao com parametros/samples.
- `TheoryAppendix`: conteudo teorico em MDX/Markdown.

## Dados mockados/fixtureados da fase core

Usar JSON local para:

- catalogo de areas;
- subareas e caminhos de topico;
- simulacoes disponiveis;
- simulacoes planejadas;
- status das simulacoes;
- parametros default;
- parametros de runtime, como duracao do ciclo e janela temporal dos graficos;
- presets;
- formulas e metadados de uso;
- textos curtos de descricao.

O fixture `fixtures/simulations/catalog.json` deve listar todo o catalogo curricular planejado em `09-simulation-catalog-plan.md`. A UI deriva dele a sidebar hierarquica por `area > subarea > simulacao`; apenas itens com `status: "available"` podem parecer selecionaveis como simulacoes prontas. No estado atual da Fase 3, `simple-pendulum`, `inclined-plane-friction`, `uniform-linear-motion`, `uniformly-accelerated-motion`, `projectile-motion`, `uniform-circular-motion`, `atwood-machine`, `centripetal-force-curve` e `work-energy-track` sao `available`; os demais permanecem `planned` ate terem motor, cena, graficos, tabela, formulas e teoria.

Usar MDX/Markdown local para:

- apendice teorico;
- formulas com KaTeX;
- explicacao de quando usar cada formula;
- limites do modelo.

O estado fisico, samples, graficos e tabela devem ser gerados pelo motor numerico ou analitico em runtime. No pendulo simples, o sample tambem carrega velocidade linear tangencial, aceleracao angular, aceleracao tangencial, aceleracao radial e modulo total de aceleracao para manter graficos, tabela, metricas, formulas e legenda sincronizados. No plano inclinado com atrito, o sample carrega posicao no plano, velocidade, aceleracao, altura, coordenadas da cena, normal, componente paralela do peso, atrito, resultante, energia cinetica, potencial, termica e total. Nas simulacoes analiticas compartilhadas, o sample comum carrega posicao, deslocamento, coordenadas `x/z`, componentes de velocidade/aceleracao, rapidez, energia e campos especificos como angulo, periodo, frequencia, aceleracao centripeta, tensao, forca centripeta, atrito maximo, trabalho aplicado e dissipacao quando aplicavel. Quando houver perda de restricao, como falta de aderencia em curva, as coordenadas `x/z` devem representar a trajetoria real calculada, enquanto campos de demanda ideal permanecem disponiveis para comparacao em graficos e formulas.

Toda simulacao nova ou alterada deve passar pelo `Simulation Fidelity Adjustment Guide` antes de mudar status para `available`. Se o modelo tiver regimes, o contrato local precisa declarar como reconhecer o regime nominal, os limites de transicao, quais campos do `SimulationSample` mudam, quais graficos comparam demanda/limite/valor real e qual `SimulationWarning` explica o regime aplicado. Se o modelo for ideal e sem troca de regime, essa ausencia tambem deve aparecer nos limites do fixture e no apendice teorico.

## Exemplo conceitual de catalogo

```json
{
  "areas": [
    {
      "id": "mechanics",
      "label": "Mecanica",
      "simulations": [
        {
          "id": "simple-pendulum",
          "label": "Pendulo simples",
          "topicPath": ["Mecanica", "Oscilacoes", "Pendulo simples"],
          "status": "available",
          "level": "introductory",
          "modelKind": "numerical",
          "renderer": "three"
        },
        {
          "id": "projectile-motion",
          "label": "Lancamento obliquo",
          "topicPath": ["Mecanica", "Cinematica", "Lancamento obliquo"],
          "status": "available",
          "level": "introductory",
          "modelKind": "analytic",
          "renderer": "three"
        }
      ]
    }
  ]
}
```

## Dados persistidos depois da prova core

Persistencia so deve entrar depois da Fase 1. Possiveis dados futuros:

- parametros favoritos;
- snapshots de simulacao;
- configuracoes de UI;
- progresso de aula;
- conteudo de professor;
- colecoes de simulacoes.

## Read models

- `SidebarCatalog`: areas, subareas, simulacoes e status, derivado de `topicPath` para alimentar menus expansiveis.
- `SimulationViewModel`: parametros, valores atuais, playback e layout.
- `ChartViewModel`: series prontas para o adapter de grafico escolhido (Plotly.js, canvas ou SVG), com recorte movel dos ultimos N segundos quando configurado.
- `TableViewModel`: amostras paginadas ou recortadas pela mesma janela temporal visivel.
- `VectorLegendViewModel`: cor, rotulo, unidade abreviada quando houver, modulo atual e leitura fisica dos vetores ativos na cena; tambem alimenta a legenda compacta sobreposta a area de animacao.
- `FormulaGuideViewModel`: formulas renderizaveis, variaveis, unidades, uso indicado e links para parametros/samples.
- `TheoryViewModel`: conteudo teorico associado a simulacao.

## Fronteiras de dados

- Dados de produto: catalogo, simulacoes, presets, formulas e teoria.
- Dados de runtime: estado atual, timeline, samples e overlays.
- Dados de usuario: configuracoes e favoritos futuros.
- Dados de analytics: eventos futuros, fora do MVP.
- Dados operacionais: erros e performance, minimo na fase core.

## Migracao de mock para dados reais

1. Manter o contrato JSON local durante o core.
2. Quando houver multiplas simulacoes, estabilizar `SimulationDefinition`.
3. Quando o catalogo planejado crescer, manter `planned` separado de `available`.
4. Se conteudo crescer, considerar carregamento estatico ou CMS simples.
5. So introduzir API remota quando houver necessidade de edicao, colaboracao ou persistencia multi-dispositivo.
