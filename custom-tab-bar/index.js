// 自定义 tabBar：四项固定区。内容入口（推荐/活动）在这里，
// 「联系我们」这类低频项不进底部，改由 open-type="contact" 的客服按钮承接。
Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: '/assets/tab-home.png' },
      { pagePath: '/pages/recommend/recommend', text: '推荐', icon: '/assets/tab-rec.png' },
      { pagePath: '/pages/activity/activity', text: '活动', icon: '/assets/tab-act.png' },
      { pagePath: '/pages/profile/profile', text: '我的', icon: '/assets/tab-mine.png' }
    ]
  },

  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index
      if (index === this.data.selected) return
      wx.switchTab({ url: this.data.list[index].pagePath })
    }
  }
})
