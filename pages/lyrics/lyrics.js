// pages/lyrics/lyrics.js
const app = getApp()

Page({
  data: {
    works: [],
    filteredWorks: [],
    searchKey: '',
    filterType: 'all'
  },

  onLoad() {
    this.loadWorks()
  },

  onShow() {
    this.loadWorks()
  },

  // 加载所有作品
  loadWorks() {
    // 检查云开发是否已配置
    if (!app.globalData.envId || !wx.cloud) {
      this.setData({ works: [], filteredWorks: [] })
      wx.showToast({
        title: '请先配置云开发',
        icon: 'none'
      })
      return
    }

    wx.showLoading({ title: '加载中...' })

    const db = wx.cloud.database()
    db.collection('works')
      .orderBy('updatedAt', 'desc')
      .get()
      .then(res => {
        const works = res.data.map(item => ({
          ...item,
          updatedAt: this.formatDate(item.updatedAt),
          melodyCount: item.lyrics.filter(l => l.melodyUrl).length
        }))
        this.setData({ works })
        this.applyFilter()
        wx.hideLoading()
      })
      .catch(err => {
        console.error('加载失败', err)
        wx.hideLoading()
        wx.showToast({ title: '加载失败', icon: 'none' })
      })
  },

  // 格式化日期
  formatDate(timestamp) {
    const date = new Date(timestamp)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日`
  },

  // 搜索
  onSearch(e) {
    this.setData({ searchKey: e.detail.value })
    this.applyFilter()
  },

  // 设置筛选类型
  setFilter(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ filterType: type })
    this.applyFilter()
  },

  // 应用筛选
  applyFilter() {
    let filtered = [...this.data.works]

    // 搜索过滤
    if (this.data.searchKey) {
      const key = this.data.searchKey.toLowerCase()
      filtered = filtered.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(key)
        const lyricMatch = item.lyrics.some(l =>
          l.content.toLowerCase().includes(key)
        )
        const tagMatch = item.tags.some(t =>
          t.toLowerCase().includes(key)
        )
        return titleMatch || lyricMatch || tagMatch
      })
    }

    // 类型过滤
    if (this.data.filterType === 'recent') {
      const now = Date.now()
      const week = 7 * 24 * 60 * 60 * 1000
      filtered = filtered.filter(item => {
        const updated = new Date(item.updatedAt).getTime()
        return now - updated < week
      })
    } else if (this.data.filterType === 'withMelody') {
      filtered = filtered.filter(item => item.melodyCount > 0)
    }

    this.setData({ filteredWorks: filtered })
  },

  // 查看作品
  viewWork(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/player/player?id=${id}`
    })
  },

  // 编辑作品
  editWork(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/create/create?id=${id}`
    })
  },

  // 删除作品
  deleteWork(e) {
    const id = e.currentTarget.dataset.id

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个作品吗？删除后无法恢复',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          this.performDelete(id)
        }
      }
    })
  },

  // 执行删除
  performDelete(id) {
    wx.showLoading({ title: '删除中...' })

    const db = wx.cloud.database()
    db.collection('works').doc(id).remove()
      .then(() => {
        wx.hideLoading()
        wx.showToast({ title: '删除成功', icon: 'success' })
        this.loadWorks()
      })
      .catch(err => {
        console.error('删除失败', err)
        wx.hideLoading()
        wx.showToast({ title: '删除失败', icon: 'none' })
      })
  },

  // 跳转到创作页面
  navigateToCreate() {
    wx.navigateTo({
      url: '/pages/create/create'
    })
  }
})
