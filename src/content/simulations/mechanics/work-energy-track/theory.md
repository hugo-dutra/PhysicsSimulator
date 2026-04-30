# Trabalho e energia em trilho

Esta simulacao usa um trilho reto inclinado para conectar trabalho, energia cinetica, energia potencial gravitacional e dissipacao por atrito em uma unica linha de tempo.

## Modelo usado

O trabalho de uma forca constante paralela ao movimento e

$$
W=F\Delta s
$$

A energia cinetica e

$$
K=\frac{1}{2}mv^2
$$

A energia potencial gravitacional e

$$
U_g=mgh
$$

Com atrito cinetico constante, a parcela termica didatica acumulada e

$$
E_{termica}=F_{at}\Delta s
$$

O grafico de energia mostra o balanco `K + U_g + E_termica - W_aplicado`, que deve permanecer aproximadamente constante enquanto o corpo nao atinge o limite visual.

## Como interpretar

Sem atrito e sem forca aplicada, a queda de energia potencial aparece como aumento de energia cinetica. Com atrito, parte dessa energia vai para a parcela termica. Com forca aplicada positiva, o trabalho externo injeta energia no sistema.

A cena mostra o trilho como uma bancada de laboratorio: o corpo acompanha a posicao calculada no sample, o rastro quente sobre o trilho cresce com `E_termica` e o painel compacto do viewport resume `K`, `U_g`, `E_termica`, `W_aplicado` e o saldo do balanco. Essas leituras sao as mesmas usadas nos graficos, na tabela e nas formulas.

## Limites do modelo

O trilho real foi reduzido a uma rampa reta. Nao ha rolamento, rotacao, deformacao, mola, curva real nem colisao resolvida no fim do trilho. A forca aplicada e o atrito permanecem constantes no trecho.
