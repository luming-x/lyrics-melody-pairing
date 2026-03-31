// 吉他和弦数据

/**
 * 吉他和弦图谱
 * 每个和弦包含：
 * - name: 和弦名称
 * - frets: 品位数组，-1表示不弹奏，0表示空弦
 * - fingers: 指法
 */
const chordLibrary = {
  // C调和弦
  'C': {
    name: 'C',
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0]
  },
  'Cm': {
    name: 'Cm',
    frets: [-1, 3, 5, 5, 4, 3],
    fingers: [0, 3, 4, 3, 2, 1]
  },
  'C7': {
    name: 'C7',
    frets: [-1, 3, 2, 3, 1, 0],
    fingers: [0, 3, 2, 4, 1, 0]
  },
  'Cmaj7': {
    name: 'Cmaj7',
    frets: [-1, 3, 2, 0, 0, 0],
    fingers: [0, 3, 2, 0, 0, 0]
  },

  // D调和弦
  'D': {
    name: 'D',
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [0, 0, 0, 1, 3, 2]
  },
  'Dm': {
    name: 'Dm',
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [0, 0, 0, 2, 3, 1]
  },
  'D7': {
    name: 'D7',
    frets: [-1, -1, 0, 2, 1, 2],
    fingers: [0, 0, 0, 2, 1, 3]
  },
  'Dm7': {
    name: 'Dm7',
    frets: [-1, -1, 0, 2, 1, 1],
    fingers: [0, 0, 0, 3, 1, 2]
  },

  // E调和弦
  'E': {
    name: 'E',
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0]
  },
  'Em': {
    name: 'Em',
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0]
  },
  'E7': {
    name: 'E7',
    frets: [0, 2, 0, 1, 0, 0],
    fingers: [0, 2, 0, 1, 0, 0]
  },
  'Em7': {
    name: 'Em7',
    frets: [0, 2, 0, 0, 0, 0],
    fingers: [0, 2, 0, 0, 0, 0]
  },

  // F调和弦
  'F': {
    name: 'F',
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1]
  },
  'Fm': {
    name: 'Fm',
    frets: [1, 3, 3, 1, 1, 1],
    fingers: [1, 3, 4, 1, 1, 1]
  },
  'F7': {
    name: 'F7',
    frets: [1, 3, 1, 2, 1, 1],
    fingers: [1, 3, 1, 2, 1, 1]
  },
  'Fmaj7': {
    name: 'Fmaj7',
    frets: [-1, 3, 2, 2, 1, 0],
    fingers: [0, 3, 2, 1, 1, 0]
  },

  // G调和弦
  'G': {
    name: 'G',
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3]
  },
  'Gm': {
    name: 'Gm',
    frets: [3, 5, 5, 3, 3, 3],
    fingers: [1, 3, 4, 1, 1, 1]
  },
  'G7': {
    name: 'G7',
    frets: [3, 2, 0, 0, 0, 1],
    fingers: [3, 2, 0, 0, 0, 1]
  },
  'Gmaj7': {
    name: 'Gmaj7',
    frets: [3, 2, 0, 0, 0, 2],
    fingers: [2, 1, 0, 0, 0, 3]
  },

  // A调和弦
  'A': {
    name: 'A',
    frets: [-1, 0, 2, 2, 2, 0],
    fingers: [0, 0, 1, 2, 3, 0]
  },
  'Am': {
    name: 'Am',
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0]
  },
  'A7': {
    name: 'A7',
    frets: [-1, 0, 2, 0, 2, 0],
    fingers: [0, 0, 2, 0, 1, 0]
  },
  'Am7': {
    name: 'Am7',
    frets: [-1, 0, 2, 0, 1, 0],
    fingers: [0, 0, 2, 0, 1, 0]
  },

  // B调和弦
  'B': {
    name: 'B',
    frets: [-1, 2, 4, 4, 4, 2],
    fingers: [0, 1, 3, 4, 2, 1]
  },
  'Bm': {
    name: 'Bm',
    frets: [-1, 2, 4, 4, 3, 2],
    fingers: [0, 1, 3, 4, 2, 1]
  },
  'B7': {
    name: 'B7',
    frets: [-1, 2, 1, 2, 0, 2],
    fingers: [0, 1, 1, 2, 0, 3]
  },
  'Bm7': {
    name: 'Bm7',
    frets: [-1, 2, 0, 2, 0, 2],
    fingers: [0, 1, 0, 2, 0, 3]
  }
}

/**
 * 调式分类
 */
const keyCategories = {
  'C调': ['C', 'Cm', 'C7', 'Cmaj7'],
  'D调': ['D', 'Dm', 'D7', 'Dm7'],
  'E调': ['E', 'Em', 'E7', 'Em7'],
  'F调': ['F', 'Fm', 'F7', 'Fmaj7'],
  'G调': ['G', 'Gm', 'G7', 'Gmaj7'],
  'A调': ['A', 'Am', 'A7', 'Am7'],
  'B调': ['B', 'Bm', 'B7', 'Bm7']
}

/**
 * 和弦类型分类
 */
const chordTypes = {
  '大三和弦': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  '小三和弦': ['Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm'],
  '属七和弦': ['C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7'],
  '大七和弦': ['Cmaj7', 'Dm7', 'Em7', 'Fmaj7', 'Gmaj7', 'Am7', 'Bm7']
}

/**
 * 获取所有和弦
 */
function getAllChords() {
  return Object.keys(chordLibrary)
}

/**
 * 根据调式获取和弦
 */
function getChordsByKey(key) {
  return keyCategories[key] || []
}

/**
 * 根据类型获取和弦
 */
function getChordsByType(type) {
  return chordTypes[type] || []
}

/**
 * 获取和弦详情
 */
function getChord(chordName) {
  return chordLibrary[chordName]
}

/**
 * 搜索和弦
 */
function searchChords(keyword) {
  const allChords = getAllChords()
  return allChords.filter(chord => 
    chord.toLowerCase().includes(keyword.toLowerCase())
  )
}

/**
 * 转调功能
 */
function transposeChord(chordName, semitones) {
  const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const flatStrings = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
  
  // 解析根音和后缀
  const match = chordName.match(/^([A-G][#b]?)(.*)$/)
  if (!match) return chordName
  
  let root = match[1]
  const suffix = match[2]
  
  // 找到根音在音阶中的位置
  let rootIndex = noteStrings.indexOf(root)
  if (rootIndex === -1) {
    rootIndex = flatStrings.indexOf(root)
    if (rootIndex === -1) return chordName
  }
  
  // 计算新根音
  let newIndex = (rootIndex + semitones) % 12
  if (newIndex < 0) newIndex += 12
  
  const newRoot = noteStrings[newIndex]
  return newRoot + suffix
}

module.exports = {
  chordLibrary,
  keyCategories,
  chordTypes,
  getAllChords,
  getChordsByKey,
  getChordsByType,
  getChord,
  searchChords,
  transposeChord
}
