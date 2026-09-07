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

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()

  return (
    <section className='relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-28 pb-16'>
      {/* 背景由全局 BackgroundVideo 层提供（models_bg.png 全屏铺满） */}
      <div className='mx-auto flex w-full max-w-6xl flex-col items-start text-left'>
        <div
          className='landing-animate-fade-up text-primary mb-6 text-xs font-semibold tracking-[0.22em] uppercase opacity-0'
          style={{ animationDelay: '0ms' }}
        >
          {t('The Leading LLM API Aggregator')}
        </div>

        <h1
          className='landing-animate-fade-up max-w-4xl text-[clamp(2.55rem,6vw,4.6rem)] leading-[1.08] font-semibold tracking-tight text-foreground opacity-0'
          style={{ animationDelay: '60ms' }}
        >
          {t('One Platform.')}
          <br />
          <span className='text-primary'>
            {t('All Leading Models.')}
          </span>
        </h1>

        <p
          className='landing-animate-fade-up text-muted-foreground mt-6 max-w-xl text-base leading-relaxed opacity-0 md:text-lg'
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
              className='group h-12 rounded-lg px-7 text-sm font-semibold shadow-lg shadow-primary/20'
              render={<Link to='/dashboard' />}
            >
              {t('Go to Dashboard')}
              <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Button>
          ) : (
            <>
              <Button
                className='group h-12 rounded-lg px-7 text-sm font-semibold shadow-lg shadow-primary/20'
                render={<Link to='/sign-up' />}
              >
                {t('Start Building')}
                <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
              <Button
                variant='outline'
                className='h-12 rounded-lg border-primary/30 bg-background/50 px-7 text-sm font-semibold backdrop-blur hover:bg-primary/10'
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
