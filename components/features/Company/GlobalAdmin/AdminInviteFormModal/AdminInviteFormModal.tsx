'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { AdminAssignManagerForm } from '@/components/features/Company/GlobalAdmin/AdminAssignManagerForm/AdminAssignManagerForm'
import { AdminInviteEmployeeForm } from '@/components/features/Company/GlobalAdmin/AdminInviteEmployeeForm/AdminInviteEmployeeForm'
import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FormCard from '@/components/shared/Cards/FormCard'
import FullScreenBackdrop from '@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import { Button } from '@/ui/button'

type Props = {
  companyId: string
  onInvited?: () => void
}

export function AdminInviteFormModal({ companyId, onInvited }: Props) {
  const [open, setOpen] = useState(false)
  const t = useTranslations('pages.Company.globalAdmin.companyDetail')

  const handleClose = () => setOpen(false)
  const handleInvited = () => {
    handleClose()
    onInvited?.()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('inviteTitle')}</Button>

      {open && (
        <>
          <FullScreenBackdrop onClick={handleClose} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-modal-title"
            className="scrollbar-styled fixed inset-x-4 top-1/2 z-50 max-h-[90vh] -translate-y-1/2 overflow-y-auto md:inset-x-auto md:left-1/2 md:w-[520px] md:-translate-x-1/2"
          >
            <FormCard
              title={<span id="invite-modal-title">{t('inviteTitle')}</span>}
              tools={<CloseIconButton onClick={handleClose} />}
            >
              <div className="flex flex-col gap-6">
                <AdminInviteEmployeeForm companyId={companyId} onInvited={handleInvited} />
                <hr className="border-border" />
                <AdminAssignManagerForm companyId={companyId} />
              </div>
            </FormCard>
          </div>
        </>
      )}
    </>
  )
}
