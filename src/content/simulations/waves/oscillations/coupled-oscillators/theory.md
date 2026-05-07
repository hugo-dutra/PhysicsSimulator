# Osciladores acoplados

Esta simulacao usa duas massas ligadas a molas verticais e conectadas por uma mola horizontal de acoplamento. O objetivo e mostrar, com a mesma fonte numerica, como posicao, velocidades, forcas, energia, graficos, tabela, formulas e cena 3D contam a mesma historia fisica: uma massa pode influenciar a outra por meio da mola central.

As coordenadas $x_A$ e $x_B$ sao deslocamentos verticais medidos a partir do equilibrio de cada massa, com sinal positivo para baixo. O peso aparece como vetor didatico na cena, mas o integrador resolve o movimento em torno do equilibrio estatico, onde peso e pre-carga das molas verticais ja se cancelaram.

## Equacoes do movimento

O motor usa integracao RK4 nas equacoes acopladas:

$$
m_A\ddot{x}_A = -k_Ax_A - k_c(x_A-x_B) - c\dot{x}_A
$$

$$
m_B\ddot{x}_B = -k_Bx_B - k_c(x_B-x_A) - c\dot{x}_B
$$

O termo $-k_Ax_A$ ou $-k_Bx_B$ vem da mola vertical de cada massa. O termo com $k_c$ mede quanto uma massa esta deslocada em relacao a outra; por isso a mola central e o canal de troca de energia. O termo $-c\dot{x}$ representa amortecimento viscoso quando o usuario ativa o modo amortecido.

## Modos normais

Quando as massas e as molas verticais sao iguais, dois movimentos ficam especialmente claros:

$$
\omega_+ = \sqrt{\frac{k}{m}}
$$

$$
\omega_- = \sqrt{\frac{k + 2k_c}{m}}
$$

No modo em fase, $x_A = x_B$. As massas sobem e descem juntas, a mola de acoplamento quase nao deforma e a energia fica pouco armazenada na mola central.

No modo em oposicao de fase, $x_A = -x_B$. Uma massa sobe enquanto a outra desce, a mola central deforma bastante e a frequencia aumenta porque o acoplamento tambem age como forca restauradora.

Com massas ou molas diferentes, o integrador continua valido, mas essas duas expressoes simples viram uma referencia didatica aproximada.

## Batimentos e energia

Quando apenas a Massa A comeca deslocada e a Massa B parte quase parada, as condicoes iniciais misturam os dois modos normais. O resultado e uma alternancia: a amplitude de A diminui enquanto B cresce, depois o processo se inverte. Isso e o batimento por transferencia de energia.

A energia mecanica exibida e:

$$
E_m =
\frac{1}{2}m_Av_A^2+
\frac{1}{2}m_Bv_B^2+
\frac{1}{2}k_Ax_A^2+
\frac{1}{2}k_Bx_B^2+
\frac{1}{2}k_c(x_A-x_B)^2
$$

Sem amortecimento, $E_m$ deve permanecer aproximadamente constante, com pequenas diferencas numericas vindas do passo de integracao. Com amortecimento, a energia mecanica diminui e a energia dissipada acumulada aparece em `thermalEnergyJoules`.

Na cena, as trilhas, as barras de energia e os pulsos na mola central destacam essa transferencia. Nos graficos, `leftKineticEnergyJoules`, `rightKineticEnergyJoules`, `leftElasticPotentialEnergyJoules`, `rightElasticPotentialEnergyJoules` e `couplingPotentialEnergyJoules` mostram as parcelas que compoem a energia total.

## Limites do modelo

- Movimento unidimensional em torno do equilibrio vertical.
- Molas lineares, sem massa propria e sem fim de curso.
- Amortecimento viscoso linear comum as duas massas, opcional pelo parametro `dampingNewtonSecondsPerMeter`.
- `couplingSpringConstantNewtonsPerMeter = 0` e valido e mostra osciladores independentes.
- Nao ha colisao entre massas, atrito seco, histerese, molas nao lineares ou acoplamento com mais de duas massas.
- `COUPLED_UNCOUPLED_REFERENCE` aparece quando a mola central e zerada.
- `COUPLED_DAMPED_SYSTEM` aparece quando ha dissipacao mecanica.
- `COUPLED_OUT_OF_PHASE_MODE` aparece quando as condicoes iniciais destacam o modo fora de fase.
