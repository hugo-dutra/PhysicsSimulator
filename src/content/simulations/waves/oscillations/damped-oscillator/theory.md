# Oscilador amortecido

O oscilador amortecido mostra como uma massa ligada a uma mola retorna ao equilibrio quando existe uma perda proporcional a velocidade. A coordenada $x$ e medida a partir do equilibrio: positiva para baixo na cena, com a mola desenhada a partir do mesmo sample usado por graficos, tabela e formulas.

O modelo usado e:

$$
\ddot{x} + \gamma\dot{x} + \omega_0^2 x = 0,
\qquad
\omega_0 = \sqrt{\frac{k}{m}}
$$

O parametro de amortecimento $\gamma$ separa quatro leituras didaticas:

- $\gamma = 0$: movimento ideal, energia mecanica constante.
- $0 < \gamma < 2\omega_0$: subamortecido, ainda cruza o equilibrio enquanto a amplitude decai.
- $\gamma = 2\omega_0$: amortecimento critico, retorno mais rapido sem oscilacao.
- $\gamma > 2\omega_0$: superamortecido, retorno sem oscilacao e mais lento que o critico.

## Energia

A energia rastreada soma energia cinetica, potencial elastica e dissipacao acumulada:

$$
E = K + U + E_t
$$

Quando o amortecimento esta ativo, $K + U$ diminui e $E_t$ aumenta. Isso nao e uma simulacao termica detalhada; e uma conta didatica de para onde a energia mecanica foi no modelo linear.

## Limites do modelo

- Mola ideal, massa pontual e movimento unidimensional.
- Amortecimento linear, sem atrito seco ou resistencia turbulenta.
- Sem fim de curso, batente, deformacao plastica ou massa da mola.
- `OSCILLATOR_UNDERDAMPED`, `OSCILLATOR_CRITICAL_DAMPING` e `OSCILLATOR_OVERDAMPED` indicam o regime calculado pelos parametros atuais.
