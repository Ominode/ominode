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
import { useCallback, type SyntheticEvent } from 'react'

/**
 * 全屏背景层 — the bottom-most visual layer of the page.
 *
 * 三层从下到上：
 *   1. 模型星球静态场景 `models_bg.png`（object-cover 全屏铺满）；
 *   2. 背景视频（占位容器，素材放入 `public/media/ominode-tiangong.mp4` 即启用，
 *      未提供时 `<video>` 无帧渲染为透明，露出底下的 CG 场景）；
 *   3. 纱幕（veil），压住场景高光，保证叠加在场景上的文字始终可读：
 *      - `light`：固定亮纱，用于亮色设计的公开页（落地页/登录页）——这些页面
 *        无论明暗模式都使用深色文字；
 *      - `adaptive`：随主题切换（见 styles/index.css 的 `.models-bg-veil`）——
 *        亮色模式亮纱、暗色模式暗纱；夜色基调的 celestial-twilight preset 下
 *        恒为暗纱（见 styles/theme-celestial.css）。
 *
 * 背景层固定全屏、垫在所有内容之下（`-z-10`），移动端同样保持 cover 裁剪。
 */
const MODELS_BG_IMG = '/media/models_bg.png'
const TIANGONG_VIDEO_SRC = '/media/ominode-tiangong.mp4'

type BackgroundVideoProps = {
  variant: 'light' | 'adaptive'
}

export function BackgroundVideo(props: BackgroundVideoProps) {
  // 素材尚未提供时隐藏播放器，避免某些浏览器渲染出黑框占位。
  const handleError = useCallback((event: SyntheticEvent<HTMLVideoElement>) => {
    event.currentTarget.style.display = 'none'
  }, [])

  return (
    <div
      className='celestial-video-layer pointer-events-none fixed inset-0 -z-10 overflow-hidden'
      aria-hidden='true'
    >
      <img
        src={MODELS_BG_IMG}
        alt=''
        className='absolute inset-0 h-full w-full object-cover'
      />
      <video
        className='absolute inset-0 h-full w-full object-cover'
        autoPlay
        muted
        loop
        playsInline
        preload='auto'
        onError={handleError}
      >
        <source src={TIANGONG_VIDEO_SRC} type='video/mp4' />
      </video>
      <div
        className={
          props.variant === 'adaptive'
            ? 'models-bg-veil absolute inset-0'
            : 'models-bg-veil-light absolute inset-0'
        }
      />
    </div>
  )
}
