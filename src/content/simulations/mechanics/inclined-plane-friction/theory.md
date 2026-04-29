# Plano inclinado com atrito

## Ideia fisica

O plano inclinado mostra como uma mesma forca peso pode ser decomposta em duas leituras complementares. A componente paralela ao plano tenta mover o bloco para baixo da rampa, enquanto a componente perpendicular determina a normal e, portanto, o limite de atrito.

No modelo desta simulacao, o eixo positivo fica ao longo do plano, no sentido de descida. A posicao `s` mede a distancia percorrida sobre a rampa, nao a coordenada horizontal.

## Decomposicao do peso

Para uma rampa com angulo $\alpha$:

$$
P_{\parallel}=mg\sin(\alpha)
$$

$$
P_{\perp}=mg\cos(\alpha)
$$

A componente $P_{\parallel}$ aparece como tendencia de movimento. A componente perpendicular gera a normal:

$$
N=mg\cos(\alpha)
$$

## Atrito

O atrito estatico pode equilibrar a componente paralela se:

$$
mg\sin(\alpha) \leq \mu N
$$

Quando essa condicao e satisfeita e o bloco parte do repouso, a simulacao mostra o bloco parado. Quando o bloco desliza para baixo, usamos:

$$
F_{at}=\mu N
$$

com sentido contrario ao movimento.

## Aceleracao ao descer

Durante o deslizamento para baixo:

$$
a=g\sin(\alpha)-\mu g\cos(\alpha)
$$

Essa expressao explica por que aumentar o angulo tende a acelerar o bloco, enquanto aumentar o coeficiente de atrito tende a reduzir a aceleracao.

## Energia

A energia potencial gravitacional e calculada pela altura restante ate a base do plano:

$$
U=mgh
$$

A energia cinetica segue:

$$
K=\frac{1}{2}mv^2
$$

Com atrito, parte da energia mecanica vira uma parcela termica didatica:

$$
E=K+U+E_{termica}
$$

Essa parcela nao simula temperatura real; ela apenas fecha o balanco de energia do modelo.

## Limites do modelo

- O bloco nao rola e nao gira.
- O coeficiente de atrito estatico e cinetico e representado pelo mesmo controle.
- O ar, deformacoes, rugosidade variavel e empurroes externos nao entram no calculo.
- Ao chegar ao fim do plano, o bloco e mantido no limite visual para preservar a leitura da cena.
