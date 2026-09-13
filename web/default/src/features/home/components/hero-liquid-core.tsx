/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import ClaudeColor from '@lobehub/icons/es/Claude/components/Color'
import DeepSeekColor from '@lobehub/icons/es/DeepSeek/components/Color'
import GeminiColor from '@lobehub/icons/es/Gemini/components/Color'
import MetaColor from '@lobehub/icons/es/Meta/components/Color'
import OpenAIMono from '@lobehub/icons/es/OpenAI/components/Mono'
import { useEffect, useId, useRef } from 'react'

import { cn } from '@/lib/utils'

/**
 * Liquid Glass Intelligence Core — 首页右侧主视觉。
 *
 * 分层（由后到前）：光纤轨道后半段 → 玻璃核心（折射透镜 / 内部流光画布 /
 * 冰晶纹理 / 焦散扫光 / 边缘高光 / 镜面高光）→ 光纤轨道前半段 → 模型玻璃卡片。
 *
 * 连续运动全部由 CSS 动画驱动，只有两件事需要逐帧计算，共用同一个
 * requestAnimationFrame：卡片的椭圆公转（深度决定缩放、透明度与前后遮挡）
 * 和内部流光画布。舞台离开视口时暂停；prefers-reduced-motion 下只绘制静帧。
 * 模型 Logo 直接深引用 @lobehub/icons 的单个组件，避免把整个图标库打进首页。
 */

type OrbitLane = {
  id: string
  Logo: typeof ClaudeColor
  /** 起始角（弧度） */
  phase: number
  /** 公转一周的秒数 */
  period: number
  /** 半长轴，占舞台宽度的比例 */
  radius: number
  /** 半短轴 / 半长轴 —— 轨道平面的倾角 */
  tilt: number
  /** 轨道平面的上下偏移，占舞台宽度的比例 */
  lift: number
  /** 是否为这条轨道绘制可见的光纤 */
  ring: boolean
}

// 删除原智谱位（Mistral）卡片后重新配平：五张卡片各自一条轨道，
// 半径、倾角、周期与相位都错开，避免规则的十字构图与同步感。
// 具体数值由离线仿真挑选，尽量减少同为前景或同为后景的卡片相撞；
// 前景卡片从后景卡片前方掠过时的遮挡是有意保留的纵深。
const ORBIT_LANES: OrbitLane[] = [
  {
    id: 'openai',
    Logo: OpenAIMono,
    phase: 0.11,
    period: 20,
    radius: 0.3,
    tilt: 0.48,
    lift: 0.08,
    ring: false,
  },
  {
    id: 'claude',
    Logo: ClaudeColor,
    phase: 1.25,
    period: 30,
    radius: 0.46,
    tilt: 0.27,
    lift: -0.11,
    ring: true,
  },
  {
    id: 'meta',
    Logo: MetaColor,
    phase: 2.07,
    period: 22,
    radius: 0.35,
    tilt: 0.36,
    lift: -0.1,
    ring: true,
  },
  {
    id: 'gemini',
    Logo: GeminiColor,
    phase: 2.15,
    period: 27,
    radius: 0.38,
    tilt: 0.49,
    lift: 0.07,
    ring: false,
  },
  {
    id: 'deepseek',
    Logo: DeepSeekColor,
    phase: 3.8,
    period: 24,
    radius: 0.44,
    tilt: 0.46,
    lift: 0.06,
    ring: true,
  },
]

// 光纤只画后半段（经过核心背后）与前半段（经过核心前方）两条弧，
// 前后弧分属两层 SVG，才能被核心真实地遮挡。
const RING_ARCS = ORBIT_LANES.filter((lane) => lane.ring).map((lane) => {
  const cx = 50
  const cy = 50 + lane.lift * 100
  const rx = lane.radius * 100
  const ry = rx * lane.tilt
  return {
    id: lane.id,
    back: `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`,
    front: `M ${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`,
  }
})

const MOTE_IDS = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7']

