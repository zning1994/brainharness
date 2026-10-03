Status: canonical
Audience: operator
Last reviewed: 2026-10-04

# 官网与跨平台分发实施计划

目标：构建可部署双语官网，并逐个验证 OpenAI 插件适配。
设计：../design/2026-10-04-website-openai-design.md。
实施方式：本会话逐项执行。保留工作树，提交前核对实际范围。

## 任务一：静态官网

新增 site/package.json、site/build.mjs、site/content.mjs、site/style.css、site/app.js、site/favicon.svg、site/tests/build.test.mjs；新增 .gitignore 中 site/dist/ 忽略项。

- [x] content 导出 locales.en、locales.zh，包含导航、英雄区、三个技能、安装区及能力状态。名称和来源以现有 Claude 清单为准。
- [x] build 导出 renderPage(locale, catalog, baseUrl)，生成两个语言页面、根入口、robots.txt、sitemap.xml，复制 CSS/JS/SVG。
- [x] 所有正文与属性通过 escapeHtml 转义；未知或缺失插件应停止构建，不发布残缺命令。
- [x] app 使用 DOM textContent 更新示例与安装命令；复制成功后才显示成功提示，失败保留可选择命令；无 JS 仍可阅读英文页面和命令。
- [x] node --test 验证双语、子路径、清单 URL 唯一来源、HTML 转义和未知插件错误。构建后检查桌面和移动页面。

## 任务二：Pages 与项目说明

新增 .github/workflows/pages.yml，修改 README.md 中官网入口与维护说明。不改其他语言 README 的技能内容；根 README 作为网站维护的唯一说明。

- [x] PR 和 main 运行 Node 24 测试与构建。
- [x] 上传 site/dist；仅 main 使用 deploy-pages 发布，permissions 最小化并使用 github-pages environment。
- [x] 不写 CNAME，不修改 DNS。GitHub Pages 已直接绑定用户配置好的正式域名，并按正式域名验收。
- [x] 核对 git diff、清单验证和旧 Claude 安装。用户已确认提交文件范围，代码已推送，Pages 已启用。

## 任务三：跨仓兼容，文件范围已确认

每个技能仓库新增 plugin.json；修改 README.md、CHANGELOG.md、SKILL.md 版本与 .claude-plugin/plugin.json 版本。Cooking 新增 skills/brainharness-cooking/references；Autoresearch 新增技能目录下 autoresearch.py、eval-guide.md、examples 链接。主仓新增 .agents/plugins/marketplace.json。

- [x] Cooking 首先完成适配。保留原 description，增加名称与界面元数据，不增加凭据或 MCP 配置。
- [x] 在隔离 Codex 配置目录添加本地测试市场，真实安装并检查 SKILL.md、references 解析。
- [x] Docs 使用同样的已验证清单，测试入口与说明。
- [x] Autoresearch 验证 Python 脚本和参考资料位置，仅运行 --help 或静态检查，不调用外部模型。
- [x] 验证 portable manifest 与 Claude manifest 的 name/version 一致。打包归档不能包含包外符号链接、.env、测试输出或私有内容。
- [x] 本地验证结果写入官网状态；ChatGPT 公开上架仍显示未提交。

## 审核重点

子路径资源不能跳到域名根；中英文文案不得遗漏；不能把菜单可见当成安装成功；不能把 Codex 本地兼容当成 ChatGPT 公开可用；域名未解析时不得替换默认发布地址。工作流失败保留已有线上版本，修复后重新验证。


## 本轮实施记录

✅VERIFIED：双语官网完成，Node 构建和 5 项测试通过。Playwright 使用构建后的 HTML/CSS/JS 验证桌面及 390px 手机布局、平台选择、技能选择、任务示例切换、复制成功与失败反馈。未启动开发服务器。预览导出到本任务 outputs/website-preview/。

✅VERIFIED：三个 portable manifest 已准备，完整实体文件包在独立 Codex 配置目录安装成功，技能资源可读，Autoresearch --help 成功。没有运行外部模型实验。原日常 Codex 配置未改动。

⛔CONFLICT：保留符号链接的源仓包虽然报告安装成功，但当前 Codex 缓存跳过技能入口和资源链接。不能据此宣称 main 源码布局可直接用于 Codex。依据：evidence/codex-isolated/plugins/cache/brainharness-links-test/ 下技能目录为空，而 brainharness-compat-test 的实体包可读。

范围调整已获用户确认：主仓新增 scripts/package-openai.mjs 与 scripts/package-openai.test.mjs，生成无符号链接分发树；三个技能用 openai/v0.2.1、openai/v1.2.1、openai/v0.3.1 分支分发，主仓 OpenAI 清单 ref 指向对应分支。技能源 main 保持唯一来源，Claude 仍使用 main。2026-10-04 已实施打包脚本并完成本地安装验证。

待完成：最终提交范围确认、源仓及分发分支推送、远端分发安装验证、GitHub Pages 启用和线上验收。brainharness.si 的根域 A 与 www CNAME 已解析至 GitHub Pages，域名尚未绑定。未提交 OpenAI 公开目录审核。

## 分发包验收

✅VERIFIED：新脚本生成 Cooking 0.2.1 共 11 文件、Docs 1.2.1 共 5 文件、Autoresearch 0.3.1 共 9 文件。在独立 Codex 配置目录安装全部成功，25 文件与打包产物字节一致，技能入口均为实际文件。Autoresearch --help 通过；未运行模型实验。证据位于任务目录 evidence/openai-distribution-final-verification.json。

✅VERIFIED：打包及网站 11 项测试通过，网站静态构建通过。Claude manifest 校验通过，但校验器跳过源仓符号链接并给出警告；实体目标另外验证。

⚠️UNVERIFIED：三个 openai/v版本号 远端分支尚未发布，仓库 URL 安装和线上工作流尚未验收。当前包来自待提交工作树；源仓提交后按同一脚本重新生成，并与已验证包校验一致再发布。网站工作流已配置测试，不代表远端 CI 已运行。

最终审查修复：分发包不再复制含失效相对链接的源码 README，改为生成技能目录与源文档链接。新增测试先失败后通过，最终包重新安装并完成 25 文件比对。

## 发布执行

2026-10-04 用户确认全部提交与发布范围。三个技能源仓 main 已核实为 50aa3fd、84d6291、1cf7c58。三个版本分发分支已推送并核实远端，Codex 从 GitHub URL 安装三个插件成功。Pages workflow 模式已启用，正式域名已提交绑定；网站 SITE_URL 使用 https://brainharness.si。证书与部署成功需要后续线上核验。

## 最终验收结果

✅VERIFIED：官网提交 6039087 已落入远端 main。GitHub Actions 运行 37154952097 构建与部署成功。正式域名根页面、中英文页面、CSS、JS、sitemap 均返回 HTTP 200；中英文 HTML 与本地正式域名构建逐字节一致。www 与 HTTP 请求跳转至 HTTPS 根域。Pages API 确认 https_enforced=true，证书覆盖根域与 www。

✅VERIFIED：公开命令 codex plugin marketplace add zning1994/brainharness 及三个插件安装成功，远端下载后的 25 个文件与已验证产物一致。分发提交：Cooking 801029b，Docs a2bcb6f，Autoresearch b44ce87。

本次提交、分发和官网部署已完成。ChatGPT 公开目录审核、模型实验、GitHub Release 和 ClawHub 新版本不在本次发布范围；没有宣称已完成这些事项。
