'use client'
import { Input } from '@nextui-org/react'
import Link from 'next/link'

import { DotsIcon } from '@/components/ui/icons/accounts/dots-icon'
import { ExportIcon } from '@/components/ui/icons/accounts/export-icon'
import { InfoIcon } from '@/components/ui/icons/accounts/info-icon'
import { TrashIcon } from '@/components/ui/icons/accounts/trash-icon'
import { HouseIcon } from '@/components/ui/icons/breadcrumb/house-icon'
import { UsersIcon } from '@/components/ui/icons/breadcrumb/users-icon'
import { SettingsIcon } from '@/components/ui/icons/sidebar/settings-icon'
import { TableWrapper } from '@/components/ui/table/table'
import { Button } from '@/ds/shadcn/button'

import { AddUser } from './add-user'

export const Accounts = () => {
  return (
    <div className="mx-auto my-10 flex w-full max-w-[95rem] flex-col gap-4 px-4 lg:px-6">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={'/'}>
            <span>Home</span>
          </Link>
          <span> / </span>
        </li>

        <li className="flex gap-2">
          <UsersIcon />
          <span>Users</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Accounts</h3>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
          <Input
            classNames={{
              input: 'w-full',
              mainWrapper: 'w-full',
            }}
            placeholder="Search users"
          />
          <SettingsIcon />
          <TrashIcon />
          <InfoIcon />
          <DotsIcon />
        </div>
        <div className="flex flex-row flex-wrap gap-3.5">
          <AddUser />
          <Button color="primary">
            <ExportIcon />
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[95rem]">
        <TableWrapper />
      </div>
    </div>
  )
}
