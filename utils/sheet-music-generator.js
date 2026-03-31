// 简谱自动生成工具

/**
 * 音高到简谱数字的映射
 */
const NOTE_TO_NUMBER = {
  'C4': 1,  'D4': 2,  'E4': 3,  'F4': 4,  'G4': 5,  'A4': 6,  'B4': 7,
  'C5': 1.1, 'D5': 2.1, 'E5': 3.1, 'F5': 4.1, 'G5': 5.1, 'A5': 6.1, 'B5': 7.1,
  'C3': 1.-1, 'D3': 2.-1, 'E3': 3.-1, 'F3': 4.-1, 'G3': 5.-1, 'A3': 6.-1, 'B3': 7.-1,
  // 升降音
  'C#4': '#1', 'D#4': '#2', 'F#4': '#4', 'G#4': '#5', 'A#4': '#6',
  'Db4': 'b2', 'Eb4': 'b3', 'Gb4': 'b5', 'Ab4': 'b6', 'Bb4': 'b7'
}

/**
 * 音符时长映射
 */
const DURATION_MAP = {
  'whole': '1-',
  'half': '2-',
  'quarter': '4',
  'eighth': '8',
  'sixteenth': '16'
}

/**
 * 频率到音高的转换
 * 基于 A4 = 440Hz
 */
function frequencyToNote(frequency) {
  const A4 = 440
  const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  
  const semitones = Math.round(12 * Math.log2(frequency / A4))
  const octave = Math.floor((semitones + 69) / 12) - 1
  const noteIndex = (semitones + 69) % 12
  
  const note = noteStrings[noteIndex]
  return `${note}${octave}`
}

/**
 * 音高到频率转换
 */
function noteToFrequency(note) {
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
}

/**
 * 调式调整（根据目标调式转调）
 */
function transposeNote(note, originalKey, targetKey) {
  const semitoneValues = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
    'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  }
  
  const noteRegex = /^([A-G][#b]?)(\d+)$/
  const match = note.match(noteRegex)
  if (!match) return note
  
  const [, noteName, octave] = match
  const semitoneOffset = semitoneValues[targetKey] - semitoneValues[originalKey]
  
  const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  let noteIndex = noteStrings.indexOf(noteName)
  if (noteIndex === -1) return note
  
  let newIndex = (noteIndex + semitoneOffset) % 12
  if (newIndex < 0) newIndex += 12
  
  let newOctave = parseInt(octave)
  if (noteIndex + semitoneOffset < 0) newOctave--
  if (noteIndex + semitoneOffset >= 12) newOctave++
  
  return `${noteStrings[newIndex]}${newOctave}`
}

/**
 * 生成简谱字符串
 */
function generateSheetMusic(notes, options = {}) {
  const {
    key = 'C',        // 调式
    timeSignature = '4/4',  // 拍号
    showLyrics = true,  // 是否显示歌词
    fontSize = 16      // 字体大小
  } = options
  
  let sheet = []
  let currentBar = 1
  let beatsInBar = parseInt(timeSignature.split('/')[1])
  let currentBeats = 0
  
  sheet.push(`=== ${key}调 ${timeSignature} ===\n`)
  
  notes.forEach((note, index) => {
    const noteNumber = NOTE_TO_NUMBER[note.pitch] || note.pitch
    const duration = DURATION_MAP[note.duration] || '4'
    const lyric = note.lyric || ''
    
    // 添加音符
    let line = `${noteNumber}  `
    if (showLyrics && lyric) {
      line += `    ${lyric}`
    }
    sheet.push(line)
    
    // 统计拍数
    const durationBeats = {
      '1-': 4, '2-': 2, '4': 1, '8': 0.5, '16': 0.25
    }
    currentBeats += durationBeats[duration] || 1
    
    // 换行处理
    if (currentBeats >= beatsInBar) {
      sheet.push('|')  // 小节线
      currentBeats = 0
      currentBar++
      
      if (currentBar % 4 === 1) {
        sheet.push('')  // 每4小节空一行
      }
    }
  })
  
  return sheet.join('\n')
}

/**
 * 根据旋律数据生成简谱
 */
function melodyToSheetMusic(melodyData, lyrics = []) {
  const notes = melodyData.map((note, index) => ({
    pitch: frequencyToNote(note.frequency),
    duration: note.duration || 'quarter',
    lyric: lyrics[index] || ''
  }))
  
  return generateSheetMusic(notes)
}

/**
 * 简谱导出为图片格式的配置
 */
function getSheetMusicStyle(theme = 'light') {
  const styles = {
    light: {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      lineColor: '#000000',
      accentColor: '#007AFF'
    },
    dark: {
      backgroundColor: '#1C1C1E',
      textColor: '#FFFFFF',
      lineColor: '#FFFFFF',
      accentColor: '#0A84FF'
    }
  }
  return styles[theme] || styles.light
}

/**
 * 生成简谱的HTML表示（用于导出或显示）
 */
function generateSheetMusicHTML(sheetMusicText) {
  const lines = sheetMusicText.split('\n')
  
  let html = '<div class="sheet-music">'
  lines.forEach(line => {
    if (line.startsWith('===')) {
      // 标题行
      html += `<div class="sheet-title">${line.replace(/===/g, '').trim()}</div>`
    } else if (line === '') {
      // 空行
      html += '<div class="sheet-space"></div>'
    } else if (line === '|') {
      // 小节线
      html += '<div class="sheet-bar">|</div>'
    } else {
      // 音符行
      html += `<div class="sheet-line">${line}</div>`
    }
  })
  html += '</div>'
  
  return html
}

module.exports = {
  frequencyToNote,
  noteToFrequency,
  transposeNote,
  generateSheetMusic,
  melodyToSheetMusic,
  getSheetMusicStyle,
  generateSheetMusicHTML,
  NOTE_TO_NUMBER,
  DURATION_MAP
}
