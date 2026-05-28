"use client"

import { useRef, useEffect, memo } from 'react'

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
    const STAR_COUNT = isMobile ? 400 : 800
    starsRef.current = Array.from({ length: STAR_COUNT }).map((_, i) => {
      const rx = Math.sin(i * 12.9898) * 43758.5453
      const ry = Math.sin(i * 78.233) * 12345.6789
      const x = rx - Math.floor(rx)
      const y = ry - Math.floor(ry)
      const size = 0.12 + ((i % 5) / 30)
      const alpha = 0.4 + (x * 0.3)
      const speed = 0.5 + ((i % 4) / 8)
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
        const driftX = reduce ? 0 : Math.sin(t * star.speed + star.phase) * star.dirX * 15
        const driftY = reduce ? 0 : Math.cos(t * star.speed + star.phase) * star.dirY * 12
        const x = star.x * width + driftX
        const y = star.y * height + driftY
        const size = (star.size / 100) * Math.min(width, height)
        ctx.globalAlpha = reduce ? star.alpha : star.alpha * (0.7 + 0.3 * Math.sin(t * 0.5 + star.phase))
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduce && time > nextShootRef.current && shootingStarsRef.current.length < 2) {
        const startX = Math.random() * width
        const startY = Math.random() * height * 0.35
        const angle = Math.random() * 0.4 + 0.2
        const speed = 350 + Math.random() * 200
        shootingStarsRef.current.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0.8 + Math.random() * 0.4,
          age: 0,
          size: 1 + Math.random() * 0.5,
        })
        nextShootRef.current = time + 3000 + Math.random() * 5000
      }
      if (!reduce && shootingStarsRef.current.length) {
        ctx.lineCap = 'round'
        const updated: typeof shootingStarsRef.current = []
        for (const shot of shootingStarsRef.current) {
          const age = shot.age + dt
          const x = shot.x + shot.vx * dt
          const y = shot.y + shot.vy * dt
          const alpha = Math.max(0, 1 - age / shot.life)
          ctx.strokeStyle = `rgba(255,255,255,${0.8 * alpha})`
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

export default StarField
