# Onda em corda

Esta simulacao usa uma onda senoidal 1D ideal:

$$
y(x,t)=A\sin(kx-\omega t+\phi)
$$

O deslocamento \(y\), a velocidade transversal \(v_y\), a aceleracao transversal \(a_y\) e a velocidade de propagacao \(v=\lambda f\) sao calculados no motor e consumidos pelo probe, pela corda desenhada, pelos graficos, pela tabela e pelo guia de formulas.

## Como ler a cena

- A linha teal e o perfil instantaneo da corda.
- O marcador mostra o probe usado pelos graficos e pela tabela.
- A velocidade de propagacao acompanha as cristas horizontalmente; a velocidade transversal descreve o movimento local da corda para cima e para baixo.
- Amplitude zero mantem a corda reta. Frequencia zero congela o perfil.

## Limites declarados no fixture

- O meio e ideal, sem reflexao nas extremidades, amortecimento, dispersao ou mudanca de tensao.
- A velocidade de onda e \(v=\lambda f\), nao \(v=\sqrt{T/\mu}\) nesta primeira fatia.
- A cena chama o helper fisico do motor para desenhar o perfil espacial; ela nao cria uma onda paralela.
