// pages/player/player.js
const app = getApp()

Page({
  data: {
    work: null,
    sectionTypes: ['主歌', '副歌', '桥段', '前奏', '间奏', '结尾'],
    currentIndex: 0,
    currentSectionId: 'section-0',
    isPlaying: false,
    audioContext: null
  },

  onLoad(options) {
    if (options.id) {
      this.loadWork(options.id)
    }
  },

  onUnload() {
    // 页面卸载时停止播放
    if (this.data.audioContext) {
      this.data.audioContext.stop()
      this.data.audioContext.destroy()
    }
  },

  // 加载作品
  loadWork(id) {
    // 检查云开发是否已配置
    if (!app.globalData.envId || !wx.cloud) {
      wx.showModal({
        title: '提示',
        content: '请先配置云开发环境',
        showCancel: false
      })
      return
    }

    wx.showLoading({ title: '加载中...' })

    const db = wx.cloud.database()
    db.collection('works').doc(id).get()
      .then(res => {
        this.setData({
          work: res.data
        })
        wx.hideLoading()
      })
      .catch(err => {
        console.error('加载失败', err)
        wx.hideLoading()
        wx.showToast({ title: '加载失败', icon: 'none' })
      })
  },

  // 播放旋律
  playMelody(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    const url = e.currentTarget.dataset.url

    // 如果点击的是当前正在播放的段落
    if (this.data.currentIndex === index && this.data.isPlaying) {
      this.pausePlay()
      return
    }

    // 如果点击的是其他段落，先停止当前播放
    if (this.data.audioContext) {
      this.data.audioContext.stop()
      this.data.audioContext.destroy()
    }

    // 创建新的音频上下文
    const audioContext = wx.createInnerAudioContext()
    audioContext.src = url

    audioContext.onPlay(() => {
      this.setData({
        isPlaying: true,
        currentIndex: index,
        currentSectionId: `section-${index}`,
        audioContext
      })
    })

    audioContext.onPause(() => {
      this.setData({ isPlaying: false })
    })

    audioContext.onStop(() => {
      this.setData({ isPlaying: false })
    })

    audioContext.onEnded(() => {
      this.setData({ isPlaying: false })
      // 自动播放下一段有旋律的段落
      this.autoPlayNext(index)
    })

    audioContext.onError((err) => {
      console.error('播放失败', err)
      wx.showToast({ title: '播放失败', icon: 'none' })
      this.setData({ isPlaying: false })
    })

    audioContext.play()
  },

  // 暂停播放
  pausePlay() {
    if (this.data.audioContext) {
      this.data.audioContext.pause()
    }
  },

  // 自动播放下一段
  autoPlayNext(currentIndex) {
    const work = this.data.work
    const nextIndex = currentIndex + 1

    // 查找下一段有旋律的段落
    for (let i = nextIndex; i < work.lyrics.length; i++) {
      if (work.lyrics[i].melodyUrl) {
        setTimeout(() => {
          this.playMelody({
            currentTarget: {
              dataset: {
                index: i,
                url: work.lyrics[i].melodyUrl
              }
            }
          })
        }, 500)
        return
      }
    }
  },

  // 编辑作品
  editWork() {
    const id = this.data.work._id
    wx.navigateTo({
      url: `/pages/create/create?id=${id}`
    })
  },

  // 分享作品
  shareWork() {
    const work = this.data.work
    wx.showShareMenu({
      withShareTicket: true
    })

    // 也可以自定义分享内容
    wx.showModal({
      title: '分享作品',
      content: `「${work.title}」-${work.lyricsCount}段歌词`,
      confirmText: '复制分享',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: `「${work.title}」-${work.lyricsCount}段歌词\n\n${work.lyrics[0].content}`,
            success: () => {
              wx.showToast({ title: '已复制到剪贴板', icon: 'success' })
            }
          })
        }
      }
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    if (this.data.work && this.data.work._id) {
      this.loadWork(this.data.work._id)
    }
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
