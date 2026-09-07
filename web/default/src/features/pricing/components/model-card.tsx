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
import { ChevronRight, Copy } from 'lucide-react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { StatusBadge } from '@/components/status-badge'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { getLobeIcon } from '@/lib/lobe-icon'
import { cn } from '@/lib/utils'

import { DEFAULT_TOKEN_UNIT } from '../constants'
import {
  getDynamicDisplayGroupRatio,
  getDynamicPricingSummary,
} from '../lib/dynamic-price'
import { parseTags } from '../lib/filters'
import { isTokenBasedModel } from '../lib/model-helpers'
import { formatPrice, formatRequestPrice } from '../lib/price'
import type { PricingModel, TokenUnit } from '../types'
import { ModelPerfBadge, type ModelPerfBadgeData } from './model-perf-badge'

export interface ModelCardProps {
  model: PricingModel
  onClick: () => void
  priceRate?: number
  usdExchangeRate?: number
  tokenUnit?: TokenUnit
  showRechargePrice?: boolean
  perf?: ModelPerfBadgeData
}

export const ModelCard = memo(function ModelCard(props: ModelCardProps) {
  const { t } = useTranslation()
  const { copyToClipboard } = useCopyToClipboard()
  const tokenUnit = props.tokenUnit ?? DEFAULT_TOKEN_UNIT
  const priceRate = props.priceRate ?? 1
  const usdExchangeRate = props.usdExchangeRate ?? 1
  const showRechargePrice = props.showRechargePrice ?? false
  const isTokenBased = isTokenBasedModel(props.model)
  const tokenUnitLabel = tokenUnit === 'K' ? '1K' : '1M'
  const tags = parseTags(props.model.tags)
  const groups = props.model.enable_groups || []
  const endpoints = props.model.supported_endpoint_types || []
  const modelIconKey = props.model.icon || props.model.vendor_icon
  const modelIcon = modelIconKey ? getLobeIcon(modelIconKey, 28) : null
  const initial = props.model.model_name?.charAt(0).toUpperCase() || '?'
  const isDynamicPricing =
    props.model.billing_mode === 'tiered_expr' &&
    Boolean(props.model.billing_expr)
  const hasCachedPrice = isTokenBased && props.model.cache_ratio != null
  const dynamicSummary = isDynamicPricing
    ? getDynamicPricingSummary(props.model, {
        tokenUnit,
        showRechargePrice,
        priceRate,
        usdExchangeRate,
        groupRatioMultiplier: getDynamicDisplayGroupRatio(props.model),
      })
    : null

  const primaryGroup = groups[0]
  const bottomTags = [...endpoints.slice(0, 2), ...tags.slice(0, 2)]
  const hiddenCount =
    Math.max(groups.length - 1, 0) +
    Math.max(endpoints.length - 2, 0) +
    Math.max(tags.length - 2, 0)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    copyToClipboard(props.model.model_name || '')
  }

  return (
    <div
      className={cn(
        'group relative flex min-h-[15rem] flex-col rounded-xl border border-[#9ab3d1]/55 bg-white/78 p-4 shadow-[0_12px_30px_-20px_rgba(35,70,110,0.45)] backdrop-blur-md transition-all sm:p-5',
        'hover:-translate-y-0.5 hover:border-[#6f97c6] hover:bg-white/90'
      )}
    >
      {/* Header: icon + name + price + actions */}
      <div className='flex items-start justify-between gap-2.5 sm:gap-3'>
        <div className='flex min-w-0 items-start gap-2.5 sm:gap-3'>
          <div className='flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#9ab3d1]/45 bg-[#edf5ff] text-[#3768a3] sm:size-12'>
            {modelIcon || (
              <span className='text-base font-bold'>
                {initial}
              </span>
            )}
          </div>
          <div className='min-w-0'>
            <h3 className='truncate font-mono text-base leading-snug font-bold text-[#17345c]'>
              {props.model.model_name}
            </h3>
            <div className='mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs sm:mt-1 sm:gap-x-3'>
              {dynamicSummary ? (
                dynamicSummary.isSpecialExpression ? (
                  <span className='min-w-0'>
                    <span className='text-amber-700 dark:text-amber-300'>
                      {t('Special billing expression')}
                    </span>
                    <code className='text-muted-foreground/70 mt-0.5 line-clamp-1 block font-mono text-[11px] break-all'>
                      {dynamicSummary.rawExpression}
                    </code>
                  </span>
                ) : dynamicSummary.primaryEntries.length > 0 ? (
                  <>
                    {dynamicSummary.primaryEntries.map((entry) => (
                      <span
                        key={entry.key}
                        className='whitespace-nowrap text-[#52709a]'
                      >
                        {t(entry.shortLabel)}{' '}
                        <span className='font-mono font-semibold text-[#17345c]'>
                          {entry.formatted}
                        </span>
                        /{tokenUnitLabel}
                      </span>
                    ))}
                  </>
                ) : (
                  <span className='text-[#52709a] text-xs'>
                    {t('Dynamic Pricing')}
                  </span>
                )
              ) : isTokenBased ? (
                <>
                  <span className='whitespace-nowrap text-[#52709a]'>
                    {t('Input')}{' '}
                    <span className='font-mono font-semibold text-[#17345c]'>
                      {formatPrice(
                        props.model,
                        'input',
                        tokenUnit,
                        showRechargePrice,
                        priceRate,
                        usdExchangeRate
                      )}
                    </span>
                    /{tokenUnitLabel}
                  </span>
                  <span className='whitespace-nowrap text-[#52709a]'>
                    {t('Output')}{' '}
                    <span className='font-mono font-semibold text-[#17345c]'>
                      {formatPrice(
                        props.model,
                        'output',
                        tokenUnit,
                        showRechargePrice,
                        priceRate,
                        usdExchangeRate
                      )}
                    </span>
                    /{tokenUnitLabel}
                  </span>
                  {hasCachedPrice && (
                    <span className='whitespace-nowrap text-[#7893b3]'>
                      {t('Cached')}{' '}
                      <span className='font-mono'>
                        {formatPrice(
                          props.model,
                          'cache',
                          tokenUnit,
                          showRechargePrice,
                          priceRate,
                          usdExchangeRate
                        )}
                      </span>
                    </span>
                  )}
                </>
              ) : (
                <span className='whitespace-nowrap text-[#52709a]'>
                  <span className='font-mono font-semibold text-[#17345c]'>
                    {formatRequestPrice(
                      props.model,
                      showRechargePrice,
                      priceRate,
                      usdExchangeRate
                    )}
                  </span>{' '}
                  / {t('request')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-1.5'>
          <button
            type='button'
            onClick={props.onClick}
            className='inline-flex items-center gap-1 rounded-md border border-[#9ab3d1]/60 px-2 py-1 text-xs text-[#52709a] transition-colors hover:bg-[#edf5ff] hover:text-[#17345c] sm:px-2.5 sm:py-1.5'
          >
            {t('Details')}
            <ChevronRight className='size-3.5' />
          </button>
          <button
            type='button'
            onClick={handleCopy}
            className='rounded-md border border-[#9ab3d1]/60 p-1.5 text-[#52709a] transition-colors hover:bg-[#edf5ff] hover:text-[#17345c]'
            title={t('Copy')}
          >
            <Copy className='size-3.5' />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className='mt-3 line-clamp-2 min-h-[2.75rem] flex-1 text-sm leading-relaxed text-[#52709a] sm:mt-4'>
        {props.model.description || t('No description available.')}
      </p>

      {/* Footer: left metadata and right performance summary share row alignment */}
      <div className='mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-1 sm:mt-4'>
        <div className='flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1'>
          {primaryGroup && (
            <span className='text-[#52709a] text-xs font-medium'>
              {primaryGroup} {t('Groups')}
            </span>
          )}
          <span className='text-[#52709a] text-xs font-medium'>
            {isTokenBased ? t('Token-based') : t('Per Request')}
          </span>
          {isDynamicPricing && (
            <StatusBadge
              label={t('Dynamic Pricing')}
              variant='warning'
              copyable={false}
              size='sm'
            />
          )}
        </div>
        <ModelPerfBadge perf={props.perf} className='row-span-2 self-start' />

        <div className='flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-0.5 sm:gap-x-3 sm:gap-y-1'>
          {bottomTags.map((item) => (
            <span key={item} className='text-[#7893b3] text-xs'>
              {item}
            </span>
          ))}
          <span className='text-[#9ab3d1] text-xs'>
            {tokenUnitLabel}
          </span>
          {hiddenCount > 0 && (
            <span className='text-[#9ab3d1] text-xs'>
              +{hiddenCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
})
