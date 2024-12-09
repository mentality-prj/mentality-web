import { Button as NextUIButton } from '@nextui-org/react'

export interface CustomButtonProps {
  variant?: 'primary' | 'secondary'
  state?: 'default' | 'hovered' | 'pressed' | 'disabled'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  children?: React.ReactNode
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  state = 'default',
  size = 'md',
  disabled = false,
  children,
  ...props
}) => {
  const stateStyles: Record<string, string> = {
    default: '',
    hovered: 'hover:bg-opacity-80',
    pressed: 'active:scale-95',
    disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
  }

  const colorStyles: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active',
    secondary: 'bg-secondary text-black hover:bg-secondary-hover active:bg-secondary-active',
  }

  const sizeStyles: Record<string, string> = {
    sm: 'px-3 py-1 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-xl',
  }

  return (
    <NextUIButton
      className={`${colorStyles[variant]} ${sizeStyles[size]} ${
        disabled ? stateStyles.disabled : stateStyles[state]
      } transition duration-200 ease-in-out focus:outline-none`}
      disabled={disabled}
      {...props}
    >
      {children}
    </NextUIButton>
  )
}

export default CustomButton
