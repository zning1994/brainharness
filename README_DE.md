<div align="center">

# brainharness

> Eine Schmiede für Claude-Code-Skills — gebaut und tatsächlich im Einsatz.

[![Claude Code](https://img.shields.io/badge/Claude%20Code-Marketplace-blueviolet)](https://claude.ai/code)
[![Plugins](https://img.shields.io/badge/plugins-3-green)](#was-ist-enthalten)
[![Status](https://img.shields.io/badge/status-v0.2.0-orange)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Ein Claude-Code-Plugin-Marketplace.
Bündelt Skills und Plugins, die ich selbst geschrieben und tatsächlich nutze — andere können sie mit einem einzigen Befehl installieren.

[Installation](#installation) · [Was ist enthalten](#was-ist-enthalten) · [Mitwirken](#mitwirken--feedback) · [Changelog](CHANGELOG.md) · [Releases](https://github.com/zning1994/brainharness/releases)

**Other Languages / 其他语言：**

[English](README.md) · [简体中文](README_CN.md) · [日本語](README_JA.md) · [Español](README_ES.md) · [한국어](README_KO.md) · [Português](README_PT.md) · [Русский](README_RU.md)

</div>

---

## Was das ist

brainharness ist kein einzelner Skill, sondern ein **Manifest-Repository**. Es enthält nur eine `marketplace.json`, die das eigene GitHub-Repository jedes Plugins auflistet. Claude Code liest dieses Manifest und lädt jeden Skill aus dessen Quell-Repository.

Jeder Skill hat sein eigenes Repo, seinen eigenen Issue-Tracker und seinen eigenen Release-Rhythmus. brainharness ist nur das Regal, das sie an einem Ort zusammenhält.

---

## Installation

### Marketplace hinzufügen

```bash
/plugin marketplace add zning1994/brainharness
```

### Ein Plugin installieren

```bash
/plugin install brainharness-cooking@brainharness
/plugin install brainharness-docs@brainharness
/plugin install brainharness-autoresearch@brainharness
```

### Auf die neueste Version aktualisieren

```bash
/plugin marketplace update brainharness
/reload-plugins
```

---

## Was ist enthalten

### brainharness-cooking

Hilft dir zu entscheiden, was du heute Abend kochst, wie du es zubereitest und wie du ein Gericht rettest, wenn etwas schiefgeht. Standardmäßig chinesische Hausmannskost; stellt zwei gezielte Fragen, bevor Empfehlungen gegeben werden, und liefert etwas, das du tatsächlich in die Pfanne werfen kannst.

- Repo: [zning1994/brainharness-cooking](https://github.com/zning1994/brainharness-cooking)
- Trigger: `was soll ich heute Abend kochen`, `ich habe X und Y, was kann ich machen`, `wie brate ich Rindfleisch zart`

### brainharness-docs

Organisiert Projektdokumentation nach Größe, Zielgruppe und Aktualität. Schlanke aufgeblähte CLAUDE.md / AGENTS.md, entscheidet, wo jedes Dokument leben sollte, und verhindert doppelte Informationen im Repo.

- Repo: [zning1994/brainharness-docs](https://github.com/zning1994/brainharness-docs)
- Trigger: Neue Projekt-Doc-Struktur, CLAUDE.md mit mehr als 250 Zeilen, unordentliche Docs, die neu strukturiert werden müssen

### brainharness-autoresearch

Optimiert automatisch den Prompt eines Skills. Inspiriert vom Autoresearch-Muster von Karpathy: binäre Evals definieren, eine Agent-Schleife Experimente laufen lassen, den Prompt mutieren und die besseren Varianten behalten.

- Repo: [zning1994/brainharness-autoresearch](https://github.com/zning1994/brainharness-autoresearch) (früher `openclaw-autoresearch`)
- Trigger: Ein Skill, der nicht gut funktioniert und systematisches Tuning braucht, Vergleich mehrerer Prompt-Varianten

---

## Projektstruktur

```text
brainharness/
├── .claude-plugin/
│   └── marketplace.json    # Plugin-Katalog (zeigt auf jedes Quell-Repo)
├── README.md               # Englisch (Standard)
├── README_DE.md            # Diese Datei
├── README_CN.md / JA / ES / KO / PT / RU
├── CHANGELOG.md
└── LICENSE
```

Jeder Plugin-Eintrag in `marketplace.json` verwendet `source.url`, um auf sein eigenes Repo zu zeigen. brainharness bleibt dadurch leichtgewichtig — wenn sich ein Skill ändert, reicht ein Push ins Quell-Repo. brainharness wird nur geändert, wenn Plugins hinzugefügt/entfernt oder Katalog-Metadaten aktualisiert werden.

---

## Designprinzipien

- **Ein Skill, ein Repo** — unabhängige Versionierung, Issues, Releases
- **brainharness ist nur ein Katalog** — keine Inhaltsduplikation, nur Aggregation
- **OpenClaw / ClawHub-Koexistenz** — derselbe Skill kann in beiden veröffentlicht werden
- **Eine Änderung, ein Ort** — URL-Änderungen in `marketplace.json` berühren den Skill selbst nicht

---

## Mitwirken / Feedback

- Problem mit einem bestimmten Skill → Issue im Repo dieses Skills eröffnen
- Problem mit dem Marketplace selbst (falsche URL, fehlender Eintrag) → Issue in diesem Repo eröffnen
- Eigene Skills so veröffentlichen → dieses Repo als Vorlage für dein eigenes Marketplace forken

---

## Lizenz

[MIT](LICENSE)
