// components/theme-switcher/theme-switcher.js
const app = getApp()

Component({
  data: {
    currentTheme: 'light'
  },

  lifetimes: {
    attached() {
      this.setData({
        currentTheme: app.globalData.theme
      })

      // 监听主题变化
      this.themeChangeListener = (theme) => {
        this.setData({ currentTheme: theme })
        this.applyTheme(theme)
      }

      // 初始化应用主题
      this.applyTheme(app.globalData.theme)
    },

    detached() {
      // 移除监听
      if (this.themeChangeListener) {
        // 在实际应用中，应该有更好的事件总线机制
      }
    }
  },

  methods: {
    // 切换主题
    switchTheme() {
      const newTheme = app.globalData.theme === 'light' ? 'dark' : 'light'
      app.switchTheme(newTheme)
      this.setData({ currentTheme: newTheme })
    },

    // 应用主题到页面
    applyTheme(theme) {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]

      if (currentPage) {
        currentPage.setData({ theme })

        // 更新页面背景色
        if (theme === 'dark') {
          wx.setPageStyle({
            style: {
              backgroundColor: '#1a1a1a'
            }
          })
        } else {
          wx.setPageStyle({
            style: {
              backgroundColor: '#f5f5f5'
            }
          })
        }
      }
    }
  }
})
