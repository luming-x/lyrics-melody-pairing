// pages/metronome/metronome.js
const app = getApp()

Page({
  data: {
    bpm: 120, // 每分钟节拍数
    minBPM: 40,
    maxBPM: 240,
    isPlaying: false,
    currentBeat: 1,
    beatsPerMeasure: 4, // 每小节拍数
    accentBeat: 1, // 强拍位置
    lastClickTime: 0,
    timer: null,
    interval: 0,
    volume: 0.8,
    showSettings: false
  },

  onLoad() {
    this.calculateInterval()
  },

  onUnload() {
    this.stopMetronome()
  },

  // 计算间隔时间（毫秒）
  calculateInterval() {
    const { bpm } = this.data
    const interval = (60 / bpm) * 1000
    this.setData({ interval })
  },

  // 开始/停止
  togglePlay() {
    const { isPlaying } = this.data
    if (isPlaying) {
      this.stopMetronome()
    } else {
      this.startMetronome()
    }
  },

  // 开始节拍器
  startMetronome() {
    this.setData({ isPlaying: true, currentBeat: 1 })
    this.playBeat()
    
    const intervalId = setInterval(() => {
      this.playBeat()
    }, this.data.interval)
    
    this.setData({ timer: intervalId })
  },

  // 停止节拍器
  stopMetronome() {
    this.setData({ isPlaying: false, currentBeat: 1 })
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({ timer: null })
    }
  },

  // 播放节拍
  playBeat() {
    const { bpm, beatsPerMeasure, accentBeat, currentBeat, volume } = this.data
    const isAccent = currentBeat === accentBeat
    
    // 生成节拍音效
    this.generateClickSound(isAccent, volume)
    
    // 震动反馈
    if (isAccent) {
      wx.vibrateShort({ type: 'heavy' })
    } else {
      wx.vibrateShort({ type: 'light' })
    }
    
    // 更新当前拍数
    const nextBeat = currentBeat >= beatsPerMeasure ? 1 : currentBeat + 1
    this.setData({ currentBeat: nextBeat })
  },

  // 生成节拍音效
  generateClickSound(isAccent, volume) {
    const audioContext = wx.createInnerAudioContext()
    
    // 使用音频振荡器生成音效
    if (wx.createAudioContext) {
      const audioCtx = wx.createAudioContext()
      
      if (isAccent) {
        // 强拍：高频，音量更大
        audioCtx.play({
          volume: volume,
          audioType: 'high'
        })
      } else {
        // 弱拍：中频，音量较小
        audioCtx.play({
          volume: volume * 0.6,
          audioType: 'medium'
        })
      }
    }
    
    // 备用方案：使用预置的滴答声
    if (!audioContext) {
      // 这里可以播放预录制的滴答声文件
      console.log('播放节拍音效', isAccent ? '强拍' : '弱拍')
    }
  },

  // 调整BPM
  onBPMChange(e) {
    const bpm = parseInt(e.detail.value)
    this.setData({ bpm })
    this.calculateInterval()
    
    // 如果正在播放，重启以应用新BPM
    if (this.data.isPlaying) {
      this.stopMetronome()
      this.startMetronome()
    }
  },

  // 增加BPM
  increaseBPM() {
    const { bpm, maxBPM } = this.data
    const newBPM = Math.min(bpm + 5, maxBPM)
    this.setData({ bpm: newBPM })
    this.calculateInterval()
    
    if (this.data.isPlaying) {
      this.stopMetronome()
      this.startMetronome()
    }
  },

  // 减少BPM
  decreaseBPM() {
    const { bpm, minBPM } = this.data
    const newBPM = Math.max(bpm - 5, minBPM)
    this.setData({ bpm: newBPM })
    this.calculateInterval()
    
    if (this.data.isPlaying) {
      this.stopMetronome()
      this.startMetronome()
    }
  },

  // 设置每小节拍数
  onBeatsPerMeasureChange(e) {
    const beatsPerMeasure = parseInt(e.detail.value)
    this.setData({ beatsPerMeasure })
  },

  // 调整音量
  onVolumeChange(e) {
    const volume = parseFloat(e.detail.value)
    this.setData({ volume })
  },

  // 显示/隐藏设置面板
  toggleSettings() {
    this.setData({ showSettings: !this.data.showSettings })
  },

  // 预设BPM
  setPresetBPM(bpm) {
    this.setData({ bpm })
    this.calculateInterval()
    
    if (this.data.isPlaying) {
      this.stopMetronome()
      this.startMetronome()
    }
  },

  // 重置为默认设置
  resetSettings() {
    this.setData({
      bpm: 120,
      beatsPerMeasure: 4,
      volume: 0.8
    })
    this.calculateInterval()
    
    if (this.data.isPlaying) {
      this.stopMetronome()
      this.startMetronome()
    }
  }
})
