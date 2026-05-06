# Oscilador forcado e ressonancia

O oscilador forcado adiciona uma forca periodica ao sistema massa-mola amortecido. A cena mostra a massa, a mola, a forca externa, a forca elastica e o amortecimento usando a mesma timeline numerica que alimenta graficos e tabela.

O modelo integrado e:

$$
\ddot{x} + \gamma\dot{x} + \omega_0^2x =
\frac{F_0}{m}\cos(\omega t)
$$

com:

$$
\omega_0 = \sqrt{\frac{k}{m}}
$$

Quando a frequencia externa $\omega$ fica perto de $\omega_0$, a resposta cresce ate o amortecimento equilibrar a energia injetada. Fora dessa faixa, a amplitude tende a ser menor e a fase muda conforme a excitacao fica abaixo ou acima da frequencia natural.

## Trabalho e energia

A forca externa pode injetar ou retirar energia:

$$
P = F(t)v,
\qquad
W = \int P\,dt
$$

Quando $F(t)$ e $v$ tem o mesmo sinal, o trabalho acumulado cresce. Quando ficam em sinais opostos, a forca retira energia do oscilador. O amortecimento converte parte dessa energia mecanica em dissipacao acumulada no sample.

## Limites do modelo

- Integrador RK4 deterministico para uma mola linear e forca senoidal.
- Sem saturacao de atuador, batente, atrito seco ou mola nao linear.
- Com amortecimento zero e excitacao exatamente natural, a amplitude ideal pode crescer sem limite dentro do horizonte calculado.
- `FORCED_OSCILLATOR_NEAR_RESONANCE` aparece quando a frequencia externa esta perto da frequencia natural.
