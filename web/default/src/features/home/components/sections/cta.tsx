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

import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  if (props.isAuthenticated) {
    return null
  }

  return (
    <section className='relative z-10 overflow-hidden px-6 py-28 md:py-44'>
      {/* 蓝紫光晕背景 */}
      <div
        aria-hidden
        className='absolute inset-0 -z-10 opacity-50'
        style={{
          background: [
            'radial-gradient(ellipse 50% 50% at 30% 50%, rgba(59,130,246,0.14) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 40% at 70% 40%, rgba(168,85,247,0.12) 0%, transparent 70%)',
          ].join(', '),
        }}
      />

      <AnimateInView
        className='mx-auto max-w-3xl text-center'
        animation='scale-in'
      >
        <h2 className='text-3xl leading-tight font-bold tracking-tight text-[#16213E] md:text-5xl'>
          {t('Ready to simplify')}
          <br />
          <span className='bg-gradient-to-r from-[#3B82F6] via-[#7C5CFC] to-[#C026D3] bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(124,92,252,0.25)]'>
            {t('your AI integration?')}
          </span>
        </h2>
        <p className='mx-auto mt-6 max-w-md text-base leading-relaxed text-[#44547A] md:text-lg'>
          {t(
            'Deploy your own gateway and start routing requests through your configured upstream services.'
          )}
        </p>
        <div className='mt-10 flex items-center justify-center gap-3'>
          <Button
            className='group h-11 rounded-lg px-6'
            render={<Link to='/sign-up' />}
          >
            {t('Get Started')}
            <ArrowRight className='ml-1 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Button>
          <Button
            variant='outline'
            className='h-11 rounded-lg border-white/60 bg-white/70 px-6 text-[#16213E] backdrop-blur hover:bg-white/90'
            render={<Link to='/pricing' />}
          >
            {t('View Pricing')}
          </Button>
        </div>
      </AnimateInView>
    </section>
  )
}
