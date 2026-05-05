# Rotacao de corpo rigido

Para um corpo rigido girando em torno de eixo fixo, a segunda lei rotacional e:

$$
\tau = I\alpha
$$

O momento de inercia \(I\) mede a resistencia a mudanca de velocidade angular. Nesta cena, a esfera na barra e uma massa movel didatica:

$$
I = I_{base} + m r^2
$$

A distancia \(r\) e a massa \(m\) da esfera sao controles independentes. Aumentar \(m\) aumenta a contribuicao \(m r^2\), desloca mais o centro de massa para a esfera e torna a mudanca de \(\omega\) mais forte quando o sistema conserva \(L\) ou \(K_{rot}\). Com \(m = 0\), a esfera movel deixa de contribuir para \(I\).

Aproximar a massa do eixo reduz \(I\), move o centro de massa para perto do pivo e, quando torque e amortecimento estao zerados, conserva:

$$
L = I\omega
$$

Por isso, para o mesmo \(L\), reduzir \(I\) aumenta \(\omega\). Com torque constante e sem amortecimento:

$$
\omega(t)=\omega_0+\alpha t
$$

$$
\theta(t)=\theta_0+\omega_0t+\frac{1}{2}\alpha t^2
$$

O controle de energia constante troca para um regime em que a energia cinetica rotacional da velocidade angular de referencia fica fixa:

$$
K_{rot}=K_0
$$

$$
\omega=\operatorname{sgn}(\omega_0)\sqrt{\frac{2K_0}{I}}
$$

Nesse modo, \(L = I\omega\) varia quando a massa movel muda \(I\), mas \(K_{rot}\) permanece igual ao valor definido pela velocidade angular inicial de referencia. Se a massa se aproxima do eixo, \(I\) diminui e \(\omega\) aumenta; se a massa se afasta, \(I\) aumenta e \(\omega\) diminui.

Quando o amortecimento angular esta ativo, o motor usa uma solucao exponencial simples em que a aceleracao efetiva depende de \(\omega\). A energia cinetica rotacional e:

$$
K_{rot}=\frac{1}{2}I\omega^2
$$

## Como interpretar

- Aumentar \(I\) reduz a aceleracao angular para o mesmo torque.
- Aproximar a massa movel do eixo reduz \(I\) e aumenta \(\omega\) quando \(L\) e mantido.
- Aumentar a massa movel aumenta a sensibilidade de \(I\), centro de massa e \(\omega\) a distancia radial escolhida.
- Ligar energia constante conserva \(K_{rot}\), entao aproximar a massa reduz \(I\), aumenta \(\omega\) e reduz \(L\) em relacao ao caso externo com maior inercia.
- Torque zero e valido; o corpo gira livremente se \(\omega_0\) nao for zero.
- Amortecimento positivo reduz a velocidade angular e registra dissipacao didatica.
- O vetor axial de momento angular \(L\) aparece perpendicular ao plano de giro; momento de inercia e escalar.

## Limites do modelo

- O eixo e fixo e o corpo nao translada.
- O corpo nao deforma; a mudanca de \(I\) representa uma massa movel radial idealizada.
- Energia constante e um modo de comparacao ideal; nao e conservacao de momento angular de um sistema isolado.
- O amortecimento e linear em \(\omega\), nao um modelo real de rolamento ou fluido.
- A cena representa uma barra rigida simples para tornar o giro legivel.
