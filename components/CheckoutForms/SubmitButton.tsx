import { Button } from '@/ds/shadcn/button'

interface SubmitButtonProps {
  text: string
}

export default function SubmitButton({ text }: SubmitButtonProps) {
  return (
    <Button type="submit" className="border-1 mt-2 rounded-lg px-5 text-xl">
      {text}
    </Button>
  )
}
