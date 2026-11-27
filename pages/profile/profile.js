const app = getApp()

function fmt(ts) {
  const d = new Date(ts)
  const p = (n) => (n < 10 ? '0' + n : '' + n)
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

Page({
  data: {
    userInfo: null,
    leads: [],
    phoneAuthed: false
  },

  onLoad() {
    // 静默登录：进来就有身份，不弹授权窗、没有「注册」这一步。
    // 真正需要身份的时刻（报名/领资料）才用 getPhoneNumber 要手机号。
    wx.login({
      success: (res) => {
        app.globalData.loginCode = res.code
        const userInfo = app.globalData.userInfo || { nickName: '微信用户', silent: true }
        app.globalData.userInfo = userInfo
        this.setData({ userInfo })
      }
    })
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
    const leads = (wx.getStorageSync(app.globalData.leadKey) || []).map((l) => ({
      ...l,
      timeText: fmt(l.createdAt)
    }))
    this.setData({ leads, userInfo: app.globalData.userInfo })
  },

  onGetPhone(e) {
    const detail = e.detail || {}
    if (detail.code) {
      // 正式环境：把 code 发给后端换手机号
      app.globalData.phoneCode = detail.code
      this.setData({ phoneAuthed: true })
      wx.showToast({ title: '手机号已授权', icon: 'none' })
    } else {
      wx.showToast({ title: '需要正式 AppID 才能一键获取', icon: 'none' })
    }
  },

  onCall() {
    wx.makePhoneCall({ phoneNumber: '4000000000' })
  },

  onService() {
    // button open-type="contact" 直接拉起微信客服
  },

  onPrivacy() {
    wx.showModal({
      title: '信息使用说明',
      content: '你提交的姓名、手机号、医院与科室仅用于本次活动与服务联系，不会用于其他用途，也不会提供给第三方。',
      showCancel: false
    })
  }
})
