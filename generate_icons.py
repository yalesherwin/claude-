#!/usr/bin/env python3
"""
快速生成Chrome扩展所需的PNG图标
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("警告: 未安装PIL/Pillow库，将创建简单图标")

import os

def create_simple_icon(size):
    """使用PIL创建图标"""
    # 创建图像
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 绘制渐变背景圆
    center = size // 2
    radius = int(size * 0.47)

    # 绘制圆形背景（紫色）
    for i in range(radius, 0, -1):
        # 从深紫到浅紫的渐变
        ratio = i / radius
        r = int(102 + (118 - 102) * (1 - ratio))
        g = int(126 + (75 - 126) * (1 - ratio))
        b = int(234 + (162 - 234) * (1 - ratio))
        draw.ellipse(
            [center - i, center - i, center + i, center + i],
            fill=(r, g, b, 255)
        )

    # 绘制地球图标（白色圆圈）
    earth_radius = int(radius * 0.58)
    line_width = max(1, size // 42)

    # 外圆
    draw.ellipse(
        [center - earth_radius, center - earth_radius,
         center + earth_radius, center + earth_radius],
        outline=(255, 255, 255, 255),
        width=line_width
    )

    # 中间竖线
    draw.line(
        [(center, center - earth_radius), (center, center + earth_radius)],
        fill=(255, 255, 255, 255),
        width=line_width
    )

    # 横线
    draw.line(
        [(center - earth_radius, center), (center + earth_radius, center)],
        fill=(255, 255, 255, 255),
        width=line_width
    )

    # 椭圆
    draw.ellipse(
        [center - int(earth_radius * 0.43), center - earth_radius,
         center + int(earth_radius * 0.43), center + earth_radius],
        outline=(255, 255, 255, 255),
        width=line_width
    )

    return img

def create_fallback_icon(size):
    """创建一个简单的备用图标（纯色圆）"""
    import struct
    import zlib

    # 创建一个简单的PNG图标（紫色圆圈）
    # 这是一个最小化的PNG文件
    width = height = size

    # 简单的紫色圆圈数据
    pixels = []
    center = size / 2
    radius = size * 0.4

    for y in range(height):
        row = []
        for x in range(width):
            dx = x - center
            dy = y - center
            dist = (dx*dx + dy*dy) ** 0.5

            if dist < radius:
                # 紫色
                row.extend([102, 126, 234, 255])
            else:
                # 透明
                row.extend([0, 0, 0, 0])
        pixels.append(bytes(row))

    # 构建PNG文件
    def png_pack(png_tag, data):
        chunk_head = png_tag
        return (struct.pack("!I", len(data)) + chunk_head + data +
                struct.pack("!I", zlib.crc32(chunk_head + data) & 0xffffffff))

    png_data = b'\x89PNG\r\n\x1a\n'
    png_data += png_pack(b'IHDR', struct.pack("!2I5B", width, height, 8, 6, 0, 0, 0))

    raw_data = b''.join(b'\x00' + row for row in pixels)
    png_data += png_pack(b'IDAT', zlib.compress(raw_data, 9))
    png_data += png_pack(b'IEND', b'')

    return png_data

def main():
    print("正在生成Chrome扩展图标...")

    icons_dir = os.path.join(os.path.dirname(__file__), 'icons')

    if not os.path.exists(icons_dir):
        os.makedirs(icons_dir)

    sizes = [16, 48, 128]

    for size in sizes:
        filename = f'icon{size}.png'
        filepath = os.path.join(icons_dir, filename)

        if HAS_PIL:
            # 使用PIL创建高质量图标
            img = create_simple_icon(size)
            img.save(filepath, 'PNG')
            print(f"✓ 已生成 {filename} (使用PIL)")
        else:
            # 使用备用方法创建简单图标
            png_data = create_fallback_icon(size)
            with open(filepath, 'wb') as f:
                f.write(png_data)
            print(f"✓ 已生成 {filename} (简单版本)")

    print("\n✓ 所有图标已生成完成！")
    print(f"图标位置: {icons_dir}")
    print("\n下一步:")
    print("1. 打开Chrome浏览器")
    print("2. 访问 chrome://extensions/")
    print("3. 开启'开发者模式'")
    print("4. 点击'加载已解压的扩展程序'")
    print(f"5. 选择文件夹: {os.path.dirname(__file__)}")

if __name__ == '__main__':
    main()
