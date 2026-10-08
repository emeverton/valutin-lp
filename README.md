# Valutin — catálogo e editor

Este repositório contém o código do catálogo e do editor da Valutin. O site publicado é um catálogo de **venda assistida**, não um checkout online. Alterações feitas pelo painel ficam em rascunho até a publicação no próprio editor.

## Atualizar produtos sem programar

Abra [o editor publicado](https://www.valutin.com.br/editor/login) e entre com a senha recebida por um canal privado. Não coloque a senha em prompts, commits ou mensagens. No painel:

- **Fotos do catálogo:** capa, galeria e descrições das imagens das peças existentes.
- **Produtos e estoque:** nome, descrição, preço e estoque manual por tamanho das peças existentes.
- **Cadastrar peça:** produto novo com categoria, coleção, tamanhos, preço e fotos.
- **Banners:** conteúdo editorial da coleção.

Salve o rascunho, confira a prévia e só então publique. Depois, verifique a categoria e a página do produto no domínio público. Estoque manual não tem baixa automática nem sincronização garantida com Linx; confirme a disponibilidade com a equipe. Produtos novos não entram automaticamente nos feeds de anúncios sem mapeamento de SKU apropriado.

## Desenvolver localmente com Codex

```bash
git clone --branch codex/client-catalog-handoff https://github.com/emeverton/valutin-lp.git
cd valutin-lp
npm ci
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3001`. Preencha `.env.local` somente com os valores necessários, fornecidos em canal seguro pela pessoa responsável pela infraestrutura. Sem as integrações privadas, partes do editor, estoque e atendimento não funcionarão localmente. Nunca publique `.env.local` nem copie credenciais de produção para o Codex.

Antes de propor código, leia os arquivos afetados, preserve a estrutura visual aprovada e rode:

```bash
npm test
npm run build
git diff --check
```

Faça mudanças em uma branch própria e envie para revisão. **Não publique nem altere a configuração de produção sem autorização explícita.** O projeto de produção está na Vercel; um `git push` não prova que o domínio foi atualizado.
