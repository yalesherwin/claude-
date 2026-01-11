# ChinaCNU WhatsApp 翻译助手 - 安装指南

## 📦 安装前准备

### 系统要求
- Google Chrome 浏览器（版本88或更高）
- 或其他基于Chromium的浏览器（Edge, Brave, Opera等）
- 稳定的网络连接

### 必需文件检查
确保以下文件都存在：
- ✅ manifest.json
- ✅ content.js
- ✅ background.js
- ✅ translator.js
- ✅ popup.html
- ✅ popup.js
- ✅ styles.css
- ✅ icons/ 文件夹及图标文件

## 🎯 详细安装步骤

### 步骤一：生成图标文件

插件需要三个尺寸的PNG图标文件。请选择以下任一方法生成：

#### 方法A：使用HTML生成器（最简单）

1. 使用浏览器打开项目中的 `icons/generate-icons.html` 文件
2. 点击页面中的"生成并下载所有图标"按钮
3. 浏览器会自动下载3个PNG文件：
   - icon16.png
   - icon48.png
   - icon128.png
4. 将这3个文件移动到项目的 `icons/` 文件夹中

#### 方法B：在线转换工具

1. 访问在线SVG转PNG工具：https://cloudconvert.com/svg-to-png
2. 上传 `icons/icon.svg` 文件
3. 分别设置输出尺寸为 16x16、48x48、128x128
4. 转换并下载文件
5. 重命名为 icon16.png、icon48.png、icon128.png
6. 放入 `icons/` 文件夹

#### 方法C：命令行（需要ImageMagick）

```bash
cd icons
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

### 步骤二：加载扩展到Chrome

1. **打开Chrome扩展管理页面**
   - 方法1：在地址栏输入 `chrome://extensions/` 并回车
   - 方法2：点击右上角菜单 → 更多工具 → 扩展程序

2. **启用开发者模式**
   - 在页面右上角找到"开发者模式"开关
   - 将其切换到"开启"状态

3. **加载插件**
   - 点击左上角的"加载已解压的扩展程序"按钮
   - 在弹出的文件选择对话框中，选择本项目的文件夹
   - 点击"选择文件夹"

4. **确认安装成功**
   - 扩展列表中会出现"ChinaCNU WhatsApp 翻译助手"
   - 状态显示为"已启用"
   - Chrome工具栏会显示插件图标

### 步骤三：配置和测试

1. **访问WhatsApp Web**
   - 打开新标签页
   - 访问 https://web.whatsapp.com
   - 使用手机扫码登录

2. **测试插件功能**
   - 打开任意聊天对话
   - 将鼠标悬停在消息上
   - 应该能看到右上角出现 🌐 翻译按钮
   - 点击按钮测试翻译功能

3. **配置插件设置**
   - 点击Chrome工具栏的插件图标
   - 设置目标翻译语言
   - 选择是否开启自动翻译
   - 点击"保存设置"

## 🔧 常见安装问题

### 问题1：插件图标不显示

**解决方法：**
- 确认图标文件已正确生成并放置在 icons/ 文件夹
- 检查文件名是否完全匹配：icon16.png、icon48.png、icon128.png
- 在扩展管理页面点击插件的"刷新"按钮

### 问题2：无法加载扩展

**可能原因和解决方法：**
- **manifest.json 错误**：检查JSON格式是否正确
- **文件缺失**：确认所有必需文件都存在
- **权限问题**：确保文件夹有读取权限

查看错误详情：
1. 在扩展管理页面点击"错误"按钮
2. 查看具体错误信息
3. 根据错误提示修复问题

### 问题3：翻译按钮不显示

**解决方法：**
1. 刷新WhatsApp Web页面（Ctrl+R 或 Cmd+R）
2. 检查插件是否已启用（扩展管理页面）
3. 打开浏览器控制台（F12），查看是否有错误信息
4. 确认已登录WhatsApp Web

### 问题4：翻译功能无响应

**解决方法：**
- 检查网络连接
- 打开浏览器控制台（F12）查看错误信息
- 尝试刷新页面
- 检查插件设置是否正确

## 🔄 更新插件

当插件有新版本时：

1. 下载或拉取最新代码
2. 在 `chrome://extensions/` 页面找到插件
3. 点击插件卡片上的"刷新"图标按钮
4. 刷新WhatsApp Web页面

## 🗑️ 卸载插件

如需卸载：

1. 访问 `chrome://extensions/`
2. 找到"ChinaCNU WhatsApp 翻译助手"
3. 点击"移除"按钮
4. 确认删除

## 📱 在其他浏览器中安装

### Microsoft Edge

步骤与Chrome完全相同：
1. 访问 `edge://extensions/`
2. 开启开发者模式
3. 加载已解压的扩展

### Brave Browser

步骤与Chrome完全相同：
1. 访问 `brave://extensions/`
2. 开启开发者模式
3. 加载已解压的扩展

### Opera

1. 访问 `opera://extensions/`
2. 开启开发者模式
3. 加载已解压的扩展

## 💡 使用提示

1. **首次使用建议**：
   - 先在测试对话中试用翻译功能
   - 熟悉各项设置选项
   - 了解快捷操作方式

2. **性能优化**：
   - 如不需要实时翻译，建议关闭"自动翻译"
   - 手动点击按钮翻译可减少API调用

3. **隐私提示**：
   - 插件仅在WhatsApp Web页面运行
   - 不收集或存储任何聊天数据
   - 翻译请求直接发送到翻译API

## 📞 获取帮助

如果安装过程中遇到问题：

1. 查看 [README.md](README.md) 中的常见问题部分
2. 在 GitHub Issues 提交问题
3. 发送邮件至：support@chinacnu.com

---

**安装愉快！如有任何问题，欢迎随时联系我们。**
