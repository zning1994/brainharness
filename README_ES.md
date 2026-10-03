<div align="center">

# brainharness

> Una forja para skills de Claude Code — creadas y usadas de verdad.

[![Claude Code](https://img.shields.io/badge/Claude%20Code-Marketplace-blueviolet)](https://claude.ai/code)
[![Plugins](https://img.shields.io/badge/plugins-3-green)](#qué-incluye)
[![Status](https://img.shields.io/badge/status-v0.2.0-orange)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Un marketplace de plugins para Claude Code.
Agrega skills y plugins que he escrito y uso realmente, para que otros puedan instalarlos con un solo comando.

[Instalación](#instalación) · [Qué incluye](#qué-incluye) · [Contribuir](#contribuir--feedback) · [Changelog](CHANGELOG.md) · [Releases](https://github.com/zning1994/brainharness/releases)

**Other Languages / 其他语言：**

[English](README.md) · [简体中文](README_CN.md) · [日本語](README_JA.md) · [Deutsch](README_DE.md) · [한국어](README_KO.md) · [Português](README_PT.md) · [Русский](README_RU.md)

</div>

---

## Qué es esto

brainharness no es un skill individual — es un **repositorio de manifiesto**. Contiene únicamente un `marketplace.json` que lista el repositorio GitHub propio de cada plugin. Claude Code lee este manifiesto y obtiene cada skill desde su repo fuente.

Cada skill tiene su propio repo, su propio issue tracker y su propia cadencia de releases. brainharness es el estante que los mantiene juntos en un solo lugar.

---

## Instalación

### Añadir el marketplace

```bash
/plugin marketplace add zning1994/brainharness
```

### Instalar un plugin

```bash
/plugin install brainharness-cooking@brainharness
/plugin install brainharness-docs@brainharness
/plugin install brainharness-autoresearch@brainharness
```

### Actualizar al último

```bash
/plugin marketplace update brainharness
/reload-plugins
```

---

## Qué incluye

### brainharness-cooking

Te ayuda a decidir qué cocinar esta noche, cómo prepararlo y cómo salvar un plato cuando algo sale mal. Por defecto, cocina casera china; hace dos preguntas clave antes de recomendar y te da algo que realmente puedes poner en el sartén.

- Repo: [zning1994/brainharness-cooking](https://github.com/zning1994/brainharness-cooking)
- Triggers: `qué cocinar esta noche`, `tengo X e Y, qué puedo hacer`, `cómo salteo la carne para que quede tierna`

### brainharness-docs

Organiza la documentación del proyecto por tamaño, audiencia y frescura. Reduce archivos CLAUDE.md / AGENTS.md inflados, decide dónde debe vivir cada doc y evita que hechos duplicados se propaguen por el repo.

- Repo: [zning1994/brainharness-docs](https://github.com/zning1994/brainharness-docs)
- Triggers: estructura inicial de docs, CLAUDE.md con más de 250 líneas, docs desordenados que necesitan reestructuración

### brainharness-autoresearch

Optimiza automáticamente el prompt de un skill. Inspirado en el patrón autoresearch de Karpathy: define evals binarios, deja que un bucle de agente corra experimentos, muta el prompt y se queda con las mejores variantes.

- Repo: [zning1994/brainharness-autoresearch](https://github.com/zning1994/brainharness-autoresearch) (antes `openclaw-autoresearch`)
- Triggers: un skill que no funciona bien y necesita ajuste sistemático, comparar múltiples variantes de prompt

---

## Estructura del proyecto

```text
brainharness/
├── .claude-plugin/
│   └── marketplace.json    # Catálogo de plugins (apunta a cada repo fuente)
├── README.md               # Inglés (por defecto)
├── README_ES.md            # Este archivo
├── README_CN.md / JA / DE / KO / PT / RU
├── CHANGELOG.md
└── LICENSE
```

Cada entrada de plugin en `marketplace.json` usa `source.url` para apuntar a su propio repo. brainharness se mantiene ligero — cuando un skill se actualiza, solo haz push a su repo fuente. brainharness solo cambia cuando añades/eliminas un plugin o actualizas los metadatos del catálogo.

---

## Principios de diseño

- **Un skill, un repo** — versiones, issues y releases independientes
- **brainharness es solo un catálogo** — sin duplicación de contenido, solo agregación
- **Coexistencia OpenClaw / ClawHub** — el mismo skill puede publicarse en ambos
- **Un cambio, un sitio** — actualizar la URL en `marketplace.json` no toca el skill en sí

---

## Contribuir / Feedback

- Problema con un skill específico → abre un issue en el repo de ese skill
- Problema con el marketplace en sí (URL incorrecta, entrada faltante) → abre un issue en este repo
- Quieres publicar tus propios skills así → haz fork de este repo como plantilla para tu propio marketplace

---

## Licencia

[MIT](LICENSE)
