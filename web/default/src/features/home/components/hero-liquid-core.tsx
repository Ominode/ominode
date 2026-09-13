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
import { useEffect, useId, useRef, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

/**
 * Liquid Glass Intelligence Core — 首页右侧主视觉。
 *
 * 中心是一段在灰色摄影棚背景上渲染的虹彩液态玻璃循环视频。灰底用 SVG 抠像
 * 滤镜（下方 `matte`）按「与灰底的亮度偏差 + 色度」生成 alpha 去掉，所以球体
 * 能以普通合成叠在湖光雪山上，明暗主题都成立。没有用 mix-blend-mode：hero 与
 * 核心的入场动画都会建立隔离的层叠上下文，混合模式碰不到背景图。
 *
 * 五个模型 Logo 静止、等距地排成一圈，贴着球体外沿，并由一条同半径的细光环
 * 串起来。圈的半径在 CSS 里由球体半径 + 间隙 + 半个卡片宽度算出，所以球体与
 * 卡片尺寸怎么缩放，Logo 都不会压到球体上。没有逐帧 JS：视频离开视口时暂停，
 * prefers-reduced-motion 下不播放、停在首帧海报。模型 Logo 直接深引用
 * @lobehub/icons 的单个组件，避免把整个图标库打进首页。
 */

type RingLogo = {
  id: string
  Logo: typeof ClaudeColor
}

const RING_LOGOS: RingLogo[] = [
  { id: 'openai', Logo: OpenAIMono },
  { id: 'claude', Logo: ClaudeColor },
  { id: 'gemini', Logo: GeminiColor },
  { id: 'meta', Logo: MetaColor },
  { id: 'deepseek', Logo: DeepSeekColor },
]

// 从正上方开始，顺时针等距排布
const RING_POSITIONS = RING_LOGOS.map((logo, index) => {
  const angle = -Math.PI / 2 + (index / RING_LOGOS.length) * Math.PI * 2
  return {
    ...logo,
    style: {
      '--ring-cos': Math.cos(angle).toFixed(4),
      '--ring-sin': Math.sin(angle).toFixed(4),
    } as CSSProperties,
  }
})

const MOTE_IDS = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7']

const SPHERE_VIDEO_SRC = '/media/ominode-glass-sphere.mp4'
const SPHERE_POSTER_SRC = '/media/ominode-glass-sphere-poster.webp'

type HeroLiquidCoreProps = {
  className?: string
}

export function HeroLiquidCore(props: HeroLiquidCoreProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const matteFilterId = `${useId().replaceAll(/[^a-zA-Z0-9_-]/g, '')}-matte`

  useEffect(() => {
    const stage = stageRef.current
    const video = videoRef.current
    if (!stage || !video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // 自动播放可能被浏览器拒绝（省流量模式等）；那时停在海报帧即可
    video.muted = true
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => undefined)
        return
      }
      video.pause()
    })
    visibilityObserver.observe(stage)

    return () => {
      visibilityObserver.disconnect()
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
      <div className='liquid-core-ring' />

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

      <div className='liquid-core-cards'>
        {RING_POSITIONS.map((logo) => (
          <div key={logo.id} className='liquid-core-card' style={logo.style}>
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
