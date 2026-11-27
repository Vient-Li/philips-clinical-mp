const app = getApp()

Page({
  data: {
    activityTitle: '活动报名',
    heroTag: '活动报名',
    whenText: '',
    deptNames: ['请选择', '心脏科', '超声科', '放射科', '呼吸科', '危急重症', '介入科', '信息科', '其他'],
    deptIndex: 0,
    agreed: false,
    submitting: false,
    done: false,
    form: { name: '', phone: '', hospital: '', note: '' }
  },

  onLoad(query) {
    const tags = {
      activity: '活动报名',
      course: '课程报名',
      material: '领取资料',
      case: '预约方案',
      banner: '预约咨询',
      profile: '预约演示'
    }
    const from = query.from || 'activity'
    this.setData({
      activityTitle: query.title ? decodeURIComponent(query.title) : '活动报名',
      heroTag: tags[from] || '活动报名',
      whenText: query.time ? decodeURIComponent(query.time) : ''
    })
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`form.${key}`]: e.detail.value })
  },

  onDeptChange(e) {
    this.setData({ deptIndex: Number(e.detail.value) })
  },

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed })
  },

  onGetPhone(e) {
    // 正式 AppID + 已开通用手机号快速填写时，这里能直接拿到加密手机号
    const detail = e.detail || {}
    if (detail.code) {
      this.setData({ 'form.phone': detail.code, phoneCode: detail.code })
      wx.showToast({ title: '已获取手机号凭证', icon: 'none' })
    } else {
      wx.showToast({ title: '需正式 AppID 与手机号能力', icon: 'none' })
    }
  },

  onSubmit() {
    const { form, deptIndex, deptNames, agreed } = this.data
    if (!form.name.trim()) return wx.showToast({ title: '请填写姓名', icon: 'none' })
    if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) return wx.showToast({ title: '手机号格式不对', icon: 'none' })
    if (!form.hospital.trim()) return wx.showToast({ title: '请填写医院', icon: 'none' })
    if (!agreed) return wx.showToast({ title: '请先同意信息使用说明', icon: 'none' })

    this.setData({ submitting: true })
    const lead = {
      ...form,
      dept: deptNames[deptIndex],
      title: this.data.activityTitle,
      createdAt: Date.now()
    }
    // 真实项目在这里 wx.request 提交到留资接口；先落本地，保证预览可用
    const list = wx.getStorageSync(app.globalData.leadKey) || []
    list.unshift(lead)
    wx.setStorageSync(app.globalData.leadKey, list)

    setTimeout(() => {
      this.setData({ submitting: false, done: true })
    }, 500)
  },

  backHome() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
