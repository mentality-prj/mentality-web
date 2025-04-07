import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'

import { Button } from '@/ds/shadcn/button'

export const AddUser = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <div>
      <>
        <Button onClick={onOpen} color="primary">
          Add User
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Add User</ModalHeader>
                <ModalBody>
                  <Input label="Email" variant="bordered" />
                  <Input label="First Name" variant="bordered" />
                  <Input label="Last Name" variant="bordered" />
                  <Input label="Phone Number" variant="bordered" />

                  <Input label="Password" type="password" variant="bordered" />
                  <Input label="Confirm Password" type="password" variant="bordered" />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onClick={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onClick={onClose}>
                    Add User
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  )
}
