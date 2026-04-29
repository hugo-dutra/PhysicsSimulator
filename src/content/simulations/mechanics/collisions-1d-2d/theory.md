# Colisoes 1D e 2D

Esta simulacao trata dois corpos como particulas que se movem livres ate o contato. No instante da colisao, o motor aplica um impulso normal e conserva o momento linear total do sistema isolado.

O coeficiente de restituicao controla a velocidade relativa depois do impacto:

$$
e=-\frac{v'_{2n}-v'_{1n}}{v_{2n}-v_{1n}}
$$

Quando \(e=1\), a colisao e elastica no eixo normal e a energia cinetica total e preservada. Quando \(0 \le e < 1\), o momento linear continua conservado, mas parte da energia cinetica normal vira energia interna nao detalhada.

## Como interpretar

- As componentes normais mudam no contato.
- As componentes tangenciais permanecem constantes porque o modelo nao inclui atrito de contato.
- O grafico de momento deve permanecer constante antes e depois do contato.
- O impulso aparece apenas depois que a distancia entre os centros chega ao contato didatico.

## Limites do modelo

- Os corpos nao deformam e nao giram.
- Nao ha atrito tangencial, som, calor detalhado nem contato prolongado.
- Se os corpos nao se aproximam o suficiente dentro do ciclo, o motor mostra movimento livre e emite warning.
- O modelo e adequado para comparar momento, impulso e energia em poucas particulas, nao para empilhamentos ou muitas colisoes simultaneas.
