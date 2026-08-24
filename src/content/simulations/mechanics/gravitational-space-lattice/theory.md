# Curvatura gravitacional em malha 3D

Esta simulação coloca um sistema didático Sol–planeta–Lua dentro de uma malha volumétrica formada por arestas paralelas aos três eixos. Longe das massas, as células permanecem quase cúbicas. Perto delas, os vértices se deslocam gradualmente para o centro; dentro do núcleo visual, vários vértices encontram o mesmo ponto e as arestas parecem convergir para uma singularidade.

Essa construção é uma **analogia visual**. As linhas não são fios materiais existentes no espaço, e o encontro dos vértices não descreve o interior físico de um planeta nem calcula uma singularidade da relatividade geral.

## Física que continua comandando a cena

A massa central produz o campo newtoniano

$$
g(r)=\frac{GM}{r^2},
$$

e o potencial gravitacional específico

$$
\Phi(r)=-\frac{GM}{r}.
$$

A trajetória do corpo orbital é uma elipse kepleriana. Sua rapidez segue a equação vis-viva,

$$
v=\sqrt{GM\left(\frac{2}{r}-\frac{1}{a}\right)},
$$

e a energia mecânica usada nos gráficos e na tabela é

$$
E=\frac{1}{2}mv^2-\frac{GMm}{r}.
$$

Posição, velocidade, campo, força, potencial, energia e período vêm dos mesmos samples usados pela cena. Alterar apenas a malha nunca retroage sobre essa órbita.

## Como a malha cúbica é deformada

Para cada um dos três poços, o motor fornece duas escalas visuais separadas:

- intensidade de deformação, usada para definir quanto cada vértice se aproxima do centro;
- escala de influência, derivada da raiz cúbica da massa e usada para ampliar o núcleo e o alcance perceptível da curva.

Fora do núcleo visual, um vértice $\vec p$ é deslocado suavemente em direção ao centro $\vec c_i$ de cada massa:

$$
\vec p'=\vec p+\sum_i(\vec c_i-\vec p)\,\alpha_i
e^{-1.7((d_i-r_{n,i})/R_i)^2}.
$$

Aqui, $d_i$ é a distância até a massa, $r_{n,i}$ é o raio do núcleo, $R_i$ é o alcance visual e $\alpha_i$ é a intensidade. Quando $d_i\le r_{n,i}$, os vértices vizinhos são colocados em $\vec c_i$; por isso várias arestas dos cubos se encontram visualmente no centro da massa.

Massas maiores elevam simultaneamente $\alpha_i$, $r_{n,i}$ e $R_i$: a convergência fica mais forte e começa a ser perceptível mais longe. Não existe, porém, uma borda física onde a gravidade “começa”. $R_i$ é apenas um limiar visual suave para manter a malha legível.

### Lua didática e terceiro poço

A Lua gira ao redor do planeta usando as coordenadas secundárias já calculadas no mesmo sample orbital. Para que seu poço não fique escondido dentro do poço do planeta na escala da viewport, o renderer preserva a direção dessa órbita local, mas impõe uma separação visual mínima de aproximadamente uma célula e meia da grade-base.

A intensidade lunar parte da razão de massa Lua/Terra de referência, `0,0123`, e recebe uma amplificação visual fixa de `3x`. O resultado continua menor que o poço do planeta, porém suficientemente amplo para curvar e aquecer as linhas vizinhas. Essa razão e esse ganho pertencem à analogia visual: a Lua não perturba a elipse principal e não entra na força, na energia nem no período do problema kepleriano de dois corpos.

## Densidade, suavidade e gradiente de cor

Em `Densidade de cubos = 1x`, a malha preserva a resolução original de $12^3=1.728$ cubos. O controle pode elevar o orçamento total até aproximadamente `10x`. Como as células precisam continuar cúbicas, o renderer aplica a raiz cúbica do multiplicador aos três eixos e arredonda para um número inteiro de divisões; no máximo, a grade usa $26^3=17.576$ cubos. Assim o controle não significa `10x` em cada eixo — o que produziria `1000x` mais cubos — e continua utilizável em WebGL.

Na densidade padrão, cada aresta recebe um ponto intermediário de renderização para evitar quinas muito marcadas. Acima de `1x`, os próprios cubos menores fornecem a suavidade espacial e o ponto intermediário é removido para não duplicar todos os segmentos transparentes. Isso não remove vértices reais da grade: eles crescem de $13^3=2.197$ para $27^3=19.683$ no máximo. Aumentar a densidade recria os buffers apenas quando o parâmetro muda; durante a animação, geometria, material e arrays tipados de posição/cor são reutilizados. Valores altos exigem mais CPU, GPU e memória e podem reduzir o FPS.

A cor também é calculada no renderer a partir da influência visual dos núcleos e do quanto cada ponto se desviou da grade ortogonal:

