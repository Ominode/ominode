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
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

/**
 * 玉石信息面板 — the homepage product preview rendered as a slab of
 * translucent green-jade set in a 鎏金 frame, floating over the Tiān Gōng
 * scene. The jade texture (glass, inner glow, corner ornaments, float
 * animation) lives in theme-celestial.css under the `.hero-jade-*` classes;
 * only layout and content live here.
 */
interface Channel {
  name: string
  dot: string
}

const CHANNELS: Channel[] = [
  { name: 'OpenAI', dot: 'bg-[#C89B58]' },
  { name: 'Claude', dot: 'bg-[#E2A88F]' },
  { name: 'Gemini', dot: 'bg-[#8FB5AE]' },
  { name: 'DeepSeek', dot: 'bg-[#6FA8A0]' },
  { name: 'Qwen', dot: 'bg-[#D8C48A]' },
  { name: 'Llama', dot: 'bg-[#A8C4BF]' },
]

interface HeroJadePanelProps {
  className?: string
}

export function HeroJadePanel(props: HeroJadePanelProps) {
  const { t } = useTranslation()

  const metrics = [
    { label: t('Requests'), value: '2,431', unit: '/s' },
    { label: t('Latency'), value: '128', unit: 'ms' },
    { label: t('Throughput'), value: '∞', unit: '' },
  ]

  return (
    <div className={cn('mx-auto w-full max-w-[520px]', props.className)}>
      <div className='hero-jade-slab'>
        {/* 鎏金四角 */}
        <span className='hero-jade-corner hero-jade-corner-tl' aria-hidden />
        <span className='hero-jade-corner hero-jade-corner-tr' aria-hidden />
        <span className='hero-jade-corner hero-jade-corner-bl' aria-hidden />
        <span className='hero-jade-corner hero-jade-corner-br' aria-hidden />

        {/* 面板首行：玉牌名 + 朱砂印 */}
        <div className='flex items-center justify-between border-b border-[rgba(200,155,88,0.16)] px-6 py-4'>
          <div className='flex items-center gap-3'>
            <div className='hero-jade-seal'>天</div>
            <div>
              <div className='font-serif text-[15px] font-medium tracking-[0.18em] text-[#E9D9B8]'>
                ominode
              </div>
              <div className='mt-0.5 text-[10px] font-medium tracking-[0.3em] text-[#C89B58]/70 uppercase'>
                {t('AI Gateway')}
              </div>
            </div>
          </div>
          <div className='hero-jade-cinnabar' aria-hidden>
            云上
          </div>
        </div>

        {/* 模型通道 */}
        <div className='px-6 pt-5'>
          <div className='flex items-center justify-between'>
            <span className='text-[10px] font-semibold tracking-[0.22em] text-[#C89B58]/70 uppercase'>
              {t('Models')}
            </span>
            <span className='flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-[#8FB5AE]'>
              <span className='relative flex size-1.5'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6FA8A0] opacity-60' />
                <span className='relative inline-flex size-1.5 rounded-full bg-[#6FA8A0]' />
              </span>
              {t('Online')}
            </span>
          </div>
          <div className='mt-3.5 grid grid-cols-2 gap-2'>
            {CHANNELS.map((channel) => (
              <div
                key={channel.name}
                className='flex items-center gap-2.5 rounded-lg border border-[rgba(200,155,88,0.14)] bg-[rgba(255,255,255,0.02)] px-3 py-2'
              >
                <span
                  className={cn(
                    'size-1.5 shrink-0 rounded-full',
                    channel.dot
                  )}
                />
                <span className='text-xs font-medium text-[#E9D9B8]'>
                  {channel.name}
                </span>
                <span className='ml-auto text-[9px] tracking-[0.18em] text-[#C89B58]/50 uppercase'>
                  200
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 实时指标 */}
        <div className='mt-5 grid grid-cols-3 gap-2 border-t border-[rgba(200,155,88,0.14)] px-6 pt-4 pb-2'>
          {metrics.map((metric) => (
            <div key={metric.label} className='flex flex-col'>
              <span className='font-serif text-lg leading-none font-medium tracking-[0.1em] text-[#E4C98F]'>
                {metric.value}
                {metric.unit && (
                  <span className='ml-0.5 text-[10px] tracking-[0.12em] text-[#C89B58]/60'>
                    {metric.unit}
                  </span>
                )}
              </span>
              <span className='mt-1.5 text-[9px] tracking-[0.2em] text-[#8A9388]/80 uppercase'>
                {metric.label}
              </span>
            </div>
          ))}
        </div>

        {/* 今日负载 */}
        <div className='px-6 pt-3 pb-5'>
          <div className='flex items-center justify-between text-[9px] tracking-[0.2em] text-[#C89B58]/55 uppercase'>
            <span>{t('Quota')} · {t('Today')}</span>
            <span className='tabular-nums'>67%</span>
          </div>
          <div className='mt-2 h-[3px] overflow-hidden rounded-full bg-[rgba(200,155,88,0.12)]'>
            <div className='h-full w-[67%] rounded-full bg-[linear-gradient(90deg,#8A622A,#C89B58)]' />
          </div>
        </div>

        {/* 尾行：状态 */}
        <div className='flex items-center justify-between border-t border-[rgba(200,155,88,0.14)] px-6 py-3'>
          <div className='text-[9px] font-medium tracking-[0.24em] text-[#C89B58]/60 uppercase'>
            ◆ {t('Status')}
          </div>
          <div className='flex items-center gap-1.5 text-xs text-[#8FB5AE]'>
            <span className='size-1.5 rounded-full bg-[#6FA8A0] shadow-[0_0_6px_rgba(111,168,160,0.8)]' />
            {t('Stable')}
          </div>
        </div>
      </div>
    </div>
  )
}
