// 钢琴页面
Page({
  data: {
    startOctave: 3,
    endOctave: 5,
    interactive: true,
    lastPlayedNote: null,
    noteHistory: [],
    showSettings: false
  },

  onLoad() {
    this.setData({ noteHistory: [] })
  },

  // 音符按下
  onNoteOn(e) {
    const { frequency, timestamp } = e.detail
    
    // 查找音符名称
    const noteName = this.getNoteName(frequency)
    
    this.setData({
      lastPlayedNote: noteName,
      noteHistory: [...this.data.noteHistory, noteName].slice(-10)
    })
    
    wx.vibrateShort({ type: 'light' })
  },

  // 音符松开
  onNoteOff(e) {
    // 可以在这里添加音符结束的处理逻辑
  },

  // 根据频率获取音符名称
  getNoteName(frequency) {
    const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const A4 = 440
    const semitones = Math.round(12 * Math.log2(frequency / A4))
    const octave = Math.floor((semitones + 69) / 12) - 1
    const noteIndex = (semitones + 69) % 12
    
    return `${noteStrings[noteIndex]}${octave}`
  },

  // 切换设置面板
  onToggleSettings() {
    this.setData({ showSettings: !this.data.showSettings })
  },

  // 选择起始八度
  onChangeStartOctave(e) {
    const startOctave = parseInt(e.detail.value)
    this.setData({ startOctave })
  },

  // 选择结束八度
  onChangeEndOctave(e) {
    const endOctave = parseInt(e.detail.value)
    this.setData({ endOctave })
  },

  // 切换交互模式
  onToggleInteractive() {
    this.setData({ interactive: !this.data.interactive })
  },

  // 清除历史
  onClearHistory() {
    this.setData({ noteHistory: [], lastPlayedNote: null })
  }
})
