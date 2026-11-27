const data = require('../../utils/data.js')

Page({
  data: {
    keyword: '',
    list: []
  },

  onLoad(query) {
    this.source = data.courses.slice()
    if (query.type === 'activity') {
      this.source = data.activities.map((a) => ({ id: a.id, cover: a.cover, title: a.title, sub: a.ctaType === 'signup' ? '可报名' : '可浏览', activity: true }))
    }
    this.title = query.title ? decodeURIComponent(query.title) : '系列课程'
    wx.setNavigationBarTitle({ title: this.title })
    this.setData({ list: this.source })
  },

  onSearch(e) {
    const keyword = e.detail.value.trim()
    const list = keyword ? this.source.filter((i) => i.title.indexOf(keyword) > -1 || (i.sub || '').indexOf(keyword) > -1) : this.source
    this.setData({ keyword, list })
  },

  onOpen(e) {
    const id = e.currentTarget.dataset.id
    const item = this.source.find((i) => i.id === id)
    if (item && item.activity) {
      wx.navigateTo({ url: `/pages/form/form?from=activity&title=${encodeURIComponent(item.title)}` })
    } else {
      wx.navigateTo({ url: `/pages/detail/detail?id=${id}` })
    }
  }
})
