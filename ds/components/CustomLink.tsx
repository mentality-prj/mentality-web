import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type CustomLinkProps = React.ComponentProps<typeof Link> & {
  className?: string
}

export function CustomLink({ className, children, ...props }: CustomLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        'focus:text-primary-focus active:text-primary-pressed inline-flex cursor-pointer font-semibold text-primary hover:text-primary-hover focus:font-bold focus-visible:underline focus-visible:outline-none',
        className
      )}
    >
      {children}
    </Link>
  )
}
