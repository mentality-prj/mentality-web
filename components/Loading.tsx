import { Loader2 } from 'lucide-react'

interface LoadingProps {
  size?: number | string
  className?: string
}

const Loading = ({ size = 16, className = '' }: LoadingProps) => {
  return <Loader2 size={size} className={`icon animate-spin ${className}`} />
}

export default Loading
