import { Button, ButtonProps } from '@nextui-org/react'

interface CustomButtonProps extends ButtonProps {
  text: string
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, ...props }) => {
  return <Button {...props}>{text}</Button>
}

export default CustomButton
