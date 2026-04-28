# Product Spec

## Objetivo da experiencia

Permitir que o usuario explore um fenomeno fisico mudando parametros e observando simultaneamente:

- animacao do sistema fisico;
- vetores e outras representacoes visuais;
- graficos derivados da simulacao;
- tabela de amostras;
- apendice teorico com formulas, interpretacao e limites do modelo.

## Perfis de usuario

- Aluno explorador: quer mexer em valores e entender causa e efeito.
- Professor demonstrador: quer explicar em aula com visual claro e parametros controlaveis.
- Autor tecnico: quer validar se uma simulacao comunica corretamente um conceito.

## Navegacao principal

A aplicacao deve agrupar simulacoes por area do conhecimento em uma sidebar:

- Mecanica.
- Termodinamica.
- Fluidos.
- Eletricidade.
- Magnetismo.

No MVP, apenas `Mecanica > Pendulo simples` precisa estar funcional. As demais areas podem aparecer como itens planejados, desde que nao confundam com simulacoes prontas.

## Tela da simulacao

Layout recomendado:

- Sidebar fixa ou recolhivel com areas e simulacoes.
- Topbar compacta com nome da area, nome da simulacao e acoes globais.
- Area central com viewport/canvas da simulacao.
- Painel lateral de parametros com sliders, inputs numericos, toggles e presets.
- Secao de graficos sincronizados.
- Secao de tabela de amostras.
- Aba ou painel de apendice teorico.

## Controles esperados no pendulo simples

- Play/pause.
- Reset.
- Presets de demonstracao.
- Comprimento do fio.
- Massa.
- Gravidade.
- Angulo inicial.
- Velocidade angular inicial.
- Amortecimento.
- Toggle de vetores.
- Toggle de trilha.
- Toggle de energia.

## Representacoes esperadas

- Cena animada do pendulo.
- Vetores de peso, tensao e velocidade.
- Grafico de angulo por tempo.
- Grafico de velocidade angular por tempo.
- Grafico de energia cinetica, potencial e total.
- Tabela com tempo, angulo, velocidade, posicao e energia.
- Apendice teorico com equacoes, unidades e limites da aproximacao.

## Estados de tela

- Inicial: carrega preset padrao do pendulo.
- Rodando: integrador avanca no tempo e UI mostra estado atual.
- Pausado: usuario pode ajustar parametros e inspecionar dados.
- Resetado: volta aos parametros atuais com tempo zero.
- Erro de parametro: indica valor invalido sem quebrar a cena.
- Recurso planejado: areas futuras aparecem desabilitadas ou marcadas como planejadas.

## Comportamento com mocks/fixtures

Na fase core, dados de catalogo, parametros, presets e texto teorico podem vir de JSON/MDX locais. Nao deve haver dependencia de backend.

## Criterios de aceite do MVP

- O usuario consegue abrir `Mecanica > Pendulo simples` pela sidebar.
- O canvas mostra a animacao do pendulo.
- Alterar controles muda a simulacao e regenera dados derivados.
- Graficos e tabela refletem os mesmos samples.
- Vetores podem ser ligados e desligados.
- O apendice teorico aparece ao lado ou abaixo da simulacao sem substituir a experiencia principal.
- A interface usa Material UI em dark graphite com acento cyan/teal e leitura confortavel.

## Limites do MVP

- Nao precisa salvar simulacoes do usuario.
- Nao precisa compartilhar links configurados.
- Nao precisa autenticar usuarios.
- Nao precisa ter mais de uma simulacao funcional.
- Nao precisa de simulacao fisica de alta fidelidade alem do modelo declarado.
