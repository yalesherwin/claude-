# ChinaCNU 图标生成说明

## 生成图标方法

### 方法一：使用HTML生成器（推荐）
1. 用浏览器打开 `generate-icons.html` 文件
2. 点击"生成并下载所有图标"按钮
3. 将下载的三个PNG文件放到当前目录：
   - icon16.png
   - icon48.png
   - icon128.png

### 方法二：在线工具
1. 访问在线SVG转PNG工具，如：
   - https://cloudconvert.com/svg-to-png
   - https://convertio.co/zh/svg-png/
2. 上传 `icon.svg` 文件
3. 分别转换为 16x16、48x48、128x128 三种尺寸
4. 重命名为对应的文件名并保存到当前目录

### 方法三：使用命令行（需要安装ImageMagick）
```bash
# 转换为不同尺寸
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

## 图标规格
- **icon16.png**: 16x16 像素（工具栏小图标）
- **icon48.png**: 48x48 像素（扩展管理页面）
- **icon128.png**: 128x128 像素（Chrome Web Store）

## 注意事项
- 所有图标必须是PNG格式
- 建议使用透明背景（当前设计使用渐变背景）
- 确保图标在小尺寸下仍然清晰可辨
