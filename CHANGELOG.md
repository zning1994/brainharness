# Changelog

All notable changes to the brainforge marketplace will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This file tracks changes to the marketplace itself (manifest, docs, layout) — not to individual plugins. For plugin-level changes, see each plugin's own CHANGELOG.

## [0.2.0] - 2026-10-04

### Changed

- Rename `brainforge` to `brainharness` and align repository links and installation names with BrainHarness.
- Update distribution metadata and documentation; preserve skill behavior and historical release notes.

## [0.1.3] - 2026-04-23

### Added

- Six additional README translations: Japanese (`README_JA.md`), Spanish (`README_ES.md`), German (`README_DE.md`), Korean (`README_KO.md`), Portuguese (`README_PT.md`), Russian (`README_RU.md`)
- Language switcher in every README now lists all 7 other available languages

### Changed

- `marketplace.json` metadata version: `0.1.2` → `0.1.3`

## [0.1.2] - 2026-04-23

### Added

- English README as the default (`README.md`)
- Chinese README moved to `README_CN.md` with language switcher at the top
- Language switcher links in both READMEs, mirroring the multi-language structure used by `cooking-skill`

### Changed

- `marketplace.json` metadata version: `0.1.1` → `0.1.2`

## [0.1.1] - 2026-04-23

### Added

- CHANGELOG.md — this file, tracking marketplace-level changes
- README now links to CHANGELOG in the top navigation

### Changed

- `marketplace.json` metadata version: `0.1.0` → `0.1.1`

## [0.1.0] - 2026-04-23

### Added

- Initial marketplace manifest (`.claude-plugin/marketplace.json`) listing 3 plugins:
  - [`cooking-skill`](https://github.com/zning1994/cooking-skill) `0.1.0`
  - [`docs-organization`](https://github.com/zning1994/docs-organization) `1.1.0`
  - [`brainforge-autoresearch`](https://github.com/zning1994/brainforge-autoresearch) `0.2.4`
- README with marketplace overview, install instructions, and per-plugin summaries
- MIT LICENSE

### Notes

- `brainforge-autoresearch` was renamed from `openclaw-autoresearch` as part of this launch; GitHub auto-redirects the old URL
- Each plugin lives in its own GitHub repo; brainforge is a lightweight manifest-only aggregator

[0.1.3]: https://github.com/zning1994/brainforge/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/zning1994/brainforge/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/zning1994/brainforge/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/zning1994/brainforge/releases/tag/v0.1.0
