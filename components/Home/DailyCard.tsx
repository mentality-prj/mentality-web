import { Button } from '@/ds/shadcn/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ds/shadcn/card'

export type DailyCardProps = {
  title: string
  textContent: string
  buttonText: string
}

export const DailyCard = ({ title, textContent, buttonText }: DailyCardProps) => {
  return (
    <Card className="grid h-full grid-rows-[auto_1fr_auto] gap-2 border-none bg-surface-white p-4 shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="flex min-h-[3rem] items-center text-base font-medium text-textcolor-tertiary">
          <p className="m-0 line-clamp-2">{title}</p>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow p-0">
        <p className="line-clamp-4 text-xl/6 font-semibold">&quot;{textContent}&quot;</p>
      </CardContent>

      <CardFooter className="mt-2 p-0">
        <Button className="ml-auto max-h-4 p-0" variant="textButton">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
