'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { InviteEmployeeForm } from '@/components/features/Company/CompanyAdmin/InviteEmployee/InviteEmployeeForm'
import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FormCard from '@/components/shared/Cards/FormCard'
import { ModalSheet } from '@/components/shared/FullScreenContainers/ModalSheet'
import { Button } from '@/ui/button'

export function InviteEmployeeFormModal() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('pages.Company.companyAdmin.invite')

  const handleClose = () => setOpen(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('title')}</Button>

      {open && (
        <ModalSheet labelledBy="invite-employee-modal-title" onClose={handleClose}>
          <FormCard
            title={<span id="invite-employee-modal-title">{t('title')}</span>}
            tools={<CloseIconButton onClick={handleClose} />}
          >
            <InviteEmployeeForm onInvited={handleClose} />
          </FormCard>
        </ModalSheet>
      )}
    </>
  )
}
