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

import { HeroJadePanel } from '../hero-jade-panel'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()

  return (
    <section className='relative z-10 flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16'>
      {/* 金晕：暮光金自标题后方漫射 */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10 opacity-70'
        style={{
          background: [
            'radial-gradient(ellipse 60% 45% at 50% 22%, rgba(200,155,88,0.17) 0%, transparent 65%)',
            'radial-gradient(ellipse 45% 35% at 50% 78%, rgba(138,98,42,0.10) 0%, transparent 60%)',
          ].join(', '),
        }}
      />
      {/* 可读性纱幕：标题区收一层暖夜色 */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_28%,rgba(12,10,8,0.45),transparent_72%)]'
      />

      <div className='mx-auto flex w-full max-w-4xl flex-col items-center text-center'>
        <div
          className='landing-animate-fade-up mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#C89B58]/25 bg-[#C89B58]/[0.06] px-3 py-1.5 text-[11px] font-medium tracking-[0.18em] text-[#D8BC85] opacity-0 shadow-[0_0_18px_rgba(200,155,88,0.12)]'
          style={{ animationDelay: '0ms' }}
        >
          <span className='relative flex size-1.5'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C89B58] opacity-60' />
            <span className='relative inline-flex size-1.5 rounded-full bg-[#C89B58]' />
          </span>
          <span>{t('AI Application Infrastructure Foundation')}</span>
        </div>

        <h1
          className='landing-animate-fade-up text-[clamp(2.9rem,7vw,5.4rem)] leading-[1.06] font-bold tracking-tight opacity-0'
          style={{ animationDelay: '60ms' }}
        >
          {t('Unified API Gateway for')}
          <br />
          <span className='bg-gradient-to-r from-[#F2E2B6] via-[#DDBE82] to-[#9A6B2F] bg-clip-text text-transparent drop-shadow-[0_0_44px_rgba(200,155,88,0.4)]'>
            {t('Vast Range of AI Models')}
          </span>
        </h1>

        <p
          className='landing-animate-fade-up text-muted-foreground/85 mt-6 max-w-xl text-base leading-relaxed opacity-0 md:text-lg'
          style={{ animationDelay: '120ms' }}
        >
          {t(
            'Access a vast selection of models via a standard, unified API protocol. Power AI applications, manage digital assets, and connect the Future.'
          )}
        </p>

        <div
          className='landing-animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3 opacity-0'
          style={{ animationDelay: '180ms' }}
        >
          {props.isAuthenticated ? (
            <Button
              className='group h-11 rounded-lg px-6 text-sm font-medium'
              render={<Link to='/dashboard' />}
            >
              {t('Go to Dashboard')}
              <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Button>
          ) : (
            <>
              <Button
                className='group h-11 rounded-lg px-6 text-sm font-medium'
                render={<Link to='/sign-up' />}
              >
                {t('Get Started')}
                <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
              <Button
                variant='outline'
                className='border-border hover:border-border hover:bg-muted/50 h-11 rounded-lg px-6 text-sm font-medium'
                render={<Link to='/pricing' />}
              >
                {t('View Pricing')}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 玉石信息面板：产品主视觉，悬于天宫云海之上 */}
      <div
        className='landing-animate-fade-up mt-16 w-full opacity-0 md:mt-20'
        style={{ animationDelay: '300ms' }}
      >
        <HeroJadePanel />
      </div>
    </section>
  )
}
