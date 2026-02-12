type Props = {
  text: string
}

export const StyledDescription = ({ text }: Props) => {
  const items = text
    .split(/\.\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <ul className="list-inside list-disc space-y-2 text-base leading-relaxed">
      {items.map((item, index) => (
        <li key={index} className="text-base leading-relaxed">
          {item.endsWith('.') ? item : item + '.'}
        </li>
      ))}
    </ul>
  )
}
