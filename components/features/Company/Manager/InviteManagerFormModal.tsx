'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { InviteEmployeeManagerForm } from '@/components/features/Company/Manager/InviteEmployeeManagerForm'
import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FormCard from '@/components/shared/Cards/FormCard'
import { ModalSheet } from '@/components/shared/FullScreenContainers/ModalSheet'
import { Button } from '@/ui/button'

export function InviteManagerFormModal() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('pages.Company.manager.invite')

  const handleClose = () => setOpen(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('title')}</Button>

      {open && (
        <ModalSheet labelledBy="invite-manager-modal-title" onClose={handleClose}>
          <FormCard
            title={<span id="invite-manager-modal-title">{t('title')}</span>}
            tools={<CloseIconButton onClick={handleClose} />}
          >
            <InviteEmployeeManagerForm onInvited={handleClose} />
          </FormCard>
        </ModalSheet>
      )}
    </>
  )
}
