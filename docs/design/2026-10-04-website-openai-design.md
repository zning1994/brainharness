Status: canonical
Audience: operator
Last reviewed: 2026-10-04

# BrainHarness 官网与跨平台分发设计

目标是帮助访客了解技能、选择平台并完成安装。主仓库同时保存官网和平台市场清单，三个技能仓库继续作为各自内容的唯一来源。

## 选择与边界

采用 main/site/ 与 GitHub Actions 发布静态 Pages。独立官网仓库会增加目录同步成本；gh-pages 源码分支会拆散维护流程。第一版不采用这两种方式。

第一版提供英文和简体中文。默认英文，用户显式切换语言；不按浏览器语言强制跳转。首页包括品牌介绍、三个技能的任务实例、平台安装选择、执行条件、项目链接。没有登录、付费、统计脚本或后台。公开源代码，不展示私有技能仓库。

## 结构与数据

官网使用 Node.js 24 内置模块生成 HTML，无生产依赖。site/content.mjs 保存双语文案及每平台的明确状态；插件名称和 GitHub 来源读取现有 .claude-plugin/marketplace.json，不维护另一份 URL 列表。

生成 /en/ 与 /zh/ 页面及根入口。SITE_URL 控制发布地址，默认 GitHub Pages 项目 URL。输出相对资源路径，支持 /brainharness/ 子路径；canonical、hreflang、sitemap 使用完整发布地址。尚未配置并验证 brainharness.si 前不绑定域名。

颜色：纸白 #ffffff、淡蓝灰 #eef3fa、墨蓝 #142344、钴蓝 #204fd4、次要文字 #52617a。标题使用系统 Georgia 衬线，正文使用系统无衬线，命令使用等宽字体。左侧说明配右侧可切换任务示例；技能区按内容长度自然排版，安装区明确区分平台。无自动动画，键盘焦点清晰，移动端单列。

## 兼容策略

Claude 继续读取既有清单与独立仓库，不把 site/ 声明为插件来源。不提交 node_modules、构建产物或大媒体。

OpenAI 在主仓库新增 .agents/plugins/marketplace.json，使用 URL 来源指向三个独立仓库。每个技能仓库新增 portable plugin.json，保留 Claude manifest。仅在安装与资源解析验证通过后标记 Codex 可用。ChatGPT 公开目录状态显示未上架，不生成假的安装链接。

技能正文保持根目录单一来源，现有技能入口符号链接保留。Cooking 补 references 资源链接，Autoresearch 补脚本、指南及 examples 链接。打包时将所需链接实体化，归档中不依赖包外文件。Autoresearch 明确需要 Python、模型服务凭据及本地执行环境；不宣称普通 ChatGPT 中无配置运行。

跨仓精确范围已经通过异步问题提交用户确认，未确认前只实施单仓官网。公开审核和付费模型调用不在本轮范围。

## 验收与发布

检查双语链接、缺失清单条目、恶意字符串转义、部署子路径、无 JS 内容、复制失败提示与移动端溢出。只构建静态文件，不启动用户开发服务器。浏览器查看本地构建或临时只读页面完成交互检查。

GitHub Actions 仅对 site/、市场清单和工作流改动触发发布；PR 只构建验证，main 才部署。提交前给用户实际文件清单和远端目标。GitHub Pages 成功工作流、线上 HTTP 和页面内容分别验证。域名 DNS 和 HTTPS 属于独立验收步骤。

官方依据：https://developers.openai.com/plugins/build/plugins 与 https://code.claude.com/docs/en/plugin-marketplaces 。公开目录提交遵循 https://developers.openai.com/plugins/guides/submit-claude-plugin 。
