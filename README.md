# 飞利浦临床门户 · 微信小程序

从原 H5（`page.ma.scrmtech.com/cyy-form/...`）重做成微信小程序：不使用 DOM 操作、不使用 iframe、不依赖外链资源、不依赖非 HTTPS 接口。

信息架构按「小程序是够用就走的工具」定，不照搬网站栏目：

- 底部 **四项固定区**：首页 / 推荐 / 活动 / 我的。`联系我们` 不进 tabBar（低频，占黄金位不划算），改成 `<button open-type="contact">` 放在「我的」和首页尾部。
- 层级最多三层：tab → 列表 → 详情。所有入口终点只有一个——留资表单。
- 转化点不在 tabBar，在详情页底部常驻固定条（咨询 + 报名/领取/预约）。
- 注册登录取消：`wx.login` 静默换 session，只在需要手机号时用 `<button open-type="getPhoneNumber">`。
- 自定义导航栏用 `wx.getMenuButtonBoundingClientRect()` 让出右上角系统胶囊，导航栏内只留一个搜索位。

## 怎么打开看

1. 微信开发者工具 → 导入项目 → 选择本目录
2. AppID 选「测试号」（项目里填的是 `touristappid`，命令行打开会被工具拒绝，GUI 里选测试号即可）
3. 编译，模拟器选 iPhone 14（390 宽）看最准

## 页面

| 文件 | 说明 |
|---|---|
| `pages/index/index` | 首页：自定义导航 + 搜索、banner×3、科室九宫格、分类入口、系列课程两列×6、“更多”进入完整 12 门课程、尾部转化区 |
| `pages/recommend/recommend` | 推荐 tab：吸顶搜索 + 分段（全部/课程/资料/案例）+ 内容列表 |
| `pages/activity/activity` | 活动 tab：吸顶筛选（全部/可报名/已报名）+ 活动横排卡，直接进报名 |
| `pages/profile/profile` | 我的：静默登录状态、手机号授权、我的报名与领取、在线咨询（客服按钮）、服务热线、信息使用说明 |
| `pages/detail/detail` | 内容详情（课程/资料/案例共用骨架）：底部固定转化条 + 咨询 |
| `pages/form/form` | 留资表单：姓名/手机号/医院/科室/备注 + 校验 + 手机号一键填写 |
| `pages/category/category` | 科室/分类的内容列表（从首页九宫格、分类入口进） |

## 资源

`assets/` 全部本地化：原站切图 + 4 个自绘 tabBar 图标，不触外链、不用配白名单。

## 预览

`preview/` 是「布局效果图」工具，不是模拟器：

- `preview/render.mjs`：把 WXML/WXSS 按 390 宽（rpx→px）渲成 HTML，并用页面自己的 `onLoad/onShow` 产出数据（`wx.*` 有预览替身）
- `preview/out/*.html` 是渲染结果，`*-fold.png` / `*-full.png` 是截图

有有效 AppID 后以微信开发者工具模拟器为准，这里的图只用来快速看结构。

## 还没做

- 真实接口与登录换 openid（现在留资落本地 `storage`，`utils/data.js` 是静态数据，接口一接即可替换）
- 手机号一键填写要正式 AppID + 已认证主体
- 分包：内容再多时把详情页拆进分包
