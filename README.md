# ChinaCNU WhatsApp 翻译助手

<div align="center">

**专业的WhatsApp Web即时翻译工具 - 专为外贸人士打造**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)](https://chrome.google.com/webstore)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange.svg)](manifest.json)

</div>

## 📖 项目简介

ChinaCNU WhatsApp 翻译助手是一款专为外贸从业者设计的Chrome浏览器扩展插件。它能在WhatsApp Web页面中提供即时翻译功能，帮助您轻松跨越语言障碍，与全球客户无缝沟通。

### ✨ 核心特性

- 🌍 **多语言支持**：支持中文、英语、西班牙语、法语、德语等12种常用语言
- 🚀 **即时翻译**：点击消息旁的翻译按钮，立即获取翻译结果
- 🤖 **自动翻译**：可选择自动翻译所有新消息，提高沟通效率
- 💯 **完全免费**：使用免费的翻译API，无需注册或付费
- 🎨 **精美界面**：现代化的UI设计，与WhatsApp Web完美融合
- 🔒 **隐私保护**：所有翻译在本地处理，保护您的聊天隐私
- ⚡ **轻量高效**：占用资源少，不影响WhatsApp Web的使用体验

## 🚀 快速开始

### 安装步骤

#### 方法一：从源码安装（开发版）

1. **下载项目**
   ```bash
   git clone https://github.com/yourusername/chinacnu-whatsapp-translator.git
   cd chinacnu-whatsapp-translator
   ```

2. **生成图标文件**
   - 打开浏览器访问 `icons/generate-icons.html`
   - 点击"生成并下载所有图标"按钮
   - 将下载的三个PNG文件（icon16.png, icon48.png, icon128.png）放到 `icons/` 文件夹中

3. **加载扩展到Chrome**
   - 打开Chrome浏览器
   - 访问 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目文件夹

4. **开始使用**
   - 访问 [WhatsApp Web](https://web.whatsapp.com)
   - 登录您的WhatsApp账号
   - 在消息上悬停会看到翻译按钮（🌐图标）

#### 方法二：从Chrome Web Store安装（即将上线）

*Coming soon...*

## 📱 使用说明

### 基础功能

1. **手动翻译**
   - 将鼠标悬停在任意WhatsApp消息上
   - 点击右上角出现的 🌐 图标
   - 翻译结果会显示在原消息下方
   - 点击 × 按钮关闭翻译结果

2. **自动翻译**
   - 点击Chrome工具栏的ChinaCNU图标
   - 开启"自动翻译"开关
   - 所有新消息将自动显示翻译结果

3. **语言设置**
   - 点击Chrome工具栏的插件图标
   - 在"翻译设置"中选择目标语言
   - 点击"保存设置"

### 快捷功能

- **右键翻译**：选中任意文本，右键选择"ChinaCNU 翻译选中文本"
- **快速开关**：通过插件弹窗快速启用/禁用翻译功能

## 🛠️ 技术架构

### 项目结构

```
chinacnu-whatsapp-translator/
├── manifest.json          # Chrome扩展配置文件
├── content.js            # 内容脚本（注入到WhatsApp Web）
├── background.js         # 后台服务脚本
├── translator.js         # 翻译API封装
├── popup.html           # 插件弹窗界面
├── popup.js             # 弹窗逻辑
├── styles.css           # 注入样式
├── icons/               # 图标资源
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── icon.svg
│   └── generate-icons.html
└── README.md
```

### 技术栈

- **前端框架**：原生JavaScript（无依赖）
- **翻译API**：
  - Google Translate API（免费版）
  - MyMemory Translation API（备用）
- **样式**：CSS3 + 渐变效果
- **Chrome API**：Manifest V3

## 🌐 支持的语言

- 🇨🇳 中文（简体/繁体）
- 🇺🇸 English
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇷🇺 Русский
- 🇸🇦 العربية
- 🇵🇹 Português
- 🇮🇹 Italiano

## 🔧 开发指南

### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/yourusername/chinacnu-whatsapp-translator.git

# 进入项目目录
cd chinacnu-whatsapp-translator

# 在Chrome中加载扩展
# chrome://extensions/ -> 开发者模式 -> 加载已解压的扩展程序
```

### 修改和测试

1. 修改源代码后，在 `chrome://extensions/` 页面点击刷新按钮
2. 刷新WhatsApp Web页面查看效果
3. 使用Chrome开发者工具调试

### 自定义配置

编辑 `translator.js` 文件，可以：
- 添加新的翻译API
- 修改翻译逻辑
- 调整重试机制

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 常见问题

### Q: 翻译按钮不显示？
A: 请确保：
- 已在WhatsApp Web登录
- 插件已启用（查看插件弹窗状态）
- 刷新WhatsApp Web页面

### Q: 翻译失败？
A: 可能原因：
- 网络连接问题
- 翻译API暂时不可用（插件会自动切换备用API）
- 文本内容为空或格式异常

### Q: 如何更改翻译目标语言？
A: 点击Chrome工具栏的插件图标，在弹窗中选择目标语言，点击保存。

### Q: 是否支持离线使用？
A: 不支持。翻译功能需要网络连接来访问翻译API。

### Q: 是否收集用户数据？
A: 不收集。所有翻译请求直接发送到翻译API，插件本身不存储任何聊天内容。

## 📜 更新日志

### v1.0.0 (2024-01-11)
- 🎉 首次发布
- ✨ 支持手动和自动翻译
- 🌍 支持12种常用语言
- 🎨 精美的UI设计
- 🔄 多API自动切换

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 感谢 [Google Translate](https://translate.google.com) 提供的翻译服务
- 感谢 [MyMemory](https://mymemory.translated.net) 提供的备用翻译API
- 感谢所有贡献者和用户的支持

## 📧 联系我们

- **品牌官网**：[ChinaCNU.com](https://chinacnu.com)
- **问题反馈**：[GitHub Issues](https://github.com/yourusername/chinacnu-whatsapp-translator/issues)
- **电子邮件**：support@chinacnu.com

---

<div align="center">

**Made with ❤️ by ChinaCNU Team**

*让跨境沟通更简单*

</div>
