# Rolamento sem escorregamento

O modelo descreve uma roda ideal, aproximada por cilindro solido, descendo um plano inclinado. Quando o contato tem atrito estatico suficiente, o centro da roda translada e a roda gira obedecendo `v = omega R`.

No rolamento puro, o atrito estatico nao dissipa energia: ele ajusta o torque necessario para converter parte da energia potencial em energia cinetica rotacional. A aceleracao fica menor que a de um bloco deslizando sem atrito, porque a energia tambem alimenta a rotacao.

Se o atrito requerido supera o limite `mu N`, a simulacao entra em regime didatico de escorregamento. Nesse caso a restricao `v = omega R` deixa de valer como igualdade e o modelo registra dissipacao acumulada.

## Regimes

- Rolamento puro: `gripRatio <= 1`, com `v = omega R`.
- Limite de aderencia: `gripRatio` perto de 1, sensivel a angulo e coeficiente de atrito.
- Escorregamento: `gripRatio > 1`, com warning e energia dissipada.

## Limites do modelo

A roda nao deforma, o trilho e reto, o momento de inercia e fixado como `I = 1/2 m R^2`, e nao ha arrasto do ar. O escorregamento e aproximado para fins didaticos, sem modelar contato real de pneu.
