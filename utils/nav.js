// 父级页面版：详情 / 表单 / 分类这些子页面下一阶段再接。
// 所有指向子页面的跳转统一收口在这里，接子页面时只改这一个文件，
// 页面里的调用点不用动。
const PENDING = '详情页下一阶段接入'

function openChild(url) {
  if (!url) return
  wx.showToast({ title: PENDING, icon: 'none' })
}

module.exports = { openChild }
