# GitHub CLI 登录指南

由于 GitHub API 访问受限，需要使用手动方式创建 Token 并登录。

## 步骤 1：创建 GitHub Personal Access Token

1. 访问 GitHub Token 设置页面：
   https://github.com/settings/tokens

2. 点击 "Generate new token" → "Generate new token (classic)"

3. 填写 Token 信息：
   - **Note（备注）**：`GitHub CLI for Mac`
   - **Expiration（过期时间）**：选择 `90 days` 或 `No expiration`
   - **Select scopes（权限范围）**，勾选以下选项：
     - ✅ `repo` - 完整的仓库访问权限
     - ✅ `workflow` - GitHub Actions 工作流权限
     - ✅ `read:org` - 读取组织信息
     - ✅ `user` - 用户信息

4. 点击 "Generate token" 生成 Token

5. **重要**：复制生成的 Token（以 `ghp_` 开头）
   - 注意：Token 只显示一次，请立即复制保存

## 步骤 2：使用 Token 登录 GitHub CLI

在终端中执行以下命令：

```bash
# 使用 Token 登录（替换 YOUR_TOKEN 为你的实际 Token）
echo "YOUR_TOKEN" | gh auth login --with-token
```

示例：
```bash
echo "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" | gh auth login --with-token
```

## 步骤 3：验证登录

```bash
# 检查登录状态
gh auth status

# 查看当前用户信息
gh auth status --show-token
```

## 步骤 4：使用 GitHub CLI

登录成功后，可以使用以下命令：

```bash
# 列出你的仓库
gh repo list

# 创建新仓库
gh repo create my-repo --public

# 克隆仓库
gh repo clone username/repo

# 查看 Issues
gh issue list
```

## 如果遇到问题

### 问题 1：Token 无效
- 检查 Token 是否完整复制（包括 `ghp_` 前缀）
- 确认 Token 没有过期
- 确认 Token 有足够的权限

### 问题 2：权限不足
- 重新创建 Token，确保勾选了 `repo` 权限

### 问题 3：登录失败
- 运行 `gh auth logout` 清除旧配置
- 重新使用 Token 登录

## 安全提醒

- ⚠️ 不要将 Token 分享给他人
- ⚠️ 不要在公开的代码仓库中提交 Token
- ⚠️ 定期更新 Token（建议每 90 天）
- ⚠️ 如果 Token 泄露，立即在 GitHub 中撤销

---

**准备好 Token 后，运行以下命令登录：**
```bash
echo "你的Token" | gh auth login --with-token
```
