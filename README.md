# 飞利浦临床门户 · 微信小程序（父级页面版）

四个一级页面的骨架 + 原站切图 + 静态数据，导入微信开发者工具即可编译。这一版只做父级页面，子页面（详情 / 报名表单 / 分类）留给下一阶段。

交接人先看这一句：**所有指向子页面的点击都会弹「详情页下一阶段接入」**，这不是 bug，是这一版的边界。收口在 `utils/nav.js`。

## 包含

| 页面 | 内容 |
| --- | --- |
| 首页 | banner 轮播 3 张、科室九宫格、类型四宫格、最新活动横滑、系列课程两列、尾部客服入口 |
| 推荐 | 搜索 + 全部 / 课程 / 资料 / 案例 筛选 |
| 活动 | 全部 / 可报名 / 已报名，卡片直接回答「什么时候、在哪、还剩几席」，已报名显示状态 |
| 我的 | 静默登录身份、手机号一键授权入口、报名记录（读本机 storage）、客服 / 热线 / 信息说明 |

- 底部四项：首页 / 推荐 / 活动 / 我的，自定义 tabBar（`custom-tab-bar/`，图标在 `assets/tab-*.png`）。
- `assets/` 36 张原站切图全部本地，不依赖外链、不用配白名单。
- 首页用 `navigationStyle: custom`，右上角给系统胶囊让位（`wx.getMenuButtonBoundingClientRect()` 算出来的 `navRight`），只留一个搜索位。

## 不包含（下一阶段）

详情页、报名表单、分类列表页。所有指向它们的跳转统一走 `utils/nav.js`：

```js
const nav = require('../../utils/nav.js')
nav.openChild('/pages/detail/detail?id=c7')   // 现在只弹提示
```

接子页面时把 `openChild()` 里的 `wx.showToast` 换成 `wx.navigateTo({ url })`，页面里的调用点一行都不用改。

## 跑起来

1. 微信开发者工具 → 导入项目 → 选这个目录
2. AppID：仓库里填的是 `touristappid`，游客模式能编译看页面。真机预览和手机号一键填写要换成自己的 AppID，且主体已认证
3. 点「编译」

## 目录

```
app.js / app.json / app.wxss
custom-tab-bar/          底部四项，switchTab 切换
pages/index              首页（自定义导航栏）
pages/recommend          推荐
pages/activity           活动
pages/profile            我的
utils/data.js            全部内容数据，一个文件
utils/nav.js             子页面跳转收口
assets/                  36 张原站切图
docs/screenshots/        真机效果参考
```

## 数据与接口

- 内容数据全在 `utils/data.js`：`banners` / `depts` / `cats` / `activities` / `courses` / `materials` / `cases` / `recommend`。后台取数接在这里，页面结构不用动。
- 报名与领取记录现在写本机存储（`wx.setStorageSync(app.globalData.leadKey)`），后端留资接口接 `app.js` 里的 `apiBase`。
- 手机号：`<button open-type="getPhoneNumber">` 拿到 code 后，在 `pages/profile/profile.js` 的 `onGetPhone` 里发给后端换号码。

## 改之前先看这几条

1. **底部固定四项**，不加第五个。tabBar 是常用一级区，低频项（联系我们）用 `open-type="contact"` 的客服按钮承接，不占底部。
2. **右上角是系统区**，胶囊不能盖也不能改，自定义导航必须按 `navRight` 避让，最多留一个动作位。
3. **不做注册登录**。`wx.login` 静默换身份，只有手机号走一次授权。
4. **层级最多三层**：tab → 列表 → 详情。子页面接进来时别再往下加层。
5. **封面按容器裁切**（`aspectFill`），原站切图的文字都在画面中间，不要改成固定高度压扁。

## 截图

`docs/screenshots/` 里是四个 tab 在真机尺寸下的效果：`01-home` / `02-recommend` / `03-activity` / `04-profile`。
