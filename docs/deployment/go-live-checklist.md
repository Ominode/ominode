# Ominode 上线前检查清单（Go-Live Checklist）

> 适用于 ominode.com 生产环境正式上线前的逐项核对。
> 标 🔴 的是不上线就会出问题的项；🟡 是商用建议；🟢 是可选优化。

## 0. 当前环境基线（已确认）

- 服务器：阿里云新加坡轻量 2C4G，Docker Compose 部署（ominode + postgres + redis）
- 域名：ominode.com（阿里云购买，Cloudflare DNS，橙色云代理）
- DNS 现状：仅 `ominode.com` 和 `www.ominode.com` 有解析；`api./docs./status./admin.` 均不存在
- 已完成：GHCR 部署流水线、VERSION 注入、`.env` 密码管理、DB 定时备份（每 4 小时）、SYSTEM_NAME=ominode、日志文件 ominode 前缀

---

## 1. 域名 / 网络 🔴

- [ ] **ServerAddress 设为 `https://ominode.com`**（后台 → 系统设置 → 站点设置）
  - 这是全系统最重要的一个配置：OAuth 回调、密码重置邮件链接、支付回调/跳转、Passkey、Midjourney 图片代理 URL 全部从它派生。配错 = 这些功能全挂。
- [ ] **Cloudflare SSL/TLS 模式确认**：如果是 Flexible（CF→源站明文 HTTP），建议后期切 Full (strict) + 源站 Caddy（仓库根目录已备好 Caddyfile 和 compose 注释段）
- [ ] **`SESSION_COOKIE_SECURE=true` + `SESSION_COOKIE_TRUSTED_URL=https://ominode.com`**（服务器 `.env` / compose 环境变量）——全站 HTTPS 后应开启；注意 TRUSTED_URL 配错会导致服务拒绝启动
- [ ] 子域名规划（当前都没有，按需添加 CF 解析）：
  - API 与主站同源（`ominode.com/v1`），**不需要**单独的 api. 子域
  - `status.ominode.com`（可选）：后期接 UptimeRobot / Uptime Kuma 状态页
  - `docs.ominode.com`（可选）：自建文档站之前，先把后台 DocsLink 改掉（见 §5）

## 2. 管理员账号 / 访问控制 🔴

- [ ] **确认 root 账号来源与密码**：如果部署时走过初始化向导（setup wizard）则无碍；如果是自动创建的 `root/123456`，**立刻改密码**
- [ ] 开启管理员的 **2FA / Passkey**（个人设置里），root 账号必须开
- [ ] 日常运营用普通 admin 账号，root 仅应急（系统支持 guest/user/admin/root 四级 + Casbin 细粒度权限）

## 3. 注册 / 反滥用 🔴

新实例默认"裸奔"：注册开、邮箱验证关、人机验证关。上线前：

- [ ] **SMTP 配置**（系统设置 → 邮件）：SMTPServer/Port/Account/Token/From，发一封测试邮件验证
- [ ] **`EmailVerificationEnabled` 开启**（否则任何人可以用假邮箱无限注册）
- [ ] **Turnstile 开启**：Cloudflare Turnstile 后台拿 Site Key + Secret 填入（站点密钥会通过 `/api/status` 公开，属正常）
- [ ] 按需配置：邮箱域名白名单（EmailDomainRestrictionEnabled + Whitelist）、别名限制
- [ ] **邀请奖励/新用户额度**：`QuotaForNewUser`、`QuotaForInviter` 默认 0，按商业模型设定
- [ ] 敏感词：过滤开关默认开，但词表只有占位符 `test_sensitive`，**必须填入真实词表**否则形同虚设

## 4. 支付 🔴

**总开关**：所有支付网关都被"合规确认"闸门控制——后台支付设置里必须确认合规声明（记录版本/操作人/IP），否则全部支付方式静默不可用。

按你选用的渠道逐项配置（不用全配，选你要用的）：

### 易支付（Epay，国内个人收款常用）
- [ ] `PayAddress`（易支付网关地址）、`EpayId`、`EpayKey`、`Price`、`MinTopUp`
- [ ] 回调地址：默认 `{ServerAddress}/api/user/epay/notify`；如需自定义用 `CustomCallbackAddress`
- [ ] 在易支付商户后台核对 notify URL 可达

### Stripe
- [ ] `StripeApiSecret`、`StripePriceId`、`StripeWebhookSecret`（三个缺一不可）
- [ ] Stripe Dashboard 注册 webhook：`https://ominode.com/api/stripe/webhook`
- [ ] `StripeUnitPrice`、`StripeMinTopUp`、可选 promotion codes

