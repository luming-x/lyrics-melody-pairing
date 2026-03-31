// app.js
App({
  onLaunch() {
    // 初始化云开发（如果已配置）
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      // 只有配置了云环境ID才初始化云开发
      if (this.globalData.envId) {
        wx.cloud.init({
          env: this.globalData.envId,
          traceUser: true
        })
      }
    }

    // 初始化主题
    this.initTheme()

    // 检查用户信息
    this.checkUserInfo()
  },

  // 初始化主题
  initTheme() {
    // 从本地存储读取主题设置
    const themeMode = wx.getStorageSync('themeMode') || 'light'

    // 监听系统主题变化
    wx.onThemeChange((res) => {
      if (themeMode === 'auto') {
        this.setTheme(res.theme)
      }
    })

    // 应用主题
    if (themeMode === 'auto') {
      const systemTheme = wx.getSystemInfoSync().theme
      this.setTheme(systemTheme)
    } else {
      this.setTheme(themeMode)
    }
  },

  // 设置主题
  setTheme(theme) {
    const app = getApp()
    app.globalData.theme = theme

    // 更新页面主题
    const pages = getCurrentPages()
    pages.forEach(page => {
      if (page.onThemeChange) {
        page.onThemeChange(theme)
      }
    })
  },

  // 切换主题
  switchTheme(themeMode) {
    wx.setStorageSync('themeMode', themeMode)

    if (themeMode === 'auto') {
      const systemTheme = wx.getSystemInfoSync().theme
      this.setTheme(systemTheme)
    } else {
      this.setTheme(themeMode)
    }
  },

  // 检查用户信息
  checkUserInfo() {
    // 暂时注释掉登录检查，先确保小程序能正常运行
    // const userInfo = wx.getStorageSync('userInfo')
    // if (!userInfo) {
    //   // 首次使用，跳转到授权页面
    //   wx.navigateTo({
    //     url: '/pages/login/login'
    //   })
    // }
  },

  globalData: {
    userInfo: null,
    envId: null, // 云环境ID，配置后填写
    theme: 'light', // 当前主题：light/dark
    themeMode: 'light' // 主题模式：light/dark/auto
  }
})
