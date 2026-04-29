# Colisoes 1D e 2D

Esta simulacao trata dois corpos como esferas rigidas didaticas. O corpo 2 inicia no centro da cena e o corpo 1 se aproxima; o contato acontece somente quando a distancia entre centros chega a soma dos raios:

$$
|\vec r_2-\vec r_1|=r_1+r_2
$$

No instante da colisao, o motor aplica um impulso normal e conserva o momento linear total do sistema isolado.

O coeficiente de restituicao controla a velocidade relativa depois do impacto:

$$
e=-\frac{v'_{2n}-v'_{1n}}{v_{2n}-v_{1n}}
$$

Quando \(e=1\), a colisao e elastica no eixo normal e a energia cinetica total e preservada. Quando \(0 \le e < 1\), o momento linear continua conservado, mas parte da energia cinetica normal vira energia interna nao detalhada.

## Como interpretar

- As componentes normais mudam no contato.
- As componentes tangenciais permanecem constantes porque o modelo nao inclui atrito de contato.
- O angulo de impacto obliquo desloca a linha de centros no contato; por isso, depois do impacto, as esferas podem sair em lados diferentes.
- O grafico de momento deve permanecer constante antes e depois do contato.
- O impulso aparece apenas depois que a distancia entre os centros chega a \(r_1+r_2\).

## Limites do modelo

- Os corpos nao deformam e nao giram.
- Nao ha atrito tangencial, som, calor detalhado nem contato prolongado.
- Se os corpos nao se aproximam o suficiente dentro do ciclo, o motor mostra movimento livre e emite warning.
- O modelo e adequado para comparar momento, impulso e energia em poucas particulas, nao para empilhamentos ou muitas colisoes simultaneas.
