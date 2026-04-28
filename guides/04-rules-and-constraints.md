# Rules And Constraints

## Regras de produto

- Toda simulacao funcional deve ter visualizacao, parametros, graficos/tabela e teoria.
- Toda simulacao deve declarar area do conhecimento, nivel, objetivos didaticos e limites do modelo.
- Itens planejados podem aparecer na sidebar, mas devem ser claramente marcados como indisponiveis ou planejados.
- A primeira entrega funcional deve ser `Mecanica > Pendulo simples`.

## Regras de fisica

- Unidades devem ser explicitas.
- Parametros devem ter minimo, maximo, passo e valor padrao.
- O modelo numerico deve ser deterministico para os mesmos parametros.
- Tabela, graficos e animacao devem ser derivados da mesma fonte de dados.
- Quando houver aproximacao, a teoria deve explicar a aproximacao e seus limites.
- O produto educacional nao deve sugerir precisao de simulador profissional quando o modelo for didatico.

## Regras de UX

- Interface dark graphite com uma cor principal cyan/teal.
- Controles numericos usam slider e input quando precisao importar.
- Toggles para exibir vetores, trilha, energia e overlays.
- Icones em botoes sempre que houver comando conhecido como play, pause, reset, zoom ou download.
- Texto dentro de paineis deve ser compacto; evitar hero, landing page e blocos promocionais.
- UI deve evitar cards dentro de cards.
- O canvas e os graficos devem ter dimensoes estaveis para nao causar layout shift.

## Restricoes tecnicas

- Nao depender de backend na Fase 1.
- Nao introduzir auth, cadastro ou persistencia antes da prova core.
- Nao misturar muitos motores visuais no MVP.
- Nao usar WebGPU como requisito de producao inicial; WebGL deve ser o baseline.
- Nao travar contratos de API remota cedo demais.

## Dados mockados

Na fase core, catalogo, presets, parametros e conteudo teorico podem ser mockados com JSON/MDX locais. Isso e permitido e desejado para reduzir atrito.

## Fora de escopo inicial

- CFD realista.
- Eletromagnetismo numerico pesado.
- Simulacao profissional de engenharia.
- Colaboracao em tempo real.
- Avaliacoes, notas e turmas.
- Biblioteca completa de aulas.
