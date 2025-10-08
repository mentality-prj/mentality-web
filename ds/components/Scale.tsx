'use client'

const defaultColors = ['var(--primary)', 'var(--primary-hover)', 'var(--primary-focus)', 'var(--primary-pressed)']

interface ScaleProps {
  labels: string[]
  value: number | null
  onChange: (val: number) => void
  name?: string
  colors?: string[]
  showLabels?: boolean
}

export function Scale({
  labels,
  value,
  onChange,
  name = 'scale',
  colors = defaultColors,
  showLabels = true,
}: ScaleProps) {
  return (
    <div className="w-full">
      <div className="relative mb-3 flex w-full items-center justify-between px-10">
        {labels.map((_, i) => (
          <div key={i} className="relative flex w-full items-center last:w-auto">
            {/* circles */}
            <label
              className={`relative z-10 cursor-pointer transition-opacity ${
                i + 1 < (value ?? 0) ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={i + 1}
                checked={value === i + 1}
                onChange={() => onChange(i + 1)}
                className="peer hidden"
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full border-4 transition-colors ${
                  value === i + 1 ? 'border-primary' : 'border-secondary-hover'
                }`}
              >
                <div className="h-2 w-2 rounded-full bg-reversed"></div>
              </div>
            </label>

            {/* lines between circles*/}
            {i < labels.length - 1 && (
              <div
                className={`absolute -right-2 left-2 z-0 h-2 transition-colors ${
                  i === 0 ? 'rounded-l-full' : i === labels.length - 2 ? 'rounded-r-full' : 'rounded-none'
                }`}
                style={{
                  backgroundColor: value && i < value - 1 ? colors[i % colors.length] : 'var(--secondary-hover)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* labels (optionally)*/}
      {showLabels && (
        <div
          className="grid text-center"
          style={{
            gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))`,
          }}
        >
          {labels.map((label, i) => (
            <span key={i} className="select-none text-sm font-normal leading-tight text-textcolor-tertiary">
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
