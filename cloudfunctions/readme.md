# 云开发说明

## 数据库设计

### works 集合
```json
{
  "_id": "自动生成",
  "title": "作品标题",
  "theme": "创作主题",
  "tags": ["标签1", "标签2"],
  "notes": "创作灵感/笔记",
  "lyrics": [
    {
      "typeIndex": 0,
      "content": "歌词内容",
      "melodyUrl": "云存储文件ID"
    }
  ],
  "lyricsCount": 5,
  "melodyCount": 3,
  "createdAt": "创建时间戳",
  "updatedAt": "更新时间戳"
}
```

## 云存储设计

### melodies 文件夹
- 存储所有录制的旋律音频文件
- 文件命名规则: `melodies/{timestamp}_{random}.mp3`

## 权限设置

### 数据库权限
- `works` 集合: 所有用户可读写（可后续调整为仅创建者）

### 存储权限
- `melodies` 文件夹: 所有用户可读写

## 初始化步骤

1. 在微信开发者工具中开通云开发
2. 创建数据库集合 `works`
3. 创建云存储文件夹 `melodies`
4. 在 `app.js` 中替换 `env: 'your-env-id'` 为你的云环境ID
5. 在 `project.config.json` 中替换 `appid: 'your-appid'` 为你的小程序AppID
