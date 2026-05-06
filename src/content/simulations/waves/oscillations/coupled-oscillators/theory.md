# Osciladores acoplados

Esta simulacao usa duas massas iguais presas a molas externas e ligadas por uma mola central. O objetivo e mostrar modos normais, batimentos e troca de energia sem trocar de fonte de dados: posicoes, vetores, graficos, tabela e formulas saem do mesmo integrador.

As equacoes sao:

$$
m\ddot{x}_1 = -kx_1 - k_c(x_1-x_2)
$$

$$
m\ddot{x}_2 = -kx_2 - k_c(x_2-x_1)
$$

O modo em fase tem $x_1 = x_2$, nao deforma a mola central e oscila com:

$$
\omega_+ = \sqrt{\frac{k}{m}}
$$

O modo fora de fase tem $x_1 = -x_2$, deforma a mola central e oscila com:

$$
\omega_- = \sqrt{\frac{k + 2k_c}{m}}
$$

## Batimentos e energia

Quando as condicoes iniciais misturam os dois modos, cada massa parece entregar energia para a outra em ciclos. A energia total ideal permanece praticamente constante:

$$
E =
\frac{1}{2}m(v_1^2+v_2^2)+
\frac{1}{2}k(x_1^2+x_2^2)+
\frac{1}{2}k_c(x_1-x_2)^2
$$

Os graficos mostram deslocamentos individuais, modo comum, modo relativo, velocidades, forca de acoplamento e parcelas de energia.

## Limites do modelo

- Duas massas iguais e molas externas iguais.
- Movimento unidimensional, sem amortecimento, colisao entre massas ou fim de curso.
- `couplingSpringConstantNewtonsPerMeter = 0` e valido e mostra osciladores independentes.
- `COUPLED_OUT_OF_PHASE_MODE` aparece quando as condicoes iniciais destacam o modo fora de fase.
