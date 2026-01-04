# Twitter Raffle System (Twitter 自动抽奖系统)

一个专业的 Twitter 自动抽奖系统，支持用户通过关注、转发、评论参与每日抽奖。

## 功能特性

- ✅ **Twitter OAuth 登录** - 安全的 Twitter 账号登录
- ✅ **自动验证** - 自动检测用户是否关注、转发、评论
- ✅ **每日参与** - 用户每天可参与一次
- ✅ **实时展示** - 参与者列表实时更新
- ✅ **自动开奖** - 每天中国时间 7:00 AM 自动抽奖
- ✅ **中奖历史** - 完整的中奖记录和统计
- ✅ **专业设计** - 现代化的渐变色 UI 设计

## 技术栈

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Twitter OAuth
- **Twitter API**: twitter-api-v2
- **Scheduling**: node-cron
- **Icons**: Lucide React

## 前置要求

- Node.js 18+
- PostgreSQL 数据库
- Twitter Developer Account (用于 OAuth 和 API)

## 安装步骤

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd twitter-raffle
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env` 并填写以下配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/raffle_db"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production

# Twitter OAuth (从 https://developer.twitter.com/ 获取)
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret

# Twitter API v2 Bearer Token
TWITTER_BEARER_TOKEN=your-twitter-bearer-token

# Raffle Configuration
RAFFLE_TWITTER_USER_ID=your-twitter-user-id
RAFFLE_TWEET_ID=your-tweet-id

# Cron Job Configuration
CRON_API_KEY=your-secret-cron-key
ENABLE_CRON=true
```

### 4. Twitter Developer 配置

#### 获取 Twitter OAuth 凭证

1. 访问 [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. 创建一个新的 App
3. 在 "User authentication settings" 中：
   - Type of App: Web App
   - Callback URL: `http://localhost:3000/api/auth/callback/twitter`
   - Website URL: `http://localhost:3000`
4. 记录 `Client ID` 和 `Client Secret`

#### 获取 Bearer Token

1. 在同一个 App 中，进入 "Keys and tokens"
2. 生成 "Bearer Token"
3. 记录 Bearer Token

#### 获取 Twitter User ID

1. 使用 [Twitter ID Lookup](https://tweeterid.com/) 或类似工具
2. 输入你的 Twitter 用户名
3. 获取数字格式的 User ID

#### 获取 Tweet ID

1. 打开你想要用户转发和评论的推文
2. URL 格式为: `https://twitter.com/username/status/1234567890`
3. 其中 `1234567890` 就是 Tweet ID

### 5. 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev --name init

# (可选) 打开 Prisma Studio 查看数据
npx prisma studio
```

### 6. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
twitter-raffle/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth 路由
│   │   ├── participate/           # 参与抽奖 API
│   │   ├── participants/          # 获取参与者 API
│   │   ├── winners/               # 获取中奖者 API
│   │   ├── lottery/draw/          # 抽奖 API
│   │   └── config/                # 配置 API
│   ├── winners/                   # 中奖历史页面
│   ├── page.tsx                   # 主页
│   ├── layout.tsx                 # 根布局
│   └── providers.tsx              # Session Provider
├── lib/
│   ├── prisma.ts                  # Prisma 客户端
│   ├── auth.ts                    # NextAuth 配置
│   ├── twitter.ts                 # Twitter API 集成
│   ├── cron.ts                    # 定时任务
│   └── init.ts                    # 应用初始化
├── prisma/
│   └── schema.prisma              # 数据库模型
├── types/
│   └── next-auth.d.ts            # NextAuth 类型定义
└── .env                           # 环境变量
```

## 数据库模型

### User (用户)
- Twitter 账号信息
- 关联的参与记录和中奖记录

### Participant (参与者)
- 每日参与记录
- 关注、转发、评论状态
- 是否符合抽奖资格

### Winner (中奖者)
- 中奖记录
- 奖金金额
- 支付状态

### RaffleConfig (抽奖配置)
- Twitter User ID (关注目标)
- Tweet ID (转发和评论目标)
- 每日奖金和中奖人数
- 开奖时间设置

## API 端点

### POST `/api/participate`
用户参与抽奖，自动验证 Twitter 操作

### GET `/api/participants?date=YYYY-MM-DD`
获取指定日期的参与者列表

### GET `/api/winners?limit=10&date=YYYY-MM-DD`
获取中奖者列表

### POST `/api/lottery/draw`
手动触发抽奖（需要 API Key）

### GET/POST `/api/config`
获取/更新抽奖配置

## 定时任务

系统使用 node-cron 在每天中国时间 7:00 AM (UTC 23:00) 自动执行抽奖：

```typescript
// lib/cron.ts
cron.schedule('0 23 * * *', async () => {
  // 自动抽奖逻辑
}, {
  timezone: 'Asia/Shanghai'
});
```

## 部署

### Vercel 部署

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量（同 `.env` 文件）
4. 部署

### 数据库推荐

- [Vercel Postgres](https://vercel.com/postgres)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)
- [Neon](https://neon.tech)

### 环境变量配置

在 Vercel Dashboard 中配置所有环境变量，特别注意：
- `NEXTAUTH_URL` 改为生产域名
- `NEXTAUTH_SECRET` 使用强密码
- `ENABLE_CRON=true` 启用定时任务

## 安全建议

1. ✅ 使用强密码生成 `NEXTAUTH_SECRET`
2. ✅ 妥善保管所有 API Keys
3. ✅ 不要将 `.env` 提交到 Git
4. ✅ 定期轮换 API Keys
5. ✅ 在生产环境使用 HTTPS

## 常见问题

### Q: 如何测试抽奖功能？
A: 可以手动调用抽奖 API：
```bash
curl -X POST http://localhost:3000/api/lottery/draw \
  -H "Authorization: Bearer your-cron-api-key"
```

### Q: 如何修改开奖时间？
A: 修改 `lib/cron.ts` 中的 cron 表达式和时区

### Q: 如何修改每日中奖人数？
A: 在数据库中更新 `RaffleConfig` 表的 `winnersPerDay` 字段

### Q: Twitter API 有速率限制吗？
A: 是的，免费版有限制。建议使用 Twitter API v2 的标准或高级访问。

## 技术支持

如有问题，请提交 Issue 或联系开发者。

## License

MIT License

---

**注意**: 此系统仅供学习和个人使用，请遵守 Twitter 的服务条款和当地法律法规。
