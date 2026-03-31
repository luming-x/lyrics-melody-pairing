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

    // 检查用户信息
    this.checkUserInfo()
  },

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
    envId: null // 云环境ID，配置后填写
  }
})
