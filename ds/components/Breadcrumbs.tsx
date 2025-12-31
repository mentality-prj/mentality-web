import React from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/ds/shadcn/breadcrumb'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface BreadcrumbsProps {
  className?: string
  currentPage: string
  breadcrumbList: {
    title: string
    href: string
  }[]
}

export const Breadcrumbs = ({ className, currentPage, breadcrumbList }: BreadcrumbsProps) => {
  return (
    <Breadcrumb className={cn('', className)}>
      <BreadcrumbList className="sm:gap-1">
        {breadcrumbList.map(({ title, href }, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={href} className="text-textcolor-tertiary">
                  {title}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-textcolor-tertiary mr-1">/</BreadcrumbSeparator>
          </React.Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
