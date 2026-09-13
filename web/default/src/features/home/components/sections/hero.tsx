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

import { HeroLiquidCore } from '../hero-liquid-core'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()

  // 不设底色：整屏高的 hero 若铺不透明底，会把背景层遮成「首屏无图、下滑才有图」。
  // 大屏上文字列按内容收窄（最多 36rem），其余宽度全部留给玻璃球；舞台高度不超过
  // 一屏。手机上球体在文字下方，向两侧页边距各借 1.25rem。
  // 首屏入场顺序：eyebrow → 标题 → 描述 → 按钮 → 玻璃球 → Logo 圈，总时长约 1s。
  return (
    <section className='relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-24 pb-16 text-(--landing-ink)'>
      <div className='relative mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[fit-content(36rem)_minmax(0,1fr)] lg:gap-8'>
        <div className='flex flex-col items-start text-left'>
          <div className='landing-animate-rise landing-eyebrow mb-6'>
            {t('The Leading LLM API Aggregator')}
          </div>

          <h1
            className='landing-animate-rise landing-display max-w-3xl text-[clamp(2.7rem,6vw,5rem)] lg:text-[clamp(2.6rem,3.9vw,3.75rem)]'
            style={{ animationDelay: '70ms' }}
          >
            {t('One Platform.')}
            <br />
            <span className='landing-headline-flow bg-clip-text text-transparent'>
              {t('All Leading Models.')}
            </span>
          </h1>

          <p
            className='landing-animate-rise landing-lede mt-6 max-w-[34rem] text-base md:text-lg lg:max-w-[30rem]'
            style={{ animationDelay: '140ms' }}
          >
            {t(
              "Access the world's top AI models through a single API. More models, lower costs, faster innovation."
            )}
          </p>

          <div
            className='landing-animate-rise mt-9 flex flex-wrap items-center gap-3'
            style={{ animationDelay: '210ms' }}
          >
            {props.isAuthenticated ? (
              <Button
                className='landing-cta-primary group h-12 rounded-full border-0 px-7 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(72,135,232,0.28)] hover:brightness-105'
                render={<Link to='/dashboard' />}
              >
                {t('Go to Dashboard')}
                <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
            ) : (
              <>
                <Button
                  className='landing-cta-primary group h-12 rounded-full border-0 px-7 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(72,135,232,0.28)] hover:brightness-105'
                  render={<Link to='/sign-up' />}
                >
                  {t('Start Building')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                <Button
                  variant='outline'
                  className='landing-cta-secondary h-12 rounded-full border-[#9ab3d1] bg-white/75 px-7 text-sm font-semibold text-(--landing-ink) shadow-[0_4px_16px_rgba(35,70,110,0.10)] backdrop-blur hover:bg-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20'
                  render={<Link to='/pricing' />}
                >
                  {t('View Models')}
                </Button>
              </>
            )}
          </div>
        </div>

        <HeroLiquidCore className='-mx-5 w-[calc(100%+2.5rem)] max-w-none sm:mx-auto sm:w-full sm:max-w-[640px] lg:max-w-[min(100%,calc(100svh_-_10rem))]' />
      </div>

      <div aria-hidden='true' className='landing-lake-shimmer' />
    </section>
  )
}
