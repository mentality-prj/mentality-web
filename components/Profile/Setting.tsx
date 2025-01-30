'use client'
import { useState } from 'react'
import { Button, CardBody, CardHeader, Form, Input, Tab, Tabs } from '@nextui-org/react'

import { CustomUser } from '@/types/auth'

interface SettingProps {
  user: CustomUser
}
export default function Setting({ user }: SettingProps) {
  const [firstName, lastName] = user.name!.split(' ')
  const [name, setName] = useState(firstName)
  const [surname, setSurname] = useState(lastName)
  const [email, setEmail] = useState(user.email!)
  return (
    <>
      <CardHeader>
        <h2 className="text-2xl font-semibold text-zinc-950">Settings</h2>
      </CardHeader>
      <CardBody>
        <Tabs
          aria-label="Options"
          selectedKey={'profile'}
          classNames={{
            tab: 'text-purple-700 font-medium max-w-fit p-0 pb-3 h-[26px] px-2 data-[hover-unselected=true]:opacity-100  ',
            cursor: 'w-full h-[1px]',
            tabList: 'border-b p-0 gap-4 border-divider relative w-full rounded-none',
            tabContent: 'group-data-[hover-unselected=true]:text-purple-800 text-gray-500',
            panel: 'px-0',
          }}
          variant="underlined"
          color="secondary"
        >
          <Tab key="profile" title="My Profile">
            <div className="flex flex-col gap-4 border-b pb-5">
              <h4 className="font-semibold">Personal information</h4>
              <p className="text-gray-500">Update your personal information here.</p>
            </div>
            <Form>
              <div className="flex w-full flex-wrap gap-x-5 gap-y-6 border-b py-6">
                <Input
                  classNames={{
                    base: 'max-w-[400px]',
                  }}
                  variant="bordered"
                  labelPlacement="outside"
                  label="Name"
                  value={name}
                  onValueChange={setName}
                />
                <Input
                  classNames={{
                    base: 'max-w-[400px]',
                  }}
                  variant="bordered"
                  labelPlacement="outside"
                  label="Surname"
                  value={surname}
                  onValueChange={setSurname}
                />
                <Input
                  classNames={{
                    base: 'max-w-[400px]',
                  }}
                  variant="bordered"
                  labelPlacement="outside"
                  label="Email address"
                  value={email}
                  onValueChange={setEmail}
                />
              </div>
              <div className="mt-6 flex gap-3">
                <Button type="reset" variant="bordered" color="secondary">
                  Cancel
                </Button>
                <Button type="submit" color="secondary">
                  Save
                </Button>
              </div>
            </Form>
          </Tab>
          <Tab key="order" title="Order History">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum excepturi hic, voluptas fuga error quae
            corrupti modi ipsum temporibus, ut esse, asperiores maxime iusto libero sapiente quaerat ad sit reiciendis?
          </Tab>
        </Tabs>
      </CardBody>
    </>
  )
}
