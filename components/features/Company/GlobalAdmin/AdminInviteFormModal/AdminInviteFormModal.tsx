'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { AdminAssignManagerForm } from '@/components/features/Company/GlobalAdmin/AdminAssignManagerForm/AdminAssignManagerForm'
import { AdminInviteEmployeeForm } from '@/components/features/Company/GlobalAdmin/AdminInviteEmployeeForm/AdminInviteEmployeeForm'
import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FormCard from '@/components/shared/Cards/FormCard'
import { ModalSheet } from '@/components/shared/FullScreenContainers/ModalSheet'
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
        <ModalSheet labelledBy="invite-modal-title" onClose={handleClose}>
          <FormCard
            title={<span id="invite-modal-title">{t('inviteTitle')}</span>}
            tools={<CloseIconButton onClick={handleClose} />}
          >
            <div className="flex flex-col gap-sm">
              <AdminInviteEmployeeForm companyId={companyId} onInvited={handleInvited} />
              <hr className="border-border" />
              <AdminAssignManagerForm companyId={companyId} />
            </div>
          </FormCard>
        </ModalSheet>
      )}
    </>
  )
}
