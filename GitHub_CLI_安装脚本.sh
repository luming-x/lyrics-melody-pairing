#!/bin/bash

# GitHub CLI (gh) 手动安装脚本
# 使用说明：当网络恢复正常后，先手动下载安装包，然后运行此脚本

set -e

echo "=========================================="
echo "GitHub CLI 手动安装脚本"
echo "=========================================="
echo ""

# 检查是否提供了安装包路径
if [ $# -eq 0 ]; then
    echo "使用方法："
    echo "  $0 <gh安装包路径>"
    echo ""
    echo "示例："
    echo "  $0 ~/Downloads/gh_2.88.1_macOS_amd64.tar.gz"
    echo ""
    echo "注意：请先从 https://github.com/cli/cli/releases 下载安装包"
    exit 1
fi

ARCHIVE_PATH="$1"

# 检查文件是否存在
if [ ! -f "$ARCHIVE_PATH" ]; then
    echo "错误：文件不存在: $ARCHIVE_PATH"
    exit 1
fi

# 检查文件类型
if [[ ! "$ARCHIVE_PATH" =~ \.tar\.gz$ ]]; then
    echo "错误：文件应该是 .tar.gz 格式"
    exit 1
fi

echo "安装包路径: $ARCHIVE_PATH"
echo ""

# 创建临时目录
TEMP_DIR="/tmp/gh_install_$$"
mkdir -p "$TEMP_DIR"

echo "正在解压安装包..."
tar -xzf "$ARCHIVE_PATH" -C "$TEMP_DIR"

# 查找解压后的目录
EXTRACTED_DIR=$(find "$TEMP_DIR" -maxdepth 1 -type d -name "gh_*" | head -1)

if [ -z "$EXTRACTED_DIR" ]; then
    echo "错误：无法找到解压后的目录"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo "解压目录: $EXTRACTED_DIR"
echo ""

# 检查二进制文件
BINARY_PATH="$EXTRACTED_DIR/bin/gh"
if [ ! -f "$BINARY_PATH" ]; then
    echo "错误：无法找到 gh 二进制文件"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo "正在复制文件到 /usr/local/bin..."
sudo cp "$BINARY_PATH" /usr/local/bin/

echo "正在设置执行权限..."
sudo chmod +x /usr/local/bin/gh

# 清理临时文件
rm -rf "$TEMP_DIR"

echo ""
echo "=========================================="
echo "安装完成！"
echo "=========================================="
echo ""

# 验证安装
if command -v gh &> /dev/null; then
    echo "GitHub CLI 版本:"
    gh --version
    echo ""
    echo "✅ 安装成功！"
    echo ""
    echo "下一步："
    echo "  1. 登录 GitHub: gh auth login"
    echo "  2. 查看帮助: gh --help"
else
    echo "❌ 安装验证失败，请手动检查"
fi
