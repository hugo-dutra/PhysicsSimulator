# Batimentos

Batimentos aparecem quando dois tons de frequencias proximas chegam ao mesmo ponto do meio. O ouvido percebe uma oscilacao rapida carregada por uma envoltoria lenta: a intensidade cresce quando as pressoes se reforcam e diminui quando elas quase se cancelam.

Nesta simulacao, os pontinhos representam uma leitura didatica 3D da pressao sonora ao longo de um trecho de ar. O volume visto na cena e uma extrusao visual do perfil 1D calculado pelo motor: ele ajuda a enxergar a onda no espaco, mas nao rastreia moleculas individuais nem resolve propagacao acustica 3D real. O probe, os graficos, a tabela e as formulas leem a mesma soma:

```math
p(x,t)=A\sin(k_1x-\omega_1t)+A\sin(k_2x-\omega_2t+\Delta\phi)
```

A frequencia de batimento e:

```math
f_b=|f_2-f_1|
```

Se `f_1 = f_2`, nao ha pulsacao lenta. Se a amplitude for zero, a pressao resultante fica nula e os pontos ficam no volume neutro de equilibrio. O modelo e linear, 1D e em escala visual didatica; nao inclui eco, absorcao, reverberacao, direcionalidade real da fonte nem propagacao esferica.
