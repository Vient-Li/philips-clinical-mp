// 把工程的 WXML / WXSS / 页面逻辑渲染成浏览器可看的 HTML，用来截「布局效果图」。
// 不是模拟器：页面数据由页面自己的 onLoad/onShow 跑出来，模板由一个小运行时解释
// （wx:for / wx:if / {{}}），样式按 390 宽把 rpx 换成 px。有 AppID 时以模拟器为准。
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'preview', 'out')
const WIDTH = 390
const RPX = WIDTH / 750

fs.mkdirSync(OUT, { recursive: true })

// ---------- 样式 ----------
const TAG_CSS = {
  page: 'body',
  view: 'div',
  text: 'span',
  image: 'img',
  'scroll-view': 'div',
  swiper: 'div',
  'swiper-item': 'div'
}

function transformCss(src) {
  const out = src
    .replace(/url\(\/assets\//g, 'url(../../assets/')
    .replace(/(-?\d*\.?\d+)rpx/g, (_, n) => (Number(n) * RPX).toFixed(2) + 'px')
  return out
    .split('\n')
    .map((line) =>
      line.replace(/(^|,)(\s*)([a-z][a-z-]*)(?=\s*[,{])/g, (m, comma, ws, tag) => {
        return comma + ws + (TAG_CSS[tag] || tag)
      })
    )
    .join('\n')
}

// ---------- 模板 ----------
const TAG_HTML = {
  view: 'div',
  text: 'span',
  image: 'img',
  'scroll-view': 'div',
  swiper: 'div',
  'swiper-item': 'div'
}

function transformWxml(src) {
  const fixed = src.replace(/src="\/assets\//g, 'src="../../assets/')
  return fixed.replace(/<(\/?)([a-zA-Z-]+)/g, (m, slash, tag) => {
    const t = TAG_HTML[tag]
    if (!t) return m
    const extra = tag === 'swiper' && !slash ? ' data-wx="swiper"' : ''
    return `<${slash}${t}${extra}`
  })
}

// ---------- 页面运行时（在浏览器里执行）----------
const RUNTIME = String.raw`
(function () {
  function evalExpr(source, scope) {
    try {
      return new Function('s', 'with (s) { return (' + source + ') }')(scope)
    } catch (e) {
      return undefined
    }
  }
  function interp(str, scope) {
    if (str.indexOf('{{') === -1) return str
    return str.replace(/\{\{([\s\S]*?)\}\}/g, function (_, e) {
      const v = evalExpr(e, scope)
      return v === undefined || v === null ? '' : String(v)
    })
  }
  function renderNodes(nodes, dest, scope) {
    let chain = null
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        const text = interp(node.nodeValue, scope)
        if (text.trim() !== '') dest.appendChild(document.createTextNode(text))
        return
      }
      if (node.nodeType !== 1) return
      const el = node
      if (el.hasAttribute('wx:if')) {
        chain = { matched: !!evalExpr(el.getAttribute('wx:if').replace(/^\{\{|\}\}$/g, ''), scope) }
        if (!chain.matched) return
      } else if (el.hasAttribute('wx:elif')) {
        if (!chain) chain = { matched: false }
        if (chain.matched) return
        chain.matched = !!evalExpr(el.getAttribute('wx:elif').replace(/^\{\{|\}\}$/g, ''), scope)
        if (!chain.matched) return
      } else if (el.hasAttribute('wx:else')) {
        if (chain && chain.matched) return
        chain = { matched: true }
      } else {
        chain = null
      }
      if (el.hasAttribute('wx:for')) {
        const list = evalExpr(el.getAttribute('wx:for').replace(/^\{\{|\}\}$/g, ''), scope) || []
        const itemName = el.getAttribute('wx:for-item') || 'item'
        const idxName = el.getAttribute('wx:for-index') || 'index'
        list.forEach(function (it, i) {
          const sc = Object.assign({}, scope)
          sc[itemName] = it
          sc[idxName] = i
          emit(el.cloneNode(true), dest, sc)
        })
        return
      }
      emit(el.cloneNode(true), dest, scope)
    })
  }
  function emit(el, dest, scope) {
    Array.prototype.slice.call(el.attributes).forEach(function (a) {
      if (a.name.indexOf('wx:') === 0) {
        el.removeAttribute(a.name)
        return
      }
      el.setAttribute(a.name, interp(a.value, scope))
    })
    const kids = Array.prototype.slice.call(el.childNodes)
    while (el.firstChild) el.removeChild(el.firstChild)
    renderNodes(kids, el, scope)
    dest.appendChild(el)
  }
  function mount(tplId, scope) {
    const tpl = document.getElementById(tplId)
    if (!tpl) return null
    const root = document.createElement('div')
    const nodes = Array.prototype.slice.call(tpl.content.childNodes)
    renderNodes(nodes, root, scope)
    return root
  }
  const pageRoot = mount('__tpl', window.__DATA__)
  if (pageRoot) document.body.appendChild(pageRoot)
  const tabRoot = mount('__tpl_tabbar', window.__TAB__)
  if (tabRoot) document.body.appendChild(tabRoot)
  document.querySelectorAll('[data-wx="swiper"]').forEach(function (el) {
    while (el.children.length > 1) el.removeChild(el.lastElementChild)
  })
})()
`

// ---------- 设备外框（预览用，不进小程序代码）----------
const CHROME_CSS = `
html { -webkit-font-smoothing: antialiased; }
body { margin: 0; background: #ffffff; }
img { -webkit-user-drag: none; }
[data-wx="swiper"] { position: relative; overflow: hidden; }
img[mode="aspectFill"] { object-fit: cover; }
img[mode="aspectFit"] { object-fit: contain; }
.__nav { height: 91px; background: #0050d3; display: flex; align-items: flex-end; justify-content: center; }
.__nav-title { font: 600 17px/1 -apple-system, "PingFang SC", sans-serif; color: #ffffff; padding-bottom: 13px; }
.__status { position: fixed; top: 0; left: 0; right: 0; height: 47px; display: flex; align-items: flex-end; justify-content: space-between; padding: 0 26px 6px; pointer-events: none; z-index: 999; color: #111111; font: 600 14px/1 -apple-system, sans-serif; box-sizing: border-box; }
.__status.light { color: #ffffff; }
.__clock { letter-spacing: 0.2px; }
.__right { display: flex; align-items: center; gap: 5px; }
.__signal { width: 16px; height: 10px; background: currentColor; clip-path: polygon(0 100%, 18% 100%, 18% 62%, 0 62%, 0 100%, 27% 100%, 27% 44%, 45% 44%, 45% 100%, 55% 100%, 55% 26%, 73% 26%, 73% 100%, 82% 100%, 82% 8%, 100% 8%, 100% 100%); opacity: 0.9; }
.__battery { width: 22px; height: 11px; border: 1px solid currentColor; border-radius: 3px; position: relative; opacity: 0.9; }
.__battery::after { content: ""; position: absolute; left: 1.5px; top: 1.5px; bottom: 1.5px; width: 70%; background: currentColor; border-radius: 1px; }
.__capsule { position: fixed; top: 53px; right: 7px; width: 87px; height: 32px; border-radius: 16px; z-index: 998; display: flex; align-items: center; justify-content: space-around; box-sizing: border-box; }
.__capsule.dark { background: rgba(0, 0, 0, 0.05); border: 0.5px solid rgba(0, 0, 0, 0.08); color: rgba(0, 0, 0, 0.55); }
.__capsule.light { background: rgba(255, 255, 255, 0.18); border: 0.5px solid rgba(255, 255, 255, 0.28); color: rgba(255, 255, 255, 0.92); }
.__cap-dots { font-size: 15px; letter-spacing: 1px; line-height: 1; }
.__cap-line { width: 0.5px; height: 18px; background: currentColor; opacity: 0.35; }
.__cap-ring { width: 14px; height: 14px; border: 1.4px solid currentColor; border-radius: 50%; position: relative; }
.__cap-ring::after { content: ""; position: absolute; inset: 4px; background: currentColor; border-radius: 50%; }
`

function chromeHtml({ navTitle, customNav, statusLight }) {
  const capsule = `<div class="__capsule ${statusLight ? 'light' : 'dark'}"><span class="__cap-dots">···</span><span class="__cap-line"></span><span class="__cap-ring"></span></div>`
  const status = `<div class="__status ${statusLight ? 'light' : ''}"><span class="__clock">9:41</span><span class="__right"><span class="__signal"></span><span class="__battery"></span></span></div>`
  const nav = customNav
    ? ''
    : `<div class="__nav"><span class="__nav-title">${navTitle || ''}</span></div>`
  return nav + status + capsule
}

// ---------- 小程序 API 的预览替身 ----------
const DEMO_LEADS = [
  {
    title: '儿科床旁超声在监测患儿生命体征中的应用',
    name: '王医生',
    hospital: '市第一人民医院',
    dept: '超声科',
    note: '',
    createdAt: Date.now() - 36 * 3600 * 1000
  }
]

function makeWx(seed) {
  return {
    getStorageSync: (k) => (k in seed ? seed[k] : ''),
    setStorageSync() {},
    removeStorageSync() {},
    login: (o) => o && o.success && o.success({ code: 'preview-code' }),
    getWindowInfo: () => ({ windowWidth: WIDTH, windowHeight: 844, statusBarHeight: 47, screenWidth: WIDTH }),
    getSystemInfoSync: () => ({ windowWidth: WIDTH, windowHeight: 844, statusBarHeight: 47, screenWidth: WIDTH }),
    getMenuButtonBoundingClientRect: () => ({ top: 53, right: 383, bottom: 85, left: 296, width: 87, height: 32 }),
    switchTab() {},
    navigateTo() {},
    redirectTo() {},
    navigateBack() {},
    pageScrollTo() {},
    showToast() {},
    showModal() {},
    makePhoneCall() {},
    setNavigationBarTitle() {},
    setClipboardData() {}
  }
}

function loadPage(rel, query = {}, seed = {}) {
  const file = path.join(ROOT, rel + '.js')
  delete require.cache[require.resolve(file)]
  let def = null
  global.Page = (o) => {
    def = o
  }
  global.Component = () => {}
  const app = { globalData: { statusBarHeight: 47, leadKey: 'philips_leads', apiBase: 'https://page.ma.scrmtech.com' } }
  global.getApp = () => app
  global.wx = makeWx(seed)
  require(file)
  const inst = Object.assign({}, def)
  inst.data = JSON.parse(JSON.stringify(def.data || {}))
  inst.setData = function (obj) {
    Object.keys(obj).forEach((k) => {
      if (k.indexOf('.') > -1) {
        const parts = k.split('.')
        let t = this.data
        for (let i = 0; i < parts.length - 1; i++) t = t[parts[i]]
        t[parts[parts.length - 1]] = obj[k]
      } else {
        this.data[k] = obj[k]
      }
    })
  }
  inst.getTabBar = () => null
  if (inst.onLoad) inst.onLoad(query)
  if (inst.onShow) inst.onShow()
  return inst.data
}

function loadTabBar(selected) {
  const file = path.join(ROOT, 'custom-tab-bar', 'index.js')
  delete require.cache[require.resolve(file)]
  let def = null
  global.Component = (o) => {
    def = o
  }
  require(file)
  const data = JSON.parse(JSON.stringify(def.data))
  data.selected = selected
  return data
}

const css = (rel) => transformCss(fs.readFileSync(path.join(ROOT, rel), 'utf8'))
const tpl = (rel) => transformWxml(fs.readFileSync(path.join(ROOT, rel), 'utf8'))

const APP_CSS = css('app.wxss')
const TAB_CSS = css('custom-tab-bar/index.wxss')
const TAB_WXML = tpl('custom-tab-bar/index.wxml')

function build({ page, data, tabSelected, navTitle, customNav, statusLight }) {
  const pageCss = css(`pages/${page}/${page}.wxss`)
  const pageWxml = tpl(`pages/${page}/${page}.wxml`)
  const tabData = tabSelected === null ? null : loadTabBar(tabSelected)
  const html = `<!doctype html>
<html lang="zh"><head><meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>${CHROME_CSS}</style>
<style>${APP_CSS}</style>
<style>${pageCss}</style>
${tabData ? `<style>${TAB_CSS}</style>` : ''}
</head>
<body>
${chromeHtml({ navTitle, customNav, statusLight })}
<template id="__tpl">${pageWxml}</template>
<template id="__tpl_tabbar">${tabData ? TAB_WXML : ''}</template>
<script>window.__DATA__ = ${JSON.stringify(data).replace(/\/assets\//g, "../../assets/")}; window.__TAB__ = ${JSON.stringify(tabData).replace(/\/assets\//g, "../../assets/")};</script>
<script>${RUNTIME}</script>
</body></html>`
  const file = path.join(OUT, page + '.html')
  fs.writeFileSync(file, html)
  return file
}

const indexData = loadPage('pages/index/index', {}, {})
const recommendData = loadPage('pages/recommend/recommend', {}, {})
const activityData = loadPage('pages/activity/activity', {}, { philips_leads: DEMO_LEADS })
const profileData = loadPage('pages/profile/profile', {}, { philips_leads: DEMO_LEADS })
const detailData = loadPage('pages/detail/detail', { id: 'c7' }, { philips_leads: [] })

const files = [
  build({ page: 'index', data: indexData, tabSelected: 0, customNav: true, statusLight: false }),
  build({ page: 'recommend', data: recommendData, tabSelected: 1, navTitle: '推荐', statusLight: true }),
  build({ page: 'activity', data: activityData, tabSelected: 2, navTitle: '活动', statusLight: true }),
  build({ page: 'profile', data: profileData, tabSelected: 3, navTitle: '我的', statusLight: true }),
  build({ page: 'detail', data: detailData, tabSelected: null, navTitle: '课程详情', statusLight: true })
]

console.log(files.join('\n'))
