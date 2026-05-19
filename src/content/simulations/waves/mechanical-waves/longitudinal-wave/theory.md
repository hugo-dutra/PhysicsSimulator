# Onda longitudinal em mola

Esta simulacao mostra uma onda longitudinal ideal em uma mola. Cada elo oscila para frente e para tras no mesmo eixo em que a perturbacao se propaga. Por isso a cena desenha a mola na diagonal do plano, com regioes de compressao e rarefacao viajando paralelas ao eixo da mola.

## Modelo

O deslocamento longitudinal local e

$$
\xi(x,t)=A\sin(kx-\omega t+\phi)
$$

em que `A` e a amplitude longitudinal, `k=2\pi/\lambda`, `\omega=2\pi f` e `\phi` e a fase inicial. O probe da interface le um unico elo da mola, e os graficos, tabela, vetores e formulas usam esse mesmo sample.

No modo `Mola elastica`, a velocidade de propagacao usa a rigidez longitudinal efetiva `C` e a densidade linear `\mu`:

$$
v=\sqrt{C/\mu}, \quad \lambda=v/f
$$

No modo `lambda vezes f`, a velocidade e calculada diretamente por `v=\lambda f`.

## Compressao

A compressao relativa local vem do gradiente espacial do deslocamento:

$$
\epsilon=-\frac{\partial \xi}{\partial x}
$$

O sinal positivo indica espiras se aproximando; sinal negativo indica rarefacao. A forca elastica didatica exibida no vetor e no grafico e

$$
F_x=C\epsilon
$$

## Como ler a cena

- Espiras mais proximas indicam compressao.
- Espiras mais afastadas indicam rarefacao.
- O controle `Voltas da mola` altera apenas quantas espiras sao desenhadas, ajudando a inspecionar a compressao visual sem mudar os samples fisicos.
- O marcador do probe acompanha o elo selecionado e oscila ao longo do eixo da mola.
- O vetor `v_onda` mostra a propagacao da frente de compressao; os vetores `dx`, `v_x` e `a_x` mostram o movimento local do elo.

## Limites

O modelo e senoidal, 1D e linear. Ele nao inclui perdas, reflexoes nas extremidades, dispersao real de uma mola fisica, atrito interno nem choque entre espiras. Amplitude zero e frequencia zero sao casos validos: a primeira remove a perturbacao, e a segunda congela o perfil espacial.
