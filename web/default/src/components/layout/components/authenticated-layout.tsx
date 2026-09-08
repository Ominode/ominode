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
import { BackgroundVideo } from '@/components/background-video'
import { AnimatedOutlet } from '@/components/page-transition'
import { SkipToMain } from '@/components/skip-to-main'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'

import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout(props: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'

  return (
    <LayoutProvider>
      <SearchProvider>
        <SidebarProvider defaultOpen={defaultOpen} className='flex-col'>
          <SkipToMain />
          {/* 模型星球场景 — 控制台随主题切换纱幕（亮色亮纱 / 暗色及暮光 preset 暗纱）。 */}
          <BackgroundVideo variant='adaptive' />
          <AppHeader />
          <div className='flex min-h-0 w-full flex-1'>
            <AppSidebar />
            <SidebarInset
              className={cn(
                '@container/content',
                'h-[calc(100svh-var(--app-header-height,0px))]',
                'min-h-0 overflow-hidden',
                'peer-data-[variant=inset]:h-[calc(100svh-var(--app-header-height,0px)-(var(--spacing)*4))]'
              )}
            >
              {props.children ?? <AnimatedOutlet />}
            </SidebarInset>
          </div>
        </SidebarProvider>
      </SearchProvider>
    </LayoutProvider>
  )
}
