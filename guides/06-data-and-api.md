# Data And API

## Entidades principais

- `KnowledgeArea`: area principal como Mecanica, Termodinamica, Oscilacoes e Ondas ou Eletromagnetismo.
- `SimulationTopicPath`: caminho hierarquico como `Mecanica > Cinematica > Lancamento obliquo`.
- `SimulationDefinition`: metadados, area, status, parametros, renderizador, graficos e teoria.
- `SimulationTechnologyPlan`: motor, renderer, bibliotecas opcionais e estrategia de graficos/conteudo esperados.
- `SimulationParameter`: nome, unidade, tipo, minimo, maximo, passo e valor padrao.
- `SimulationRuntimeParameter`: controle de runtime com o mesmo formato de parametro, para duracao do ciclo, janela de grafico e outros ajustes nao fisicos.
- `SimulationPreset`: conjunto nomeado de parametros para demonstracao.
- `SimulationState`: estado instantaneo do sistema fisico.
- `SimulationSample`: amostra derivada para graficos e tabela.
- `VectorOverlay`: vetor exibido na cena, como peso, tensao ou velocidade.
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

Usar MDX/Markdown local para:

- apendice teorico;
- formulas com KaTeX;
- explicacao de quando usar cada formula;
- limites do modelo.

O estado fisico, samples, graficos e tabela devem ser gerados pelo motor numerico em runtime.

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
          "status": "planned",
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

- `SidebarCatalog`: areas, subareas, simulacoes e status.
- `SimulationViewModel`: parametros, valores atuais, playback e layout.
- `ChartViewModel`: series prontas para o adapter de grafico escolhido (Plotly.js, canvas ou SVG), com recorte movel dos ultimos N segundos quando configurado.
- `TableViewModel`: amostras paginadas ou recortadas pela mesma janela temporal visivel.
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
