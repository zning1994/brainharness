<div align="center">

# brainharness

> Кузница для Claude Code skills — созданные и реально используемые.

[![Claude Code](https://img.shields.io/badge/Claude%20Code-Marketplace-blueviolet)](https://claude.ai/code)
[![Plugins](https://img.shields.io/badge/plugins-3-green)](#что-внутри)
[![Status](https://img.shields.io/badge/status-v0.2.0-orange)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Маркетплейс плагинов для Claude Code.
Собирает skills и плагины, которые я написал и реально использую, чтобы другие могли установить их одной командой.

[Установка](#установка) · [Что внутри](#что-внутри) · [Вклад](#вклад--обратная-связь) · [Changelog](CHANGELOG.md) · [Releases](https://github.com/zning1994/brainharness/releases)

**Other Languages / 其他语言：**

[English](README.md) · [简体中文](README_CN.md) · [日本語](README_JA.md) · [Español](README_ES.md) · [Deutsch](README_DE.md) · [한국어](README_KO.md) · [Português](README_PT.md)

</div>

---

## Что это такое

brainharness — не отдельный skill, а **репозиторий-манифест**. В нём всего один `marketplace.json`, который перечисляет отдельные GitHub-репозитории каждого плагина. Claude Code читает этот манифест и подтягивает каждый skill из его собственного репозитория.

У каждого skill-а свой репозиторий, свой issue tracker и свой ритм релизов. brainharness — просто полка, которая держит их всех в одном месте.

---

## Установка

### Добавить маркетплейс

```bash
/plugin marketplace add zning1994/brainharness
```

### Установить плагин

```bash
/plugin install brainharness-cooking@brainharness
/plugin install brainharness-docs@brainharness
/plugin install brainharness-autoresearch@brainharness
```

### Обновиться до последней версии

```bash
/plugin marketplace update brainharness
/reload-plugins
```

---

## Что внутри

### brainharness-cooking

Помогает решить, что приготовить на ужин, как это сделать и как спасти блюдо, если что-то пошло не так. По умолчанию — китайская домашняя кухня. Задаёт два точных вопроса перед рекомендацией и выдаёт то, что действительно можно поставить на плиту.

- Репозиторий: [zning1994/brainharness-cooking](https://github.com/zning1994/brainharness-cooking)
- Триггеры: `что приготовить на ужин`, `у меня есть X и Y, что можно сделать`, `как обжарить говядину, чтобы была мягкой`

### brainharness-docs

Организует документацию проекта по размеру, аудитории и свежести. Сжимает раздутые CLAUDE.md / AGENTS.md, решает, где должен жить каждый документ, и предотвращает дублирование фактов по всему репозиторию.

- Репозиторий: [zning1994/brainharness-docs](https://github.com/zning1994/brainharness-docs)
- Триггеры: скелет документации нового проекта, CLAUDE.md больше 250 строк, беспорядочные документы, которые нужно переструктурировать

### brainharness-autoresearch

Автоматически оптимизирует промпт skill-а. Основано на паттерне autoresearch от Карпати: определить бинарные evals → позволить агенту в цикле запускать эксперименты → мутировать промпт → оставлять лучшие варианты.

- Репозиторий: [zning1994/brainharness-autoresearch](https://github.com/zning1994/brainharness-autoresearch) (ранее `openclaw-autoresearch`)
- Триггеры: skill работает плохо и нуждается в систематическом тюнинге, сравнение нескольких вариантов промпта

---

## Структура проекта

```text
brainharness/
├── .claude-plugin/
│   └── marketplace.json    # Каталог плагинов (указывает на каждый исходный репозиторий)
├── README.md               # Английский (по умолчанию)
├── README_RU.md            # Этот файл
├── README_CN.md / JA / ES / DE / KO / PT
├── CHANGELOG.md
└── LICENSE
```

Каждая запись плагина в `marketplace.json` использует `source.url` для указания на свой репозиторий. Поэтому brainharness остаётся лёгким — когда skill обновляется, достаточно сделать push в его исходный репозиторий. brainharness меняется только при добавлении/удалении плагина или обновлении метаданных каталога.

---

## Принципы дизайна

- **Один skill — один репозиторий** — независимое версионирование, issues, релизы
- **brainharness — просто каталог** — никакого дублирования контента, только агрегация
- **Сосуществование OpenClaw / ClawHub** — один и тот же skill можно публиковать в обоих
- **Одно изменение — одно место** — обновление URL в `marketplace.json` не затрагивает сам skill

---

## Вклад / Обратная связь

- Проблема с конкретным skill-ом → создайте issue в репозитории этого skill-а
- Проблема с самим маркетплейсом (неверный URL, отсутствующая запись) → создайте issue в этом репозитории
- Хотите публиковать свои skills таким образом → сделайте fork этого репозитория как шаблон для своего собственного маркетплейса

---

## Лицензия

[MIT](LICENSE)
