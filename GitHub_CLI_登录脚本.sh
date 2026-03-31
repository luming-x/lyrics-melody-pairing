#!/bin/bash

# GitHub CLI 登录脚本
# 使用 Token 方式登录

echo "=========================================="
echo "GitHub CLI 登录脚本"
echo "=========================================="
echo ""

# 询问 Token
read -sp "请输入你的 GitHub Personal Access Token: " token
echo ""

if [ -z "$token" ]; then
    echo "✗ Token 不能为空"
    exit 1
fi

# 使用 Token 登录
echo "正在登录..."
echo "$token" | gh auth login --with-token

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ 登录成功！"
    echo ""
    echo "验证登录状态..."
    gh auth status
    echo ""
    echo "你可以使用以下命令："
    echo "  gh repo list - 查看仓库"
    echo "  gh issue list - 查看 Issues"
    echo "  gh pr list - 查看 Pull Requests"
else
    echo ""
    echo "✗ 登录失败"
    echo "请检查："
    echo "  1. Token 是否正确（以 ghp_ 开头）"
    echo "  2. Token 是否包含 repo、workflow、user 权限"
    echo "  3. Token 是否已过期"
fi
