import { Button } from '@nextui-org/react'

export default function AddTip() {
  return (
    <div className="flex w-full gap-4 px-4 py-6">
      <Button color="success">Generate Tip</Button>
      <p className="text-sm">
        Generate a <strong>Tip</strong> using the OpenAI service. <br />
        This tip will automatically appear on pages as a <strong>Current Tip</strong>
      </p>
    </div>
  )
}