### Creem
- [ ] `CreemApiKey`、`CreemProducts`（JSON）、`CreemWebhookSecret`
- [ ] **`CreemTestMode` 必须为 false**（测试模式且 secret 为空时跳过签名验证，生产致命）
- [ ] webhook：`https://ominode.com/api/creem/webhook`

### Waffo / Waffo-Pancake
- [ ] Waffo：ApiKey/PrivateKey/PublicCert 三件套 + MerchantId（或用 Sandbox 三件套测试）
- [ ] Waffo-Pancake：MerchantID/PrivateKey/ProductID；webhook 在 Pancake 后台注册 `{ServerAddress}/api/waffo-pancake/webhook/{test|prod}`

### 通用
- [ ] 充值档位 `payment_setting.amount_options` 与折扣 `amount_discount`
- [ ] 额度显示单位（美元/人民币/Tokens/自定义符号汇率）：`general_setting.quota_display_type`
- [ ] **端到端测试**：用最小金额真实充值一笔，确认回调入账 → 再测试订阅支付（如启用）
- [ ] 已知缺口：无用户侧退款流程、无发票/收据（roadmap 项）

## 5. 站点内容 / 品牌 🟡

- [ ] ~~SystemName~~ ✅ 已通过 `SYSTEM_NAME=ominode` 环境变量解决
- [ ] **DocsLink**：默认值指向上游 `https://docs.newapi.pro`——改成自己的文档站或暂时清空
- [ ] Logo、Footer（支持 HTML）、About 页内容、首页内容（HomePageContent）、公告（Notice）
- [ ] **法律页面 🔴（商用必须）**：`legal.user_agreement`（用户协议）、`legal.privacy_policy`（隐私政策）默认为空，必须填写

## 6. 登录方式（按需启用）

- [ ] GitHub OAuth：ClientId/Secret，回调 `https://ominode.com/oauth/github`
- [ ] Discord / LinuxDO / OIDC / 自定义 OAuth：同理，回调均为 `{ServerAddress}/oauth/<provider>`
- [ ] Telegram：`TelegramBotToken` + `TelegramBotName`
- [ ] 微信扫码：需自建/租用微信登录中转服务（WeChatServerAddress/Token）
- [ ] Passkey：`passkey.enabled` 开启后，RPID = `ominode.com`（裸域名，无协议头），Origins = `https://ominode.com`；不配则从 ServerAddress 自动派生

## 7. 渠道 / 号池（业务核心）

- [ ] 配置上游渠道（支持单渠道多 key，换行分隔；随机/轮询）
- [ ] 优先级 + 权重分层（高优先级 = 主用，低优先级 = 兜底）
- [ ] `AutomaticDisableChannelEnabled` 开启 + `AutomaticDisableKeywords` 按业务调整
- [ ] `CHANNEL_UPDATE_FREQUENCY`（余额轮询）按需；余额不足自动禁用
- [ ] 模型定价：同步官方倍率（模型同步/价格同步功能）后按毛利调整
- [ ] 已知缺口（roadmap）：429 冷却复活、per-key 用量、池容量视图

## 8. 运维 / 监控 🟡

- [x] 数据库定时备份（每 4 小时，保留 14 天）
- [ ] 阿里云快照（防整机故障）
- [ ] 备份异地拷贝（OSS / 本地下载）
- [ ] 外部可用性监控（UptimeRobot 免费版监控 `https://ominode.com/api/status`）
- [ ] 内部监控面板（管理员 → 系统维护：性能指标、日志文件管理）
- [ ] 日志保留策略（错误日志开关已开；定期清理旧日志）
- [ ] 多节点暂不需要；如需扩展：所有节点共享同一 `SESSION_SECRET` + Redis 必需

## 9. 安全加固 🟡

- [ ] `CRYPTO_SECRET` 显式设置（默认跟随 SESSION_SECRET；它加密存储的渠道 key，**设定后不可再改**，改了存量密钥无法解密）
- [ ] 确认服务器上 3306（chain-operate-bot 的 MySQL）公网暴露的密码强度（非本项目容器，但同台机器）
- [ ] Postgres/Redis 端口未映射公网 ✅（compose 默认不暴露）
- [ ] 审计日志已内置（管理员操作留痕，含 IP）

## 10. 上线前最后一遍端到端验证

- [ ] 注册新账号（邮箱验证链路完整）
- [ ] 充值一笔最小金额（回调入账正确）
- [ ] 创建令牌 → 用 `/v1/chat/completions` 发一次真实请求 → 扣费正确
- [ ] 后台看日志/计费记录/看板数据一致
- [ ] 密码重置邮件链路
- [ ] OAuth 登录（如启用）
- [ ] 移动端浏览器访问（响应式）
