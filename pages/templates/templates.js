// pages/templates/templates.js
const app = getApp()

Page({
  data: {
    templates: [
      {
        id: 1,
        title: '流行歌曲模板',
        category: '流行',
        description: '经典的流行歌曲结构，适合大多数流行音乐创作',
        lyrics: [
          { type: '主歌', content: '这里填写第一段主歌歌词...\n描述故事的开端或情感的起因' },
          { type: '主歌', content: '这里填写第二段主歌歌词...\n推进故事情节或深化情感' },
          { type: '副歌', content: '这里填写副歌歌词...\n这是歌曲的核心部分，需要朗朗上口' },
          { type: '主歌', content: '这里填写第三段主歌歌词...\n可以回到主题或引入新元素' },
          { type: '副歌', content: '这里重复副歌歌词...\n强化核心主题' },
          { type: '桥段', content: '这里填写桥段歌词...\n为歌曲添加转折点或情感高潮' },
          { type: '副歌', content: '这里再次重复副歌歌词...\n以强烈的记忆点结束' },
          { type: '结尾', content: '这里填写结尾歌词...\n可以重复副歌的一部分或使用总结性的语句' }
        ],
        usage: 234
      },
      {
        id: 2,
        title: '民谣歌曲模板',
        category: '民谣',
        description: '简洁真挚的民谣风格，适合叙事和情感表达',
        lyrics: [
          { type: '主歌', content: '这里填写第一段歌词...\n用朴素的语言讲述故事' },
          { type: '主歌', content: '这里填写第二段歌词...\n继续叙述，添加细节' },
          { type: '副歌', content: '这里填写副歌歌词...\n简洁有力，突出主题' },
          { type: '主歌', content: '这里填写第三段歌词...\n推进故事发展' },
          { type: '副歌', content: '这里重复副歌歌词...' },
          { type: '副歌', content: '这里再次重复副歌...\n以余音绕梁的方式结束' }
        ],
        usage: 189
      },
      {
        id: 3,
        title: '摇滚歌曲模板',
        category: '摇滚',
        description: '充满激情和力量的摇滚风格',
        lyrics: [
          { type: '前奏', content: '（音乐前奏）' },
          { type: '主歌', content: '这里填写第一段主歌...\n有力、直接、富有冲击力' },
          { type: '副歌', content: '这里填写副歌歌词...\n爆发性的情感表达' },
          { type: '主歌', content: '这里填写第二段主歌...\n持续的情绪推进' },
          { type: '副歌', content: '这里重复副歌歌词...' },
          { type: '桥段', content: '这里填写桥段歌词...\n制造紧张和期待' },
          { type: '副歌', content: '这里再次重复副歌...\n以最高潮结束' },
          { type: '结尾', content: '（音乐结尾）' }
        ],
        usage: 156
      },
      {
        id: 4,
        title: '抒情歌曲模板',
        category: '抒情',
        description: '细腻深情的抒情风格，适合表达复杂情感',
        lyrics: [
          { type: '前奏', content: '（温柔的音乐前奏）' },
          { type: '主歌', content: '这里填写第一段歌词...\n缓缓道来，细腻描绘' },
          { type: '主歌', content: '这里填写第二段歌词...\n层层深入，情感累积' },
          { type: '副歌', content: '这里填写副歌歌词...\n情感爆发，触人心弦' },
          { type: '主歌', content: '这里填写第三段歌词...\n回归平静，但情感已变' },
          { type: '副歌', content: '这里重复副歌歌词...' },
          { type: '桥段', content: '这里填写桥段歌词...\n情感的最后一次升华' },
          { type: '副歌', content: '这里再次重复副歌...\n慢慢淡出，留有余韵' }
        ],
        usage: 142
      },
      {
        id: 5,
        title: '电子音乐模板',
        category: '电子',
        description: '现代电子音乐风格，强调节奏和律动',
        lyrics: [
          { type: '前奏', content: '（电子音效前奏）' },
          { type: '主歌', content: '这里填写第一段主歌...\n简洁有力，配合节奏' },
          { type: '副歌', content: '这里填写副歌歌词...\n重复性强的记忆点' },
          { type: '间奏', content: '（电子间奏）' },
          { type: '主歌', content: '这里填写第二段主歌...\n持续节奏，推进氛围' },
          { type: '副歌', content: '这里重复副歌歌词...' },
          { type: '桥段', content: '这里填写桥段歌词...\n节奏变化，制造高潮' },
          { type: '副歌', content: '这里再次重复副歌...\n以强烈的节奏结束' }
        ],
        usage: 98
      },
      {
        id: 6,
        title: '说唱模板',
        category: '说唱',
        description: '押韵和节奏感强的说唱风格',
        lyrics: [
          { type: '前奏', content: '（节拍前奏）' },
          { type: '主歌', content: '这里填写第一段说唱...\n注重押韵和节奏\n每个词都要有力\nflow要流畅自然' },
          { type: '副歌', content: '这里填写副歌（Hook）...\n简单好记，可以重复多遍\n这是歌曲的记忆点' },
          { type: '主歌', content: '这里填写第二段说唱...\n继续保持押韵\n内容可以递进或转折' },
          { type: '副歌', content: '这里重复副歌（Hook）...' },
          { type: '桥段', content: '这里填写桥段...\n改变节奏或flow\n为最后的爆发做准备' },
          { type: '副歌', content: '这里再次重复副歌...\n以最强的能量结束' }
        ],
        usage: 87
      }
    ],
    selectedCategory: '全部',
    categories: ['全部', '流行', '民谣', '摇滚', '抒情', '电子', '说唱'],
    filteredTemplates: []
  },

  onLoad() {
    this.filterTemplates()
  },

  // 分类筛选
  onCategoryChange(e) {
    this.setData({
      selectedCategory: e.detail.value
    })
    this.filterTemplates()
  },

  filterTemplates() {
    const { templates, selectedCategory } = this.data
    const filtered = selectedCategory === '全部' 
      ? templates 
      : templates.filter(t => t.category === selectedCategory)
    this.setData({ filteredTemplates: filtered })
  },

  // 使用模板
  useTemplate(e) {
    const template = e.currentTarget.dataset.template
    
    wx.showModal({
      title: '使用模板',
      content: `确定要使用"${template.title}"模板吗？`,
      success: (res) => {
        if (res.confirm) {
          // 将模板数据传递到创作页面
          const templateData = encodeURIComponent(JSON.stringify(template.lyrics))
          wx.navigateTo({
            url: `/pages/create/create?template=${templateData}`
          })
        }
      }
    })
  },

  // 预览模板
  previewTemplate(e) {
    const template = e.currentTarget.dataset.template
    let lyricsText = template.lyrics.map(l => `[${l.type}]\n${l.content}`).join('\n\n')
    
    wx.showModal({
      title: template.title,
      content: lyricsText,
      showCancel: false,
      confirmText: '关闭'
    })
  }
})
