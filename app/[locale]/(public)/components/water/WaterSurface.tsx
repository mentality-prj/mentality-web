'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

import { hexToRgb, mixRgb, type WaterPalette, WaterRenderer } from './waterRenderer'

export type WaterColors = { deep: string; mid: string; light: string }

export type WaterSurfaceHandle = {
  /** x, y in 0..1 of the canvas, y measured from the top. */
  drop: (x: number, y: number, strength?: number) => void
}

type Props = {
  colors: WaterColors
  className?: string
  /** Where calm, periodic drops fall (0..1, y from top). */
  source?: { x: number; y: number }
  /** Seconds between automatic drops; 0 disables them. */
  every?: number
  /** Animate only while hovered/touched (for small tiles); otherwise animate while visible. */
  still?: boolean
  /** A pointer press on the surface drops a ripple there. */
  interactive?: boolean
}

const toPalette = ({ deep, mid, light }: WaterColors): WaterPalette => ({
  deep: hexToRgb(deep),
  mid: hexToRgb(mid),
  light: hexToRgb(light),
})

/**
 * Pastel water rendered with WebGL. Falls back to the CSS gradient behind the
 * canvas when WebGL is unavailable; pauses off-screen and in background tabs;
 * honours prefers-reduced-motion with a single frozen frame.
 */
export const WaterSurface = forwardRef<WaterSurfaceHandle, Props>(function WaterSurface(
  { colors, className, source = { x: 0.5, y: 0.5 }, every = 0, still = false, interactive = false },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<WaterRenderer | null>(null)
  const targetRef = useRef<WaterPalette>(toPalette(colors))
  const kickRef = useRef<() => void>(() => undefined)
  const sourceRef = useRef(source)
  sourceRef.current = source

  useEffect(() => {
    targetRef.current = toPalette(colors)
    kickRef.current()
  }, [colors])

  useImperativeHandle(ref, () => ({
    drop: (x, y, strength = 0.8) => {
      rendererRef.current?.drop(x, 1 - y, strength)
      kickRef.current()
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let renderer: WaterRenderer
    try {
      renderer = new WaterRenderer(canvas, targetRef.current)
    } catch {
      canvas.style.display = 'none'
      return
    }
    rendererRef.current = renderer
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    /** Two drops already in flight, so a still frame shows a composed ripple. */
    const seed = (now: number) => {
      const { x, y } = sourceRef.current
      renderer.drop(x, 1 - y, 0.9, now - 2.4)
      renderer.drop(x, 1 - y, 0.8, now - 0.9)
    }
    seed(reduced ? 3.3 : renderer.time)

    let frame = 0
    let visible = false
    let activeUntil = 0
    let lastDrop = renderer.time - every * 0.6
    let frozenAt = reduced ? 3.3 : renderer.time

    const draw = (at?: number) => {
      renderer.resize()
      renderer.palette = {
        deep: mixRgb(renderer.palette.deep, targetRef.current.deep, 0.06),
        mid: mixRgb(renderer.palette.mid, targetRef.current.mid, 0.06),
        light: mixRgb(renderer.palette.light, targetRef.current.light, 0.06),
      }
      renderer.render(reduced ? frozenAt : (at ?? renderer.time))
    }

    const loop = () => {
      frame = 0
      const now = renderer.time
      if (every > 0 && now - lastDrop > every) {
        const { x, y } = sourceRef.current
        renderer.drop(x, 1 - y, 0.75)
        lastDrop = now
      }
      draw(now)
      const running = visible && !document.hidden && (!still || performance.now() < activeUntil)
      if (running && !reduced) frame = requestAnimationFrame(loop)
      else frozenAt = now
    }

    const kick = (ms = 6500) => {
      activeUntil = Math.max(activeUntil, performance.now() + ms)
      if (reduced) {
        renderer.palette = targetRef.current
        draw()
        return
      }
      if (!frame) frame = requestAnimationFrame(loop)
    }
    kickRef.current = () => kick()

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && still && performance.now() >= activeUntil) {
        frozenAt = renderer.time
        seed(frozenAt)
        draw(frozenAt)
      } else if (visible) kick()
    })
    observer.observe(canvas)
    const onVisibility = () => !document.hidden && visible && kick()
    document.addEventListener('visibilitychange', onVisibility)
    const onResize = () => draw(frozenAt)
    window.addEventListener('resize', onResize)
    draw(frozenAt)

    const host = canvas.parentElement
    const onEnter = () => {
      const { x, y } = sourceRef.current
      renderer.drop(x, 1 - y, 0.85)
      kick()
    }
    const onPress = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      renderer.drop((event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height, 0.85)
      kick()
    }
    if (still) host?.addEventListener('pointerenter', onEnter)
    if (interactive) host?.addEventListener('pointerdown', onPress)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      host?.removeEventListener('pointerenter', onEnter)
      host?.removeEventListener('pointerdown', onPress)
      renderer.dispose()
      rendererRef.current = null
    }
  }, [every, still, interactive])

  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden ${className ?? ''}`}
      style={{ background: `linear-gradient(180deg, ${colors.light} 0%, ${colors.mid} 55%, ${colors.deep} 100%)` }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
})
