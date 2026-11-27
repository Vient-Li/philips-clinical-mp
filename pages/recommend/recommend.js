const app = getApp()
const data = require('../../utils/data.js')
const nav = require('../../utils/nav.js')

const TYPES = [
  { key: 'all', label: '全部' },
  { key: 'course', label: '课程' },
  { key: 'material', label: '资料' },
  { key: 'case', label: '案例' }
]

Page({
  data: {
    types: TYPES,
    type: 'all',
    keyword: '',
    focus: false,
    list: []
  },

  onLoad() {
    this.all = data.recommendList('all')
    this.setData({ list: this.all })
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
    // 首页点搜索切过来时直接把焦点给输入框
    if (app.globalData.focusSearch) {
      app.globalData.focusSearch = false
      this.setData({ focus: true })
    }
  },

  onType(e) {
    this.setData({ type: e.currentTarget.dataset.key })
    this.apply()
  },

  onSearch(e) {
    this.setData({ keyword: e.detail.value })
    this.apply()
  },

  apply() {
    const { type, keyword } = this.data
    const kw = keyword.trim()
    let list = type === 'all' ? this.all : this.all.filter((i) => i.kind === type)
    if (kw) {
      list = list.filter((i) => i.title.indexOf(kw) > -1 || (i.sub || '').indexOf(kw) > -1)
    }
    this.setData({ list })
  },

  onOpen(e) {
    nav.openChild(`/pages/detail/detail?id=${e.currentTarget.dataset.id}`)
  }
})
