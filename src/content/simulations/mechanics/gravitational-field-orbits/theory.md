# Campo gravitacional, órbitas e a malha do espaço-tempo

Esta simulação combina duas leituras complementares. A órbita é calculada por um campo gravitacional newtoniano central, enquanto a malha deformável funciona como uma analogia visual do potencial gravitacional. A malha ajuda a formar intuição, mas não é um tecido material existente no espaço e sua coordenada vertical não representa uma dimensão espacial literal.

## O modelo orbital

A intensidade do campo criado pela massa central é

$$
g=\frac{GM}{r^2}.
$$

O motor resolve a anomalia excêntrica de Kepler em amostras de tempo uniforme. A posição vem da anomalia verdadeira, as componentes radial e transversal determinam a velocidade, e a equação vis-viva confere a rapidez:

$$
v=\sqrt{GM\left(\frac{2}{r}-\frac{1}{a}\right)}.
$$

Por isso o planeta acelera no periastro, desacelera no apoastro e permanece submetido a uma força apontando para a massa central. A lei dos períodos, $T^2/a^3=4\pi^2/(GM)$, e a lei das áreas, $dA/dt=h/2$, continuam valendo no regime de dois corpos.

## O que a malha representa

O potencial gravitacional específico no ponto orbital é

$$
\Phi=-\frac{GM}{r}.
$$

Valores mais negativos indicam uma região mais profundamente ligada ao campo central. Para desenhar essa ideia, o renderer recebe do mesmo sample duas escalas: `spacetimeCentralDeformation` para o poço fixo e `spacetimeOrbitingDeformation` para o poço que acompanha o corpo orbital. A superfície visual superpõe dois perfis suaves:

$$
z_{malha}=-\frac{D_c}{1+(\rho/w_c)^2}-\frac{D_o}{1+(\rho_o/w_o)^2}.
$$

`Profundidade do tecido` multiplica os dois poços. `Amplificação do poço orbital` existe porque a deformação de uma massa pequena desapareceria na escala da massa central; ela é deliberadamente didática e nunca entra no cálculo de posição, velocidade, campo, força ou energia. Zerar uma dessas escalas achata apenas a representação correspondente.

`Alfa das linhas` controla somente a transparencia do wireframe entre 0 e 1. O valor padrao e 0,60 para manter o tecido sutil; ele nao muda a geometria dos pocos nem qualquer grandeza orbital.

## Corpos mostrados

A massa laranja permanece na origem. O planeta segue a elipse calculada e produz seu próprio poço móvel na malha. Uma lua didática acompanha o planeta para facilitar a leitura de hierarquia orbital, mas não perturba o problema principal nem contribui para a energia calculada.

## Regimes

- Órbita quase circular: a excentricidade é pequena e campo, potencial e velocidade variam pouco.
- Órbita elíptica: a velocidade e o módulo do potencial aumentam perto do periastro.
- Excentricidade alta: a solução de Kepler permanece ativa, mas aparece um aviso sobre os limites didáticos.
- Malha ativa: um poço fica preso ao centro e o outro acompanha exatamente `xMeters/zMeters` do planeta.
- Malha plana: escala visual zero remove a deformação sem trocar a fonte dos samples físicos.
- Tempo compactado: `Tempo orbital exibido` acelera a leitura dos mesmos samples, sem recalcular a física.

## Limites do modelo

O modelo ignora atmosfera, arrasto, achatamento do corpo central, propulsão, marés e perturbações de terceiros. A lua visual não altera a órbita principal. A malha não calcula a métrica de Schwarzschild, dilatação do tempo, lentes gravitacionais, ondas gravitacionais nem relatividade de muitos corpos. Ela é uma ponte visual para o potencial newtoniano, não um simulador relativístico profissional.
