# Torque, alavancas e centro de massa

O torque mede a tendencia de uma forca fazer o corpo girar em torno de um apoio:

$$
\tau = rF\sin\phi
$$

Nesta simulacao, pesos pontuais atuam nos bracos esquerdo e direito da alavanca, e uma forca externa opcional atua no braco informado. A condicao de equilibrio rotacional e:

$$
\sum \tau = 0
$$

O centro de massa ao longo da barra ajuda a antecipar o lado dominante:

$$
x_{cm}=\frac{\sum m_i x_i}{\sum m_i}
$$

## Como interpretar

- Torque positivo e negativo indicam sentidos opostos de giro em torno do apoio.
- Forca aplicada igual a zero e valida; a alavanca passa a depender so dos pesos.
- O angulo da barra na cena e uma indicacao didatica do sinal do torque resultante.

## Limites do modelo

- A barra e rigida, leve e apoiada em um ponto fixo.
- As massas sao pontuais e a gravidade e uniforme.
- O apoio fornece a reacao necessaria; a simulacao foca na soma de torques.
- Nao ha flexao, atrito no apoio, deformacao ou dinamica estrutural.
