# Hidrostatica e empuxo

Em um fluido em repouso, a pressao aumenta com a profundidade segundo `p = rho g h`. Essa pressao atua em todas as direcoes, mas a diferenca entre as pressoes na parte inferior e superior de um corpo produz uma resultante vertical para cima: o empuxo.

Pelo principio de Arquimedes, o empuxo e igual ao peso do fluido deslocado. Quando a densidade media do corpo e menor que a densidade do fluido, o corpo pode flutuar com apenas uma fracao do volume submersa. Quando a densidade do corpo e maior, o empuxo maximo nao basta para equilibrar o peso.

## Regimes

- Flutuacao: `rho_corpo < rho_fluido`, com empuxo igual ao peso no equilibrio.
- Submersao neutra: densidades proximas, resultante vertical pequena.
- Afundamento: peso maior que empuxo maximo, com warning de regime.

## Limites do modelo

O fluido e incompressivel, homogeneo e estatico. O corpo usa densidade media e volume unico, sem estabilidade de atitude, viscosidade, arrasto, ondas de superficie ou contato com o fundo.
