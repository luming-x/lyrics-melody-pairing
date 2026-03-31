// 简谱生成页面
const sheetMusicGenerator = require('../../utils/sheet-music-generator')

Page({
  data: {
    workId: null,
    workData: null,
    sheetMusicText: '',
    sheetMusicHTML: '',
    selectedKey: 'C',
    selectedSignature: '4/4',
    showLyrics: true,
    keys: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C#', 'D#', 'F#', 'G#', 'A#'],
    signatures: ['2/4', '3/4', '4/4', '6/8'],
    isGenerating: false,
    canEdit: false
  },

  onLoad(options) {
    if (options.id) {
      this.loadWork(options.id)
    }
  },

  // 加载作品
  loadWork(workId) {
    wx.showLoading({ title: '加载中...' })
    
    wx.cloud.database().collection('works')
      .doc(workId)
      .get()
      .then(res => {
        const work = res.data
        this.setData({ 
          workData: work,
          workId: workId,
          canEdit: work.userId === wx.getStorageSync('userId')
        })
        
        // 自动生成简谱
        this.generateSheetMusic()
        wx.hideLoading()
      })
      .catch(err => {
        wx.hideLoading()
        wx.showToast({ title: '加载失败', icon: 'none' })
        console.error(err)
      })
  },

  // 生成简谱
  generateSheetMusic() {
    if (!this.data.workData) return
    
    this.setData({ isGenerating: true })
    
    // 从作品数据中提取旋律和歌词
    const melodyData = this.extractMelodyData()
    const lyrics = this.extractLyrics()
    
    try {
      // 生成简谱
      const sheetMusic = sheetMusicGenerator.generateSheetMusic(
        melodyData,
        {
          key: this.data.selectedKey,
          timeSignature: this.data.selectedSignature,
          showLyrics: this.data.showLyrics
        }
      )
      
      // 生成HTML
      const html = sheetMusicGenerator.generateSheetMusicHTML(sheetMusic)
      
      this.setData({
        sheetMusicText: sheetMusic,
        sheetMusicHTML: html,
        isGenerating: false
      })
      
      wx.showToast({ title: '生成成功', icon: 'success' })
    } catch (err) {
      console.error('简谱生成失败', err)
      wx.showToast({ title: '生成失败', icon: 'none' })
      this.setData({ isGenerating: false })
    }
  },

  // 提取旋律数据
  extractMelodyData() {
    const work = this.data.workData
    const melodyData = []
    
    work.lyrics.forEach(lyric => {
      if (lyric.melodyUrl) {
        // 如果有旋律音频，这里应该使用音高识别获取旋律数据
        // 暂时使用模拟数据
        melodyData.push({
          pitch: 'C4',
          duration: 'quarter',
          lyric: lyric.content
        })
      } else {
        // 没有旋律，使用默认音高
        melodyData.push({
          pitch: 'C4',
          duration: 'quarter',
          lyric: lyric.content
        })
      }
    })
    
    return melodyData
  },

  // 提取歌词
  extractLyrics() {
    const work = this.data.workData
    return work.lyrics.map(lyric => lyric.content)
  },

  // 选择调式
  onSelectKey(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ selectedKey: key }, () => {
      this.generateSheetMusic()
    })
  },

  // 选择拍号
  onSelectSignature(e) {
    const signature = e.currentTarget.dataset.signature
    this.setData({ selectedSignature: signature }, () => {
      this.generateSheetMusic()
    })
  },

  // 切换是否显示歌词
  onToggleLyrics() {
    const newShowLyrics = !this.data.showLyrics
    this.setData({ showLyrics: newShowLyrics }, () => {
      this.generateSheetMusic()
    })
  },

  // 复制简谱文本
  onCopySheetMusic() {
    wx.setClipboardData({
      data: this.data.sheetMusicText,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },

  // 保存为图片
  onSaveAsImage() {
    wx.showLoading({ title: '生成中...' })
    
    // 使用canvas绘制简谱
    const query = wx.createSelectorQuery()
    query.select('#sheetCanvas')
      .fields({ node: true, size: true })
      .exec(res => {
        if (!res[0]) {
          wx.hideLoading()
          wx.showToast({ title: '生成失败', icon: 'none' })
          return
        }
        
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        
        // 设置canvas尺寸
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = 750 * dpr
        canvas.height = 1334 * dpr
        ctx.scale(dpr, dpr)
        
        // 绘制背景
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, 750, 1334)
        
        // 绘制简谱
        ctx.fillStyle = '#000000'
        ctx.font = '24px Arial'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        
        const lines = this.data.sheetMusicText.split('\n')
        let y = 50
        lines.forEach(line => {
          ctx.fillText(line, 40, y)
          y += 50
        })
        
        // 导出图片
        wx.canvasToTempFilePath({
          canvas: canvas,
          success: res => {
            wx.hideLoading()
            
            // 保存图片
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                wx.showToast({ title: '已保存', icon: 'success' })
              },
              fail: () => {
                wx.showToast({ title: '保存失败', icon: 'none' })
              }
            })
          },
          fail: () => {
            wx.hideLoading()
            wx.showToast({ title: '生成失败', icon: 'none' })
          }
        })
      })
  },

  // 分享简谱
  onShare() {
    // 将简谱文本转换为图片后分享
    this.onSaveAsImage()
  }
})
