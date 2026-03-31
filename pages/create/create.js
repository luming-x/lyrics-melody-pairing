// pages/create/create.js
const app = getApp()

Page({
  data: {
    title: '',
    theme: '',
    tags: '',
    notes: '',
    lyrics: [
      {
        typeIndex: 0,
        content: '',
        melodyUrl: ''
      }
    ],
    sectionTypes: ['主歌', '副歌', '桥段', '前奏', '间奏', '结尾'],
    recording: false
  },

  onLoad(options) {
    // 如果有编辑的作品ID，加载作品数据
    if (options.id) {
      this.loadWork(options.id)
    }
  },

  // 加载作品
  loadWork(id) {
    wx.showLoading({ title: '加载中...' })

    const db = wx.cloud.database()
    db.collection('works').doc(id).get()
      .then(res => {
        const work = res.data
        this.setData({
          title: work.title || '',
          theme: work.theme || '',
          tags: work.tags ? work.tags.join(',') : '',
          notes: work.notes || '',
          lyrics: work.lyrics || this.data.lyrics
        })
        wx.hideLoading()
      })
      .catch(err => {
        console.error('加载失败', err)
        wx.hideLoading()
        wx.showToast({ title: '加载失败', icon: 'none' })
      })
  },

  // 输入事件
  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },

  onThemeInput(e) {
    this.setData({ theme: e.detail.value })
  },

  onTagsInput(e) {
    this.setData({ tags: e.detail.value })
  },

  onNotesInput(e) {
    this.setData({ notes: e.detail.value })
  },

  onLyricInput(e) {
    const index = e.currentTarget.dataset.index
    const lyrics = this.data.lyrics
    lyrics[index].content = e.detail.value
    this.setData({ lyrics })
  },

  onSectionTypeChange(e) {
    const index = e.currentTarget.dataset.index
    const lyrics = this.data.lyrics
    lyrics[index].typeIndex = parseInt(e.detail.value)
    this.setData({ lyrics })
  },

  // 添加歌词段落
  addLyricSection() {
    const lyrics = [...this.data.lyrics, {
      typeIndex: 0,
      content: '',
      melodyUrl: ''
    }]
    this.setData({ lyrics })
  },

  // 删除歌词段落
  deleteLyricSection(e) {
    const index = e.currentTarget.dataset.index
    let lyrics = this.data.lyrics
    if (lyrics.length > 1) {
      lyrics.splice(index, 1)
      this.setData({ lyrics })
    } else {
      wx.showToast({ title: '至少保留一段歌词', icon: 'none' })
    }
  },

  // 录制旋律
  recordMelody(e) {
    const index = e.currentTarget.dataset.index

    wx.showModal({
      title: '录制旋律',
      content: '开始录制后，请演唱或哼唱这段旋律的曲调',
      confirmText: '开始录制',
      success: (res) => {
        if (res.confirm) {
          this.startRecording(index)
        }
      }
    })
  },

  startRecording(index) {
    const recorderManager = wx.getRecorderManager()
    const tempFilePath = ''

    recorderManager.onStart(() => {
      this.setData({ recording: true })
      wx.showLoading({ title: '录制中...', mask: true })
    })

    recorderManager.onStop((res) => {
      this.setData({ recording: false })
      wx.hideLoading()
      this.uploadMelodyFile(index, res.tempFilePath)
    })

    recorderManager.onError((err) => {
      console.error('录制失败', err)
      this.setData({ recording: false })
      wx.hideLoading()
      wx.showToast({ title: '录制失败', icon: 'none' })
    })

    recorderManager.start({
      format: 'mp3',
      duration: 60000 // 最长60秒
    })

    // 模拟停止录制（实际应该由用户点击停止）
    setTimeout(() => {
      recorderManager.stop()
    }, 30000) // 30秒后自动停止
  },

  // 上传旋律文件
  uploadMelody(e) {
    const index = e.currentTarget.dataset.index

    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['mp3', 'wav', 'aac', 'm4a'],
      success: (res) => {
        this.uploadMelodyFile(index, res.tempFiles[0].path)
      }
    })
  },

  // 上传旋律到云存储
  uploadMelodyFile(index, filePath) {
    wx.showLoading({ title: '上传中...' })

    const cloudPath = `melodies/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp3`

    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: (res) => {
        const lyrics = this.data.lyrics
        lyrics[index].melodyUrl = res.fileID
        this.setData({ lyrics })
        wx.hideLoading()
        wx.showToast({ title: '上传成功', icon: 'success' })
      },
      fail: (err) => {
        console.error('上传失败', err)
        wx.hideLoading()
        wx.showToast({ title: '上传失败', icon: 'none' })
      }
    })
  },

  // 试听旋律
  playMelody(e) {
    const url = e.currentTarget.dataset.url
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = url
    innerAudioContext.play()
  },

  // 删除旋律
  removeMelody(e) {
    const index = e.currentTarget.dataset.index

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这段旋律吗？',
      success: (res) => {
        if (res.confirm) {
          const lyrics = this.data.lyrics
          lyrics[index].melodyUrl = ''
          this.setData({ lyrics })
        }
      }
    })
  },

  // 保存作品
  saveWork() {
    if (!this.data.title.trim()) {
      wx.showToast({ title: '请输入作品标题', icon: 'none' })
      return
    }

    // 检查云开发是否已配置
    if (!app.globalData.envId || !wx.cloud) {
      wx.showModal({
        title: '提示',
        content: '请先配置云开发环境才能保存作品',
        showCancel: false
      })
      return
    }

    wx.showLoading({ title: '保存中...' })

    const work = {
      title: this.data.title,
      theme: this.data.theme,
      tags: this.data.tags.split(',').map(t => t.trim()).filter(t => t),
      notes: this.data.notes,
      lyrics: this.data.lyrics,
      lyricsCount: this.data.lyrics.length,
      updatedAt: Date.now(),
      createdAt: Date.now()
    }

    const db = wx.cloud.database()
    db.collection('works').add({
      data: work
    })
    .then(res => {
      wx.hideLoading()
      wx.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    })
    .catch(err => {
      console.error('保存失败', err)
      wx.hideLoading()
      wx.showToast({ title: '保存失败', icon: 'none' })
    })
  }
})
