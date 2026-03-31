// pages/ai-history/ai-history.js
Page({
  data: {
    history: [],
    showDetail: false,
    selectedRecord: null
  },

  onLoad() {
    this.loadHistory()
  },

  onShow() {
    this.loadHistory()
  },

  // 加载历史记录
  loadHistory() {
    const history = wx.getStorageSync('aiHistory') || []
    this.setData({ history })
  },

  // 查看详情
  viewDetail(e) {
    const record = e.currentTarget.dataset.record
    const lyricsText = record.lyrics
      .map(l => `[${l.type}]\n${l.content}`)
      .join('\n\n')
    
    wx.showModal({
      title: `${record.emotion} ${record.style}`,
      content: `主题：${record.theme}\n\n${lyricsText}`,
      showCancel: false,
      confirmText: '关闭'
    })
  },

  // 使用历史记录
  useRecord(e) {
    const record = e.currentTarget.dataset.record
    const lyricsData = encodeURIComponent(JSON.stringify(record.lyrics))
    
    wx.showModal({
      title: '使用歌词',
      content: `确定要使用"${record.theme}"的歌词吗？`,
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: `/pages/create/create?template=${lyricsData}`
          })
        }
      }
    })
  },

  // 删除记录
  deleteRecord(e) {
    const index = e.currentTarget.dataset.index
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          const history = this.data.history
          history.splice(index, 1)
          
          this.setData({ history })
          wx.setStorageSync('aiHistory', history)
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 清空所有记录
  clearAll() {
    if (this.data.history.length === 0) {
      wx.showToast({
        title: '暂无记录',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          this.setData({ history: [] })
          wx.removeStorageSync('aiHistory')
          
          wx.showToast({
            title: '已清空',
            icon: 'success'
          })
        }
      }
    })
  },

  // 复制歌词
  copyLyrics(e) {
    const record = e.currentTarget.dataset.record
    const lyricsText = record.lyrics
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

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(timestamp)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    
    return `${month}月${day}日 ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }
})
