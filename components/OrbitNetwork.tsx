"use client"

import { useState, useRef, useEffect, memo } from 'react'
import { motion, AnimatePresence, useReducedMotion, useAnimationFrame } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Company, Service, AboutPage, SiteSettings } from '@/lib/strapi'

type Props = { companies: Company[]; services: Service[]; about: AboutPage | null; siteSettings: SiteSettings | null }

const parseColor = (value?: string) => {
  if (!value) return null
  const hexMatch = value.trim().match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
  if (hexMatch) {
    const hex = hexMatch[1]
    const fullHex = hex.length === 3
      ? hex.split('').map(ch => ch + ch).join('')
      : hex
    const num = parseInt(fullHex, 16)
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    }
  }
  const rgbMatch = value.trim().match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
    }
  }
  return null
}

const isLightColor = (value?: string) => {
  const rgb = parseColor(value)
  if (!rgb) return false
  const toLinear = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  const l = 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b)
  return l > 0.6
}

const StarField = memo(function StarField({ reduce }: { reduce: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const starsRef = useRef<Array<{
    x: number
    y: number
    size: number
    speed: number
    dirX: number
    dirY: number
    alpha: number
    phase: number
  }>>([])
  const shootingStarsRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    life: number
    age: number
    size: number
  }>>([])
  const nextShootRef = useRef(0)
  const lastTimeRef = useRef(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const STAR_COUNT = isMobile ? 800 : 1500
    starsRef.current = Array.from({ length: STAR_COUNT }).map((_, i) => {
      const rx = Math.sin(i * 12.9898) * 43758.5453
      const ry = Math.sin(i * 78.233) * 12345.6789
      const x = rx - Math.floor(rx)
      const y = ry - Math.floor(ry)
      const size = 0.14 + ((i % 6) / 28)
      const alpha = 0.55 + (x * 0.35)
      const speed = 0.3 + ((i % 5) / 10)
      const dirX = (i % 3) - 1
      const dirY = (i % 2) - 0.5
      return {
        x,
        y,
        size,
        speed,
        dirX,
        dirY,
        alpha,
        phase: i * 0.37,
      }
    })

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const render = (time: number) => {
      const { width, height } = canvas.getBoundingClientRect()
      const dt = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0
      lastTimeRef.current = time
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#ffffff'
      const t = time / 1000
      for (const star of starsRef.current) {
        const driftX = reduce ? 0 : Math.sin(t * star.speed + star.phase) * star.dirX * 10
        const driftY = reduce ? 0 : Math.cos(t * star.speed + star.phase) * star.dirY * 8
        const x = star.x * width + driftX
        const y = star.y * height + driftY
        const size = (star.size / 100) * Math.min(width, height)
        ctx.globalAlpha = reduce ? star.alpha : star.alpha * (0.8 + 0.2 * Math.sin(t * 0.6 + star.phase))
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduce && time > nextShootRef.current && shootingStarsRef.current.length < 2) {
        const startX = Math.random() * width
        const startY = Math.random() * height * 0.35
        const angle = Math.random() * 0.4 + 0.2
        const speed = 380 + Math.random() * 220
        shootingStarsRef.current.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0.9 + Math.random() * 0.4,
          age: 0,
          size: 1.2 + Math.random() * 0.6,
        })
        nextShootRef.current = time + 2500 + Math.random() * 4500
      }
      if (!reduce && shootingStarsRef.current.length) {
        ctx.lineCap = 'round'
        const updated: typeof shootingStarsRef.current = []
        for (const shot of shootingStarsRef.current) {
          const age = shot.age + dt
          const x = shot.x + shot.vx * dt
          const y = shot.y + shot.vy * dt
          const alpha = Math.max(0, 1 - age / shot.life)
          ctx.strokeStyle = `rgba(255,255,255,${0.85 * alpha})`
          ctx.lineWidth = shot.size
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x - shot.vx * 0.06, y - shot.vy * 0.06)
          ctx.stroke()
          if (age < shot.life && x < width + 120 && y < height + 120) {
            updated.push({ ...shot, x, y, age })
          }
        }
        shootingStarsRef.current = updated
      }
      ctx.globalAlpha = 1
      if (!reduce) frameRef.current = requestAnimationFrame(render)
    }

    resize()
    render(performance.now())
    window.addEventListener('resize', resize)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [reduce])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-screen w-screen"
    />
  )
})

