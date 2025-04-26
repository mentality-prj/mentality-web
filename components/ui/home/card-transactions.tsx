import { Avatar, Card, CardBody } from '@nextui-org/react'

const items = [
  {
    id: '0',
    name: 'Jose Perez',
    picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    amount: '4500 USD',
    date: '9/20/2021',
  },
  {
    id: '1',
    name: 'Jose Perez',
    picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    amount: '4500 USD',
    date: '9/20/2021',
  },
  {
    id: '2',
    name: 'Jose Perez',
    picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    amount: '4500 USD',
    date: '9/20/2021',
  },
  {
    id: '3',
    name: 'Jose Perez',
    picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    amount: '4500 USD',
    date: '9/20/2021',
  },
  {
    id: '4',
    name: 'Jose Perez',
    picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    amount: '4500 USD',
    date: '9/20/2021',
  },
]

export const CardTransactions = () => {
  return (
    <Card className="bg-default-50 rounded-xl px-3 shadow-md">
      <CardBody className="gap-4 py-5">
        <div className="flex justify-center gap-2.5">
          <div className="border-divider flex flex-col rounded-xl border-2 border-dashed px-6 py-2">
            <span className="text-default-900 text-xl font-semibold">Latest Transactions</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.id} className="grid w-full grid-cols-4">
              <div className="w-full">
                <Avatar isBordered color="secondary" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              </div>

              <span className="text-default-900 font-semibold">{item.name}</span>
              <div>
                <span className="text-success text-xs">{item.amount}</span>
              </div>
              <div>
                <span className="text-default-500 text-xs">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
