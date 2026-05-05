# Hidrostatica e empuxo

Em um fluido em repouso, a pressao aumenta com a profundidade segundo `p = rho g h`. Essa pressao atua em todas as direcoes, mas a diferenca entre as pressoes na parte inferior e superior de um corpo produz uma resultante vertical para cima: o empuxo.

Pelo principio de Arquimedes, o empuxo e igual ao peso do fluido deslocado. Nesta simulacao a massa e o volume da esfera definem a densidade media `rho_corpo = m / V`: aumentar massa com o mesmo volume aumenta o peso e favorece a descida; aumentar volume com a mesma massa aumenta o raio visual, reduz a densidade media e favorece a subida.

A cena mostra uma esfera em um tanque transparente fixo e grande o suficiente para a faixa de volumes do controle. O motor calcula raio a partir do volume, volume submerso da esfera, empuxo, peso, resultante vertical e aceleracao; mudar volume altera a esfera e a fisica, nao o tamanho da caixa ou do liquido. A posicao vertical do sample segue uma aproximacao didatica: flutuacao sobe amortecida ate a fracao submersa de equilibrio; afundamento acelera para baixo ate o fundo do tanque.

## Regimes

- Flutuacao: `rho_corpo = m/V < rho_fluido`, com empuxo igual ao peso no equilibrio e fracao submersa calculada pelo volume de calota esferica.
- Submersao neutra: densidades proximas, resultante vertical pequena.
- Afundamento: peso maior que empuxo maximo, com warning de regime, velocidade vertical descendente e contato ideal com o fundo.

## Limites do modelo

O fluido e incompressivel, homogeneo e estatico. O corpo usa densidade media e volume unico, sem estabilidade de atitude, viscosidade, arrasto, ondas de superficie ou impacto elastico com o fundo.
