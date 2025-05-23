import { Button } from '@/ds/shadcn/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ds/shadcn/card'

export type BlogCardProps = {
  title: string
  textContent: string
}

export const BlogCard = ({ title, textContent }: BlogCardProps) => {
  return (
    <Card className="flex max-w-[312px] flex-col bg-white shadow-none">
      <CardHeader className="rounded-sm p-0">
        <img
          className="rounded-t-sm"
          alt="title-image"
          src="https://png.pngtree.com/png-vector/20220725/ourmid/pngtree-close-up-huge-hands-hold-woman-victim-give-help-or-first-png-image_6073336.png"
        />
      </CardHeader>
      <CardContent className="mb-6 flex flex-grow flex-col gap-3 p-6 pb-0">
        <CardTitle className="break-words text-left text-xl/6 font-semibold">{title}</CardTitle>
        <p className="line-clamp-2 text-sm font-normal">{textContent}</p>
      </CardContent>
      <CardFooter className="p-0 px-6 pb-6">
        <Button className="max-h-4 p-0" variant="textButton">
          Learn more
        </Button>
      </CardFooter>
    </Card>
  )
}
