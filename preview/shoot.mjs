// 无头 Chrome 截图：node shoot.mjs jobs.json
// 每个 job: { file, out, width, height, full, clips? }
// 用 CDP 而不是 --screenshot，是为了拿到「精确裁切」和「整页高度」两种图。
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9411 + (process.pid % 200)
const jobsFile = process.argv[2]
const jobs = JSON.parse(fs.readFileSync(jobsFile, 'utf8'))

const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=/tmp/dsh-shot-${process.pid}`,
    '--headless=new',
    '--hide-scrollbars',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--allow-file-access-from-files',
    '--force-device-scale-factor=1',
    '--default-background-color=00000000',
    'about:blank'
  ],
  { stdio: 'ignore' }
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function versionUrl() {
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      const j = await res.json()
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl
    } catch (e) {}
    await sleep(100)
  }
  throw new Error('chrome devtools not ready')
}

const wsUrl = await versionUrl()
const ws = new WebSocket(wsUrl)
await new Promise((resolve, reject) => {
  ws.onopen = resolve
  ws.onerror = reject
})

let seq = 0
const pending = new Map()
const eventWaiters = []
ws.onerror = (e) => console.error('ws error', e.message || e.type)
ws.onclose = (e) => console.error('ws closed', e.code, e.reason)
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)
  if (process.env.CDP_DEBUG) console.error('<-', msg.id || '', msg.method || '', msg.error ? JSON.stringify(msg.error) : '')
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id)
    pending.delete(msg.id)
    if (msg.error) reject(new Error(JSON.stringify(msg.error)))
    else resolve(msg.result)
    return
  }
  if (msg.method) {
    for (let i = eventWaiters.length - 1; i >= 0; i--) {
      const w = eventWaiters[i]
      if (w.method === msg.method && (!w.sessionId || w.sessionId === msg.sessionId)) {
        eventWaiters.splice(i, 1)
        w.resolve(msg.params)
      }
    }
  }
}

function send(method, params = {}, sessionId) {
  const id = ++seq
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
  })
}

function waitEvent(method, sessionId, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const w = { method, sessionId, resolve }
    eventWaiters.push(w)
    setTimeout(() => {
      const i = eventWaiters.indexOf(w)
      if (i >= 0) {
        eventWaiters.splice(i, 1)
        reject(new Error('timeout waiting ' + method))
      }
    }, timeout)
  })
}

async function evaluate(sessionId, expression) {
  const res = await send(
    'Runtime.evaluate',
    { expression, awaitPromise: true, returnByValue: true },
    sessionId
  )
  if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails))
  return res.result.value
}

const results = []

for (const job of jobs) {
  const url = job.file.startsWith('http') ? job.file : 'file://' + path.resolve(job.file)
  const width = job.width || 390
  const height = job.height || 844

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
  await send('Page.enable', {}, sessionId)
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: true
  }, sessionId)
  const loaded = waitEvent('Page.loadEventFired', sessionId)
  await send('Page.navigate', { url }, sessionId)
  await loaded
  await evaluate(sessionId, 'document.fonts && document.fonts.ready ? document.fonts.ready.then(()=>1) : 1')
  await sleep(350)
  const contentHeight = await evaluate(
    sessionId,
    'Math.min(30000, Math.max(document.documentElement.scrollHeight, document.body.scrollHeight))'
  )

  const shots = []
  if (job.clips) {
    for (const c of job.clips) {
      shots.push({ name: c.name, clip: { x: c.x, y: c.y, width: c.width, height: c.height, scale: c.scale || 2 } })
    }
  } else if (job.full) {
    shots.push({
      name: '',
      clip: { x: 0, y: 0, width, height: contentHeight, scale: job.scale || 2 },
      beyond: true
    })
  } else {
    shots.push({ name: '', clip: { x: 0, y: 0, width, height, scale: job.scale || 2 } })
  }

  for (const s of shots) {
    const out = s.name ? job.out.replace(/\.png$/, `-${s.name}.png`) : job.out
    fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true })
    const { data } = await send(
      'Page.captureScreenshot',
      {
        format: 'png',
        clip: s.clip,
        captureBeyondViewport: !!s.beyond,
        optimizeForSpeed: false
      },
      sessionId
    )
    fs.writeFileSync(out, Buffer.from(data, 'base64'))
    results.push({ out, contentHeight, width: s.clip.width, height: s.clip.height })
  }

  await send('Target.closeTarget', { targetId })
}

ws.close()
chrome.kill('SIGTERM')
console.log(JSON.stringify(results, null, 2))
