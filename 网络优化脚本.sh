#!/bin/bash

# 网络优化脚本
# 用于优化 macOS 网络接收性能

echo "=========================================="
echo "网络优化脚本"
echo "=========================================="
echo ""

# 检查是否以 root 权限运行
if [ "$EUID" -ne 0 ]; then 
    echo "请使用 sudo 运行此脚本"
    echo "示例: sudo $0"
    exit 1
fi

echo "正在优化网络配置..."
echo ""

# 1. 设置高性能 DNS 服务器
echo "[1/5] 设置 DNS 服务器..."
# 阿里云 DNS
networksetup -setdnsservers Wi-Fi 223.5.5.5 223.6.6.6
echo "✓ 已设置为阿里云 DNS (223.5.5.5, 223.6.6.6)"
echo ""

# 2. 增加 TCP 缓冲区大小
echo "[2/5] 优化 TCP 缓冲区..."
# TCP 接收缓冲区
sysctl -w net.inet.tcp.recvspace=131072
# TCP 发送缓冲区
sysctl -w net.inet.tcp.sendspace=131072
# UDP 接收缓冲区
sysctl -w net.inet.udp.recvspace=131072
# UDP 发送缓冲区
sysctl -w net.inet.udp.maxdgram=9216
echo "✓ TCP/UDP 缓冲区已优化"
echo ""

# 3. 优化 TCP 连接参数
echo "[3/5] 优化 TCP 连接参数..."
# 增加 TCP 连接队列
sysctl -w net.inet.tcp.somaxconn=1024
# 减少 TCP 连接超时时间
sysctl -w net.inet.tcp.keepidle=7200
# 增加 TCP 重传次数
sysctl -w net.inet.tcp.keepintvl=75
# 启用 TCP 窗口缩放
sysctl -w net.inet.tcp.rfc1323=1
echo "✓ TCP 连接参数已优化"
echo ""

# 4. 增加 TCP 最大连接数
echo "[4/5] 增加 TCP 最大连接数..."
sysctl -w net.inet.ip.maxport=65535
sysctl -w kern.ipc.somaxconn=2048
echo "✓ TCP 最大连接数已增加"
echo ""

# 5. 持久化配置
echo "[5/5] 保存配置..."
# 创建 sysctl 配置文件
cat > /etc/sysctl.conf << EOF
# 网络优化配置
net.inet.tcp.recvspace=131072
net.inet.tcp.sendspace=131072
net.inet.udp.recvspace=131072
net.inet.udp.maxdgram=9216
net.inet.tcp.somaxconn=1024
net.inet.tcp.keepidle=7200
net.inet.tcp.keepintvl=75
net.inet.tcp.rfc1323=1
net.inet.ip.maxport=65535
kern.ipc.somaxconn=2048
EOF

chmod 644 /etc/sysctl.conf
echo "✓ 配置已保存"
echo ""

echo "=========================================="
echo "优化完成！"
echo "=========================================="
echo ""
echo "已执行的优化："
echo "  ✓ DNS 服务器 → 阿里云 DNS"
echo "  ✓ TCP/UDP 缓冲区 → 131072 字节"
echo "  ✓ TCP 连接队列 → 1024"
echo "  ✓ TCP 最大连接数 → 2048"
echo "  ✓ 启用 TCP 窗口缩放"
echo ""
echo "建议操作："
echo "  1. 重启网络：网络设置 → Wi-Fi → 断开 → 连接"
echo "  2. 或重启电脑使所有配置生效"
echo "  3. 测试网络：ping github.com"
echo ""
echo "DNS 备选方案："
echo "  腾讯 DNS：119.29.29.29"
echo "  百度 DNS：180.76.76.76"
echo "  Cloudflare：1.1.1.1"
echo ""
