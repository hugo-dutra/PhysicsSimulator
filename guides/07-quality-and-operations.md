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
- Testes de invariantes fisicos dentro do modelo declarado.
- Testes de validacao de parametros e unidades.
- Testes de geracao de samples para graficos e tabela.
- Testes de consistencia entre formulas documentadas, parametros e dados gerados.
- Testes de contrato para `SimulationDefinition`.
- Smoke test da tela principal abrindo o pendulo.

## Criterio de qualidade para novas simulacoes

Depois da prova do core, cada nova simulacao promovida para `available` deve ter:

- testes unitarios do modelo fisico ou solucao analitica;
- teste de parametros, unidades e limites do modelo;
- verificacao de que graficos, tabela, cena e formulas usam os mesmos samples;
- smoke test de abertura pelo catalogo;
- revisao do apendice teorico e do guia de formulas;
- checagem visual proporcional ao renderer usado.

## Validacoes visuais

- Canvas nao pode estar em branco.
- Vetores devem acompanhar o movimento.
- Graficos devem atualizar quando parametros mudam.
- Formulas devem permanecer legiveis e indicar quando usar cada equacao.
- Layout nao deve quebrar em desktop comum.
- Controles devem permanecer legiveis no tema dark.

## Riscos operacionais

- Dependencias graficas podem aumentar bundle.
- Three.js + Plotly.js + MUI podem exigir cuidado de performance.
- WebGPU nao deve ser requisito inicial.
- Conteudo teorico e formulas podem ficar desatualizados se nao forem versionados junto da simulacao.

## Observabilidade minima

Na fase local:

- erros de parametro visiveis na UI;
- logs de erro no console durante desenvolvimento;
- mensagens claras quando uma simulacao estiver planejada;
- medicao simples de FPS ou frame time se a cena ficar pesada.

## Criterio de pronto por fase

Fase 1 esta pronta quando:

- o pendulo roda localmente;
- tests do motor numerico passam;
- build passa;
- smoke visual confirma canvas, controles, graficos, tabela e formulas;
- teoria explica o modelo implementado e quando usar cada formula.
