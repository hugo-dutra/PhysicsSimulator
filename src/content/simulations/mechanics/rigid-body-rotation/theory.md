# Rotacao de corpo rigido

Para um corpo rigido girando em torno de eixo fixo, a segunda lei rotacional e:

$$
\tau = I\alpha
$$

O momento de inercia \(I\) mede a resistencia a mudanca de velocidade angular. Com torque constante e sem amortecimento:

$$
\omega(t)=\omega_0+\alpha t
$$

$$
\theta(t)=\theta_0+\omega_0t+\frac{1}{2}\alpha t^2
$$

Quando o amortecimento angular esta ativo, o motor usa uma solucao exponencial simples em que a aceleracao efetiva depende de \(\omega\). A energia cinetica rotacional e:

$$
K_{rot}=\frac{1}{2}I\omega^2
$$

## Como interpretar

- Aumentar \(I\) reduz a aceleracao angular para o mesmo torque.
- Torque zero e valido; o corpo gira livremente se \(\omega_0\) nao for zero.
- Amortecimento positivo reduz a velocidade angular e registra dissipacao didatica.

## Limites do modelo

- O eixo e fixo e o corpo nao translada.
- O corpo nao deforma e nao muda seu momento de inercia.
- O amortecimento e linear em \(\omega\), nao um modelo real de rolamento ou fluido.
- A cena representa uma barra rigida simples para tornar o giro legivel.
