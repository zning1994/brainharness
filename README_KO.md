<div align="center">

# brainharness

> Claude Code 스킬을 연마하는 공방.

[![Claude Code](https://img.shields.io/badge/Claude%20Code-Marketplace-blueviolet)](https://claude.ai/code)
[![Plugins](https://img.shields.io/badge/plugins-3-green)](#포함-내용)
[![Status](https://img.shields.io/badge/status-v0.2.0-orange)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Claude Code 플러그인 마켓플레이스.
제가 직접 만들어 실제로 쓰고 있는 스킬/플러그인을 모아두어, 누구나 명령어 한 줄로 설치할 수 있게 합니다.

[설치](#설치) · [포함 내용](#포함-내용) · [기여](#기여--피드백) · [Changelog](CHANGELOG.md) · [Releases](https://github.com/zning1994/brainharness/releases)

**Other Languages / 其他语言：**

[English](README.md) · [简体中文](README_CN.md) · [日本語](README_JA.md) · [Español](README_ES.md) · [Deutsch](README_DE.md) · [Português](README_PT.md) · [Русский](README_RU.md)

</div>

---

## 이게 뭔가요

brainharness는 단일 스킬이 아니라 **매니페스트 저장소**입니다. `marketplace.json` 파일 하나가 각 플러그인의 독립된 GitHub 저장소를 나열할 뿐입니다. Claude Code가 이 매니페스트를 읽고 각 스킬을 해당 소스 저장소에서 가져옵니다.

각 스킬은 자체 저장소, 자체 이슈 트래커, 자체 릴리스 주기를 가집니다. brainharness는 이들을 같은 선반에 모아두는 역할만 합니다.

---

## 설치

### 마켓플레이스 추가

```bash
/plugin marketplace add zning1994/brainharness
```

### 플러그인 설치

```bash
/plugin install brainharness-cooking@brainharness
/plugin install brainharness-docs@brainharness
/plugin install brainharness-autoresearch@brainharness
```

### 최신 버전으로 업데이트

```bash
/plugin marketplace update brainharness
/reload-plugins
```

---

## 포함 내용

### brainharness-cooking

오늘 저녁 뭘 먹을지, 어떻게 만들지, 실수했을 때 어떻게 수습할지 알려주는 스킬. 기본은 중식 가정 요리. 추천 전에 핵심 조건 두 가지를 먼저 물은 뒤, 실제로 냄비에 바로 올릴 수 있는 제안을 줍니다.

- 저장소: [zning1994/brainharness-cooking](https://github.com/zning1994/brainharness-cooking)
- 트리거: `오늘 저녁 뭐 먹지`, `냉장고에 X, Y 있는데 뭐 만들 수 있어`, `소고기 부드럽게 볶으려면`

### brainharness-docs

프로젝트 문서를 크기, 독자, 신선도에 따라 정리하는 스킬. 비대한 CLAUDE.md / AGENTS.md를 다이어트하고, 각 문서의 위치를 정하며, 중복 정보가 저장소 전체에 퍼지는 것을 막습니다.

- 저장소: [zning1994/brainharness-docs](https://github.com/zning1994/brainharness-docs)
- 트리거: 새 프로젝트 문서 골격 잡기, 250줄 넘은 CLAUDE.md, 어지러운 문서 재구성

### brainharness-autoresearch

스킬 프롬프트를 자동으로 최적화하는 스킬. Karpathy의 autoresearch 패턴에서 영감: 이진 eval 정의 → 에이전트 루프로 실험 → 프롬프트 변이 → 더 나은 변종 유지.

- 저장소: [zning1994/brainharness-autoresearch](https://github.com/zning1994/brainharness-autoresearch) (이전 `openclaw-autoresearch`)
- 트리거: 잘 작동하지 않는 스킬을 체계적으로 튜닝하고 싶을 때, 여러 프롬프트 변종 비교

---

## 프로젝트 구조

```text
brainharness/
├── .claude-plugin/
│   └── marketplace.json    # 플러그인 카탈로그 (각 소스 저장소를 가리킴)
├── README.md               # 영어 (기본)
├── README_KO.md            # 이 파일
├── README_CN.md / JA / ES / DE / PT / RU
├── CHANGELOG.md
└── LICENSE
```

`marketplace.json`의 각 플러그인 항목은 `source.url`로 자체 저장소를 가리킵니다. 덕분에 brainharness는 가볍게 유지됩니다 — 스킬 업데이트는 각자의 소스 저장소에 push만 하면 됩니다. brainharness는 플러그인 추가/제거 또는 카탈로그 메타데이터 업데이트 시에만 변경됩니다.

---

## 설계 원칙

- **한 스킬, 한 저장소** — 독립적인 버전 관리, 이슈, 릴리스
- **brainharness는 카탈로그일 뿐** — 내용 복제 없이, 모으기만
- **OpenClaw / ClawHub 공존** — 같은 스킬을 양쪽에 모두 배포 가능
- **한 번 고치면, 한 곳만** — `marketplace.json`의 URL 변경이 스킬 자체에는 영향 없음

---

## 기여 / 피드백

- 특정 스킬 문제 → 해당 스킬 저장소에 이슈 등록
- 마켓플레이스 자체 문제 (잘못된 URL, 누락 항목) → 이 저장소에 이슈 등록
- 자신의 스킬을 이런 식으로 배포하고 싶다면 → 이 저장소를 fork 해서 자신만의 마켓플레이스 템플릿으로 사용

---

## 라이선스

[MIT](LICENSE)
