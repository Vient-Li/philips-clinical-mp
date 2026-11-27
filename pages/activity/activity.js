const app = getApp()
const data = require('../../utils/data.js')
const nav = require('../../utils/nav.js')

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'open', label: '可报名' },
  { key: 'mine', label: '已报名' }
]

Page({
  data: {
    filters: FILTERS,
    filter: 'all',
    list: [],
    mineCount: 0
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
    this.refresh()
  },

  refresh() {
    // 已报名状态来自本机留资记录；接真实接口后换成服务端返回的报名状态
    const leads = wx.getStorageSync(app.globalData.leadKey) || []
    const signedTitles = leads.map((l) => l.title)
    const all = data.activities.map((a) => ({
      ...a,
      signed: signedTitles.indexOf(a.title) > -1
    }))
    const { filter } = this.data
    let list = all
    if (filter === 'open') list = all.filter((a) => !a.signed)
    if (filter === 'mine') list = all.filter((a) => a.signed)
    this.setData({ list, mineCount: all.filter((a) => a.signed).length })
  },

  onFilter(e) {
    this.setData({ filter: e.currentTarget.dataset.key })
    this.refresh()
  },

  onSignup(e) {
    const item = data.activities.find((a) => a.id === e.currentTarget.dataset.id)
    if (!item) return
    nav.openChild(`/pages/form/form?from=activity&title=${encodeURIComponent(item.title)}`)
  }
})
