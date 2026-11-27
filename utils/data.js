// 内容数据。原站这一层是从后台场景取数，这里先落地成静态数据，
// 后续把 activities / courses / materials / cases 换成 wx.request 拉接口即可，页面结构不用动。

const banners = [
  { id: 'b1', img: '/assets/banner-1.jpg', title: '飞利浦患者监测虚拟病人 Avatar', path: '/pages/form/form?from=banner&title=患者监测虚拟病人 Avatar' },
  { id: 'b2', img: '/assets/banner-2.jpg', title: '点击会看 · 云端课堂', path: '/pages/activity/activity' },
  { id: 'b3', img: '/assets/banner-3.jpg', title: 'IDP 云上矩阵', path: '/pages/detail/detail?id=c7' }
]

const depts = [
  { id: 'cardio', name: '心脏科', icon: '/assets/dept-1.png' },
  { id: 'ultra', name: '超声科', icon: '/assets/dept-2.png' },
  { id: 'radio', name: '放射科', icon: '/assets/dept-3.png' },
  { id: 'resp', name: '呼吸科', icon: '/assets/dept-4.png' },
  { id: 'icu', name: '危急重症', icon: '/assets/dept-5.png' },
  { id: 'interv', name: '介入科', icon: '/assets/dept-6.png' },
  { id: 'info', name: '信息科', icon: '/assets/dept-7.png' },
  { id: 'all', name: '全部', icon: '/assets/dept-8.png' }
]

const cats = [
  { id: 'product', name: '产品创新', img: '/assets/cat-1.png' },
  { id: 'solution', name: '解决方案', img: '/assets/cat-2.png' },
  { id: 'research', name: '科研成果', img: '/assets/cat-3.png' },
  { id: 'service', name: '悦享服务', img: '/assets/cat-4.png' }
]

// 线下 / 线上活动。time / city / badge 是列表页用来回答「什么时候、在哪、还剩不剩」的，
// 用户扫一眼就能决定报不报名，比只给一张封面有用。
const activities = [
  { id: 'a1', cover: '/assets/act-1.jpg', title: '医院高质量发展 区域研讨会', time: '12月06日 周六 14:00', short: '12.06 周六', city: '上海 · 线下', badge: '限 60 席', cta: '立即报名', ctaType: 'signup' },
  { id: 'a2', cover: '/assets/act-2.jpg', title: '儿科床旁超声在监测患儿生命体征中的应用', time: '12月12日 周五 19:30', short: '12.12 周五', city: '线上直播', badge: '可回看', cta: '立即报名', ctaType: 'signup' },
  { id: 'a3', cover: '/assets/act-3.jpg', title: '飞利浦超声 飞声视界系列课', time: '12月18日 周四 20:00', short: '12.18 周四', city: '线上直播', badge: '系列 6 讲', cta: '预约', ctaType: 'signup' },
  { id: 'a4', cover: '/assets/course-4.jpg', title: '复合手术室构建与管理 华西专场', time: '12月21日 周日 09:00', short: '12.21 周日', city: '成都 · 线下', badge: '限 40 席', cta: '立即报名', ctaType: 'signup' },
  { id: 'a5', cover: '/assets/course-6.jpg', title: '超声百家讲坛 · 心脏瓣膜专场', time: '12月26日 周五 19:00', short: '12.26 周五', city: '线上直播', badge: '可回看', cta: '立即报名', ctaType: 'signup' },
  { id: 'a6', cover: '/assets/course-11.jpg', title: '监护课堂 · 危重症气道管理', time: '01月09日 周五 19:30', short: '01.09 周五', city: '线上直播', badge: '新课', cta: '立即报名', ctaType: 'signup' }
]

