# Apendice teorico: pendulo simples

## Modelo usado

O pendulo simples desta simulacao e uma massa pontual presa a um fio ideal, inextensivel e sem massa. O movimento acontece em um plano, e o estado minimo e o par angulo-velocidade angular:

$$
\theta(t),\quad \dot{\theta}(t)
$$

O motor numerico resolve a equacao com seno completo:

$$
\ddot{\theta} = -\frac{g}{L}\sin(\theta) - b\dot{\theta}
$$

Use este modelo quando quiser comparar como comprimento, gravidade, amplitude inicial, velocidade angular inicial e amortecimento mudam a trajetoria. O termo $b\dot{\theta}$ representa dissipacao linear simples; ele nao tenta modelar resistencia turbulenta do ar, atrito detalhado no pivo ou elasticidade do fio.

## Leitura fisica

- O comprimento $L$ altera principalmente a escala espacial e o periodo de oscilacao.
- A massa $m$ altera peso, tensao e energia, mas nao muda a aceleracao angular no modelo ideal.
- A gravidade $g$ aumenta a aceleracao de retorno e encurta o periodo.
- O angulo inicial $\theta_0$ controla a amplitude e define se a aproximacao de pequeno angulo e adequada.
- A velocidade angular inicial $\dot{\theta}_0$ injeta energia cinetica no inicio.
- O amortecimento $b$ dissipa energia mecanica ao longo do tempo.

## Aproximacao de pequeno angulo

Para amplitudes pequenas, normalmente abaixo de 10 a 15 graus, pode-se usar:

$$
\sin(\theta) \approx \theta
$$

Nesse regime, o pendulo se comporta como oscilador harmonico simples, e o periodo aproximado e:

$$
T \approx 2\pi\sqrt{\frac{L}{g}}
$$

Use essa formula para uma estimativa rapida do periodo quando a amplitude for pequena e o amortecimento for desprezivel. Para angulos maiores, use a curva numerica da simulacao como referencia, porque o seno completo deixa o periodo depender da amplitude.

## Energia mecanica

A energia exibida nos graficos e na tabela vem das mesmas amostras usadas pela cena:

$$
K = \frac{1}{2}m(L\dot{\theta})^2
$$

$$
U = mgL(1 - \cos\theta)
$$

$$
E = K + U
$$

Sem amortecimento, $E$ deve permanecer quase constante, com pequenas variacoes numericas esperadas. Com amortecimento, a energia total decai porque o modelo remove energia proporcionalmente a velocidade angular.

## Posicao e vetores

A posicao cartesiana da massa e:

$$
x = L\sin(\theta),\quad y = -L\cos(\theta)
$$

Os vetores exibidos sao interpretacoes do sample atual:

$$
\vec{P}=m\vec{g},\quad v=L\dot{\theta},\quad T\approx m(g\cos\theta + L\dot{\theta}^2)
$$

O peso aponta verticalmente para baixo, a tensao aponta ao longo do fio em direcao ao pivo, e a velocidade e tangencial a trajetoria. A tensao e uma leitura radial aproximada para o fio ideal; ela nao representa ruptura, folga ou massa distribuida.

## Limites do modelo

- Massa pontual e fio ideal.
- Movimento restrito a um plano.
- Sem resistencia do ar detalhada.
- Sem pivo com atrito realista.
- Sem comprimento variavel, fio elastico ou colisao.
- Aproximacao de pequeno angulo apenas quando a amplitude for baixa.

## Como explorar

Comece pelo preset de pequeno angulo e compare o periodo estimado com a curva de angulo por tempo. Depois aumente o angulo inicial, ligue o amortecimento e observe como a energia total deixa de ser conservada. Ao alterar comprimento ou gravidade, confirme se cena, graficos, tabela, vetores e formulas continuam respondendo ao mesmo conjunto de parametros.
