import { ErrorIcon } from '@/ds/icons'

interface IErrorMessageProps {
  message: string
}
export const ErrorMessage = ({ message }: IErrorMessageProps) => {
  return (
    <div className="mt-1 flex items-center gap-1 text-xs font-normal leading-none text-red-30" data-testid="error-name">
      <ErrorIcon />
      {message}
    </div>
  )
}
