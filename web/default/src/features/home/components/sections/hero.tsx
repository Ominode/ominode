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
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

const HERO_BG_IMG = '/media/models_bg.png'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()

  return (
    <section className='relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-24 pb-16'>
      {/* 背景：models_bg.png 全屏铺满，模型星球主视觉位于画面右侧 */}
      <img
        src={HERO_BG_IMG}
        alt=''
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-center'
      />
      {/* 可读性纱幕：左侧提亮，保证标题在天空背景上始终可读 */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10'
        style={{
          background:
            'linear-gradient(to right, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.38) 38%, transparent 62%)',
        }}
      />

      <div className='mx-auto flex w-full max-w-6xl flex-col items-start text-left'>
        <div
          className='landing-animate-fade-up mb-6 text-[11px] font-semibold tracking-[0.28em] text-slate-500 uppercase opacity-0'
          style={{ animationDelay: '0ms' }}
        >
          {t('The Leading LLM API Aggregator')}
        </div>

        <h1
          className='landing-animate-fade-up text-[clamp(2.9rem,7vw,5.4rem)] leading-[1.06] font-bold tracking-tight text-[#16213E] opacity-0'
          style={{ animationDelay: '60ms' }}
        >
          {t('One Platform.')}
          <br />
          <span className='bg-gradient-to-r from-[#3B82F6] via-[#7C5CFC] to-[#C026D3] bg-clip-text text-transparent'>
            {t('All Leading Models.')}
          </span>
        </h1>

        <p
          className='landing-animate-fade-up mt-6 max-w-md text-base leading-relaxed text-slate-600 opacity-0 md:text-lg'
          style={{ animationDelay: '120ms' }}
        >
          {t(
            "Access the world's top AI models through a single API. More models, lower costs, faster innovation."
          )}
        </p>

        <div
          className='landing-animate-fade-up mt-9 flex flex-wrap items-center gap-3 opacity-0'
          style={{ animationDelay: '180ms' }}
        >
          {props.isAuthenticated ? (
            <Button
              className='group h-12 rounded-full border-0 bg-gradient-to-r from-[#3B82F6] to-[#A855F7] px-7 text-sm font-medium text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] hover:opacity-95'
              render={<Link to='/dashboard' />}
            >
              {t('Go to Dashboard')}
              <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Button>
          ) : (
            <>
              <Button
                className='group h-12 rounded-full border-0 bg-gradient-to-r from-[#3B82F6] to-[#A855F7] px-7 text-sm font-medium text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] hover:opacity-95'
                render={<Link to='/sign-up' />}
              >
                {t('Start Building')}
                <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
              <Button
                variant='outline'
                className='h-12 rounded-full border-white/60 bg-white/70 px-7 text-sm font-medium text-[#16213E] shadow-[0_4px_16px_rgba(15,23,42,0.08)] backdrop-blur hover:bg-white/90'
                render={<Link to='/pricing' />}
              >
                {t('View Models')}
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
