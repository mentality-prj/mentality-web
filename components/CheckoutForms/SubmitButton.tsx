import { Button } from '@/ds/shadcn/button'

interface SubmitButtonProps {
  text: string
}

export default function SubmitButton({ text }: SubmitButtonProps) {
  return (
    <Button type="submit" className="mt-2 rounded-lg border-1 px-5 text-xl">
      {text}
    </Button>
  )
}
