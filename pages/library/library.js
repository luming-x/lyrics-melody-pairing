// pages/library/library.js
Page({
  data: {},

  onLoad() {},

  goToLyrics() {
    wx.switchTab({
      url: '/pages/lyrics/lyrics'
    })
  }
})
