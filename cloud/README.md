# 微信云开发数据库配置说明

## 集合列表

### 1. works - 作品集合
存储所有歌词旋律配对作品

**字段说明**：
- title: 作品标题
- theme: 创作主题
- tags: 标签数组
- notes: 创作灵感/笔记
- lyrics: 歌词数组
- lyricsCount: 歌词段落数
- melodyCount: 已配对旋律数
- createdAt: 创建时间
- updatedAt: 更新时间

### 2. songs - 歌曲集合
存储歌曲基本信息

**字段说明**：
- songId: 歌曲唯一标识
- title: 歌曲标题
- theme: 创作主题
- author: 作者
- tags: 标签数组
- status: 状态（draft:草稿, published:已发布, archived:已归档）
- createdAt: 创建时间
- updatedAt: 更新时间

### 3. lyrics - 歌词集合
存储歌词内容

**字段说明**：
- lyricId: 歌词唯一标识
- songId: 所属歌曲ID
- verseIndex: 段落序号
- type: 类型（verse:主歌, chorus:副歌, bridge:桥段, other:其他）
- content: 歌词内容
- melodyUrl: 旋律音频URL（云存储）
- duration: 旋律时长（秒）
- createdAt: 创建时间

### 4. pairings - 配对记录集合
存储歌词旋律配对历史

**字段说明**：
- pairingId: 配对记录唯一标识
- songId: 所属歌曲ID
- lyricId: 歌词ID
- melodyUrl: 旋律音频URL
- melodyDuration: 旋律时长
- notes: 配对笔记
- rating: 评分（1-5）
- createdAt: 创建时间

## 云存储配置

### 存储目录结构
```
cloud-storage/
├── audios/          # 音频文件
│   ├── melodies/    # 旋律音频
│   └── recordings/  # 录制音频
├── images/          # 图片文件
│   └── covers/      # 封面图片
└── exports/         # 导出文件
```

### 存储权限
- 所有用户可读取
- 仅创建者可写入

## 初始化步骤

1. 在微信开发者工具中点击"云开发"
2. 创建云环境
3. 在数据库中创建集合：works, songs, lyrics, pairings
4. 配置集合权限为"所有用户可读写"
5. 在云存储中创建目录结构

## 数据库索引

### songs 集合索引
- status: 索引（用于筛选状态）
- createdAt: 索引（用于排序）

### lyrics 集合索引
- songId: 索引（用于关联查询）
- createdAt: 索引（用于排序）

### pairings 集合索引
- songId: 索引（用于关联查询）
- createdAt: 索引（用于排序）
