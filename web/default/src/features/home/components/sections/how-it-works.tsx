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

export function HowItWorks() {
  const { t } = useTranslation()

  // 序号也要随语言切换：中文用大写数字，日文用大字，拉丁语系用罗马数字。
  const steps = [
    {
      id: 'configure',
      num: t('landing.howItWorks.step1'),
      title: t('Configure'),
      desc: t(
        'Add your API keys, set up channels and configure access permissions'
      ),
    },
    {
      id: 'connect',
      num: t('landing.howItWorks.step2'),
      title: t('Connect'),
      desc: t(
        'Connect through OpenAI, Claude, Gemini, and other compatible API routes'
      ),
    },
    {
      id: 'monitor',
      num: t('landing.howItWorks.step3'),
      title: t('Monitor'),
      desc: t('Track usage, costs and performance with real-time analytics'),
    },
  ]

  return (
    <section className='relative z-10 border-t border-slate-900/10 dark:border-white/10 px-6 py-28 md:py-40'>
      <div className='mx-auto max-w-5xl'>
        <AnimateInView className='mb-20 text-center md:mb-24'>
          <h2 className='text-3xl font-bold tracking-tight text-[#16213E] dark:text-slate-100 md:text-5xl'>
            {t('Three steps to get started')}
          </h2>
        </AnimateInView>

        <div className='grid gap-16 md:grid-cols-3 md:gap-12'>
          {steps.map((step, i) => (
            <AnimateInView
              key={step.id}
              delay={i * 150}
              animation='fade-up'
              className='relative flex flex-col items-center text-center'
            >
              <span className='mb-6 font-serif text-5xl font-medium text-[#7C5CFC]/30 dark:text-[#a78bfa]/40'>
                {step.num}
              </span>{' '}
              <h3 className='mb-3 font-serif text-lg font-medium tracking-[0.12em] text-[#16213E] dark:text-slate-100'>
                {step.title}
              </h3>
              <p className='max-w-[260px] text-sm leading-relaxed text-[#44547A] dark:text-slate-400'>
                {step.desc}
              </p>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
