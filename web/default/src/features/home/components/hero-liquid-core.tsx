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
 * 分层（由后到前）：光纤轨道后半段 → 液态玻璃球（循环视频）→ 光纤轨道前半段
 * → 模型玻璃卡片。
 *
 * 玻璃球是一段在灰色摄影棚背景上渲染的虹彩液态玻璃循环视频。灰底用 SVG 抠像
 * 滤镜（下方 `matte`）按「与灰底的亮度偏差 + 色度」生成 alpha 去掉，所以球体
 * 能以普通合成叠在湖光雪山上，明暗主题都成立。没有用 mix-blend-mode：hero、
 * 核心的入场与漂浮动画都会建立隔离的层叠上下文，混合模式根本碰不到背景图，
 * 而且以后任何祖先加上 transform / opacity 都会让灰底重新露出来。
 *
 * 卡片的椭圆公转（深度决定缩放、透明度与前后遮挡）由一个 requestAnimationFrame
 * 驱动；舞台离开视口时循环与视频一起暂停。prefers-reduced-motion 下卡片静止、
 * 视频不播放，只显示首帧海报。模型 Logo 直接深引用 @lobehub/icons 的单个组件，
 * 避免把整个图标库打进首页。
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

const SPHERE_VIDEO_SRC = '/media/ominode-glass-sphere.mp4'
const SPHERE_POSTER_SRC = '/media/ominode-glass-sphere-poster.webp'

// 移动端：所有卡片共用一条轨道、等距排布、同速公转 —— 彼此永不追越，保证不重叠。
const COMPACT_PERIOD = 34
const COMPACT_ORBIT = { radius: 0.42, tilt: 0.46, lift: 0 }
const TAU = Math.PI * 2

type HeroLiquidCoreProps = {
  className?: string
}

export function HeroLiquidCore(props: HeroLiquidCoreProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const svgId = useId().replaceAll(/[^a-zA-Z0-9_-]/g, '')
  const fiberGradientId = `${svgId}-fiber`
  const matteFilterId = `${svgId}-matte`

  useEffect(() => {
    const stage = stageRef.current
    const video = videoRef.current
    if (!stage || !video) return

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

    // 自动播放可能被浏览器拒绝（省流量模式等）；那时停在海报帧即可
    video.muted = true
    const tick = (now: number) => {
      render(now)
      frameId = requestAnimationFrame(tick)
    }

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !frameId) {
        frameId = requestAnimationFrame(tick)
        video.play().catch(() => undefined)
        return
      }
      if (!entry.isIntersecting) {
        cancelAnimationFrame(frameId)
        frameId = 0
        video.pause()
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
      video.pause()
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
          {/*
            抠掉视频的灰色摄影棚背景（sRGB 约 0.72）：
            dev.R = 比灰底亮的部分（高光），dev.G = 比灰底暗的部分（边缘/阴影），
            dev.B 与 cool.R/G = 色度（虹彩）。几路相加得到 alpha 蒙版，
            灰底附近 0.66–0.76 的亮度区间为死区，彻底透明。
          */}
          <filter
            id={matteFilterId}
            x='0'
            y='0'
            width='100%'
            height='100%'
            colorInterpolationFilters='sRGB'
          >
            <feColorMatrix
              in='SourceGraphic'
              type='matrix'
              result='dev'
              values='1.8 3.54 0.66 0 -4.56  -1.8 -3.54 -0.66 0 3.96  5 0 -5 0 0  0 0 0 1 0'
            />
            <feColorMatrix
              in='SourceGraphic'
              type='matrix'
              result='cool'
              values='-5 0 5 0 0  0 5 -5 0 0  0 0 0 0 0  0 0 0 1 0'
            />
            <feColorMatrix
              in='dev'
              type='matrix'
              result='devAlpha'
              values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 1 1 0 0'
            />
            <feColorMatrix
              in='cool'
              type='matrix'
              result='coolAlpha'
              values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 1 0 0 0'
            />
            <feComposite
              in='devAlpha'
              in2='coolAlpha'
              operator='arithmetic'
              k1='0'
              k2='1'
              k3='1'
              k4='0'
              result='matte'
            />
            <feComposite in='SourceGraphic' in2='matte' operator='in' />
          </filter>
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
        <video
          ref={videoRef}
          className='liquid-core-sphere'
          src={SPHERE_VIDEO_SRC}
          poster={SPHERE_POSTER_SRC}
          muted
          loop
          playsInline
          preload='auto'
          style={{ filter: `url(#${matteFilterId})` }}
        />
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
