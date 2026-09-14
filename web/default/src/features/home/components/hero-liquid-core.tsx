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
import GrokMono from '@lobehub/icons/es/Grok/components/Mono'
import MetaColor from '@lobehub/icons/es/Meta/components/Color'
import OpenAIMono from '@lobehub/icons/es/OpenAI/components/Mono'
import QwenColor from '@lobehub/icons/es/Qwen/components/Color'
import { useEffect, useId, useRef, type ComponentType } from 'react'

import { cn } from '@/lib/utils'

/**
 * Liquid Glass Intelligence Core — 首页右侧主视觉。
 *
 * 中心是一段在灰色摄影棚背景上渲染的虹彩液态玻璃循环视频。灰底用 SVG 抠像
 * 滤镜（下方 `matte`）按「与灰底的亮度偏差 + 色度」生成 alpha 去掉，所以球体
 * 能以普通合成叠在湖光雪山上，明暗主题都成立。没有用 mix-blend-mode：hero 与
 * 核心的入场动画都会建立隔离的层叠上下文，混合模式碰不到背景图。
 *
 * 八个模型 Logo 在同一条倾斜的椭圆轨道上等距排布、同速匀速公转：转到前方时
 * 放大、变亮并挡在球体前面，转到后方时缩小、变淡并被球体遮住；轨道线也分成
 * 后半段（球体之后）与前半段（球体之前）两层。因为同速且等距（相隔 45°），
 * 卡片之间永远不会追越；轨道倾角取到让相邻卡片在任何角度都不重叠。
 *
 * 轨道尺寸只在 CSS 里定义（球体半径 + 间隙 + 约半个卡片对角线），JS 仅在尺寸
 * 变化时读取一次轨道线的实际宽高，逐帧只写 transform / opacity。舞台离开视口时
 * 动画与视频一起暂停；prefers-reduced-motion 下卡片静止、视频停在首帧海报。
 * 模型 Logo 直接深引用 @lobehub/icons 的单个组件，避免把整个图标库打进首页；
 * Kimi 用的是新版「K + 蓝色气泡」标志，图标库里没有，所以在本文件内联 SVG。
 */

type OrbitLogo = {
  id: string
  Logo: ComponentType<{ size?: number | string }>
}

/** Kimi 新版标志：K 字随主题取 currentColor，气泡保持品牌蓝 */
function KimiLogo(props: { size?: number | string }) {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox='25 24 550 550'
      xmlns='http://www.w3.org/2000/svg'
      style={{ flex: 'none', lineHeight: 1 }}
    >
      <title>Kimi</title>
      <path fill='currentColor' d='M30 68h93v483H30z' />
      <path
        fill='currentColor'
        d='M322 68h104l-65 144q-21 44-60 44h55v27a65 65 0 0 1-65 65H122v-92h116z'
      />
      <path fill='currentColor' d='M353 551h92V350a92 94 0 0 0-92-94z' />
      <path
        fill='#027AFF'
        d='M466 161l15-19c-11-12-15-26-15-42 0-33 23-53 52-53s51 20 51 53c0 38-20 58-59 59z'
      />
    </svg>
  )
}

const ORBIT_LOGOS: OrbitLogo[] = [
  { id: 'openai', Logo: OpenAIMono },
  { id: 'claude', Logo: ClaudeColor },
  { id: 'gemini', Logo: GeminiColor },
  { id: 'qwen', Logo: QwenColor },
  { id: 'meta', Logo: MetaColor },
  { id: 'deepseek', Logo: DeepSeekColor },
  { id: 'grok', Logo: GrokMono },
  { id: 'kimi', Logo: KimiLogo },
]

/** 公转一周的秒数，所有 Logo 共用 */
const ORBIT_PERIOD = 24
const TAU = Math.PI * 2

const MOTE_IDS = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7']

const SPHERE_VIDEO_SRC = '/media/ominode-glass-sphere.mp4'
const SPHERE_POSTER_SRC = '/media/ominode-glass-sphere-poster.webp'

type HeroLiquidCoreProps = {
  className?: string
}

export function HeroLiquidCore(props: HeroLiquidCoreProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const orbitRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const matteFilterId = `${useId().replaceAll(/[^a-zA-Z0-9_-]/g, '')}-matte`

  useEffect(() => {
    const stage = stageRef.current
    const video = videoRef.current
    const orbit = orbitRef.current
    if (!stage || !video || !orbit) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const startedAt = performance.now()

    let radiusX = orbit.offsetWidth / 2
    let radiusY = orbit.offsetHeight / 2
    let frameId = 0

    const placeLogos = (now: number) => {
      const turn = ((now - startedAt) / 1000 / ORBIT_PERIOD) * TAU
      cardRefs.current.forEach((card, index) => {
        if (!card) return

        // 从正前方开始，按 Logo 数量等距排布
        const angle = Math.PI / 2 + (index / ORBIT_LOGOS.length) * TAU + turn
        const depth = Math.sin(angle)
        const nearness = (depth + 1) / 2
        const x = Math.cos(angle) * radiusX
        const y = depth * radiusY
        const scale = 0.78 + nearness * 0.3

        card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`
        card.style.opacity = (0.55 + nearness * 0.45).toFixed(3)

        // 前半圈在球体（z-index 20）之前，后半圈在其后
        const zIndex = depth > 0 ? '30' : '10'
        if (card.style.zIndex !== zIndex) card.style.zIndex = zIndex

        let layer = 'mid'
        if (depth < -0.4) layer = 'back'
        else if (depth > 0.4) layer = 'front'
        if (card.dataset.depth !== layer) card.dataset.depth = layer
      })
    }

    const resizeObserver = new ResizeObserver(() => {
      radiusX = orbit.offsetWidth / 2
      radiusY = orbit.offsetHeight / 2
      if (reducedMotion) placeLogos(startedAt)
    })
    resizeObserver.observe(stage)

    if (reducedMotion) {
      placeLogos(startedAt)
      return () => resizeObserver.disconnect()
    }

    // 自动播放可能被浏览器拒绝（省流量模式等）；那时停在海报帧即可
    video.muted = true
    const tick = (now: number) => {
      placeLogos(now)
      frameId = requestAnimationFrame(tick)
    }

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!frameId) frameId = requestAnimationFrame(tick)
        video.play().catch(() => undefined)
        return
      }
      cancelAnimationFrame(frameId)
      frameId = 0
      video.pause()
    })
    visibilityObserver.observe(stage)

    return () => {
      cancelAnimationFrame(frameId)
      visibilityObserver.disconnect()
      resizeObserver.disconnect()
      video.pause()
    }
  }, [])

  return (
    <div
      ref={stageRef}
      className={cn('liquid-core-stage aspect-square w-full', props.className)}
      aria-hidden='true'
    >
      <svg className='liquid-core-defs' width='0' height='0' focusable='false'>
        <defs>
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
      </svg>

      <div className='liquid-core-ambient' />
      <div ref={orbitRef} className='liquid-core-orbit' data-half='back' />

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

      <div className='liquid-core-orbit' data-half='front' />

      <div className='liquid-core-cards'>
        {ORBIT_LOGOS.map((logo, index) => (
          <div
            key={logo.id}
            ref={(element) => {
              cardRefs.current[index] = element
            }}
            className='liquid-core-card'
            data-depth='mid'
          >
            <div className='liquid-core-tile'>
              <logo.Logo size='1em' />
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
