# Trabalho e energia em trilho

Esta simulacao usa uma rampa de skate em formato de U para comparar energia cinetica, energia potencial gravitacional, energia mecanica total e perda acumulada.

## Modelo usado

A guia da rampa e aproximada por uma parabola:

$$
h(x)=H\left(\frac{x}{a}\right)^2
$$

em que `H` e a altura das bordas e `a` e a meia largura da rampa. A energia potencial gravitacional vem dessa altura:

$$
U_g=mgh(x)
$$

A energia cinetica usa a rapidez tangencial na guia:

$$
K=\frac{1}{2}mv^2
$$

No regime sem perdas, a energia mecanica

$$
E=K+U_g
$$

permanece aproximadamente constante. Quando a perda por ciclo e maior que zero, o motor aplica um amortecimento equivalente e a energia mecanica total diminui. A parcela perdida acumulada e resumida por

$$
p=100\frac{E_0-E}{E_0}
$$

## Como interpretar

Com perda igual a `0%`, o corpo desce para o fundo do U convertendo `U_g` em `K` e sobe do outro lado convertendo `K` de volta em `U_g`. O grafico de energia total deve ficar praticamente horizontal.

Com perda maior que zero, a amplitude diminui ciclo apos ciclo. A energia perdida aparece como `E_perdida`, e o painel do viewport mostra o percentual acumulado para conferir se o regime dissipativo esta ativo.

O controle de altura relativa permite tres leituras didaticas: positivo solta o corpo acima da linha da rampa antes do contato, zero inicia na guia, e negativo usa uma energia inicial equivalente a um ponto mais baixo do U.

## Limites do modelo

A half-pipe real foi reduzida a uma parabola suave. O corpo e guiado como particula; rolamento, rotacao, perda de contato depois de entrar na guia, som, calor real e colisao com bordas nao entram no modelo. A perda percentual e um amortecimento energetico equivalente, util para comparar graficos, nao uma medida microscopica de atrito.
