<div align="center">

# brainharness

> A forge for Claude Code skills — crafted and actually used.

[![Claude Code](https://img.shields.io/badge/Claude%20Code-Marketplace-blueviolet)](https://claude.ai/code)
[![Plugins](https://img.shields.io/badge/plugins-3-green)](#whats-inside)
[![Status](https://img.shields.io/badge/status-v0.2.0-orange)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A Claude Code plugin marketplace.
Aggregates skills and plugins I've written and actually use, so others can install them with a single command.

[Install](#install) · [What's Inside](#whats-inside) · [Contribute](#contribute--feedback) · [Changelog](CHANGELOG.md) · [Releases](https://github.com/zning1994/brainharness/releases)

**Other Languages / 其他语言：**

[简体中文](README_CN.md) · [日本語](README_JA.md) · [Español](README_ES.md) · [Deutsch](README_DE.md) · [한국어](README_KO.md) · [Português](README_PT.md) · [Русский](README_RU.md)

</div>

---

## What This Is

brainharness is not a single skill — it is a **manifest repository**. It contains just a `marketplace.json` that lists each plugin's own GitHub repo. Claude Code reads this manifest and pulls each skill from its source repo.

Every skill has its own repo, its own issue tracker, and its own release cadence. brainharness is the shelf that holds them all in one place.

---

## Install

### Add the marketplace

```bash
/plugin marketplace add zning1994/brainharness
```

### Install a plugin

```bash
/plugin install brainharness-cooking@brainharness
/plugin install brainharness-docs@brainharness
/plugin install brainharness-autoresearch@brainharness
```

### Update to the latest

```bash
/plugin marketplace update brainharness
/reload-plugins
```

---

## What's Inside

### brainharness-cooking

Helps you decide what to cook tonight, how to cook it, and how to save a dish when something goes wrong. Defaults to Chinese home cooking, asks two sharp questions before recommending, and gives you something you can actually put in a pan.

- Repo: [zning1994/brainharness-cooking](https://github.com/zning1994/brainharness-cooking)
- Triggers on: `what should I cook tonight`, `I have X and Y, what can I make`, `how do I stir-fry beef so it stays tender`

### brainharness-docs

Organizes project documentation by size, audience, and freshness. Slims bloated CLAUDE.md / AGENTS.md files, decides where each doc should live, and prevents duplicate facts from spreading across your repo.

- Repo: [zning1994/brainharness-docs](https://github.com/zning1994/brainharness-docs)
- Triggers on: new project doc scaffolding, CLAUDE.md over 250 lines, messy docs needing a restructure

### brainharness-autoresearch

Automatically optimizes a skill's prompt. Inspired by Karpathy's autoresearch pattern: define binary evals, let an agent loop run experiments, mutate the prompt, and keep the better variants.

- Repo: [zning1994/brainharness-autoresearch](https://github.com/zning1994/brainharness-autoresearch) (formerly `openclaw-autoresearch`)
- Triggers on: a skill that isn't working well and needs systematic tuning, comparing multiple prompt variants

---

## Project Structure

```text
brainharness/
├── .claude-plugin/
│   └── marketplace.json    # Plugin catalog (points at each source repo)
├── README.md               # This file (English, default)
├── README_CN.md            # Chinese version
├── CHANGELOG.md
└── LICENSE
```

Each plugin entry in `marketplace.json` uses `source.url` to point at its own repo. brainharness stays lightweight — when a skill updates, just push to its source repo. brainharness only changes when you add/remove a plugin or update the catalog metadata.

---

## Migrating from brainforge

Add `zning1994/brainharness` as a marketplace and use the three installation commands in [Install](#install). The new plugin identifiers use `@brainharness`; an existing `@brainforge` installation should not be assumed to change its identifier automatically.

For ClawHub installations, use `brainharness-cooking`, `brainharness-docs`, and `brainharness-autoresearch`. Updating an old installation and changing its local directory name are separate steps.

## Design Principles

- **One skill, one repo** — independent versioning, independent issues, independent releases
- **brainharness is just a catalog** — no content duplication, only aggregation
- **OpenClaw / ClawHub coexistence** — the same skill can be published to both
- **One change, one place** — updating the URL in `marketplace.json` doesn't touch the skill itself

---

## Contribute / Feedback

- Problem with a specific skill → file an issue on that skill's repo
- Problem with the marketplace itself (wrong URL, missing entry) → file an issue on this repo
- Want to publish your own skills this way → fork this repo as a template for your own marketplace

---

## License

[MIT](LICENSE)

## Website and OpenAI distribution

The multilingual static website lives in `site/`. English, Simplified Chinese, Traditional Chinese, Japanese, Spanish, German, Korean, Portuguese and Russian have separate static pages. The root URL matches the browser language preferences in order and falls back to English; direct language URLs and manual selection are never overridden. Regional tags use their base language. Chinese uses script first: `zh-Hans` selects `/zh/`, while `zh-Hant` selects `/zh-hant/`. Without an explicit script, TW/HK/MO select Traditional Chinese; CN/SG and bare `zh` select Simplified Chinese. Search metadata uses `zh-Hans` and `zh-Hant` without changing the existing `/zh/` URL. Without JavaScript, the root offers language links. `site/languages.mjs` defines supported routes, while `site/content.mjs`, `site/translations.mjs` and `site/chinese-traditional.mjs` hold localized copy. Run `npm --prefix site test` and `npm --prefix site run build` with Node.js 24. The build reads plugin identities and repository URLs from `.claude-plugin/marketplace.json`; `site/content.mjs` owns website copy and platform availability. Build output stays untracked.

GitHub Actions builds pull requests and deploys `main` to GitHub Pages. The production URL is https://brainharness.si/; `SITE_URL` in the workflow controls canonical URLs and the sitemap. GitHub Pages owns custom-domain and HTTPS settings.

OpenAI repository distribution uses `.agents/plugins/marketplace.json` and each skill repository’s portable `plugin.json`. The OpenAI catalog pins generated `openai/v<version>` distribution branches; Claude continues to use `main`. Add the marketplace with `codex plugin marketplace add zning1994/brainharness`, then install a plugin with `codex plugin add brainharness-cooking@brainharness`. Public ChatGPT directory listing is separate and has not been submitted.

To prepare a distribution, run `node scripts/package-openai.mjs /path/to/skill-repo /path/to/new-output-directory` with Node.js 24. The output parent must already exist. The script validates matching plugin and skill versions, materializes skill resources, and copies only the portable manifest, skill tree, license and changelog. A generated README points to the packaged skill directory and source documentation. It refuses existing destinations, hidden resources and links outside the source. Run `node --test scripts/package-openai.test.mjs` before packaging. Publish the generated tree to the matching `openai/v<version>` branch only after the source commit is reviewed; do not edit distribution files by hand.

Search metadata is generated by `site/seo.mjs`: the sitemap lists reciprocal language alternatives, JSON-LD describes the visible skill collection, and `llms.txt` links to canonical pages and source repositories. The text file is an optional navigation aid, not a search-engine requirement or an indexing guarantee. Platform availability is also rendered in static HTML. Keep compatibility claims in the locale content; do not add ratings, usage figures or public ChatGPT availability without evidence. Search Console ownership is verified separately through DNS, and sitemap submission is an operator action.