export default function OrbitNetwork({ companies, services, about, siteSettings }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const [centerActive, setCenterActive] = useState(false)
  const reduce = useReducedMotion() ?? false
  const centerX = 50
  const centerY = 50
  const pausedTime = useRef(0)
  const pauseStartedAt = useRef<number | null>(null)
  const frameIntervalRef = useRef(48)
  const companyPanelRef = useRef<HTMLDivElement | null>(null)
  const companyPanelMobileRef = useRef<HTMLDivElement | null>(null)
  const aboutPanelRef = useRef<HTMLDivElement | null>(null)
  const aboutPanelMobileRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!active && !centerActive) return
    const handleOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null
      const panels = [
        companyPanelRef.current,
        companyPanelMobileRef.current,
        aboutPanelRef.current,
        aboutPanelMobileRef.current,
      ]
      if (target && panels.some(panel => panel?.contains(target))) return
      if (active) setActive(null)
      if (centerActive) setCenterActive(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [active, centerActive])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    frameIntervalRef.current = isMobile ? 96 : 48
  }, [])

  // Time-based drift to avoid rigid layout; throttled for perf
  const [tick, setTick] = useState(0)
  const last = useRef(0)
  const orbitPaused = !!active || centerActive
  useAnimationFrame((t) => {
    if (reduce) return
    if (orbitPaused) {
      if (pauseStartedAt.current === null) pauseStartedAt.current = t
      return
    }
    if (pauseStartedAt.current !== null) {
      pausedTime.current += t - pauseStartedAt.current
      pauseStartedAt.current = null
    }
    const motionTime = t - pausedTime.current
    if (motionTime - last.current > frameIntervalRef.current) {
      setTick(motionTime)
      last.current = motionTime
    }
  })

  const t = tick / 1000
  const N = companies.length
  const baseR = 38 // percent distance from center
  const driftR = 2.2  // radial drift amplitude (percent)
  const amp = 0.16  // angular wobble amplitude (radians)
  const globalSpin = reduce ? 0 : t * 0.075 // slower global spin

  const nodes = companies.map((c, i) => {
    const base = (i / N) * Math.PI * 2 + globalSpin
    // Random movement: each node has unique speed, direction, and oscillation
    const randomSpeed = 0.1 + (i % 3) * 0.08
    const randomPhase = i * 1.3
    const randomDrift = Math.sin(t * randomSpeed + randomPhase) * driftR
    const randomWobble = Math.cos(t * (0.15 + i * 0.05) + randomPhase) * amp * (1 + (i % 2) * 0.5)
    const radialNoise = Math.sin(t * 0.3 + i * 0.7) * 1.5
    const a = base + (reduce ? 0 : randomWobble)
    const r = baseR + (reduce ? 0 : randomDrift + radialNoise)
    const x = centerX + Math.cos(a) * r
    const y = centerY + Math.sin(a) * r
    return { ...c, x, y, a, r }
  })

  // Arc-based service layout: icons sit on a right-side arc; cards stack with
  // a guaranteed vertical step so titles/descriptions never overlap.
  const SERVICE_COUNT: number = 5
  const ARC_RADIUS = 28          // distance from center to icon (% units)
  const CARD_ARC_RADIUS = 34     // distance from center to card (% units) - separate arc for cards
  const ARC_HALF_ANGLE = 68      // arc spans -68° to +68°
  const serviceLayout = Array.from({ length: SERVICE_COUNT }, (_, i) => {
    const tt = SERVICE_COUNT === 1 ? 0 : i / (SERVICE_COUNT - 1)
    const angleDeg = -ARC_HALF_ANGLE + tt * (ARC_HALF_ANGLE * 2)
    const angle = (angleDeg * Math.PI) / 180
    const iconX = centerX + Math.cos(angle) * ARC_RADIUS
    const iconY = centerY + Math.sin(angle) * ARC_RADIUS
    // Card sits on its own arc (larger radius)
    const cardX = centerX + Math.cos(angle) * CARD_ARC_RADIUS
    const cardY = centerY + Math.sin(angle) * CARD_ARC_RADIUS
    return { angleDeg, iconX, iconY, cardX, cardY }
  })
  const displayServices = services.slice(0, serviceLayout.length)

  return (
    <div className="relative mx-auto h-full w-full px-4 py-0">
      {/* Starfield background covering full page */}
      <StarField reduce={reduce} />
      <div
        className="relative mx-auto flex items-center justify-center select-none"
        style={{
          width: 'min(1180px, min(100vw, calc(100vh - 140px)))',
          height: 'min(1180px, min(100vw, calc(100vh - 140px)))',
        }}
      >
        <div className="absolute z-20" style={{ left: `${centerX}%`, top: `${centerY}%`, transform: 'translate(-50%, -50%)' }}>
          <motion.div
            className="relative flex items-center justify-center rounded-full border border-neutral-800 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black shadow-glow"
            style={{ width: 'clamp(9.375rem, 24vmin, 20rem)', height: 'clamp(9.375rem, 24vmin, 20rem)' }}
            animate={reduce ? undefined : { scale: [1, 1.02, 1] }}
            transition={reduce ? undefined : { duration: 6, repeat: Infinity }}
            onMouseEnter={() => setCenterActive(true)}
            onFocus={() => setCenterActive(true)}
            onClick={() => {
              setActive(null)
              setCenterActive(prev => !prev)
            }}
            tabIndex={0}
          >
            <div className="text-center">
              {siteSettings?.mainLogoUrl ? (
                <img
                  src={siteSettings.mainLogoUrl}
                  alt="Bantu Khaya"
                  className="h-[clamp(4.5rem,12vmin,8rem)] w-[clamp(4.5rem,12vmin,8rem)] object-contain"
                />
              ) : (
                <>
                  <div className="text-3xl font-semibold tracking-wide">Bantu Khaya</div>
                  <div className="mt-1 text-sm text-neutral-300">Group</div>
                </>
              )}
            </div>
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-brand-700/30"
              animate={reduce ? undefined : { opacity: [0.5, 0.9, 0.5] }}
              transition={reduce ? undefined : { duration: 4, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* SVG connector network (center-to-node, neighbor, and cross links) */}
        <svg className="absolute inset-0 z-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden style={{ opacity: centerActive && !active ? 0.25 : 1 }}>
          {nodes.map((n, i) => {
            const isRel = active ? active === n.id : false
            const midX = (centerX + n.x) / 2
            const midY = (centerY + n.y) / 2
            const a1 = Math.atan2(n.y - centerY, n.x - centerX)
            const off = 4
            const kx1 = midX + Math.cos(a1 + Math.PI / 3) * off + Math.sin(t + i) * 1.5
            const ky1 = midY + Math.sin(a1 + Math.PI / 3) * off + Math.cos(t + i) * 1.5
            const kx2 = midX + Math.cos(a1 - Math.PI / 3) * off + Math.cos(t + i) * 1.5
            const ky2 = midY + Math.sin(a1 - Math.PI / 3) * off + Math.sin(t + i) * 1.5
            const d = `M ${centerX} ${centerY} L ${kx1} ${ky1} L ${kx2} ${ky2} L ${n.x} ${n.y}`
            return (
              <motion.path
                key={`c-${n.id}`}
                d={d}
                fill="none"
                stroke={isRel ? n.color : 'rgba(255,255,255,0.3)'}
                strokeOpacity={isRel ? 1 : 0.6}
                strokeWidth={0.5}
                vectorEffect="non-scaling-stroke"
                initial={false}
                animate={reduce ? {} : { strokeDashoffset: [0, 0] }}
                transition={{ duration: 8 + (i % 3), repeat: Infinity, ease: 'linear' }}
                strokeDasharray="none"
              />
            )
          })}

          {nodes.map((n, i) => {
            const m = nodes[(i + 1) % N]
            const isRel = active ? active === n.id || active === m.id : false
            const midX = (n.x + m.x) / 2
            const midY = (n.y + m.y) / 2
            const a1 = Math.atan2(m.y - n.y, m.x - n.x)
            const off = 2.5
            const kx1 = midX + Math.cos(a1 + Math.PI / 4) * off + Math.sin(t + i) * 1
            const ky1 = midY + Math.sin(a1 + Math.PI / 4) * off + Math.cos(t + i) * 1
            const kx2 = midX + Math.cos(a1 - Math.PI / 4) * off + Math.cos(t + i) * 1
            const ky2 = midY + Math.sin(a1 - Math.PI / 4) * off + Math.sin(t + i) * 1
            const d = `M ${n.x} ${n.y} L ${kx1} ${ky1} L ${kx2} ${ky2} L ${m.x} ${m.y}`
            return (
              <motion.path
                key={`n-${n.id}`}
                d={d}
                fill="none"
                stroke={isRel ? n.color : 'rgba(255,255,255,0.25)'}
                strokeOpacity={isRel ? 0.9 : 0.5}
                strokeWidth={0.4}
                vectorEffect="non-scaling-stroke"
                initial={false}
                animate={reduce ? {} : { strokeDashoffset: [0, 0] }}
                transition={{ duration: 10 + ((i + 1) % 4), repeat: Infinity, ease: 'linear' }}
                strokeDasharray="none"
              />
            )
          })}

          {nodes.map((n, i) => {
            const m = nodes[(i + 3) % N]
            const isRel = active ? active === n.id || active === m.id : false
            const midX = (n.x + m.x) / 2
            const midY = (n.y + m.y) / 2
            const a1 = Math.atan2(m.y - n.y, m.x - n.x)
            const off = 3
            const kx1 = midX + Math.cos(a1 + Math.PI / 3.5) * off + Math.sin(t + i) * 1.2
            const ky1 = midY + Math.sin(a1 + Math.PI / 3.5) * off + Math.cos(t + i) * 1.2
            const kx2 = midX + Math.cos(a1 - Math.PI / 3.5) * off + Math.cos(t + i) * 1.2
            const ky2 = midY + Math.sin(a1 - Math.PI / 3.5) * off + Math.sin(t + i) * 1.2
            const d = `M ${n.x} ${n.y} L ${kx1} ${ky1} L ${kx2} ${ky2} L ${m.x} ${m.y}`
            return (
              <motion.path
                key={`x-${n.id}`}
                d={d}
                fill="none"
                stroke={isRel ? n.color : 'rgba(255,255,255,0.2)'}
                strokeOpacity={isRel ? 0.8 : 0.4}
                strokeWidth={0.35}
                vectorEffect="non-scaling-stroke"
                initial={false}
                animate={reduce ? {} : { strokeDashoffset: [0, 0] }}
                transition={{ duration: 12 + ((i + 2) % 4), repeat: Infinity, ease: 'linear' }}
                strokeDasharray="none"
              />
            )
          })}
        </svg>

        {/* Drifting star nodes */}
        <div className="absolute inset-0 z-10 transition-opacity duration-200" style={{ opacity: centerActive && !active ? 0.6 : 1 }}>
          {nodes.map((n, i) => {
            const isActive = active === n.id
            return (
              <div key={n.id} className="absolute" style={{ left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%, -50%)' }}>
                <motion.button
                  onMouseEnter={() => { setActive(n.id); setCenterActive(false) }}
                  onFocus={() => { setActive(n.id); setCenterActive(false) }}
                  onClick={() => setActive((prev: string | null) => (prev === n.id ? null : n.id))}
                  tabIndex={0}
                  className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-neutral-900/70 text-xs font-medium shadow-glow backdrop-blur-sm transition-colors hover:border-white/50 focus:outline-none sm:h-16 sm:w-16 sm:text-sm lg:h-20 lg:w-20"
                  style={{
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.95)',
                    boxShadow: isActive ? `0 0 30px ${n.color}66, inset 0 0 18px ${n.color}33` : `0 0 14px rgba(255,255,255,0.08)`,
                  }}
                >
                  <motion.span
                    animate={reduce ? undefined : { y: [0, -3, 0, 2, 0], scale: [1, 1.02, 1, 0.98, 1] }}
                    transition={reduce ? undefined : { duration: 4 + (i % 3), repeat: Infinity }}
                    className="pointer-events-none flex h-8 w-8 items-center justify-center sm:h-10 sm:w-10 lg:h-12 lg:w-12"
                    style={{ color: n.color }}
                  >
                    {n.logoUrl ? (
                      <img src={n.logoUrl} alt={n.name} className="h-8 w-8 rounded-full object-contain sm:h-9 sm:w-9 lg:h-10 lg:w-10" />
                    ) : (
                      <span>{n.initial ?? n.name.charAt(0)}</span>
                    )}
                  </motion.span>
                  <span className="sr-only">{n.name}</span>
                </motion.button>
              </div>
            )
          })}
        </div>

        <AnimatePresence>
          {centerActive && !active && (
            <>
              {/* Services - infographic style with connecting lines */}
              <motion.div
                key="services-infographic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-none absolute inset-0 z-30 hidden md:block"
              >
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Card arc */}
                  <path
                    d={`M ${serviceLayout[0].cardX} ${serviceLayout[0].cardY} ` +
                       serviceLayout.slice(1).map(p => `A ${CARD_ARC_RADIUS} ${CARD_ARC_RADIUS} 0 0 1 ${p.cardX} ${p.cardY}`).join(' ')}
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.12"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Service cards */}
                {displayServices.map((s, idx) => {
                  const { cardX, cardY } = serviceLayout[idx]
                  return (
                    <div key={s.id}>
                    {/* Card placed on its own row */}
                    <motion.div
                      initial={{ opacity: 0, x: 20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 0.15 * idx, duration: 0.4 }}
                      className="absolute z-40"
                      style={{
                        left: `${cardX + (idx === 0 ? 3 : 0)}%`,
                        top: `${cardY - (idx === 0 ? 3 : 0)}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div
                        className="relative w-[34rem] rounded-lg border border-neutral-700/80 bg-neutral-800/95 px-4 py-2.5 shadow-2xl backdrop-blur lg:w-[36rem]"
                        style={{
                          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)'
                        }}
                      >
                        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border-[2px] border-white bg-neutral-900 text-[0.7rem] font-bold tracking-wider text-white shadow-lg z-10">
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                        <div className="pr-8 text-[0.9rem] font-bold leading-tight text-white">
                          {s.title}
                        </div>
                        <div className="mt-1.5 pr-6 text-[0.8rem] leading-relaxed text-neutral-300">
                          {s.desc}
                        </div>
                      </div>
                    </motion.div>
                    </div>
                  )
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {active && (
            <motion.div
              key={active}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', stiffness: 80, damping: 25 }}
              className="fixed right-0 top-0 z-30 hidden h-full w-full max-w-md rounded-l-2xl border-l border-neutral-800 bg-neutral-900/95 p-6 text-sm shadow-2xl backdrop-blur md:block"
              ref={companyPanelRef}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-5 top-5 rounded p-1 text-neutral-400 hover:text-neutral-200"
                aria-label="Close"
              >
                ✕
              </button>
              {(() => {
                const c = companies.find(x => x.id === active)!
                return (
                  <div className="mt-20">
                    <div className="text-xl font-semibold text-white" style={{ color: c.color }}>{c.name}</div>
                    <div className="mt-3 text-base leading-7 text-neutral-300">{c.blurb}</div>
                    {c.description && (
                      <div className="mt-4 text-base leading-7 text-neutral-300 prose prose-invert prose-sm max-w-none prose-p:mb-4 prose-p:leading-7 prose-ul:my-3 prose-ul:ml-4 prose-ul:list-disc prose-li:my-1 prose-li:block">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{c.description}</ReactMarkdown>
                      </div>
                    )}
                    {c.link && (
                      <a
                        href={c.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-1 rounded-md border border-neutral-700/60 px-4 py-2 text-neutral-200 hover:border-neutral-600 hover:text-white"
                      >
                        Visit page →
                      </a>
                    )}
                  </div>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {active && (
            <motion.div
              key={`${active}-mobile`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="fixed inset-x-0 bottom-0 z-50 m-4 rounded-xl border border-neutral-800 bg-neutral-900/95 p-4 text-sm shadow-2xl backdrop-blur md:hidden"
              ref={companyPanelMobileRef}
            >
              {(() => {
                const c = companies.find(x => x.id === active)!
                return (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full" style={{ background: c.color }} />
                    <div className="flex-1">
                      <div className="text-base font-semibold text-white" style={{ color: c.color }}>{c.name}</div>
                      <div className="mt-1 text-neutral-300">{c.blurb}</div>
                      {c.description && (
                        <div className="mt-2 text-neutral-300 prose prose-invert prose-sm max-w-none prose-p:mb-3 prose-p:leading-6 prose-ul:my-2 prose-ul:ml-4 prose-ul:list-disc prose-li:my-1 prose-li:block">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{c.description}</ReactMarkdown>
                        </div>
                      )}
                      {c.link && (
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 rounded-md border border-neutral-700/60 px-3 py-1.5 text-neutral-200 hover:border-neutral-600 hover:text-white"
                        >
                          Visit page →
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => setActive(null)}
                      className="-m-1 rounded p-1 text-neutral-400 hover:text-neutral-200"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {centerActive && !active && (
          <>
            {/* About panel on left - positioned outside orbit container on viewport left edge */}
            <motion.div
              key="about-panel"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: 'spring', stiffness: 240, damping: 26 }}
              className="absolute left-[1%] top-[15%] z-20 hidden w-[28rem] rounded-xl border border-neutral-800 bg-neutral-900/90 p-5 text-sm shadow-2xl backdrop-blur lg:left-[1.5%] lg:w-[32rem] md:block"
              onMouseEnter={() => setCenterActive(true)}
              ref={aboutPanelRef}
            >
              <button
                onClick={() => setCenterActive(false)}
                className="absolute right-3 top-3 rounded p-1 text-neutral-400 hover:text-neutral-200"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="text-xl font-semibold text-white">{about?.title || 'About Bantu Khaya'}</div>
              <div className="my-3 h-px w-16 bg-neutral-600" />
              <p className="text-neutral-300">{about?.hoverDescription || 'We are a connected group of ventures collaborating through shared services to deliver premium, end-to-end solutions.'}</p>
              <a href="/about" className="pointer-events-auto mt-3 inline-flex items-center gap-1 rounded-md border border-neutral-700/60 px-3 py-1.5 text-neutral-200 hover:border-neutral-600 hover:text-white">Learn more →</a>
            </motion.div>
            <motion.div
              key="about-panel-mobile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              className="fixed inset-x-0 bottom-0 z-30 m-4 max-h-[70vh] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/95 p-5 text-sm shadow-2xl backdrop-blur md:hidden"
              ref={aboutPanelMobileRef}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="max-h-[60vh] flex-1 overflow-y-auto pr-1">
                  <div className="text-lg font-semibold text-white">{about?.title || 'About Bantu Khaya'}</div>
                  <div className="my-3 h-px w-16 bg-neutral-600" />
                  <p className="text-neutral-300">{about?.hoverDescription || 'We are a connected group of ventures collaborating through shared services to deliver premium, end-to-end solutions.'}</p>
                  <a href="/about" className="pointer-events-auto mt-3 inline-flex items-center gap-1 rounded-md border border-neutral-700/60 px-3 py-1.5 text-neutral-200 hover:border-neutral-600 hover:text-white">Learn more →</a>

                  <div className="mt-6">
                    <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Services</div>
                    <div className="mt-3 grid gap-3">
                      {displayServices.map(service => (
                        <div key={service.id} className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-3">
                          <div className="text-sm font-semibold text-white">{service.title}</div>
                          <div className="mt-1 text-xs leading-5 text-neutral-300">{service.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setCenterActive(false)}
                  className="-m-1 rounded p-1 text-neutral-400 hover:text-neutral-200"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
