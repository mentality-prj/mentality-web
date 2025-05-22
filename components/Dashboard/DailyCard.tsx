import { Button } from '@/ds/shadcn/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ds/shadcn/card'

type DailyCardProps = {
  type: 'tip' | 'affirmation'
  textContent: string
}

export const DailyCard = ({ type, textContent }: DailyCardProps) => {
  return (
    <Card className="flex max-w-[536px] flex-col bg-white p-8 shadow-none">
      <CardHeader className="mb-6 p-0">
        <CardTitle className="text-base font-medium text-textcolor-tertiary">Your daily {type}</CardTitle>
      </CardHeader>
      <CardContent className="mb-8 flex-grow p-0">
        <p className="text-xl/6 font-semibold">&quot;{textContent}&quot;</p>
      </CardContent>
      <CardFooter className="mt-auto p-0">
        <Button className="ml-auto max-h-4 p-0" variant="textButton">
          See all {type}s
        </Button>
      </CardFooter>
    </Card>
  )
}
