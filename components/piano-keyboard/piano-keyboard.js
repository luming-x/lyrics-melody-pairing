// 钢琴虚拟键盘组件
Component({
  properties: {
    // 键盘起始八度
    startOctave: {
      type: Number,
      value: 3
    },
    // 键盘结束八度
    endOctave: {
      type: Number,
      value: 5
    },
    // 是否可交互
    interactive: {
      type: Boolean,
      value: true
    }
  },

  data: {
    whiteKeys: [],
    blackKeys: [],
    audioContext: null,
    pressedKeys: []
  },

  lifetimes: {
    attached() {
      this.initKeyboard()
      this.initAudio()
    },

    detached() {
      this.cleanup()
    }
  },

  methods: {
    // 初始化键盘
    initKeyboard() {
      const whiteKeys = []
      const blackKeys = []
      
      const whiteKeyNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
      const blackKeyPositions = [1, 2, 4, 5, 6] // 相对白键的位置
      
      for (let octave = this.data.startOctave; octave <= this.data.endOctave; octave++) {
        whiteKeyNames.forEach((keyName, index) => {
          const note = `${keyName}${octave}`
          whiteKeys.push({
            note: note,
            frequency: this.getFrequency(note),
            index: whiteKeys.length
          })
        })
        
        blackKeyPositions.forEach((pos) => {
          const blackKeyName = this.getBlackKeyName(pos)
          if (blackKeyName) {
            const note = `${blackKeyName}${octave}`
            blackKeys.push({
              note: note,
              frequency: this.getFrequency(note),
              position: pos,
              index: blackKeys.length
            })
          }
        })
      }
      
      this.setData({ whiteKeys, blackKeys })
    },

    // 获取黑键名称
    getBlackKeyName(position) {
      const map = {
        1: 'C#',
        2: 'D#',
        4: 'F#',
        5: 'G#',
        6: 'A#'
      }
      return map[position]
    },

    // 获取音高频率
    getFrequency(note) {
      const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
      const noteRegex = /^([A-G][#b]?)(\d+)$/
      const match = note.match(noteRegex)
      
      if (!match) return null
      
      const [, noteName, octave] = match
      const noteIndex = noteStrings.indexOf(noteName)
      if (noteIndex === -1) return null
      
      const A4 = 440
      const semitones = (parseInt(octave) - 4) * 12 + (noteIndex - 9)
      return A4 * Math.pow(2, semitones / 12)
    },

    // 初始化音频
    initAudio() {
      try {
        const audioContext = wx.createInnerAudioContext()
        this.setData({ audioContext })
      } catch (err) {
        console.error('音频初始化失败', err)
      }
    },

    // 播放音符
    playNote(frequency) {
      // 由于小程序限制，这里使用振动反馈
      wx.vibrateShort({ type: 'light' })
      
      // 触发自定义事件
      this.triggerEvent('noteon', { frequency, timestamp: Date.now() })
    },

    // 停止音符
    stopNote(frequency) {
      this.triggerEvent('noteoff', { frequency, timestamp: Date.now() })
    },

    // 白键按下
    onWhiteKeyDown(e) {
      if (!this.data.interactive) return
      
      const { frequency, note } = e.currentTarget.dataset
      const pressedKeys = [...this.data.pressedKeys, note]
      
      this.setData({ pressedKeys })
      this.playNote(frequency)
    },

    // 白键松开
    onWhiteKeyUp(e) {
      const { frequency, note } = e.currentTarget.dataset
      const pressedKeys = this.data.pressedKeys.filter(k => k !== note)
      
      this.setData({ pressedKeys })
      this.stopNote(frequency)
    },

    // 黑键按下
    onBlackKeyDown(e) {
      if (!this.data.interactive) return
      
      const { frequency, note } = e.currentTarget.dataset
      const pressedKeys = [...this.data.pressedKeys, note]
      
      this.setData({ pressedKeys })
      this.playNote(frequency)
    },

    // 黑键松开
    onBlackKeyUp(e) {
      const { frequency, note } = e.currentTarget.dataset
      const pressedKeys = this.data.pressedKeys.filter(k => k !== note)
      
      this.setData({ pressedKeys })
      this.stopNote(frequency)
    },

    // 清理资源
    cleanup() {
      if (this.data.audioContext) {
        this.data.audioContext.destroy()
      }
    },

    // 外部调用：播放音符
    externalPlayNote(note) {
      const frequency = this.getFrequency(note)
      if (frequency) {
        this.playNote(frequency)
      }
    }
  }
})
