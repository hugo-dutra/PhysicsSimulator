# Forca centripeta em curva

Em uma curva horizontal, a velocidade muda de direcao continuamente. Mesmo com rapidez constante, o corpo precisa de uma aceleracao radial apontando para o centro da curva.

## Modelo usado

A aceleracao centripeta e

$$
a_c=\frac{v^2}{r}
$$

A forca radial requerida e

$$
F_c=m\frac{v^2}{r}
$$

No modelo de pista horizontal, o atrito estatico e a forca lateral disponivel:

$$
F_{at,max}=\mu_s mg
$$

Quando `F_c` passa de `F_at,max`, o corpo nao consegue seguir o raio informado. A simulacao passa para um regime de perda de aderencia: a trajetoria real usa a aceleracao lateral maxima `a = mu_s g`, portanto abre para um raio maior que o raio da curva ideal. Se `mu_s = 0`, a aceleracao lateral e nula e o corpo sai pela tangente em linha reta.

## Como interpretar

Aumentar a velocidade pesa muito mais do que aumentar a massa, porque a forca centripeta cresce com `v^2`. Aumentar o raio reduz a demanda de forca. A velocidade critica ideal e `v_max = sqrt(mu_s g r)`. Abaixo desse limite, o corpo acompanha a curva; acima dele, a cena mostra a saida da curva em vez de manter uma orbita falsa.

## Limites do modelo

A curva e plana, o coeficiente de atrito e constante e o corpo e pontual. A perda de aderencia e um modelo didatico de raio efetivo maior, sem pneus reais, suspensao, arrasto, transferencia de carga, rotacao do corpo ou dissipacao tangencial de velocidade.
