// pages/stats/stats.js
const app = getApp()

Page({
  data: {
    theme: 'light',
    totalWorks: 0,
    totalLyrics: 0,
    totalMelodies: 0,
    recentActivity: [],
    statsByType: {
      verse: 0,
      chorus: 0,
      bridge: 0,
      other: 0
    },
    avgLyricsPerWork: 0,
    avgMelodiesPerWork: 0,
    activeDays: 0
  },

  onLoad() {
    this.setData({
      theme: app.globalData.theme
    })
    this.loadStats()
  },

  onShow() {
    this.loadStats()
  },

  // 主题变化回调
  onThemeChange(theme) {
    this.setData({ theme })
  },

  // 加载统计数据
  loadStats() {
    // 检查云开发是否已配置
    if (!app.globalData.envId || !wx.cloud) {
      this.setData({
        totalWorks: 0,
        totalLyrics: 0,
        totalMelodies: 0
      })
      return
    }

    wx.showLoading({
      title: '加载统计...'
    })

    const db = wx.cloud.database()

    // 获取所有作品
    db.collection('works')
      .get()
      .then(res => {
        const works = res.data
        this.calculateStats(works)
        wx.hideLoading()
      })
      .catch(err => {
        console.error('加载统计失败', err)
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      })
  },

  // 计算统计数据
  calculateStats(works) {
    const totalWorks = works.length
    let totalLyrics = 0
    let totalMelodies = 0
    const statsByType = {
      verse: 0,
      chorus: 0,
      bridge: 0,
      other: 0
    }
    const creationDates = new Set()

    works.forEach(work => {
      // 统计歌词
      if (work.lyrics && work.lyrics.length > 0) {
        totalLyrics += work.lyrics.length

        // 统计各类型歌词
        work.lyrics.forEach(lyric => {
          const typeIndex = lyric.typeIndex || 0
          if (typeIndex === 0) statsByType.verse++
          else if (typeIndex === 1) statsByType.chorus++
          else if (typeIndex === 2) statsByType.bridge++
          else statsByType.other++

          // 统计旋律
          if (lyric.melodyUrl) {
            totalMelodies++
          }
        })

        // 记录创作日期
        if (work.createdAt) {
          const date = new Date(work.createdAt).toDateString()
          creationDates.add(date)
        }
      }
    })

    // 计算平均值
    const avgLyricsPerWork = totalWorks > 0 ? (totalLyrics / totalWorks).toFixed(1) : 0
    const avgMelodiesPerWork = totalWorks > 0 ? (totalMelodies / totalWorks).toFixed(1) : 0

    // 生成最近活动
    const recentActivity = works
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5)
      .map(work => ({
        title: work.title,
        action: '更新',
        time: this.formatTime(work.updatedAt)
      }))

    this.setData({
      totalWorks,
      totalLyrics,
      totalMelodies,
      statsByType,
      avgLyricsPerWork,
      avgMelodiesPerWork,
      activeDays: creationDates.size,
      recentActivity
    })
  },

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour

    if (diff < minute) {
      return '刚刚'
    } else if (diff < hour) {
      return `${Math.floor(diff / minute)}分钟前`
    } else if (diff < day) {
      return `${Math.floor(diff / hour)}小时前`
    } else if (diff < 7 * day) {
      return `${Math.floor(diff / day)}天前`
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`
    }
  },

  // 刷新统计
  refreshStats() {
    this.loadStats()
  }
})
