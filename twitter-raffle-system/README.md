# 🎉 Twitter 每日抽奖系统

一个现代化、透明化的 Twitter 粉丝抽奖系统，每天抽取 2 位幸运儿，每人获得 $5 奖金。

## ✨ 特性

- 🎯 **公平透明**：随机抽奖算法，所有参与者可见
- 🎨 **科技喜庆风格**：现代化 UI 设计，带有动画效果和庆祝特效
- 👥 **实时参与列表**：查看所有参与者
- 🏆 **历史记录**：完整的中奖历史记录
- ⏰ **自动抽奖**：每天晚上 8:00 自动执行抽奖
- 📱 **响应式设计**：支持各种设备访问

## 🚀 快速开始

### 前置要求

- Node.js 16+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd twitter-raffle-system
```

2. **安装依赖**
```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

3. **启动后端服务器**
```bash
cd backend
npm run dev
```
后端将运行在 `http://localhost:3000`

4. **启动前端开发服务器**
```bash
cd frontend
npm run dev
```
前端将运行在 `http://localhost:5173`

5. **访问应用**

打开浏览器访问 `http://localhost:5173`

## 📁 项目结构

```
twitter-raffle-system/
├── backend/
│   ├── server.js          # Express 服务器主文件
│   ├── database.js        # SQLite 数据库配置
│   ├── package.json       # 后端依赖
│   └── raffle.db         # SQLite 数据库文件（自动生成）
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # 主应用组件
│   │   ├── App.css       # 组件样式
│   │   ├── index.css     # 全局样式
│   │   └── main.jsx      # 入口文件
│   ├── index.html        # HTML 模板
│   ├── vite.config.js    # Vite 配置
│   └── package.json      # 前端依赖
└── README.md
```

## 🎮 使用说明

### 参与抽奖

1. 在首页输入您的 Twitter ID（不含 @ 符号）
2. 点击"加入抽奖"按钮
3. 等待每日抽奖结果公布

### 查看参与者

- 左侧面板实时显示所有参与者
- 可以看到其他人的 Twitter ID 和参与时间

### 查看中奖记录

- 右侧面板显示历史中奖记录
- 今日中奖者会在顶部高亮显示
- 包含完整的历史抽奖记录

### 手动执行抽奖（管理员）

如果今天还未抽奖，会显示"开始今日抽奖"按钮，点击即可立即执行抽奖。

## 🔧 API 接口

### 获取所有参与者
```
GET /api/participants
```

### 添加参与者
```
POST /api/participants
Body: { "twitter_id": "username" }
```

### 获取抽奖历史
```
GET /api/raffles
```

### 获取今日抽奖状态
```
GET /api/raffle/today
```

### 执行抽奖
```
POST /api/raffle/execute
```

### 获取统计数据
```
GET /api/stats
```

## ⏰ 自动抽奖

系统配置了每天晚上 8:00 (20:00) 自动执行抽奖。

要修改抽奖时间，编辑 `backend/server.js` 中的 cron 表达式：

```javascript
// 当前：每天 20:00
cron.schedule('0 20 * * *', async () => {
  // ...
});

// 示例：每天中午 12:00
cron.schedule('0 12 * * *', async () => {
  // ...
});
```

## 🎨 自定义样式

所有样式都在 `frontend/src/index.css` 中定义。

主要颜色变量：
```css
--primary: #1d9bf0;      /* Twitter 蓝 */
--secondary: #7c3aed;    /* 紫色 */
--accent: #f59e0b;       /* 金色（奖励色） */
--success: #10b981;      /* 成功绿 */
```

## 🔒 安全建议

- 生产环境中应添加身份验证
- 限制 API 调用频率（防止滥用）
- 使用环境变量管理配置
- 添加 HTTPS 支持
- 实现更安全的随机数生成

## 📝 数据库模式

### participants 表
- `id`: 自增主键
- `twitter_id`: Twitter ID（唯一）
- `joined_at`: 参与时间

### raffles 表
- `id`: 自增主键
- `draw_date`: 抽奖日期（唯一）
- `executed_at`: 执行时间
- `status`: 状态

### winners 表
- `id`: 自增主键
- `raffle_id`: 抽奖 ID（外键）
- `participant_id`: 参与者 ID（外键）
- `twitter_id`: Twitter ID
- `prize_amount`: 奖金金额
- `won_at`: 中奖时间

## 🛠️ 技术栈

### 后端
- Node.js
- Express.js
- SQLite (better-sqlite3)
- node-cron（定时任务）

### 前端
- React 18
- Vite
- Framer Motion（动画）
- React Confetti（庆祝特效）

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题，请提交 Issue。
