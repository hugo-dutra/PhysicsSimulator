# Efeito Doppler

O efeito Doppler e a mudanca da frequencia percebida quando fonte e observador se movem em relacao ao meio. Quando a fonte se aproxima, as frentes de onda ficam mais comprimidas na direcao do observador e a frequencia recebida aumenta. Quando ela se afasta, as frentes ficam mais espacadas e a frequencia diminui.

Nesta simulacao, a fonte e o observador se movem em uma linha. Os pontinhos desenham em 3D um volume didatico de pressao extrudido a partir do mesmo modelo 1D usado pelos graficos e pela tabela. A equacao classica usada no regime subsonico e:

```math
f'=f\frac{v+v_o}{v-v_s}
```

Aqui `v_o` e positivo quando o observador se move em direcao a fonte, e `v_s` e positivo quando a fonte se move em direcao ao observador. O motor ajusta esses sinais a partir das posicoes instantaneas.

As frentes ficam visualmente comprimidas ou alongadas por:

```math
\lambda_{frente}=\frac{v-v_s}{f},\qquad
\lambda_{tras}=\frac{v+v_s}{f}
```

O modelo e 1D, didatico e subsonico. A cena e 3D para leitura visual, mas nao representa cone de Mach, vento, absorcao, eco, reflexoes ou propagacao acustica 3D real. Velocidade zero da fonte ou do observador e valida e reduz o deslocamento de frequencia conforme a formula.
