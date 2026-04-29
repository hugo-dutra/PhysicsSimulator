# Equilibrio de particula

Uma particula esta em equilibrio translacional quando a soma vetorial das forcas aplicadas e nula:

$$
\sum \vec F = \vec 0
$$

O motor decompoe cada forca em componentes \(x\) e \(z\), soma os vetores e usa a resultante para decidir o regime. Se a resultante fecha dentro da tolerancia, a particula permanece parada no ponto comum de aplicacao. Se nao fecha, a simulacao mostra a aceleracao simplificada:

$$
\vec a = \frac{\sum \vec F}{m}
$$

## Como interpretar

- Forca zero e valida e remove aquele vetor do diagrama.
- O vetor resultante deve desaparecer para o caso de equilibrio.
- Presets desequilibrados mostram deslocamento na direcao da resultante para tornar visivel que a condicao falhou.

## Limites do modelo

- Todas as forcas atuam no mesmo ponto.
- A particula nao tem tamanho, orientacao ou torque.
- Cabos, contatos e atrito real nao sao modelados; as forcas sao impostas diretamente.
- Para corpos extensos, tambem e necessario verificar equilibrio rotacional.
