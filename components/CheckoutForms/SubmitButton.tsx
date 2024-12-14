interface SubmitButtonProps {
  text: string
}

export default function SubmitButton({ text }: SubmitButtonProps) {
  return (
    <button type="submit" className="mt-2 rounded-lg border-1 px-5 text-xl">
      {text}
    </button>
  )
}
