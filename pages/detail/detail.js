const app = getApp()
const data = require('../../utils/data.js')

// 详情页只有这一种：课程 / 资料 / 案例共用骨架，差异只在信息块和底部转化动作
function blocksFor(item) {
  if (item.kind === 'material') {
    return [
      { title: '资料说明', text: `《${item.title}》由飞利浦临床应用团队整理，${item.sub}，可直接下载或转发给科室同事。` },
      { title: '包含内容', text: '适用场景与参数建议、常见误区对照表、参考文献清单。' },
      { title: '适合谁看', text: '临床医师、技师、设备科与科室管理者。' }
    ]
  }
  if (item.kind === 'case') {
    return [
      { title: '背景', text: '科室在日均检查量与报告时效之间长期拉锯，原有流程的瓶颈集中在设备排程与影像调阅两端。' },
      { title: '做法', text: '先做流程梳理，再按检查类型重组排程规则，最后把调阅、会诊、报告串成一条链路。' },
      { title: '结果', text: '改造后日均完成量与报告周转时间都有改善，具体数据见案例正文与访谈记录。' }
    ]
  }
  return [
    { title: '课程介绍', text: `本课程由飞利浦临床团队与国内专家联合呈现，围绕「${item.sub}」展开，包含主题分享、病例讨论与现场答疑三个环节。` },
    { title: '讲师', text: '三甲医院相关科室主任医师、飞利浦临床应用专家。' },
    { title: '适合人群', text: '临床医师、技师、科室管理者。报名后可在「我的」里查看观看入口。' }
  ]
}

function badgesFor(item) {
  if (item.kind === 'material') return ['PDF', '免费下载']
  if (item.kind === 'case') return ['实施案例', '图文']
  return ['线上直播', '可回看']
}

function factsFor(item) {
  if (item.kind === 'material') {
    return [
      { label: '形式', value: 'PDF · 下载后长期有效' },
      { label: '篇幅', value: item.sub }
    ]
  }
  if (item.kind === 'case') {
    return [
      { label: '形式', value: '案例正文 · 图文' },
      { label: '篇幅', value: item.sub }
    ]
  }
  return [
    { label: '形式', value: '线上直播 · 可回看' },
    { label: '时长', value: '90 分钟 · 含 20 分钟答疑' }
  ]
}

Page({
  data: {
    item: null,
    blocks: [],
    badges: [],
    facts: [],
    signed: false
  },

  onLoad(query) {
    const item = data.findItem(query.id)
    if (!item) return
    const leads = wx.getStorageSync(app.globalData.leadKey) || []
    this.setData({
      item,
      blocks: blocksFor(item),
      badges: badgesFor(item),
      facts: factsFor(item),
      signed: leads.some((l) => l.title === item.title)
    })
    wx.setNavigationBarTitle({ title: item.kindLabel + '详情' })
  },

  onCta() {
    const item = this.data.item
    if (!item) return
    wx.navigateTo({
      url: `/pages/form/form?from=${item.ctaFrom}&title=${encodeURIComponent(item.title)}`
    })
  },

  onContact() {
    // button open-type="contact" 直接拉起客服会话
  },

  onShareAppMessage() {
    const item = this.data.item
    return {
      title: item ? item.title : '飞利浦临床门户',
      path: item ? `/pages/detail/detail?id=${item.id}` : '/pages/index/index'
    }
  }
})
