# Onda em corda

Esta simulacao usa uma onda senoidal 1D ideal:

$$
y(x,t)=A\sin(kx-\omega t+\phi)
$$

O deslocamento \(y\), a velocidade transversal \(v_y\), a aceleracao transversal \(a_y\) e a velocidade de propagacao sao calculados no motor e consumidos pelo probe, pela corda desenhada, pelos graficos, pela tabela e pelo guia de formulas.

Na visualizacao atual, o modo principal usa a velocidade do meio definida pelas propriedades da corda:

$$
v=\sqrt{\frac{T}{\mu}}
$$

Com a mesma tensao \(T\) e densidade linear \(\mu\), a velocidade \(v\) fica fixa. Por isso frequencia, periodo e comprimento de onda ficam acoplados:

$$
T_p=\frac{1}{f}
$$

$$
\lambda=\frac{v}{f}=vT_p
$$

Assim, aumentar \(f\) encurta \(\lambda\), diminuir \(f\) alonga \(\lambda\), e alterar \(\lambda\) pelo controle recalcula \(f=v/\lambda\) enquanto a fonte estiver oscilando. O modo \(v=\lambda f\) continua disponivel para comparar o caso didatico em que a velocidade passa a ser derivada diretamente dos dois controles.

## Como ler a cena

- A corda teal e formada por pontos materiais discretos. Eles sobem e descem; a crista e a energia se propagam horizontalmente.
- A fonte oscilante na esquerda move uma haste presa a corda com a amplitude e frequencia configuradas.
- O marcador mostra o probe usado pelos graficos, pela tabela e pelos vetores.
- A velocidade de propagacao acompanha as cristas horizontalmente; a velocidade transversal descreve o movimento local da corda para cima e para baixo.
- Com vetores ligados, aparecem a linha de equilibrio, a medida de amplitude, a medida de comprimento de onda efetivo e a guia vertical do probe.
- Com trilha ligada, a cena mostra perfis anteriores da corda; com energia ligada, pacotes luminosos indicam fluxo de energia no sentido da propagacao.
- Amplitude zero mantem a corda reta. Frequencia zero congela o perfil.

## Limites declarados no fixture

- O meio e ideal, sem reflexao nas extremidades, amortecimento, dispersao ou rigidez real da corda.
- No modo padrao, \(v=\sqrt{T/\mu}\); \(f\), periodo e \(\lambda\) sao relacionados por \(T_p=1/f\) e \(\lambda=v/f\). No modo \(v=\lambda f\), mudar \(\lambda\) ou \(f\) muda a velocidade.
- A extremidade direita ainda e visualmente uma referencia de apoio; reflexao fixa/livre/absorvente fica para uma proxima rodada de modelo.
- A cena chama o helper fisico do motor para desenhar o perfil espacial; ela nao cria uma onda paralela.
