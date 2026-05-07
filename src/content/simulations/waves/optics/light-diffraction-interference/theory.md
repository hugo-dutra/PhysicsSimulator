# Difracao e interferencia da luz

O padrao da tela combina difracao por largura de fenda e interferencia entre fendas coerentes. Para pequenos angulos, a separacao entre franjas fica aproximadamente:

```math
\Delta y\approx\frac{L\lambda}{d}
```

A envoltoria de uma fenda e:

```math
I_{env}=\left(\frac{\sin\beta}{\beta}\right)^2,\qquad
\beta=\frac{\pi a\sin\theta}{\lambda}
```

Para `N` fendas igualmente espacadas, o termo de interferencia usado pelo motor e:

```math
I=I_0I_{env}\left(\frac{\sin(N\alpha)}{N\sin\alpha}\right)^2,\qquad
\alpha=\frac{\pi d\sin\theta}{\lambda}
```

## Como interpretar

- Aumentar o comprimento de onda abre as franjas e tambem muda a cor da luz na cena.
- Aumentar a separacao entre fendas aproxima os maximos de interferencia.
- Aumentar a largura da fenda estreita a envoltoria central.
- Aumentar `N` deixa os maximos principais mais estreitos e mais seletivos.
- O detector lateral faz uma varredura pequena na tela para alimentar graficos e tabela sem desacoplar o padrao renderizado.

## Limites declarados no fixture

- Modelo escalar de Fraunhofer para luz monocromatica.
- Sem polarizacao, coerencia parcial, campo proximo ou resposta espectral real da tela.
- A tela 3D e uma amostragem didatica da funcao de intensidade normalizada.
