// 吉他和弦库页面
const chordData = require('../../utils/chord-data')

Page({
  data: {
    allKeys: Object.keys(chordData.keyCategories),
    allTypes: Object.keys(chordData.chordTypes),
    selectedKey: 'C调',
    selectedType: '全部',
    chordList: [],
    selectedChord: null,
    showChordDetail: false,
    searchKeyword: ''
  },

  onLoad() {
    this.loadChords()
  },

  // 加载和弦列表
  loadChords() {
    let chords = []
    
    if (this.data.selectedKey !== '全部') {
      chords = chordData.getChordsByKey(this.data.selectedKey)
    } else if (this.data.selectedType !== '全部') {
      chords = chordData.getChordsByType(this.data.selectedType)
    } else {
      chords = chordData.getAllChords()
    }
    
    // 搜索过滤
    if (this.data.searchKeyword) {
      chords = chordData.searchChords(this.data.searchKeyword)
    }
    
    this.setData({ chordList: chords })
  },

  // 选择调式
  onSelectKey(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ 
      selectedKey: key,
      selectedType: '全部'
    }, () => {
      this.loadChords()
    })
  },

  // 选择类型
  onSelectType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ 
      selectedType: type,
      selectedKey: '全部'
    }, () => {
      this.loadChords()
    })
  },

  // 点击和弦
  onChordTap(e) {
    const chordName = e.currentTarget.dataset.chord
    const chord = chordData.getChord(chordName)
    
    this.setData({ 
      selectedChord: chord,
      showChordDetail: true
    })
  },

  // 关闭和弦详情
  onCloseChordDetail() {
    this.setData({ showChordDetail: false })
  },

  // 搜索和弦
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
  },

  onSearch() {
    this.setData({ selectedKey: '全部', selectedType: '全部' })
    this.loadChords()
  },

  // 播放和弦音频（振动反馈）
  onPlayChord() {
    wx.vibrateShort({ type: 'heavy' })
    wx.showToast({ title: this.data.selectedChord.name, icon: 'none' })
  }
})
