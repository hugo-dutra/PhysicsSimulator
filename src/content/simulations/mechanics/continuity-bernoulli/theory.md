# Continuidade e Bernoulli

Em escoamento estacionario incompressivel, a vazao volumetrica se conserva: `Q = A v`. Quando a area diminui, a velocidade media aumenta para manter a mesma vazao.

A equacao de Bernoulli compara pressao estatica, pressao dinamica e energia gravitacional ao longo de uma linha de corrente ideal: `p + 1/2 rho v^2 + rho g h = constante`. Em um tubo de Venturi, a garganta estreita tende a ter velocidade maior e pressao estatica menor.

## Leitura visual

A cena usa um tubo de Venturi transparente: entrada larga, garganta estreita e saida larga. Os tracadores coloridos percorrem o interior do tubo usando o mesmo `Q`, `A`, `v` e `p` calculados pelo motor. Eles passam mais devagar nas regioes largas e ficam mais rapidos e quentes na garganta, onde a area e menor.

Os tres manometros representam a pressao estatica relativa na entrada, na garganta e na saida. A coluna da garganta cai quando a velocidade ali aumenta, mostrando visualmente a troca entre pressao estatica e termo cinetico de Bernoulli.

## Regimes

- Vazao zero: velocidades nulas e diferenca de pressao ligada apenas ao desnivel.
- Venturi moderado: secao estreita acelera o fluido e reduz a pressao.
- Pressao ideal negativa: warning de limite, pois o modelo sem perdas deixou de ser fisico.

## Limites do modelo

O fluido e ideal, incompressivel, sem viscosidade, sem bombas e sem perda de carga. As particulas, cores e colunas sao representacoes didaticas derivadas dos samples calculados; nao resolvem turbulencia, cavitacao, perfil real de velocidades nem camada limite.
