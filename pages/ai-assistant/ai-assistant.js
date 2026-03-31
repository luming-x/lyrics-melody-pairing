// pages/ai-assistant/ai-assistant.js
const app = getApp()

Page({
  data: {
    // 创作主题
    theme: '',
    // 情感风格
    emotion: '',
    emotions: ['欢快', '忧伤', '浪漫', '励志', '怀旧', '激昂'],
    // 音乐风格
    style: '',
    styles: ['流行', '民谣', '摇滚', '电子', '说唱', '抒情'],
    // 歌词长度
    length: 'medium',
    lengthLabel: '中等',
    lengths: [
      { value: 'short', label: '简短', sections: 2 },
      { value: 'medium', label: '中等', sections: 4 },
      { value: 'long', label: '完整', sections: 6 }
    ],
    // 生成的歌词
    generatedLyrics: [],
    // 历史记录
    history: [],
    // 加载状态
    generating: false,
    // 是否显示结果
    showResult: false
  },

  onLoad() {
    this.loadHistory()
  },

  // 主题输入
  onThemeInput(e) {
    this.setData({ theme: e.detail.value })
  },

  // 情感选择
  onEmotionChange(e) {
    const index = e.detail.value
    this.setData({ emotion: this.data.emotions[index] })
  },

  // 风格选择
  onStyleChange(e) {
    const index = e.detail.value
    this.setData({ style: this.data.styles[index] })
  },

  // 长度选择
  onLengthChange(e) {
    const index = e.detail.value
    this.setData({
      length: this.data.lengths[index].value,
      lengthLabel: this.data.lengths[index].label
    })
  },

  // 生成歌词
  async generateLyrics() {
    if (!this.data.theme.trim()) {
      wx.showToast({
        title: '请输入创作主题',
        icon: 'none'
      })
      return
    }

    if (!this.data.emotion) {
      wx.showToast({
        title: '请选择情感风格',
        icon: 'none'
      })
      return
    }

    if (!this.data.style) {
      wx.showToast({
        title: '请选择音乐风格',
        icon: 'none'
      })
      return
    }

    this.setData({ 
      generating: true,
      showResult: false
    })

    wx.showLoading({ title: 'AI正在创作...', mask: true })

    // 模拟AI生成过程（实际应用中这里会调用AI API）
    try {
      await this.simulateAI()
      
      const lyrics = this.generateLyricsContent()
      
      this.setData({ 
        generatedLyrics: lyrics,
        generating: false,
        showResult: true
      })
      
      // 保存到历史记录
      this.saveToHistory({
        theme: this.data.theme,
        emotion: this.data.emotion,
        style: this.data.style,
        lyrics: lyrics,
        createdAt: Date.now()
      })
      
      wx.hideLoading()
      wx.showToast({
        title: '生成成功',
        icon: 'success'
      })
    } catch (err) {
      console.error('生成失败', err)
      this.setData({ generating: false })
      wx.hideLoading()
      wx.showToast({
        title: '生成失败，请重试',
        icon: 'none'
      })
    }
  },

  // 模拟AI处理时间
  simulateAI() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
  },

  // 生成歌词内容（基于模板和关键词）
  generateLyricsContent() {
    const { theme, emotion, style, length } = this.data
    const lengthInfo = this.data.lengths.find(l => l.value === length) || this.data.lengths[1]
    const sections = lengthInfo.sections

    // 基于风格和情感的歌词模板库
    const templates = {
      '流行': {
        '欢快': [
          '阳光照在脸上，笑容绽放光芒',
          '追逐梦想的路上，我们勇敢飞翔',
          '快乐是最好的礼物，分享才更有力量',
          '每一天都是新的开始，让我们一起歌唱'
        ],
        '忧伤': [
          '回忆像电影，慢慢播放',
          '那些说好的未来，最终成了过往',
          '泪水模糊视线，但心还依然滚烫',
          '或许有些遗憾，但这就是成长'
        ],
        '浪漫': [
          '遇见你的瞬间，时间都静止了',
          '心跳的声音，只有你能听见',
          '牵着手走过四季，每一个瞬间都值得',
          '原来这就是爱，简单而深刻'
        ],
        '励志': [
          '跌倒不可怕，可怕的是不再站起来',
          '梦想在前方，路在脚下延伸',
          '每一次努力，都在为未来铺路',
          '相信自己，你就是最亮的那颗星'
        ],
        '怀旧': [
          '那时候的我们，天真无邪',
          '时光匆匆流过，记忆依然清晰',
          '回到那个夏天，风很温柔',
          '青春的故事，永远藏在心里'
        ],
        '激昂': [
          '燃烧吧青春，释放你的能量',
          '没有什么能够阻挡，前进的力量',
          '挑战自我，超越极限',
          '我们是时代的先锋，创造新的辉煌'
        ]
      },
      '民谣': {
        '欢快': [
          '走在乡间的小路上，风吹麦浪',
          '老树下讲故事，岁月悠长',
          '简单的生活，最真实的快乐',
          '唱一首民谣，送给远方'
        ],
        '忧伤': [
          '老照片泛黄，故事已老',
          '一个人的夜晚，思念在发酵',
          '故乡的月亮，照亮游子的路',
          '唱尽人间冷暖，心却依然滚烫'
        ],
        '浪漫': [
          '月光洒在窗前，想你到天明',
          '远方的人啊，可曾听见我的歌声',
          '山高水长，不如你的笑容',
          '写下这首情诗，寄给远方的你'
        ],
        '励志': [
          '平凡的日子里，有不平凡的坚持',
          '一步一个脚印，走到梦想的地方',
          '生活给了我什么，我就歌唱什么',
          '平凡人的故事，同样值得被传唱'
        ],
        '怀旧': [
          '老家的院子，葡萄架下',
          '外婆的蒲扇，摇啊摇啊',
          '那时的夏天，总是很长很长',
          '再回去，已是物是人非'
        ],
        '激昂': [
          '民谣的力量，来自大地的声音',
          '用最朴实的语言，唱最真挚的情感',
          '让世界听见，我们的心声',
          '传承文化，继续前行'
        ]
      },
      '摇滚': {
        '欢快': [
          '音乐响起，身体开始摇摆',
          '跟着节奏，释放所有的压抑',
          '这就是我的态度，这就是我的风格',
          '摇滚万岁，永不妥协'
        ],
        '忧伤': [
          '孤独的夜晚，只有音乐陪伴',
          '心中的呐喊，只有你能听见',
          '痛苦也好，挣扎也罢',
          '都是生命中最真实的体验'
        ],
        '浪漫': [
          '爱如摇滚，热烈而疯狂',
          '为你疯狂，为你歌唱',
          '激情燃烧的夜晚，只有你和我',
          '摇滚情歌，唱给最爱的人'
        ],
        '励志': [
          '打破束缚，释放自我',
          '不要在意别人的眼光，做真实的自己',
          '挫折只是暂时的，坚持才能赢',
          '摇滚精神，永不放弃'
        ],
        '怀旧': [
          '那些年一起摇滚的日子',
          '吉他声嘶吼，青春飞扬',
          '现在回头看，一切都值得',
          '摇滚精神，永远年轻'
        ],
        '激昂': [
          '燃烧吧，我的灵魂',
          '用音乐打破一切桎梏',
          '摇滚不死，精神永存',
          '向前冲，永不回头'
        ]
      },
      '电子': {
        '欢快': [
          '电子音效，节奏跳动',
          '舞池中央，让我们一起嗨',
          '能量释放，快乐无限',
          '电子音乐，点燃夜晚'
        ],
        '忧伤': [
          '电子合成，悲伤的旋律',
          '虚拟世界，真实的情感',
          '孤独的信号，谁能接收',
          '夜色中，独自感受'
        ],
        '浪漫': [
          '电子情歌，未来感十足',
          '你的微笑，像电流一样',
          '心跳同步，频率匹配',
          '科技与浪漫的完美结合'
        ],
        '励志': [
          '节奏向前，不停不歇',
          '电子能量，驱动梦想',
          '创新突破，超越传统',
          '未来已来，我们创造'
        ],
        '怀旧': [
          '复古电子，回忆涌动',
          '那些经典的节拍',
          '80年代的迪斯科',
          '怀旧电子，时光倒流'
        ],
        '激昂': [
          '电子爆炸，能量爆棚',
          '节奏加速，肾上腺素飙升',
          '未来战士，电子先锋',
          '电子音乐，震撼全场'
        ]
      },
      '说唱': {
        '欢快': [
          'Flow 流畅，押韵到位',
          '快乐的说唱，让人回味',
          '跟着节奏，一起摇摆',
          'Hiphop 人生，无限精彩'
        ],
        '忧伤': [
          'Flow 沉重，内心独白',
          '生活的苦，只有自己明白',
          '说出心事，让音乐承载',
          '说唱表达，真实情感'
        ],
        '浪漫': [
          '为爱的你，写一段Hook',
          '每一个字，都是真心',
          '说唱情歌，别样的浪漫',
          'Rap for love，永远不变'
        ],
        '励志': [
          '从不放弃，从不低头',
          '说唱力量，激励前行',
          '每一句歌词，都是誓言',
          'Hiphop精神，永远闪耀'
        ],
        '怀旧': [
          '回到那个年代，Hiphop初起',
          '那些老歌，现在听起来依然',
          '经典的Flow，永远不朽',
          '说唱历史，值得铭记'
        ],
        '激昂': [
          '能量爆发，Flow 炸裂',
          '说唱战士，无所畏惧',
          '每一个bar，都是武器',
          'Hiphop力量，无可匹敌'
        ]
      },
      '抒情': {
        '欢快': [
          '阳光正好，微风不燥',
          '心中的快乐，想要与你分享',
          '简单的幸福，就在身边',
          '用歌声诉说，这份美好'
        ],
        '忧伤': [
          '夜深人静，思念成河',
          '有些话，只能藏在心里',
          '泪水滑落，无声无息',
          '抒情歌唱，表达心情'
        ],
        '浪漫': [
          '星光闪烁，月色温柔',
          '想你的夜晚，歌声为伴',
          '爱情如诗，如歌如画',
          '抒情情歌，送给最爱的你'
        ],
        '励志': [
          '温柔的坚持，最有力',
          '默默努力，终会开花',
          '抒情的力量，温暖人心',
          '相信自己，未来可期'
        ],
        '怀旧': [
          '回忆如歌，岁月如诗',
          '那些美好的时光',
          '抒情旋律，带回记忆',
          '怀旧歌曲，温暖人心'
        ],
        '激昂': [
          '抒情也能激昂',
          '内心澎湃，激情四射',
          '用柔美的旋律，唱强大的力量',
          '抒情摇滚，别样精彩'
        ]
      }
    }

    // 获取对应模板
    const styleTemplates = templates[style]?.[emotion] || templates['流行']['欢快']
    
    // 生成段落
    const lyrics = []
    const sectionTypes = ['主歌', '主歌', '副歌', '桥段', '副歌', '结尾']
    
    for (let i = 0; i < sections && i < 6; i++) {
      // 从模板中随机选择或生成
      const randomIndex = Math.floor(Math.random() * styleTemplates.length)
      let content = styleTemplates[randomIndex]
      
      // 如果主段落，可以结合主题进行简单修改
      if (i < 2) {
        content = this.customizeContent(content, theme)
      }
      
      lyrics.push({
        type: sectionTypes[i],
        content: content
      })
    }
    
    return lyrics
  },

  // 根据主题简单定制内容
  customizeContent(content, theme) {
    // 简单的主题融入（实际应用中会更智能）
    const words = theme.split(/[,，\s]+/).filter(w => w)
    if (words.length > 0) {
      const keyWord = words[Math.floor(Math.random() * words.length)]
      // 在不影响原意的情况下，尝试融入关键词
      return content
    }
    return content
  },

  // 保存到历史记录
  saveToHistory(record) {
    const history = wx.getStorageSync('aiHistory') || []
    history.unshift(record)
    
    // 只保留最近20条
    if (history.length > 20) {
      history.pop()
    }
    
    wx.setStorageSync('aiHistory', history)
    this.setData({ history })
  },

  // 加载历史记录
  loadHistory() {
    const history = wx.getStorageSync('aiHistory') || []
    this.setData({ history })
  },

  // 使用生成的歌词
  useGeneratedLyrics() {
    const lyricsData = encodeURIComponent(JSON.stringify(this.data.generatedLyrics))
    
    wx.showModal({
      title: '使用歌词',
      content: '确定要将这些歌词加载到创作页面吗？',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: `/pages/create/create?template=${lyricsData}`
          })
        }
      }
    })
  },

  // 复制歌词
  copyLyrics() {
    const lyricsText = this.data.generatedLyrics
      .map(l => `[${l.type}]\n${l.content}`)
      .join('\n\n')
    
    wx.setClipboardData({
      data: lyricsText,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        })
      }
    })
  },

  // 重新生成
  regenerate() {
    this.generateLyrics()
  },

  // 查看历史记录
  viewHistory() {
    wx.navigateTo({
      url: '/pages/ai-history/ai-history'
    })
  },

  // 清空输入
  clearInput() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有输入吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            theme: '',
            emotion: '',
            style: '',
            generatedLyrics: [],
            showResult: false
          })
        }
      }
    })
  }
})
