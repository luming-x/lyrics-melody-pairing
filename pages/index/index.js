// pages/index/index.js
const app = getApp()

Page({
  data: {
    recentWorks: [],
    theme: 'light'
  },

  onLoad() {
    this.loadRecentWorks()
    this.setData({
      theme: app.globalData.theme
    })
  },

  onShow() {
    this.loadRecentWorks()
  },

  // 主题变化回调
  onThemeChange(theme) {
    this.setData({ theme })
  },

  // 加载最近作品
  loadRecentWorks() {
    // 检查云开发是否已配置
    if (!app.globalData.envId || !wx.cloud) {
      this.setData({ recentWorks: [] })
      return
    }

    wx.showLoading({
      title: '加载中...'
    })

    const db = wx.cloud.database()
    db.collection('works')
      .orderBy('updatedAt', 'desc')
      .limit(5)
      .get()
      .then(res => {
        const works = res.data.map(item => ({
          ...item,
          updatedAt: this.formatDate(item.updatedAt)
        }))
        this.setData({
          recentWorks: works
        })
        wx.hideLoading()
      })
      .catch(err => {
        console.error('加载失败', err)
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      })
  },

  // 格式化日期
  formatDate(timestamp) {
    const date = new Date(timestamp)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日`
  },

  // 跳转到创作页面
  navigateToCreate() {
    wx.navigateTo({
      url: '/pages/create/create'
    })
  },

  // 跳转到作品库
  navigateToLibrary() {
    wx.switchTab({
      url: '/pages/lyrics/lyrics'
    })
  },

  // 跳转到歌词模板
  navigateToTemplates() {
    wx.navigateTo({
      url: '/pages/templates/templates'
    })
  },

  // 跳转到节拍器
  navigateToMetronome() {
    wx.navigateTo({
      url: '/pages/metronome/metronome'
    })
  },

  // 跳转到创作目标
  navigateToGoals() {
    wx.navigateTo({
      url: '/pages/goals/goals'
    })
  },

  // 跳转到AI助手
  navigateToAI() {
    wx.navigateTo({
      url: '/pages/ai-assistant/ai-assistant'
    })
  },

  // 跳转到简谱生成
  navigateToSheetMusic() {
    wx.navigateTo({
      url: '/pages/sheet-music/sheet-music'
    })
  },

  // 跳转到钢琴
  navigateToPiano() {
    wx.navigateTo({
      url: '/pages/piano/piano'
    })
  },

  // 跳转到和弦库
  navigateToChords() {
    wx.navigateTo({
      url: '/pages/chords/chords'
    })
  },

  // 跳转到音高识别
  navigateToPitchRecognition() {
    wx.navigateTo({
      url: '/pages/pitch-recognition/pitch-recognition'
    })
  },

  // 播放作品
  playWork(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/player/player?id=${id}`
    })
  }
})
