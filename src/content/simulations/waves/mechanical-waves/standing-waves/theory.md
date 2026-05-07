# Ondas estacionarias

Uma onda estacionaria em corda fixa nas duas extremidades e descrita por:

$$
y_n(x,t)=A\sin\left(\frac{n\pi x}{L}\right)\cos(\omega_n t+\phi)
$$

A frequencia do harmonico vem de:

$$
\lambda_n=\frac{2L}{n},\qquad
f_n=\frac{v}{\lambda_n}=\frac{n}{2L}\sqrt{\frac{T}{\mu}},\qquad
T_n=\frac{1}{f_n}
$$

O motor calcula o perfil, o envelope modal, a velocidade transversal, a aceleracao transversal, a frequencia, o periodo, o comprimento de onda modal e a velocidade de onda. A cena desenha nos, ventres e o probe a partir desses mesmos valores.

## Como interpretar

- Nos sao pontos em que o envelope vale zero e a corda nao se move.
- Ventres sao regioes de amplitude maxima.
- Aumentar o harmonico cria mais nos e ventres.
- Aumentar a tensao eleva a velocidade de onda e a frequencia; aumentar a densidade linear reduz ambas.
- Aumentar o comprimento da corda alonga \(\lambda_n\), reduz \(f_n\) e aumenta o periodo do modo.

## Limites declarados no fixture

- Corda ideal, extremidades fixas, sem perdas, rigidez real ou transiente de excitacao.
- Harmonicos ficam limitados a \(n \le 8\) para manter leitura visual e densidade de pontos estavel.
- O probe pode ser colocado sobre um no para mostrar deslocamento, velocidade e aceleracao locais proximos de zero.
