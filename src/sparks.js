// Hero arka planı: fareye tepki veren parçacık ağı + tıklayınca kıvılcım patlaması.
const COLORS = ['#2563eb', '#3b82f6', '#06b6d4', '#10b981', '#6366f1']

export function initSparks(canvas) {
  const ctx = canvas.getContext('2d')
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  let w, h, dpr
  let nodes = []
  let bursts = []
  const mouse = { x: -9999, y: -9999, active: false }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    const r = canvas.getBoundingClientRect()
    w = r.width
    h = r.height
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const count = Math.min(90, Math.floor((w * h) / 16000))
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1.2 + Math.random() * 2,
      c: COLORS[(Math.random() * COLORS.length) | 0],
    }))
  }

  function burst(x, y) {
    const n = 34
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.3
      const s = 1.5 + Math.random() * 4.5
      bursts.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 1,
        decay: 0.012 + Math.random() * 0.02,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        len: 6 + Math.random() * 10,
      })
    }
  }

  function trail(x, y) {
    bursts.push({
      x, y,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2 - 0.3,
      life: 1,
      decay: 0.035,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      len: 3,
    })
  }

  function frame() {
    ctx.clearRect(0, 0, w, h)

    // düğümler
    for (const n of nodes) {
      n.x += n.vx
      n.y += n.vy
      if (n.x < 0 || n.x > w) n.vx *= -1
      if (n.y < 0 || n.y > h) n.vy *= -1

      if (mouse.active) {
        const dx = n.x - mouse.x
        const dy = n.y - mouse.y
        const d = Math.hypot(dx, dy)
        if (d < 140 && d > 0) {
          const f = (140 - d) / 140
          n.x += (dx / d) * f * 2.2
          n.y += (dy / d) * f * 2.2
        }
      }
    }

    // bağlantılar
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d < 130) {
          ctx.strokeStyle = `rgba(37,99,235,${(1 - d / 130) * 0.22})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
      // fareye çizgi
      if (mouse.active) {
        const a = nodes[i]
        const d = Math.hypot(a.x - mouse.x, a.y - mouse.y)
        if (d < 180) {
          ctx.strokeStyle = `rgba(16,185,129,${(1 - d / 180) * 0.5})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }
    }

    for (const n of nodes) {
      ctx.fillStyle = n.c
      ctx.globalAlpha = 0.75
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    // kıvılcımlar
    for (let i = bursts.length - 1; i >= 0; i--) {
      const p = bursts[i]
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.96
      p.vy *= 0.96
      p.vy += 0.04
      p.life -= p.decay
      if (p.life <= 0) {
        bursts.splice(i, 1)
        continue
      }
      ctx.strokeStyle = p.c
      ctx.globalAlpha = p.life
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(p.x - p.vx * (p.len / 3), p.y - p.vy * (p.len / 3))
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    if (!reduce) requestAnimationFrame(frame)
  }

  const hero = canvas.parentElement
  hero.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect()
    mouse.x = e.clientX - r.left
    mouse.y = e.clientY - r.top
    mouse.active = true
    if (Math.random() < 0.35) trail(mouse.x, mouse.y)
  })
  hero.addEventListener('pointerleave', () => (mouse.active = false))
  hero.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return
    const r = canvas.getBoundingClientRect()
    burst(e.clientX - r.left, e.clientY - r.top)
  })

  window.addEventListener('resize', resize)
  resize()
  // açılışta küçük bir gösteri
  setTimeout(() => burst(w * 0.78, h * 0.32), 700)
  frame()
}
