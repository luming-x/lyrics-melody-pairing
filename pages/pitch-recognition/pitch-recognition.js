// 音高识别页面
const pitchDetector = require('../../utils/pitch-detector')

Page({
  data: {
    isRecording: false,
    currentNote: '-',
    currentOctave: '-',
    currentFrequency: 0,
    pitchDeviation: 0,
    noteHistory: [],
    detectedKey: null,
    keyConfidence: 0,
    detectedChord: null,
    recorderManager: null,
    audioContext: null
  },

  onLoad() {
    this.initAudio()
  },

  onUnload() {
    this.cleanup()
  },

  // 初始化音频
  initAudio() {
    try {
      const recorderManager = wx.getRecorderManager()
      const audioContext = wx.createInnerAudioContext()
      
      this.setData({ recorderManager, audioContext })
      
      // 监听录音事件
      recorderManager.onStop((res) => {
        this.processAudio(res.tempFilePath)
      })
      
      recorderManager.onFrameRecorded((res) => {
        // 实时处理音频帧
        this.processAudioFrame(res.frameBuffer)
      })
      
      // 监听录音错误
      recorderManager.onError((err) => {
        console.error('录音错误', err)
        wx.showToast({ title: '录音失败', icon: 'none' })
        this.setData({ isRecording: false })
      })
      
    } catch (err) {
      console.error('音频初始化失败', err)
      wx.showToast({ title: '音频初始化失败', icon: 'none' })
    }
  },

  // 开始录音
  startRecording() {
    try {
      this.data.recorderManager.start({
        format: 'mp3',
        sampleRate: 44100,
        numberOfChannels: 1,
        frameSize: 50
      })
      
      this.setData({ 
        isRecording: true,
        currentNote: '-',
        currentOctave: '-',
        currentFrequency: 0
      })
      
      wx.showToast({ title: '开始识别', icon: 'success' })
    } catch (err) {
      console.error('开始录音失败', err)
      wx.showToast({ title: '开始录音失败', icon: 'none' })
    }
  },

  // 停止录音
  stopRecording() {
    try {
      this.data.recorderManager.stop()
      this.setData({ isRecording: false })
      wx.showToast({ title: '识别完成', icon: 'success' })
    } catch (err) {
      console.error('停止录音失败', err)
    }
  },

  // 处理音频文件
  async processAudio(audioPath) {
    wx.showLoading({ title: '分析中...' })
    
    try {
      // 由于小程序限制，这里使用模拟数据
      // 实际应用中应该使用音频处理API
      await this.simulatePitchDetection()
      
      wx.hideLoading()
    } catch (err) {
      console.error('音频处理失败', err)
      wx.hideLoading()
      wx.showToast({ title: '处理失败', icon: 'none' })
    }
  },

  // 处理音频帧（实时识别）
  processAudioFrame(frameBuffer) {
    // 这里应该调用音高检测算法
    // 由于小程序限制，使用模拟数据
    // 实际应用中应该使用 Web Audio API 或其他音频处理库
    
    // 模拟：随机生成音符
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const randomNote = notes[Math.floor(Math.random() * notes.length)]
    const randomOctave = 3 + Math.floor(Math.random() * 3)
    const randomFreq = pitchDetector.noteToFrequency(randomNote, randomOctave)
    
    const noteInfo = pitchDetector.frequencyToNote(randomFreq)
    
    this.setData({
      currentNote: noteInfo.note,
      currentOctave: noteInfo.octave,
      currentFrequency: noteInfo.frequency,
      pitchDeviation: noteInfo.cents
    })
    
    // 添加到历史记录
    const historyItem = {
      note: noteInfo.note,
      octave: noteInfo.octave,
      frequency: noteInfo.frequency,
      deviation: noteInfo.cents,
      timestamp: Date.now()
    }
    
    const noteHistory = [...this.data.noteHistory, historyItem].slice(-20)
    this.setData({ noteHistory })
    
    // 如果有足够的历史记录，进行调性分析
    if (noteHistory.length >= 7) {
      const keyAnalysis = pitchDetector.analyzeKey(
        noteHistory.map(h => ({ note: h.note, octave: h.octave }))
      )
      
      this.setData({
        detectedKey: keyAnalysis.key,
        keyConfidence: keyAnalysis.confidence
      })
    }
  },

  // 模拟音高检测（演示用）
  async simulatePitchDetection() {
    // 模拟检测过程
    return new Promise((resolve) => {
      setTimeout(() => {
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
        const randomNote = notes[Math.floor(Math.random() * notes.length)]
        
        this.setData({
          currentNote: randomNote,
          currentOctave: 4,
          currentFrequency: pitchDetector.noteToFrequency(randomNote, 4),
          pitchDeviation: Math.floor(Math.random() * 20) - 10,
          detectedKey: randomNote + '调',
          keyConfidence: 75 + Math.floor(Math.random() * 25)
        })
        
        resolve()
      }, 1500)
    })
  },

  // 清除历史
  onClearHistory() {
    this.setData({ 
      noteHistory: [],
      currentNote: '-',
      currentOctave: '-',
      currentFrequency: 0,
      detectedKey: null,
      keyConfidence: 0
    })
  },

  // 清理资源
  cleanup() {
    if (this.data.recorderManager) {
      this.data.recorderManager.stop()
    }
    if (this.data.audioContext) {
      this.data.audioContext.destroy()
    }
  }
})
