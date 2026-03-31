#!/bin/bash

# Wi-Fi DNS 设置脚本
# 使用方法: bash ~/CodeBuddy/Claw/DNS_设置脚本.sh

echo "=========================================="
echo "Wi-Fi DNS 设置脚本"
echo "=========================================="
echo ""

# 显示当前 DNS 设置
echo "当前 DNS 设置:"
networksetup -getdnsservers Wi-Fi
echo ""

# 询问用户选择
echo "请选择 DNS 提供商："
echo "  1. 阿里云 DNS (223.5.5.5, 223.6.6.6) - 推荐"
echo "  2. 腾讯 DNS (119.29.29.29)"
echo "  3. 百度 DNS (180.76.76.76)"
echo "  4. Cloudflare (1.1.1.1, 1.0.0.1)"
echo "  5. 清除 DNS 设置（恢复默认）"
echo ""
read -p "请输入选项 (1-5): " choice

case $choice in
    1)
        echo "正在设置阿里云 DNS..."
        sudo networksetup -setdnsservers Wi-Fi 223.5.5.5 223.6.6.6
        ;;
    2)
        echo "正在设置腾讯 DNS..."
        sudo networksetup -setdnsservers Wi-Fi 119.29.29.29
        ;;
    3)
        echo "正在设置百度 DNS..."
        sudo networksetup -setdnsservers Wi-Fi 180.76.76.76
        ;;
    4)
        echo "正在设置 Cloudflare DNS..."
        sudo networksetup -setdnsservers Wi-Fi 1.1.1.1 1.0.0.1
        ;;
    5)
        echo "正在清除 DNS 设置..."
        sudo networksetup -setdnsservers Wi-Fi empty
        ;;
    *)
        echo "无效选项"
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    echo "✓ DNS 设置成功！"
    echo ""
    echo "新的 DNS 设置:"
    networksetup -getdnsservers Wi-Fi
    echo ""

    # 询问是否清除 DNS 缓存
    read -p "是否清除 DNS 缓存？(y/n): " flush_cache
    if [ "$flush_cache" = "y" ] || [ "$flush_cache" = "Y" ]; then
        echo "正在清除 DNS 缓存..."
        sudo dscacheutil -flushcache
        sudo killall -HUP mDNSResponder
        echo "✓ DNS 缓存已清除"
    fi

    echo ""
    echo "建议操作："
    echo "  1. 重启 Wi-Fi 使设置完全生效"
    echo "  2. 测试 DNS 解析: nslookup github.com"
else
    echo "✗ DNS 设置失败"
    exit 1
fi

echo ""
echo "=========================================="
echo "设置完成"
echo "=========================================="
