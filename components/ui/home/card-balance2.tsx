import { Card, CardBody } from '@nextui-org/react'

import { Community } from '@/components/ui/icons/community'

export const CardBalance2 = () => {
  return (
    <Card className="bg-default-50 w-full rounded-xl px-3 shadow-md xl:max-w-sm">
      <CardBody className="py-5">
        <div className="flex gap-2.5">
          <Community />
          <div className="flex flex-col">
            <span className="text-default-900">Health Insurance</span>
            <span className="text-default-900 text-xs">+2400 People</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 py-2">
          <span className="text-default-900 text-xl font-semibold">$12,138</span>
          <span className="text-danger text-xs">- 4.5%</span>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <div>
              <span className="text-success-600 text-xs font-semibold">{'↓'}</span>
              <span className="text-xs">11,930</span>
            </div>
            <span className="text-default-900 text-xs">USD</span>
          </div>

          <div>
            <div>
              <span className="text-danger text-xs font-semibold">{'↑'}</span>
              <span className="text-xs">54,120</span>
            </div>
            <span className="text-default-900 text-xs">USD</span>
          </div>

          <div>
            <div>
              <span className="text-danger text-xs font-semibold">{'⭐'}</span>
              <span className="text-xs">150</span>
            </div>
            <span className="text-default-900 text-xs">VIP</span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
