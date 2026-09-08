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

import { AnimateInView } from '@/components/animate-in-view'

interface FeaturesProps {
  className?: string
}

export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()

  const features = [
    {
      id: 'fast',
      title: t('Lightning Fast'),
      desc: t(
        'Optimized network architecture ensures millisecond response times'
      ),
    },
    {
      id: 'secure',
      title: t('Secure & Reliable'),
      desc: t(
        'Enterprise-grade security with comprehensive permission management'
      ),
    },
    {
      id: 'global',
      title: t('Global Coverage'),
      desc: t('Multi-region deployment for stable global access'),
    },
    {
      id: 'developer',
      title: t('Developer Friendly'),
      desc: t('Compatible API routes for common AI application workflows'),
    },
  ]

  return (
    <section className='relative z-10 px-6 py-28 md:py-40'>
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='mx-auto mb-20 max-w-2xl text-center md:mb-28'>
          <h2 className='text-3xl leading-tight font-bold tracking-tight text-[#16213E] dark:text-slate-100 md:text-5xl'>
            {t('Built for developers,')}
            <br />
            <span className='bg-gradient-to-r from-[#3B82F6] via-[#7C5CFC] to-[#C026D3] bg-clip-text text-transparent'>
              {t('designed for scale')}
            </span>
          </h2>
        </AnimateInView>

        <div className='grid grid-cols-1 gap-x-12 gap-y-16 text-center sm:grid-cols-2 lg:grid-cols-4'>
          {features.map((f, i) => (
            <AnimateInView
              key={f.id}
              delay={i * 120}
              animation='fade-up'
              className='flex flex-col items-center'
            >
              <span className='mb-4 font-serif text-sm tracking-[0.3em] text-[#7C5CFC]/70'>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className='mb-3 font-serif text-lg font-medium tracking-[0.12em] text-[#16213E] dark:text-slate-100'>
                {f.title}
              </h3>
              <p className='max-w-[240px] text-sm leading-relaxed text-[#44547A] dark:text-slate-400'>
                {f.desc}
              </p>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