const courses = [
  { id: 'c1', cover: '/assets/course-1.jpg', title: '激光沙龙系列讲座', sub: '临床应用研讨会' },
  { id: 'c2', cover: '/assets/course-2.jpg', title: '明鉴视界', sub: '冠脉IVUS讨论会' },
  { id: 'c3', cover: '/assets/course-3.jpg', title: '中欧之光 谱写未来', sub: '光谱技术最新进展' },
  { id: 'c4', cover: '/assets/course-4.jpg', title: '复合手术室构建与管理', sub: '华西经验 大咖呈现' },
  { id: 'c5', cover: '/assets/course-5.jpg', title: '医工技术', sub: '「善事利器」工程技术培训' },
  { id: 'c6', cover: '/assets/course-6.jpg', title: '超声百家讲坛', sub: '直击超声临床应用经验' },
  { id: 'c7', cover: '/assets/course-7.jpg', title: '星云云课堂', sub: '多领域多模块 高级可视化应用' },
  { id: 'c8', cover: '/assets/course-8.jpg', title: '微课堂', sub: '聚焦临床课程与操作培训' },
  { id: 'c9', cover: '/assets/course-9.jpg', title: 'TOP国际研讨会系列', sub: '飞利浦伟康倾力呈现' },
  { id: 'c10', cover: '/assets/course-10.jpg', title: '洞鉴系列', sub: '赋能血管介入治疗精准化' },
  { id: 'c11', cover: '/assets/course-11.jpg', title: '监护课堂', sub: '危重症相关临床和操作培训' },
  { id: 'c12', cover: '/assets/course-12.jpg', title: '飞悦与你', sub: 'MR临床应用与科研成果' }
]

// 资料：详情页的转化动作是「领取资料」，不是报名。
const materials = [
  { id: 'm1', cover: '/assets/course-2.jpg', title: '冠脉 IVUS 临床应用白皮书', sub: '24 页 · PDF · 2026 版' },
  { id: 'm2', cover: '/assets/course-5.jpg', title: '复合手术室建设选型指南', sub: '36 页 · PDF · 含 8 个案例' },
  { id: 'm3', cover: '/assets/course-9.jpg', title: '无创通气参数设置速查卡', sub: '2 页 · 可打印' },
  { id: 'm4', cover: '/assets/course-12.jpg', title: 'MR 临床科研选题手册', sub: '18 页 · PDF' }
]

// 案例：详情页的转化动作是「预约同款方案」。
const cases = [
  { id: 'k1', cover: '/assets/course-4.jpg', title: '华西医院复合手术室建设实录', sub: '案例 · 8 分钟阅读' },
  { id: 'k2', cover: '/assets/course-7.jpg', title: '区域影像中心如何做到日均 1200 例', sub: '案例 · 6 分钟阅读' },
  { id: 'k3', cover: '/assets/course-11.jpg', title: 'ICU 监护数据闭环改造记', sub: '案例 · 5 分钟阅读' }
]

const KINDS = {
  course: { label: '课程', cta: '立即报名', ctaFrom: 'course', ctaTitle: '立即报名' },
  material: { label: '资料', cta: '免费领取', ctaFrom: 'material', ctaTitle: '免费领取' },
  case: { label: '案例', cta: '预约同款方案', ctaFrom: 'case', ctaTitle: '预约同款方案' }
}

// 推荐流：课程 + 资料 + 案例混排，推荐 tab 用这一份顺序。
const recommend = [
  { id: 'c2', kind: 'course' },
  { id: 'm1', kind: 'material' },
  { id: 'c6', kind: 'course' },
  { id: 'k1', kind: 'case' },
  { id: 'c7', kind: 'course' },
  { id: 'm2', kind: 'material' },
  { id: 'c4', kind: 'course' },
  { id: 'k2', kind: 'case' },
  { id: 'c11', kind: 'course' },
  { id: 'm3', kind: 'material' },
  { id: 'c10', kind: 'course' },
  { id: 'k3', kind: 'case' }
]

function item(id, kind) {
  const pool = kind === 'course' ? courses : kind === 'material' ? materials : cases
  const found = pool.find((i) => i.id === id)
  if (!found) return null
  return {
    ...found,
    kind,
    kindLabel: KINDS[kind].label,
    cta: KINDS[kind].cta,
    ctaFrom: KINDS[kind].ctaFrom
  }
}

// 统一按 id 取任意类型内容，详情页只认这一个入口。
function findItem(id) {
  for (const kind of ['course', 'material', 'case']) {
    const found = item(id, kind)
    if (found) return found
  }
  return null
}

// 推荐流按类型过滤，type = all / course / material / case
function recommendList(type) {
  const list = recommend.map((r) => item(r.id, r.kind)).filter(Boolean)
  return type && type !== 'all' ? list.filter((i) => i.kind === type) : list
}

function activityList(filter) {
  if (filter === 'signup') return activities.filter((a) => a.ctaType === 'signup')
  return activities
}

module.exports = {
  banners,
  depts,
  cats,
  activities,
  courses,
  materials,
  cases,
  KINDS,
  item,
  findItem,
  recommendList,
  activityList
}