// 移动端：所有卡片共用一条轨道、等距排布、同速公转 —— 彼此永不追越，保证不重叠。
const COMPACT_PERIOD = 34
const COMPACT_ORBIT = { radius: 0.42, tilt: 0.46, lift: 0 }
const LIGHT_BUFFER = 200
const LIGHT_FRAME_MS = 33
const TAU = Math.PI * 2

const LIGHT_BLOBS = [
  {
    color: '255, 255, 255',
    alpha: 0.26,
    radius: 70,
    orbitX: 38,
    orbitY: 30,
    periodX: 13,
    periodY: 17,
    offset: 0,
  },
  {
    color: '160, 212, 255',
    alpha: 0.24,
    radius: 82,
    orbitX: 44,
    orbitY: 36,
    periodX: 17,
    periodY: 11,
    offset: 1.9,
  },
  {
    color: '130, 236, 246',
    alpha: 0.18,
    radius: 60,
    orbitX: 34,
    orbitY: 42,
    periodX: 9,
    periodY: 14,
    offset: 3.4,
  },
  {
    color: '184, 158, 255',
    alpha: 0.2,
    radius: 66,
    orbitX: 40,
    orbitY: 28,
    periodX: 19,
    periodY: 15,
    offset: 4.6,
  },
  {
    color: '255, 196, 228',
    alpha: 0.1,
    radius: 54,
    orbitX: 30,
    orbitY: 34,
    periodX: 15,
    periodY: 20,
    offset: 5.8,
  },
]

// 焦散光丝的 RGB 分离：青、粉两道偏移副本 + 白色主线，形成轻微色散。
const CAUSTIC_CHANNELS: Array<[number, string, number]> = [
  [-1.1, '120, 232, 255', 0.22],
  [1.1, '255, 170, 220', 0.16],
  [0, '255, 255, 255', 0.42],
]

/**
 * 核心内部的液态流光：几团缓慢游走、呼吸的柔光，加三条带色散的焦散光丝。
 * 画在 200px 的低分辨率画布上，由 CSS 放大到核心尺寸，放大本身就是柔化。
 */
function paintInternalLight(ctx: CanvasRenderingContext2D, seconds: number) {
  const center = LIGHT_BUFFER / 2
  ctx.globalCompositeOperation = 'source-over'
  ctx.clearRect(0, 0, LIGHT_BUFFER, LIGHT_BUFFER)
  ctx.globalCompositeOperation = 'lighter'

  for (const blob of LIGHT_BLOBS) {
    const x =
      center +
      Math.sin((seconds / blob.periodX) * TAU + blob.offset) * blob.orbitX
    const y =
      center +
      Math.cos((seconds / blob.periodY) * TAU + blob.offset) * blob.orbitY
    const breathe =
      0.85 +
      Math.sin((seconds / (blob.periodX + blob.periodY)) * TAU + blob.offset) *
        0.15
    const gradient = ctx.createRadialGradient(
      x,
      y,
      0,
      x,
      y,
      blob.radius * breathe
    )
    gradient.addColorStop(0, `rgba(${blob.color}, ${blob.alpha})`)
    gradient.addColorStop(1, `rgba(${blob.color}, 0)`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, LIGHT_BUFFER, LIGHT_BUFFER)
  }

  ctx.lineCap = 'round'
  for (let strand = 0; strand < 3; strand += 1) {
    const phase = (seconds / (11 + strand * 4)) * TAU + strand * 2.1
    const sway = Math.sin(phase) * 26
    const bend = Math.cos(phase * 0.7) * 34
    const baseY = 58 + strand * 42
    const glow = 0.5 + Math.sin(phase * 1.3) * 0.5
    ctx.lineWidth = 1.4 + strand * 0.4
    for (const [dx, color, alpha] of CAUSTIC_CHANNELS) {
      ctx.strokeStyle = `rgba(${color}, ${(alpha * glow).toFixed(3)})`
      ctx.beginPath()
      ctx.moveTo(18 + dx, baseY + sway)
      ctx.bezierCurveTo(
        70 + dx,
        baseY - bend,
        130 + dx,
        baseY + bend + sway * 0.5,
        182 + dx,
        baseY - sway
      )
      ctx.stroke()
    }
  }

  // 边缘羽化，让流光在玻璃边缘自然消散
  ctx.globalCompositeOperation = 'destination-in'
  const edge = ctx.createRadialGradient(
    center,
    center,
    center * 0.55,
    center,
    center,
    center
  )
  edge.addColorStop(0, 'rgba(0, 0, 0, 1)')
  edge.addColorStop(0.78, 'rgba(0, 0, 0, 0.9)')
  edge.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = edge
  ctx.fillRect(0, 0, LIGHT_BUFFER, LIGHT_BUFFER)
}

