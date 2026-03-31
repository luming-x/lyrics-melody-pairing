#!/bin/bash

# GitHub CLI 安装脚本 for macOS
# 使用方法: sh GitHub_CLI_安装脚本.sh

echo "================================"
echo "GitHub CLI 安装脚本"
echo "================================"
echo ""

# 检查是否已安装
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI 已经安装"
    echo "当前版本: $(gh --version)"
    echo ""
    read -p "是否要更新到最新版本? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "正在更新 GitHub CLI..."
        brew upgrade gh
    else
        echo "跳过更新"
        exit 0
    fi
else
    echo "📦 GitHub CLI 未安装，开始安装..."
    echo ""
fi

# 检查 Homebrew 是否安装
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew 未安装"
    echo "正在安装 Homebrew..."
    
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # 配置 Homebrew 环境（Apple Silicon）
    if [[ $(uname -m) == 'arm64' ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    
    echo "✅ Homebrew 安装完成"
else
    echo "✅ Homebrew 已安装"
fi

echo ""
echo "正在安装 GitHub CLI..."
brew install gh

if [ $? -eq 0 ]; then
    echo ""
    echo "================================"
    echo "✅ GitHub CLI 安装成功！"
    echo "================================"
    echo ""
    echo "版本信息: $(gh --version)"
    echo ""
    echo "下一步："
    echo "1. 运行 'gh auth login' 进行登录"
    echo "2. 或运行 'sh GitHub_CLI_登录脚本.sh' 使用辅助登录"
    echo ""
else
    echo ""
    echo "❌ 安装失败，请检查错误信息"
    exit 1
fi
