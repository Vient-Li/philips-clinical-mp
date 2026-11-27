const app = getApp()
const data = require('../../utils/data.js')
const nav = require('../../utils/nav.js')

Page({
  data: {
    statusBarHeight: 44,
    // 右上角留给系统胶囊，导航栏内容按胶囊位置避让，不自己占那一段
    navRight: 96,
    banners: data.banners,
    depts: data.depts,
    cats: data.cats,
    activities: data.activities.slice(0, 3),
    courses: data.courses.slice(0, 6)
  },

  onLoad() {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const menu = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null
    const statusBarHeight = app.globalData.statusBarHeight || info.statusBarHeight || 44
    const navRight = menu ? Math.round(info.windowWidth - menu.left + 8) : 96
    this.setData({ statusBarHeight, navRight })
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  // 搜索不单独开一级页：切到推荐 tab 并让搜索框拿焦点
  onSearch() {
    app.globalData.focusSearch = true
    wx.switchTab({ url: '/pages/recommend/recommend' })
  },

  onBanner(e) {
    const item = data.banners[e.currentTarget.dataset.index]
    if (!item) return
    // 指向某个 tab 的 banner 直接切过去，其余进子页面
    if (item.path.indexOf('/pages/activity/') === 0) {
      wx.switchTab({ url: '/pages/activity/activity' })
      return
    }
    if (item.path.indexOf('/pages/index/') === 0) {
      wx.switchTab({ url: '/pages/index/index' })
      return
    }
    nav.openChild(item.path)
  },

  onDept(e) {
    const { id } = e.currentTarget.dataset
    if (id === 'all') {
      wx.switchTab({ url: '/pages/recommend/recommend' })
      return
    }
    nav.openChild(`/pages/category/category?dept=${id}`)
  },

  onCat(e) {
    nav.openChild(`/pages/category/category?cat=${e.currentTarget.dataset.id}`)
  },

  onAct(e) {
    const item = this.data.activities[e.currentTarget.dataset.index]
    if (!item) return
    nav.openChild(`/pages/detail/detail?id=${item.id}`)
  },

  onCourse(e) {
    nav.openChild(`/pages/detail/detail?id=${e.currentTarget.dataset.id}`)
  },

  toActivity() {
    wx.switchTab({ url: '/pages/activity/activity' })
  },

  toRecommend() {
    wx.switchTab({ url: '/pages/recommend/recommend' })
  },

  onContact() {
    // 由 button open-type="contact" 直接拉起微信客服，这里不用处理
  },

  onShareAppMessage() {
    return {
      title: '飞利浦临床门户',
      path: '/pages/index/index'
    }
  }
})