type HeroLiquidCoreProps = {
  className?: string
}

export function HeroLiquidCore(props: HeroLiquidCoreProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const svgId = useId().replaceAll(/[^a-zA-Z0-9_-]/g, '')
  const fiberGradientId = `${svgId}-fiber`
  const crystalFilterId = `${svgId}-crystal`

  useEffect(() => {
    const stage = stageRef.current
    const ctx = canvasRef.current?.getContext('2d')
    if (!stage || !ctx) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const finePointer = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches
    const compact = window.matchMedia('(max-width: 767px)').matches
    const startedAt = performance.now()

    let stageSize = stage.clientWidth
    let pointerX = 0
    let pointerY = 0
    let parallaxX = 0
    let parallaxY = 0
    let lastLightPaint = -Infinity
    let frameId = 0

    const render = (now: number) => {
      const seconds = (now - startedAt) / 1000
      parallaxX += (pointerX - parallaxX) * 0.06
      parallaxY += (pointerY - parallaxY) * 0.06
      stage.style.setProperty('--core-mx', parallaxX.toFixed(3))
      stage.style.setProperty('--core-my', parallaxY.toFixed(3))

      ORBIT_LANES.forEach((lane, index) => {
        const card = cardRefs.current[index]
        if (!card) return

        const orbit = compact ? COMPACT_ORBIT : lane
        const period = compact ? COMPACT_PERIOD : lane.period
        const phase = compact
          ? (index / ORBIT_LANES.length) * TAU + 0.3
          : lane.phase
        const angle = phase + (seconds / period) * TAU
        const depth = Math.sin(angle)
        const nearness = (depth + 1) / 2
        // 越靠前视差越大：后景 2px，前景 8px
        const drift = 2 + nearness * 6
        const x = Math.cos(angle) * orbit.radius * stageSize + parallaxX * drift
        const y =
          (depth * orbit.radius * orbit.tilt + orbit.lift) * stageSize +
          parallaxY * drift
        const scale = 0.8 + nearness * 0.28

        card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`
        card.style.opacity = (0.5 + nearness * 0.5).toFixed(3)

        const zIndex = depth > 0 ? '30' : '10'
        if (card.style.zIndex !== zIndex) card.style.zIndex = zIndex

        let layer = 'mid'
        if (depth < -0.4) layer = 'back'
        else if (depth > 0.4) layer = 'front'
        if (card.dataset.depth !== layer) card.dataset.depth = layer
      })

      if (now - lastLightPaint >= LIGHT_FRAME_MS) {
        lastLightPaint = now
        paintInternalLight(ctx, seconds)
      }
    }

    const resizeObserver = new ResizeObserver((entries) => {
      stageSize = entries[0].contentRect.width
      if (reducedMotion) render(startedAt)
    })
    resizeObserver.observe(stage)

    if (reducedMotion) {
      render(startedAt)
      return () => resizeObserver.disconnect()
    }

    const tick = (now: number) => {
      render(now)
      frameId = requestAnimationFrame(tick)
    }

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !frameId) {
        frameId = requestAnimationFrame(tick)
        return
      }
      if (!entry.isIntersecting) {
        cancelAnimationFrame(frameId)
        frameId = 0
      }
    })
    visibilityObserver.observe(stage)

    // 视口归一化坐标，无需逐帧读取布局
    const onPointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth) * 2 - 1
      pointerY = (event.clientY / window.innerHeight) * 2 - 1
    }
    const trackPointer = finePointer && !compact
    if (trackPointer) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
    }

    return () => {
      cancelAnimationFrame(frameId)
      visibilityObserver.disconnect()
      resizeObserver.disconnect()
      if (trackPointer) window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return (
    <div
      ref={stageRef}
      className={cn('liquid-core-stage aspect-square w-full', props.className)}
      aria-hidden='true'
    >
      <div className='liquid-core-ambient' />

      <svg
        className='liquid-core-orbits'
        data-layer='back'
        viewBox='0 0 100 100'
        preserveAspectRatio='none'
      >
        <defs>
          <linearGradient id={fiberGradientId} x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0' stopColor='#e4f1ff' stopOpacity='0.45' />
            <stop offset='0.22' stopColor='#cfe5ff' stopOpacity='0.95' />
            <stop offset='0.5' stopColor='#8fbdf0' stopOpacity='0.6' />
            <stop offset='0.78' stopColor='#c7b6f4' stopOpacity='0.9' />
            <stop offset='1' stopColor='#e4f1ff' stopOpacity='0.45' />
          </linearGradient>
        </defs>
        {RING_ARCS.map((arc) => (
          <path
            key={arc.id}
            d={arc.back}
            className='liquid-core-fiber'
            stroke={`url(#${fiberGradientId})`}
            vectorEffect='non-scaling-stroke'
          />
        ))}
      </svg>

      <div className='liquid-core'>
        <div className='liquid-core-lens' />
        <canvas
          ref={canvasRef}
          className='liquid-core-light'
          width={LIGHT_BUFFER}
          height={LIGHT_BUFFER}
        />
        <svg className='liquid-core-crystal' viewBox='0 0 200 200'>
          <defs>
            <filter
              id={crystalFilterId}
              x='0'
              y='0'
              width='100%'
              height='100%'
              colorInterpolationFilters='sRGB'
            >
              <feTurbulence
                type='fractalNoise'
                baseFrequency='0.014 0.04'
                numOctaves={2}
                seed={11}
              />
              <feComponentTransfer>
                <feFuncR type='table' tableValues='0 0 0 0.9 0 0 0 0' />
              </feComponentTransfer>
              <feColorMatrix
                type='matrix'
                values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.7 0 0 0 0'
              />
            </filter>
          </defs>
          <rect width='200' height='200' filter={`url(#${crystalFilterId})`} />
        </svg>
        <div className='liquid-core-sweep' />
        <div className='liquid-core-rim' />
        <div className='liquid-core-specular' />
      </div>

      <svg
        className='liquid-core-orbits'
        data-layer='front'
        viewBox='0 0 100 100'
        preserveAspectRatio='none'
      >
        {RING_ARCS.map((arc) => (
          <path
            key={arc.id}
            d={arc.front}
            className='liquid-core-fiber'
            stroke={`url(#${fiberGradientId})`}
            vectorEffect='non-scaling-stroke'
          />
        ))}
        <g className='liquid-core-glints'>
          {RING_ARCS.map((arc) => (
            <path
              key={arc.id}
              d={arc.front}
              className='liquid-core-glint'
              pathLength={100}
              vectorEffect='non-scaling-stroke'
            />
          ))}
        </g>
      </svg>

      <div className='liquid-core-cards'>
        {ORBIT_LANES.map((lane, index) => (
          <div
            key={lane.id}
            ref={(element) => {
              cardRefs.current[index] = element
            }}
            className='liquid-core-card'
            data-depth='mid'
          >
            <div className='liquid-core-tile'>
              <lane.Logo size='1em' />
            </div>
          </div>
        ))}
      </div>

      <div className='liquid-core-motes'>
        {MOTE_IDS.map((id) => (
          <span key={id} className='liquid-core-mote' />
        ))}
      </div>
    </div>
  )
}
