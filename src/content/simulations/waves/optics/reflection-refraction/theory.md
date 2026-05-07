# Reflexao e refracao

Esta simulacao mostra uma interface plana entre dois meios transparentes. O motor calcula um raio incidente, um raio refletido e, quando existe, um raio refratado pela Lei de Snell:

```math
n_1\sin\theta_i=n_2\sin\theta_t
```

O angulo critico existe apenas quando a luz tenta sair de um meio mais refringente para outro menos refringente:

```math
\theta_c=\sin^{-1}\left(\frac{n_2}{n_1}\right),\qquad n_1>n_2
```

Se o angulo incidente supera esse limite, a cena entra em reflexao interna total: o raio transmitido some, o raio refletido domina e a tabela marca o regime `OPTICS_TOTAL_INTERNAL_REFLECTION`.

## Como interpretar

- A normal fica fixa na interface e todos os angulos sao medidos contra ela.
- Aumentar `n2` aproxima o raio refratado da normal; diminuir `n2` afasta o raio e pode criar reflexao interna total se `n1 > n2`.
- A abertura do feixe e visual. Ela ajuda a perceber a inclinacao dos raios vizinhos, mas o sample principal continua sendo o raio central.
- A fracao refletida usa uma aproximacao de Schlick para leitura didatica; a direcao dos raios segue Snell.

## Limites declarados no fixture

- Interface plana, meios homogeneos e raios em 2D.
- Sem dispersao por cor, absorcao, polarizacao ou rugosidade.
- A aproximacao de refletancia e apenas uma leitura visual, nao uma simulacao completa de Fresnel.
