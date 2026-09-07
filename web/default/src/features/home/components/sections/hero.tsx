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
    <section className='relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[#f4f8ff] px-6 pt-24 pb-16 text-[#17345c]'>
      <img
        src='/media/AI_webpage-bg.png'
        alt=''
        aria-hidden='true'
        className='absolute inset-y-0 right-0 h-full w-full object-cover object-right opacity-90 lg:w-[64%]'
      />
      <div
        aria-hidden='true'
        className='absolute inset-0 bg-gradient-to-r from-[#f4f8ff] via-[#f4f8ff]/95 to-[#f4f8ff]/10 lg:from-[#f4f8ff] lg:via-[#f4f8ff]/92 lg:to-transparent'
      />
      <div className='relative mx-auto flex w-full max-w-6xl flex-col items-start text-left'>
        <div
          className='landing-animate-fade-up mb-6 text-xs font-semibold tracking-[0.22em] text-[#52709a] uppercase opacity-0'
          style={{ animationDelay: '0ms' }}
        >
          {t('The Leading LLM API Aggregator')}
        </div>

        <h1
          className='landing-animate-fade-up max-w-3xl text-[clamp(2.8rem,6vw,5rem)] leading-[1.06] font-bold tracking-tight text-[#17345c] opacity-0'
          style={{ animationDelay: '60ms' }}
        >
          {t('One Platform.')}
          <br />
          <span className='bg-gradient-to-r from-[#3B82F6] via-[#7C5CFC] to-[#C026D3] bg-clip-text text-transparent'>
            {t('All Leading Models.')}
          </span>
        </h1>

        <p
          className='landing-animate-fade-up mt-6 max-w-xl text-base leading-relaxed font-medium text-[#52709a] opacity-0 md:text-lg'
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
              className='group h-12 rounded-full border-0 bg-gradient-to-r from-[#28a8ef] to-[#a66af2] px-7 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(72,135,232,0.28)] hover:brightness-105'
              render={<Link to='/dashboard' />}
            >
              {t('Go to Dashboard')}
              <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Button>
          ) : (
            <>
              <Button
                className='group h-12 rounded-full border-0 bg-gradient-to-r from-[#28a8ef] to-[#a66af2] px-7 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(72,135,232,0.28)] hover:brightness-105'
                render={<Link to='/sign-up' />}
              >
                {t('Start Building')}
                <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
              <Button
                variant='outline'
                className='h-12 rounded-full border-[#9ab3d1] bg-white/75 px-7 text-sm font-semibold text-[#17345c] shadow-[0_4px_16px_rgba(35,70,110,0.10)] backdrop-blur hover:bg-white'
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
