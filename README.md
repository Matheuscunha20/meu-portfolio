# GenesisTec — Inovação Digital

Site institucional da **GenesisTec**, uma página única com tema futurista: fundo de partículas animado, cursor personalizado, animações ao rolar a página e layout responsivo.

🔗 **Acesse:** https://www.genesistec.dev.br

## Seções
- **Início**: apresentação com a logo e as chamadas principais
- **Projetos**: cards com os projetos em destaque
- **Sobre**: quem sou e números
- **Contato**: WhatsApp, GitHub, LinkedIn e um formulário que abre a conversa no WhatsApp com a mensagem pronta

## Tecnologias
- HTML5
- CSS3 (variáveis, grid, animações, media queries)
- JavaScript puro (Canvas API, IntersectionObserver)
- Hospedagem: Vercel (domínio genesistec.dev.br)

## Destaques técnicos
- Fundo de partículas em `<canvas>`, com menos partículas no celular para não pesar
- Cursor personalizado só em computador com mouse (em celular e tablet fica o padrão)
- Menu mobile com animação de "X", fecha com Esc ou ao clicar em um link
- Respeita a configuração "reduzir movimento" do sistema (`prefers-reduced-motion`)
- Sem dependências e sem build: é só abrir o `index.html`

## Como rodar localmente
```bash
git clone https://github.com/Matheuscunha20/meu-portfolio.git
cd meu-portfolio
# abra o index.html no navegador
```

## Estrutura
```
meu-portfolio/
├── assets/      # logo e imagens
├── index.html
├── style.css
├── script.js
└── vercel.json  # site estático, sem etapa de build
```

---
Desenvolvido por [Matheus Cunha](https://www.linkedin.com/in/matheus-cunha-dev)
