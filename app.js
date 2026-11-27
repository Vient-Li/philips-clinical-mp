App({
  globalData: {
    leadKey: 'philips_leads',
    userInfo: null,
    // 后续接真实接口时替换：报名提交/课程列表/登录态
    apiBase: 'https://page.ma.scrmtech.com'
  },

  onLaunch() {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    this.globalData.statusBarHeight = info.statusBarHeight || 20
    this.globalData.menuButton = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null
  }
})
