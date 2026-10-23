# NerveCenter

**new-api / sub2api 中转站账号管理中心**：把你在各个中转站上的账号接到一处，余额、API Key、用量、分组倍率、模型比价和提醒，都在一个控制台里。

- 在线使用：https://nvcenter.cc
- 产品介绍：https://nvcenter.cc/intro

> 本仓库只包含产品介绍和一小部分网页前端代码（首页、产品介绍页、通用组件），用于展示，不是完整源码，也无法单独构建运行。NerveCenter 服务本身不开源。

## 适合谁

- **中转站站长**：手上有一串上游账号，每个面板都要单独登录，查余额要一个个点开，Key 散在各处，倍率调了不知道。
- **在多个中转站都有账号的用户**：想知道同一个模型在哪个站最便宜、最稳。

## 主要功能

- **渠道接入**：粘贴面板地址，自动识别 new-api 或 sub2api。在自己的浏览器里登录面板，按图文教程把登录凭据复制过来，带验证码的站点也能用。
- **余额总览**：所有渠道的总余额、今日和近 7 天消耗、余额趋势；余额不足、需要重新授权的渠道集中列出。
- **API Key 管理**：不登录面板也能新建、修改、停用、删除上游 Key，按渠道、分组、状态筛选，并显示每把 Key 所在分组的倍率。
- **用量日志**：按天、按模型统计请求数和费用，逐条调用明细，可导出 CSV / NDJSON。
- **倍率与价格**：只列你能用的分组和你实际适用的倍率，模型价格统一换算成每 1M token 的输入价和输出价。
- **渠道简报**：定时比对分组倍率和模型列表，涨价、降价、新分组、模型上下架都有时间线。
- **健康数据**：读取面板自身统计的成功率、平均耗时、首字耗时。不用你的 Key 发测试请求，不产生费用。
- **模型比价**：同一个模型在你各个渠道上的价格和稳定性放在一起比，挑出最便宜、最稳、最划算的线路。
- **通知提醒**：余额预警、渠道异常、倍率与模型变化、安全提醒，推送到站内消息、Telegram 或 Webhook。
- **Telegram 机器人**：[@NerverCenter_bot](https://t.me/NerverCenter_bot)，查看余额、用量和倍率变化，管理 Key，调整推送。
- **团队协作**：工作区、成员邀请和角色，渠道可设为“仅自己”或“团队共享”。
- **账号安全**：两步验证和恢复码、登录设备管理、安全动态。
- **个人 API 令牌**：给脚本和自动化工具用，权限按需勾选，能做的永远不超过你本人。
- **问题反馈**：在网站上提交问题，随时看到是否采纳和处理进度。

## 支持的面板

- new-api（以及能识别出的改版面板）
- sub2api

其他面板会提示“该地址上没有找到支持的面板”。

## 安全

- 上游凭据入库前加密，每条凭据有自己的数据密钥（AES-256-GCM）。
- 平台管理员看不到你的上游凭据。查看某把 Key 的明文要先通过两步验证，并记入审计。
- 绑定渠道、查看明文、调整权限等敏感操作都会记入审计。
- 账号密码只保存 argon2id 哈希。
- 接入 new-api 时，“一行命令”里的面板密码只发给面板本身，不经过 NerveCenter。

## 三步上手

1. 打开 https://nvcenter.cc 注册。
2. 进入“渠道 → 添加渠道”，粘贴面板地址，按页面上的步骤接入。
3. 一两分钟后，余额、Key 和用量就会出现在中控台。顺手设一条余额提醒线，再开两步验证。

## 本仓库包含什么

```
docs/product-intro.zh.md          完整产品介绍（中文）
web/src/pages/Landing.tsx         首页
web/src/pages/Intro.tsx           产品介绍页
web/src/components/landing/       首页插图、控制台预览和功能介绍
web/src/components/ui.tsx         通用界面组件
web/src/lib/messages.landing.ts   首页文案（中英）
web/src/index.css                 全局样式
```

前端使用 React、TypeScript 和 Tailwind CSS。这些文件引用了未公开的模块，无法单独构建。

## 链接

- 网站：https://nvcenter.cc
- 产品介绍：https://nvcenter.cc/intro
- 两步验证工具（没有手机时使用，验证码只在浏览器里计算）：https://nvcenter.cc/tools/2fa
- Telegram 机器人：https://t.me/NerverCenter_bot

## English

NerveCenter brings your accounts on many **new-api** and **sub2api** relay panels into one console: balances, upstream API keys, usage logs, group ratios, model price comparison and alerts.

- Connect a panel by pasting its address; NerveCenter detects new-api or sub2api. You sign in from your own browser, so panels with captchas work too.
- See balances across every channel, with low-balance and re-authorisation alerts.
- Create, edit, disable and delete upstream keys without signing in to each panel.
- Usage logs by day and by model, exportable as CSV or NDJSON.
- Group ratios and model prices per channel, in USD per 1M tokens.
- A timeline of ratio, group and model changes, plus panel health (success rate, latency).
- Model price comparison: the cheapest and most stable channel for each model.
- Alerts in the app, on Telegram ([@NerverCenter_bot](https://t.me/NerverCenter_bot)) or by webhook.
- Team workspaces, two-step verification and personal API tokens.

Upstream credentials are encrypted at rest. Platform admins can't see them, and every sensitive action is audited.

This repository holds only the product introduction and a small excerpt of the web front end, for reference. It isn't the full source and doesn't build on its own. NerveCenter is a closed-source service: https://nvcenter.cc

## 版权 / Copyright

© NerveCenter. 保留所有权利。本仓库代码仅供展示，未授予开源许可。

All rights reserved. The code here is shown for reference only; no open-source licence is granted.
