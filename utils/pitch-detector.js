// 音高识别工具

/**
 * 使用自相关算法进行音高检测
 * @param {Array} audioData - 音频数据（Float32Array）
 * @param {number} sampleRate - 采样率
 * @returns {number|null} - 检测到的频率，null表示未检测到
 */
function detectPitch(audioData, sampleRate) {
  if (!audioData || audioData.length === 0) return null

  // 计算自相关
  const autocorrelation = computeAutocorrelation(audioData)
  
  // 找到第一个峰值
  let bestOffset = -1
  let bestCorrelation = 0
  let foundGoodCorrelation = false
  const correlations = new Array(autocorrelation.length).fill(0)
  
  for (let offset = 0; offset < autocorrelation.length; offset++) {
    correlations[offset] = Math.abs(autocorrelation[offset])
    if (correlations[offset] > 0.9) {
      foundGoodCorrelation = true
    }
    if (!foundGoodCorrelation) continue
    if (correlations[offset] > bestCorrelation) {
      bestCorrelation = correlations[offset]
      bestOffset = offset
    } else {
      break
    }
  }
  
  if (bestOffset === -1) return null
  
  // 使用抛物线插值提高精度
  const interpolatedOffset = parabolicInterpolation(correlations, bestOffset)
  const frequency = sampleRate / interpolatedOffset
  
  return frequency
}

/**
 * 计算自相关函数
 */
function computeAutocorrelation(audioData) {
  const size = audioData.length
  const maxCorrelations = Math.floor(size / 2)
  const correlations = new Array(maxCorrelations).fill(0)
  
  for (let lag = 0; lag < maxCorrelations; lag++) {
    let sum = 0
    for (let i = 0; i < maxCorrelations; i++) {
      sum += audioData[i] * audioData[i + lag]
    }
    correlations[lag] = sum
  }
  
  return correlations
}

/**
 * 抛物线插值
 */
function parabolicInterpolation(arr, peakIndex) {
  const y1 = arr[peakIndex - 1] || arr[peakIndex]
  const y2 = arr[peakIndex]
  const y3 = arr[peakIndex + 1] || arr[peakIndex]
  
  const denominator = 2 * (y1 - 2 * y2 + y3)
  if (denominator === 0) return peakIndex
  
  const offset = (y1 - y3) / denominator
  return peakIndex + offset
}

/**
 * 频率转音高名称
 */
function frequencyToNote(frequency) {
  const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const A4 = 440
  
  // 计算相对于A4的半音数
  const semitones = Math.round(12 * Math.log2(frequency / A4))
  const octave = Math.floor((semitones + 69) / 12) - 1
  const noteIndex = (semitones + 69) % 12
  
  const note = noteStrings[noteIndex]
  const cents = Math.round(1200 * Math.log2(frequency / noteToFrequency(note, octave)))
  
  return {
    note: note,
    octave: octave,
    cents: cents,
    frequency: frequency
  }
}

/**
 * 音高转频率
 */
function noteToFrequency(note, octave) {
  const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const noteIndex = noteStrings.indexOf(note)
  if (noteIndex === -1) return null
  
  const A4 = 440
  const semitones = (octave - 4) * 12 + (noteIndex - 9)
  return A4 * Math.pow(2, semitones / 12)
}

/**
 * 计算音准偏差（音分）
 */
function getPitchDeviation(targetFrequency, actualFrequency) {
  return Math.round(1200 * Math.log2(actualFrequency / targetFrequency))
}

/**
 * 分析音调（调性检测）
 * @param {Array} notes - 音高列表 [{note, octave, cents}]
 * @returns {Object} - 调性分析结果
 */
function analyzeKey(notes) {
  if (!notes || notes.length === 0) {
    return { key: null, confidence: 0 }
  }
  
  // 统计每个音符出现的次数
  const noteCounts = {}
  notes.forEach(({note}) => {
    noteCounts[note] = (noteCounts[note] || 0) + 1
  })
  
  // 调式音阶映射
  const majorScales = {
    'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
    'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
    'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
    'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
    'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
    'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
    'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
    'Gb': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F']
  }
  
  // 评估每个调式的匹配度
  let bestKey = null
  let bestScore = 0
  
  Object.entries(majorScales).forEach(([key, scale]) => {
    let score = 0
    scale.forEach(scaleNote => {
      score += noteCounts[scaleNote] || 0
    })
    
    // 增加主音和属音的权重
    score += (noteCounts[scale[0]] || 0) * 2  // 主音
    score += (noteCounts[scale[4]] || 0) * 1.5  // 属音
    
    if (score > bestScore) {
      bestScore = score
      bestKey = key
    }
  })
  
  // 计算置信度
  const totalNotes = notes.length
  const confidence = Math.min(bestScore / totalNotes, 1)
  
  return {
    key: bestKey,
    confidence: Math.round(confidence * 100)
  }
}

/**
 * 和弦检测
 * @param {Array} notes - 同时发声的音符
 * @returns {Object} - 和弦信息
 */
function detectChord(notes) {
  if (!notes || notes.length < 3) {
    return { chord: null, quality: null }
  }
  
  // 获取根音（最低音）
  const rootNote = notes[0].note
  
  // 简单和弦类型识别
  const intervals = []
  for (let i = 1; i < notes.length; i++) {
    const semitoneDiff = notes[i].octave * 12 + getNoteIndex(notes[i].note) - 
                        notes[0].octave * 12 - getNoteIndex(notes[0].note)
    intervals.push(semitoneDiff % 12)
  }
  
  // 判断和弦类型
  intervals.sort((a, b) => a - b)
  const intervalPattern = intervals.join('-')
  
  // 三和弦模式
  const triadPatterns = {
    '4-7': { quality: 'major', symbol: '' },      // 大三和弦
    '3-7': { quality: 'minor', symbol: 'm' },     // 小三和弦
    '3-6': { quality: 'diminished', symbol: 'dim' },  // 减三和弦
    '4-8': { quality: 'augmented', symbol: 'aug' }   // 增三和弦
  }
  
  const pattern = intervalPattern.slice(0, 7)  // 取前两个音程
  const triadInfo = triadPatterns[pattern]
  
  if (triadInfo) {
    return {
      chord: rootNote + triadInfo.symbol,
      quality: triadInfo.quality,
      notes: notes.map(n => n.note)
    }
  }
  
  return { chord: null, quality: null, notes: notes.map(n => n.note) }
}

/**
 * 获取音符在十二平均律中的索引
 */
function getNoteIndex(note) {
  const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  return noteStrings.indexOf(note)
}

module.exports = {
  detectPitch,
  frequencyToNote,
  noteToFrequency,
  getPitchDeviation,
  analyzeKey,
  detectChord
}
