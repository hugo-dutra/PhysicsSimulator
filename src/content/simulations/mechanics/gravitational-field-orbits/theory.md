# Campo gravitacional e orbitas

Esta simulacao usa um campo central ideal para relacionar massa central, raio orbital, velocidade, energia e forca gravitacional. A intensidade do campo cai com o quadrado da distancia: `g = GM/r^2`.

Para uma orbita circular ou eliptica didatica, o motor resolve a anomalia excentrica de Kepler em amostras de tempo uniforme. A posicao vem da anomalia verdadeira, a velocidade vem das componentes radial e transversal, e a rapidez orbital e conferida pela equacao vis-viva. Por isso o corpo acelera no periastro, desacelera no apoastro e permanece submetido a uma forca central apontando para a massa principal.

A lei dos periodos aparece em `T^2/a^3 = 4 pi^2/(GM)`: aumentar o semi-eixo maior alonga o periodo, enquanto aumentar a massa central encurta o periodo. A lei das areas aparece em `dA/dt = h/2`: a velocidade angular nao e constante em uma elipse, mas a taxa areolar se mantem constante quando nao ha torque externo.

A cena mostra uma leitura Sol-planeta-lua: o corpo central fica fixo na origem, o planeta segue a orbita kepleriana calculada, e a lua e um satelite didatico derivado do mesmo sample para facilitar a leitura visual. Essa lua nao adiciona uma perturbacao de tres corpos; ela apenas acompanha o planeta como marcador secundario, com velocidade relativa propria e independente da velocidade kepleriana instantanea que varia com a excentricidade.

## Regimes

- Orbita quase circular: excentricidade pequena, campo e velocidade variam pouco.
- Orbita eliptica: excentricidade moderada, velocidade aumenta perto do periastro.
- Excentricidade alta: a simulacao emite warning porque o modelo visual e introdutorio.
- Tempo compactado: o controle `Tempo orbital exibido` acelera a passagem do tempo do modelo no playback para tornar a orbita visivel sem alterar campo, energia, forca ou formulas.

## Limites do modelo

O modelo ignora atmosfera, arrasto, achatamento do planeta, propulsao, mare e perturbacoes de outros corpos. A lua visual nao altera a orbita principal. A elipse segue as leis keplerianas do problema ideal de dois corpos, suficiente para comparar campo, velocidade, periodo, areas e energia, mas nao substitui um propagador orbital astronomico.
