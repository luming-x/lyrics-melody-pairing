# GitHub CLI (gh) 安装与使用指南

## 📋 什么是 GitHub CLI？

GitHub CLI 是一个开源工具，让您可以在命令行中直接与 GitHub 进行交互，无需切换到浏览器。

## 🚀 安装步骤

### 方法1: 使用安装脚本（推荐）

```bash
# 1. 运行安装脚本
sh GitHub_CLI_安装脚本.sh

# 2. 运行登录脚本
sh GitHub_CLI_登录脚本.sh
```

### 方法2: 手动安装

```bash
# 1. 安装 Homebrew（如果未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. 安装 GitHub CLI
brew install gh

# 3. 配置 Homebrew（Apple Silicon Mac）
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile

# 4. 登录
gh auth login
```

## 🔑 登录步骤

1. **运行登录命令**
   ```bash
   gh auth login
   ```

2. **选择 GitHub.com**
   ```
   What account do you want to log into?
   > GitHub.com
     GitHub Enterprise Server
   ```

3. **选择 HTTPS 协议**
   ```
   What is your preferred protocol for Git operations?
   > HTTPS
     SSH
   ```

4. **上传 SSH 密钥**
   ```
   Authenticate Git with your GitHub credentials?
   > Yes
     No
   ```

5. **浏览器授权**
   - 系统会自动打开浏览器
   - 点击"Authorize github-cli"
   - 等待授权完成

6. **完成登录**
   - 返回终端，看到"Logged in as XXX"即为成功

## 📝 常用命令

### 仓库操作

```bash
# 查看当前仓库
gh repo view

# 查看所有仓库
gh repo list

# 创建新仓库
gh repo create my-repo --public

# 克隆仓库
gh repo clone username/repo-name

# 删除仓库
gh repo delete repo-name
```

### 问题 (Issues)

```bash
# 查看问题列表
gh issue list

# 创建问题
gh issue create --title "Bug报告" --body "问题描述"

# 查看问题详情
gh issue view 123

# 关闭问题
gh issue close 123
```

### 拉取请求 (Pull Requests)

```bash
# 查看 PR 列表
gh pr list

# 创建 PR
gh pr create --title "新功能" --body "PR描述"

# 查看当前分支的 PR
gh pr view

# 合并 PR
gh pr merge
```

### 发布版本 (Releases)

```bash
# 查看发布版本
gh release list

# 创建发布版本
gh release create v1.0.0 --notes "首个正式版本"

# 查看版本详情
gh release view v1.0.0
```

### 代码管理

```bash
# 查看文件
gh repo view --json name,description

# 查看代码
gh api /repos/owner/repo/readme

# 查看分支
gh api /repos/owner/repo/branches
```

## 🎯 项目相关命令

对于您的"歌词旋律配对工具"项目：

```bash
# 查看项目信息
gh repo view lyrics-melody-pairing

# 查看项目统计
gh repo view --json name,stargazersCount,forksCount,openIssuesCount

# 创建新版本
gh release create v1.4.0 --notes "新增音乐创作工具功能"

# 查看问题
gh issue list --repo lyrics-melody-pairing

# 查看 Pull Requests
gh pr list --repo lyrics-melody-pairing
```

## 🔧 配置选项

```bash
# 查看当前配置
gh config list

# 设置默认编辑器
gh config set editor vim

# 设置 Git 协议
gh config set git_protocol ssh

# 设置浏览器
gh config set browser firefox
```

## 📊 查看状态

```bash
# 查看登录状态
gh auth status

# 查看版本
gh --version

# 查看帮助
gh --help

# 查看特定命令帮助
gh repo --help
```

## 🐛 常见问题

### 1. 登录失败

**问题**: `gh auth login` 无法完成

**解决方案**:
- 检查网络连接
- 确认 GitHub 账户状态
- 尝试使用 SSH 协议
- 检查是否被防火墙阻止

### 2. 命令未找到

**问题**: `command not found: gh`

**解决方案**:
```bash
# 重新安装
brew reinstall gh

# 或添加到 PATH
export PATH="/opt/homebrew/bin:$PATH"
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zprofile
```

### 3. 认证失败

**问题**: `Authentication failed`

**解决方案**:
```bash
# 重新登录
gh auth logout
gh auth login

# 或清除缓存
gh auth setup
```

### 4. 浏览器未打开

**问题**: 授权页面未自动打开

**解决方案**:
```bash
# 复制授权链接手动打开
# 终端会显示一个 URL，复制后在浏览器中打开
```

## 💡 高级用法

### 自动化脚本

```bash
# 创建并推送新版本
#!/bin/bash
VERSION=$1
gh release create $VERSION --notes "版本 $VERSION"
git push origin main
```

### 批量操作

```bash
# 批量关闭所有问题
gh issue list --state open | jq -r '.[].number' | xargs -I {} gh issue close {}

# 批量创建里程碑
for version in v1.5.0 v1.6.0 v1.7.0; do
    gh api repos/owner/repo/milestones -f title=$version
done
```

### 与 Git 集成

```bash
# 创建 PR 并关联问题
git checkout -b feature/new-feature
git commit -am "Add new feature"
git push origin feature/new-feature
gh pr create --title "Add new feature" --body "Fixes #123"

# 合并后自动关闭问题
gh pr merge --squash
```

## 📚 更多资源

- **官方文档**: https://cli.github.com/manual/
- **GitHub 社区**: https://github.com/cli/cli/discussions
- **问题反馈**: https://github.com/cli/cli/issues

## 🎉 开始使用

```bash
# 1. 安装
sh GitHub_CLI_安装脚本.sh

# 2. 登录
sh GitHub_CLI_登录脚本.sh

# 3. 测试
gh repo view

# 4. 开始使用！
```

---

**现在您可以在命令行中高效地管理您的 GitHub 项目了！** 🚀
