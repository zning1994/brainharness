<div align="center">

# brainharness

> Claude Code スキルを鍛えるための工房。

[![Claude Code](https://img.shields.io/badge/Claude%20Code-Marketplace-blueviolet)](https://claude.ai/code)
[![Plugins](https://img.shields.io/badge/plugins-3-green)](#同梱プラグイン)
[![Status](https://img.shields.io/badge/status-v0.2.0-orange)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Claude Code プラグインマーケットプレイス。
自分で書いて実際に使っているスキル/プラグインをまとめ、誰でも 1 コマンドでインストールできるようにしています。

[インストール](#インストール) · [同梱プラグイン](#同梱プラグイン) · [貢献](#貢献--フィードバック) · [Changelog](CHANGELOG.md) · [Releases](https://github.com/zning1994/brainharness/releases)

**Other Languages / 其他语言：**

[English](README.md) · [简体中文](README_CN.md) · [Español](README_ES.md) · [Deutsch](README_DE.md) · [한국어](README_KO.md) · [Português](README_PT.md) · [Русский](README_RU.md)

</div>

---

## これは何か

brainharness は単独のスキルではなく、**マニフェストリポジトリ**です。`marketplace.json` が 1 つ入っているだけで、各プラグインの独立した GitHub リポジトリを列挙しています。Claude Code はこのマニフェストを読み、各スキルをそれぞれのソースリポジトリから取得します。

各スキルは独自のリポジトリ、Issue トラッカー、リリースサイクルを持っています。brainharness はそれらを同じ棚にまとめる役割だけを担います。

---

## インストール

### マーケットプレイスを追加

```bash
/plugin marketplace add zning1994/brainharness
```

### プラグインをインストール

```bash
/plugin install brainharness-cooking@brainharness
/plugin install brainharness-docs@brainharness
/plugin install brainharness-autoresearch@brainharness
```

### 最新版に更新

```bash
/plugin marketplace update brainharness
/reload-plugins
```

---

## 同梱プラグイン

### brainharness-cooking

今夜何を作るか、どう作るか、失敗した時の救済策を提案するスキル。デフォルトは中華の家庭料理。まず 2 つの重要な条件を確認してから、実際に鍋で再現できる提案を返します。

- リポジトリ：[zning1994/brainharness-cooking](https://github.com/zning1994/brainharness-cooking)
- トリガー例：`今夜何食べよう`、`冷蔵庫に X と Y がある、何が作れる`、`牛肉を柔らかく炒めるコツ`

### brainharness-docs

プロジェクトドキュメントをサイズ・対象読者・鮮度で整理するスキル。肥大化した CLAUDE.md / AGENTS.md をスリム化し、各ドキュメントの置き場所を決め、情報の重複を防ぎます。

- リポジトリ：[zning1994/brainharness-docs](https://github.com/zning1994/brainharness-docs)
- トリガー例：新規プロジェクトのドキュメント骨組み、250 行を超えた CLAUDE.md、散らかったドキュメントの再構成

### brainharness-autoresearch

スキルのプロンプトを自動で最適化するスキル。Karpathy の autoresearch パターンに基づく：バイナリ eval を定義 → エージェントループで実験 → プロンプトを変異 → 良い変種を残す。

- リポジトリ：[zning1994/brainharness-autoresearch](https://github.com/zning1994/brainharness-autoresearch)（旧 `openclaw-autoresearch`）
- トリガー例：調子の悪いスキルを体系的にチューニングしたい、複数のプロンプト変種の効果を比較したい

---

## プロジェクト構造

```text
brainharness/
├── .claude-plugin/
│   └── marketplace.json    # プラグインカタログ（各ソースリポを指す）
├── README.md               # 英語（デフォルト）
├── README_JA.md            # このファイル
├── README_CN.md / ES / DE / KO / PT / RU
├── CHANGELOG.md
└── LICENSE
```

`marketplace.json` の各プラグインは `source.url` で独立したリポジトリを指すため、brainharness は軽量なまま。スキルを更新するときは各自のリポジトリに push するだけで、brainharness を触る必要はありません。brainharness を更新するのはプラグインの追加/削除・カタログメタデータの変更のときだけです。

---

## 設計思想

- **1 スキル = 1 リポジトリ** — 独立したバージョニング、Issue、リリース
- **brainharness はカタログにすぎない** — 内容の複製はせず、集約だけ
- **OpenClaw / ClawHub との共存** — 同じスキルを両方で公開可能
- **1 変更 = 1 箇所** — `marketplace.json` の URL 変更がスキル本体に影響しない

---

## 貢献 / フィードバック

- 特定スキルの問題 → そのスキルのリポジトリに Issue を立てる
- マーケットプレイス自体の問題（URL 誤り、欠落エントリなど） → 本リポジトリに Issue を立てる
- 自分のスキルをこの方法で公開したい → 本リポジトリをテンプレートとして fork

---

## ライセンス

[MIT](LICENSE)
