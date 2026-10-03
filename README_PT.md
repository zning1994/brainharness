<div align="center">

# brainharness

> Uma forja para skills do Claude Code — feitas e realmente usadas.

[![Claude Code](https://img.shields.io/badge/Claude%20Code-Marketplace-blueviolet)](https://claude.ai/code)
[![Plugins](https://img.shields.io/badge/plugins-3-green)](#o-que-inclui)
[![Status](https://img.shields.io/badge/status-v0.2.0-orange)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Um marketplace de plugins para Claude Code.
Agrega skills e plugins que escrevi e uso de verdade, para que outros possam instalá-los com um único comando.

[Instalação](#instalação) · [O que inclui](#o-que-inclui) · [Contribuir](#contribuir--feedback) · [Changelog](CHANGELOG.md) · [Releases](https://github.com/zning1994/brainharness/releases)

**Other Languages / 其他语言：**

[English](README.md) · [简体中文](README_CN.md) · [日本語](README_JA.md) · [Español](README_ES.md) · [Deutsch](README_DE.md) · [한국어](README_KO.md) · [Русский](README_RU.md)

</div>

---

## O que é isto

brainharness não é um skill individual — é um **repositório de manifesto**. Contém apenas um `marketplace.json` que lista o repositório GitHub próprio de cada plugin. O Claude Code lê esse manifesto e busca cada skill em seu repo de origem.

Cada skill tem seu próprio repo, seu próprio rastreador de issues e sua própria cadência de releases. brainharness é apenas a prateleira que os mantém juntos em um só lugar.

---

## Instalação

### Adicionar o marketplace

```bash
/plugin marketplace add zning1994/brainharness
```

### Instalar um plugin

```bash
/plugin install brainharness-cooking@brainharness
/plugin install brainharness-docs@brainharness
/plugin install brainharness-autoresearch@brainharness
```

### Atualizar para o mais recente

```bash
/plugin marketplace update brainharness
/reload-plugins
```

---

## O que inclui

### brainharness-cooking

Ajuda você a decidir o que cozinhar hoje à noite, como preparar e como salvar um prato quando algo dá errado. Padrão: comida caseira chinesa. Faz duas perguntas-chave antes de recomendar e entrega algo que você realmente consegue colocar na panela.

- Repo: [zning1994/brainharness-cooking](https://github.com/zning1994/brainharness-cooking)
- Triggers: `o que cozinhar hoje`, `tenho X e Y, o que posso fazer`, `como refogar carne para ficar macia`

### brainharness-docs

Organiza documentação de projeto por tamanho, público-alvo e frescor. Enxuga arquivos CLAUDE.md / AGENTS.md inchados, decide onde cada doc deve viver e evita que fatos duplicados se espalhem pelo repo.

- Repo: [zning1994/brainharness-docs](https://github.com/zning1994/brainharness-docs)
- Triggers: estrutura inicial de docs, CLAUDE.md com mais de 250 linhas, docs bagunçados precisando de reestruturação

### brainharness-autoresearch

Otimiza automaticamente o prompt de um skill. Baseado no padrão autoresearch de Karpathy: define evals binários, deixa um loop de agente rodar experimentos, muta o prompt e mantém as variantes melhores.

- Repo: [zning1994/brainharness-autoresearch](https://github.com/zning1994/brainharness-autoresearch) (antigo `openclaw-autoresearch`)
- Triggers: um skill que não está funcionando bem e precisa de ajuste sistemático, comparar múltiplas variantes de prompt

---

## Estrutura do projeto

```text
brainharness/
├── .claude-plugin/
│   └── marketplace.json    # Catálogo de plugins (aponta para cada repo de origem)
├── README.md               # Inglês (padrão)
├── README_PT.md            # Este arquivo
├── README_CN.md / JA / ES / DE / KO / RU
├── CHANGELOG.md
└── LICENSE
```

Cada entrada de plugin em `marketplace.json` usa `source.url` para apontar para seu próprio repo. brainharness se mantém leve — quando um skill é atualizado, basta dar push no seu repo de origem. brainharness só muda quando você adiciona/remove um plugin ou atualiza os metadados do catálogo.

---

## Princípios de design

- **Um skill, um repo** — versionamento, issues e releases independentes
- **brainharness é apenas um catálogo** — sem duplicação de conteúdo, só agregação
- **Coexistência OpenClaw / ClawHub** — o mesmo skill pode ser publicado em ambos
- **Uma mudança, um lugar** — atualizar a URL em `marketplace.json` não mexe no skill em si

---

## Contribuir / Feedback

- Problema com um skill específico → abra uma issue no repo desse skill
- Problema com o marketplace em si (URL errada, entrada faltando) → abra uma issue neste repo
- Quer publicar seus próprios skills assim → faça fork deste repo como template para seu próprio marketplace

---

## Licença

[MIT](LICENSE)
