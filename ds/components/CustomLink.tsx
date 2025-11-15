import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type CustomLinkProps = React.ComponentProps<typeof Link> & {
  className?: string
}

export function CustomLink({ className, children, ...props }: CustomLinkProps) {
  return (
    <Link {...props} legacyBehavior>
      <a
        className={cn(
          'inline-flex cursor-pointer pt-6 font-semibold text-primary hover:text-primary-hover focus:font-bold focus:text-primary-focus focus-visible:underline focus-visible:outline-none active:text-primary-pressed',
          className
        )}
      >
        {children}
      </a>
    </Link>
  )
}
