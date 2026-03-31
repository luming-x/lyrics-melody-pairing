#!/bin/bash

# GitHub CLI 登录脚本
# 使用方法: sh GitHub_CLI_登录脚本.sh

echo "================================"
echo "GitHub CLI 登录向导"
echo "================================"
echo ""

# 检查是否已安装
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI 未安装"
    echo "请先运行: sh GitHub_CLI_安装脚本.sh"
    exit 1
fi

echo "📋 登录步骤："
echo ""
echo "1. 选择 GitHub.com（或 GitHub Enterprise Server）"
echo "2. 选择 HTTPS 协议"
echo "3. 选择 Yes（上传 SSH 密钥）"
echo "4. 系统将打开浏览器进行授权"
echo "5. 完成授权后返回终端"
echo ""
echo "================================"
echo ""

# 执行登录命令
gh auth login

if [ $? -eq 0 ]; then
    echo ""
    echo "================================"
    echo "✅ 登录成功！"
    echo "================================"
    echo ""
    echo "当前用户信息："
    gh auth status
    
    echo ""
    echo "✅ 现在您可以使用以下命令："
    echo "  gh repo view          # 查看仓库信息"
    echo "  gh repo create         # 创建新仓库"
    echo "  gh issue list          # 查看问题列表"
    echo "  gh pr list             # 查看拉取请求"
    echo "  gh release create      # 创建发布版本"
    echo ""
    echo "📚 更多命令: gh --help"
    echo ""
else
    echo ""
    echo "❌ 登录失败，请重试"
    echo "常见问题："
    echo "1. 确保网络连接正常"
    echo "2. 确保已有 GitHub 账户"
    echo "3. 检查是否被浏览器阻止了弹窗"
    exit 1
fi
