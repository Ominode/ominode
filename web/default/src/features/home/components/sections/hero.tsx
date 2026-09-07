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
    <section className='relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden bg-transparent px-6 pt-24 pb-16'>
      <div className='relative mx-auto flex w-full max-w-6xl flex-col items-start text-left'>
        <div
          className='landing-animate-fade-up text-primary mb-6 text-xs font-semibold tracking-[0.22em] uppercase opacity-0'
          style={{ animationDelay: '0ms' }}
        >
          {t('The Leading LLM API Aggregator')}
        </div>

        <h1
          className='landing-animate-fade-up text-foreground max-w-3xl text-[clamp(2.8rem,6vw,5rem)] leading-[1.06] font-bold tracking-tight opacity-0'
          style={{ animationDelay: '60ms' }}
        >
          {t('One Platform.')}
          <br />
          <span className='text-primary'>
            {t('All Leading Models.')}
          </span>
        </h1>

        <p
          className='landing-animate-fade-up text-muted-foreground mt-6 max-w-xl text-base leading-relaxed font-medium opacity-0 md:text-lg'
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
                className='h-12 rounded-lg border-border bg-background/70 px-7 text-sm font-semibold backdrop-blur hover:bg-accent'
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