- teal indica linhas quase retas e influência pequena;
- amarelo e laranja indicam a faixa de transição;
- vermelho indica maior convergência e maior desvio visual perto das massas.

Esse gradiente é um heatmap da **analogia de deformação**, não uma medição local exata do campo em `m/s²`. Em intensidade zero, toda a grade volta simultaneamente à geometria ortogonal e à cor teal.

## Feixe de luz iniciado sobre uma linha da grade

O feixe neon nasce sobre uma das linhas da malha-base e aponta para a face oposta. A partir desse estado inicial, sua posição e sua direção são integradas em 72 passos. Em cada passo, os mesmos poços visuais usados pela malha acrescentam somente uma mudança transversal à direção acumulada do raio.

Por isso, uma linha distante dos núcleos permanece praticamente reta. Quando o feixe passa perto de uma massa, a direção muda continuamente. Depois que a influência visual fica desprezível, a mudança transversal zera e o feixe continua em linha reta pela última tangente adquirida: ele não retorna à direção nem à linha-base originais.

O controle `Trajetória do feixe` não recalcula uma física diferente. Ele apenas revela de 0% a 100% os segmentos consecutivos do caminho já calculado; o último segmento também pode aparecer parcialmente, permitindo acompanhar a propagação de forma contínua enquanto o slider é arrastado.

O plano define como o feixe é posicionado e qual eixo ele atravessa:

- `XY`: os controles U/V movem o feixe em X/Y e a propagação ocorre em Z;
- `YZ`: os controles U/V movem o feixe em Y/Z e a propagação ocorre em X;
- `XZ`: os controles U/V movem o feixe em X/Z e a propagação ocorre em Y.

U e V são medidos em células inteiras para o ponto e a direção iniciais coincidirem com uma linha existente. Depois do desvio, o raio pode naturalmente deixar essa linha. Ligar, desligar, mover ou revelar parcialmente o feixe não muda nenhum sample orbital.

Esse traço mostra o desvio **qualitativo da analogia escolhida**. A persistência da tangente de saída corrige o comportamento conceitual do percurso, mas a intensidade continua amplificada para ser visível. O modelo não resolve uma geodésica nula de uma métrica relativística, não calcula lentes gravitacionais reais e não deve ser interpretado como uma previsão quantitativa do ângulo de deflexão da luz.

## Controles visuais

`Intensidade da malha 3D` multiplica a convergência sem mudar a física. Em zero, a grade volta a ser ortogonal, mas posição, força, energia e período permanecem iguais.

`Alfa das linhas 3D` define a transparência máxima nas regiões próximas às massas e inicia em `0,25`. Conforme a influência visual diminui com a distância, o alfa também cai suavemente até um piso muito baixo, mas não nulo, reduzindo a poluição visual sem apagar a referência do espaço distante. Zero continua ocultando toda a malha sem remover massas ou recalcular samples.

`Densidade de cubos` inicia em `1x` e altera somente a tesselação visual do mesmo volume. Aumentá-la cria mais cubos, arestas e vértices, mantendo o alcance da cena, a espessura do feixe, os poços visuais e todos os samples orbitais inalterados.

`Amplificação da massa orbital` torna a deformação do corpo pequeno visível na escala da massa central. Ela muda a intensidade didática desse núcleo, mas a massa ainda determina seu tamanho e alcance relativos.

`Corpo em órbita` controla apenas a esfera que percorre a trajetória. `Rastro da órbita` controla a elipse de referência e o trecho progressivo já percorrido; ele também respeita o toggle geral `Trilha`. Ocultar qualquer um desses elementos não remove a massa orbital nem seu poço e não altera campo, energia, período, malha, feixe ou samples.

`Lua e campo lunar` controla em conjunto a esfera lunar, sua guia orbital local e o terceiro poço usado pela malha e pelo feixe. Desligá-lo não apaga as coordenadas lunares do sample e não recalcula a órbita principal; apenas remove a contribuição lunar da analogia renderizada.

## Regimes e limites

- Malha ativa: intensidade maior que zero deforma a grade a partir dos campos visuais do sample.
- Malha ortogonal: intensidade zero remove a deformação e preserva integralmente a órbita.
- Núcleo orbital oculto: amplificação orbital zero remove apenas a convergência visual ligada ao corpo em órbita.
- Lua desligada: corpo lunar, guia local e terceiro poço deixam de ser renderizados, enquanto os samples orbitais permanecem idênticos.
- Excentricidade alta: a elipse de Kepler continua calculada, mas atmosfera, precessão e perturbações de terceiros ficam fora do modelo.

O modelo não calcula métrica de Schwarzschild, dilatação temporal, lentes gravitacionais, ondas gravitacionais, horizonte de eventos nem relatividade de muitos corpos. A Lua produz um terceiro núcleo apenas na analogia visual volumétrica; ela ainda não transforma a dinâmica principal em um problema gravitacional de três corpos.
