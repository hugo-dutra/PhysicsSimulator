# Deployment

## Destino inicial

O deploy publico inicial usa GitHub Pages em um repositorio separado somente para o artefato estatico gerado:

- Repositorio fonte: `hugo-dutra/PhysicsSimulator`.
- Repositorio de build: `hugo-dutra/PhysicsSimulator-build`.
- URL esperada: `https://hugo-dutra.github.io/PhysicsSimulator-build/`.
- Branch publicado: `main`.
- Origem do Pages: branch `main`, pasta `/`.

Esse repositorio de build nao deve receber codigo fonte, `node_modules`, fixtures de desenvolvimento ou documentos de planejamento. Ele deve conter apenas o conteudo gerado em `dist/`, mais arquivos auxiliares estaticos necessarios para GitHub Pages, como `.nojekyll` e, se a aplicacao usar rotas client-side, `404.html`.

## Quando publicar

Publique apenas depois dos checks proporcionais passarem no repositorio fonte:

```bash
npm run test
npm run lint
npm run build:pages
```

O script `build:pages` compila o Vite com `--base=/PhysicsSimulator-build/`. Essa base e obrigatoria porque o GitHub Pages serve este projeto em um subcaminho do dominio do usuario, nao na raiz do dominio.

## Processo manual

1. Confirme que o repositorio fonte esta no estado desejado:

```bash
git status --short --branch
git rev-parse --short HEAD
```

2. Rode os checks:

```bash
npm run test
npm run lint
npm run build:pages
```

3. Prepare o artefato para Pages:

```bash
Copy-Item -Path dist\index.html -Destination dist\404.html
New-Item -Path dist\.nojekyll -ItemType File -Force
```

4. Clone ou atualize o repositorio de build em uma pasta temporaria fora do repositorio fonte.

5. Limpe o conteudo antigo do repositorio de build e copie todo o conteudo de `dist/` para a raiz dele.

6. Faça commit e push no repositorio de build:

```bash
git add -A
git commit -m "Deploy PhysicSimulator build"
git push origin main
```

7. Garanta que o GitHub Pages esteja habilitado no repositorio de build com source `main` e path `/`.

8. Verifique a URL publicada:

```bash
curl -I https://hugo-dutra.github.io/PhysicsSimulator-build/
```

## Observacoes

- Se o nome do repositorio de build mudar, atualize `build:pages`, este guia e a URL esperada no mesmo ciclo.
- O aviso de chunk acima de 500 kB no build e conhecido por causa das dependencias graficas e cientificas; ele nao bloqueia deploy, mas deve ser acompanhado quando o bundle crescer.
- O deploy nao promove qualidade de simulacao. Mudancas de simulacao ainda precisam passar pelo `Simulation Fidelity Adjustment Guide` antes de uma simulacao ser mantida ou promovida como `analysis` ou `ready`.
