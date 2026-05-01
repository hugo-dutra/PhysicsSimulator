# Campo gravitacional e orbitas

Esta simulacao usa um campo central ideal para relacionar massa central, raio orbital, velocidade, energia e forca gravitacional. A intensidade do campo cai com o quadrado da distancia: `g = GM/r^2`.

Para uma orbita circular ou eliptica didatica, a velocidade orbital e estimada pela equacao vis-viva. O satelite fica sempre submetido a uma forca central apontando para a massa principal, e essa forca sustenta a curvatura da trajetoria.

## Regimes

- Orbita quase circular: excentricidade pequena, campo e velocidade variam pouco.
- Orbita eliptica: excentricidade moderada, velocidade aumenta perto do periastro.
- Excentricidade alta: a simulacao emite warning porque o modelo visual e introdutorio.

## Limites do modelo

O modelo ignora atmosfera, arrasto, achatamento do planeta, propulsao, mare e perturbacoes de outros corpos. A elipse e uma parametrizacao didatica, suficiente para comparar campo, velocidade e energia, mas nao substitui um propagador orbital astronomico.
