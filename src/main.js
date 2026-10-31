import './style.css'
import { initSparks } from './sparks.js'
import { config } from './config.js'

initSparks(document.getElementById('sparks'))

// yıl
document.getElementById('year').textContent = new Date().getFullYear()

// iletişim butonları (yalnızca config'te doluysa görünür)
function setLink(id, href) {
  const el = document.getElementById(id)
  if (!href) return
  el.href = href
  el.hidden = false
}
setLink('mail-btn', config.email && `mailto:${config.email}?subject=${encodeURIComponent(config.mailSubject)}`)
setLink('wa-btn', config.whatsapp && `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(config.whatsappText)}`)
setLink('linkedin-btn', config.linkedin)

// nav gölgesi
const nav = document.getElementById('nav')
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10)
window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

// görününce animasyon
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in')
        io.unobserve(e.target)
      }
    }
  },
  { threshold: 0.15 },
)
document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

// sayaçlar
function countUp(el) {
  const to = Number(el.dataset.to)
  const dur = 1800
  const t0 = performance.now()
  const tick = (t) => {
    const p = Math.min((t - t0) / dur, 1)
    const eased = 1 - Math.pow(1 - p, 4)
    el.textContent = Math.round(to * eased)
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
const cio = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        countUp(e.target)
        cio.unobserve(e.target)
      }
    }
  },
  { threshold: 0.6 },
)
document.querySelectorAll('.count').forEach((el) => cio.observe(el))
