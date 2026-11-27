const app = getApp()
const data = require('../../utils/data.js')

Page({
  data: {
    statusBarHeight: 44,
    // 右上角留给系统胶囊，导航栏内容按胶囊位置避让，不自己占那一段
    navRight: 96,
    banners: data.banners,
    depts: data.depts,
    cats: data.cats,
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
    if (item.path.indexOf('/pages/index/') > -1) {
      wx.switchTab({ url: item.path })
    } else {
      wx.navigateTo({ url: item.path })
    }
  },

  onDept(e) {
    const { id, name } = e.currentTarget.dataset
    if (id === 'all') {
      wx.switchTab({ url: '/pages/recommend/recommend' })
      return
    }
    wx.navigateTo({ url: `/pages/category/category?dept=${id}&title=${encodeURIComponent(name)}` })
  },

  onCat(e) {
    const { id, name } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/category/category?cat=${id}&title=${encodeURIComponent(name)}` })
  },

  onCourse(e) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` })
  },

  toAllCourses() {
    wx.navigateTo({ url: `/pages/category/category?title=${encodeURIComponent('系列课程')}` })
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
