# Massa-mola vertical

Um sistema massa-mola vertical e um oscilador harmonico em que a gravidade desloca a posicao de repouso. A mola fica presa a um suporte fixo e a esfera oscila para cima e para baixo em torno do equilibrio estatico.

## Modelo declarado

A coordenada principal `x` e medida a partir do equilibrio estatico, com sentido positivo para baixo. A deformacao total da mola e:

```math
\Delta\ell = \frac{mg}{k} + x
```

Como `mg/k` ja foi absorvido no equilibrio, a equacao dinamica usada no motor e:

```math
\ddot{x} + b\dot{x} + \frac{k}{m}x = 0
```

Quando `b = 0`, o movimento e ideal e a energia mecanica do oscilador permanece constante. Quando `b > 0`, o sample acumula energia dissipada e a amplitude decai.

## Leituras sincronizadas

- A esfera, a mola helicoidal, os vetores, graficos e tabela usam o mesmo `KinematicsSample`.
- `positionMeters` e o deslocamento em relacao ao equilibrio.
- `zMeters` posiciona a esfera na cena com eixo Z vertical.
- `secondaryRadiusMeters` registra o deslocamento estatico `mg/k`.
- `springForceNewtons`, `weightNewtons` e `netForceNewtons` alimentam vetores e grafico de forcas.
- `kineticEnergyJoules`, `potentialEnergyJoules`, `elasticPotentialEnergyJoules`, `gravitationalPotentialEnergyJoules`, `thermalEnergyJoules` e `totalEnergyJoules` alimentam o grafico de energia.

## Periodo ideal

No regime ideal sem amortecimento:

```math
T = 2\pi\sqrt{\frac{m}{k}}
```

A gravidade nao muda esse periodo quando medimos o movimento a partir do equilibrio; ela muda apenas a posicao onde a esfera fica em repouso.

## Limites declarados no fixture

- A mola e ideal, linear e sem massa propria.
- O movimento e vertical e unidimensional.
- O suporte superior permanece fixo.
- O amortecimento e linear na velocidade.
- Nao ha fim de curso, contato com suporte, resistencia do ar turbulenta, plasticidade ou oscilacao lateral.

## Checklist de fidelidade aplicado

- Parametros fisicos e runtime possuem unidade, faixa, passo e tooltip de ajuda.
- O caso `dampingPerSecond = 0` e valido e conserva a energia do oscilador.
- A velocidade inicial zero tambem e valida.
- Cena, graficos, tabela, formulas e vetores leem os mesmos samples.
- O warning `SPRING_DAMPING_ACTIVE` aparece quando o amortecimento transforma energia mecanica em dissipacao didatica.
