# Data And API

## Entidades principais

- `KnowledgeArea`: area como Mecanica, Termodinamica, Fluidos, Eletricidade ou Magnetismo.
- `SimulationDefinition`: metadados, area, status, parametros, renderizador, graficos e teoria.
- `SimulationParameter`: nome, unidade, tipo, minimo, maximo, passo e valor padrao.
- `SimulationPreset`: conjunto nomeado de parametros para demonstracao.
- `SimulationState`: estado instantaneo do sistema fisico.
- `SimulationSample`: amostra derivada para graficos e tabela.
- `VectorOverlay`: vetor exibido na cena, como peso, tensao ou velocidade.
- `ChartSeries`: serie derivada dos samples.
- `TheoryAppendix`: conteudo teorico em MDX/Markdown.

## Dados mockados/fixtureados da fase core

Usar JSON local para:

- catalogo de areas;
- simulacoes disponiveis;
- status das simulacoes;
- parametros default;
- presets;
- textos curtos de descricao.

Usar MDX/Markdown local para:

- apendice teorico;
- formulas com KaTeX;
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
          "status": "available",
          "level": "introductory"
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

- `SidebarCatalog`: areas, simulacoes e status.
- `SimulationViewModel`: parametros, valores atuais, playback e layout.
- `ChartViewModel`: series prontas para Plotly.js.
- `TableViewModel`: amostras paginadas ou recortadas.
- `TheoryViewModel`: conteudo teorico associado a simulacao.

## Fronteiras de dados

- Dados de produto: catalogo, simulacoes, presets e teoria.
- Dados de runtime: estado atual, timeline, samples e overlays.
- Dados de usuario: configuracoes e favoritos futuros.
- Dados de analytics: eventos futuros, fora do MVP.
- Dados operacionais: erros e performance, minimo na fase core.

## Migracao de mock para dados reais

1. Manter o contrato JSON local durante o core.
2. Quando houver multiplas simulacoes, estabilizar `SimulationDefinition`.
3. Se conteudo crescer, considerar carregamento estatico ou CMS simples.
4. So introduzir API remota quando houver necessidade de edicao, colaboracao ou persistencia multi-dispositivo.
