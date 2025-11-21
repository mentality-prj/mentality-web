export type ThoughtsFormProps = {
  onTextChange: (value: string) => void
  onSave: () => void
  content: string
  loading: boolean
  tags: string[]
  setTags: (tags: string[]) => void
}
