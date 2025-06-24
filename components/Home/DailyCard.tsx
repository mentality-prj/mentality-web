import { Button } from '@/ds/shadcn/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ds/shadcn/card'

export type DailyCardProps = {
  title: string
  textContent: string
  buttonText: string
}

export const DailyCard = ({ title, textContent, buttonText }: DailyCardProps) => {
  return (
    <Card className="flex flex-col border-none bg-surface-white p-8 shadow-none">
      <CardHeader className="mb-6 p-0">
        <CardTitle className="text-base font-medium text-textcolor-tertiary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="mb-8 flex-grow p-0">
        <p className="text-xl/6 font-semibold">&quot;{textContent}&quot;</p>
      </CardContent>
      <CardFooter className="mt-auto p-0">
        <Button className="ml-auto max-h-4 p-0" variant="textButton">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
