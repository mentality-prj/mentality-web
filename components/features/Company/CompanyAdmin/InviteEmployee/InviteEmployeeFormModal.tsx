'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { InviteEmployeeForm } from '@/components/features/Company/CompanyAdmin/InviteEmployee/InviteEmployeeForm'
import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import FormCard from '@/components/shared/Cards/FormCard'
import FullScreenBackdrop from '@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import { Button } from '@/ui/button'

export function InviteEmployeeFormModal() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('pages.Company.companyAdmin.invite')

  const handleClose = () => setOpen(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('title')}</Button>

      {open && (
        <>
          <FullScreenBackdrop onClick={handleClose} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-employee-modal-title"
            className="scrollbar-styled fixed inset-x-4 top-1/2 z-50 max-h-[90vh] -translate-y-1/2 overflow-y-auto md:inset-x-auto md:left-1/2 md:w-[520px] md:-translate-x-1/2"
          >
            <FormCard
              title={<span id="invite-employee-modal-title">{t('title')}</span>}
              tools={<CloseIconButton onClick={handleClose} />}
            >
              <InviteEmployeeForm onInvited={handleClose} />
            </FormCard>
          </div>
        </>
      )}
    </>
  )
}
