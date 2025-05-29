export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <div className="">{/* Greeting Title component */}</div>
      {/* Content ↓*/}
      <div className="flex gap-8">
        <div className="flex-col gap-8">
          <div className="">{/* current state component */}</div>
          <div className="">{/* exercises for recovery */}</div>
        </div>
        <div className="flex-col gap-8">
          <div className="flex gap-6">
            {/* Your daily affirmation component */}
            {/* Tip of the day */}
          </div>
          <div className="">{/* Chat with an AI assistant compoent */}</div>
          <div className="">{/* My progress */}</div>
        </div>
      </div>
    </div>
  )
}
