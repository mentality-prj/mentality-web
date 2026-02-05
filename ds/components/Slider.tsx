'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

type SliderMark = {
  value: number
  label?: React.ReactNode
}

type SliderProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  marks?: boolean | SliderMark[]
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    value,
    defaultValue,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    marks = false,
    orientation = 'horizontal',
    disabled = false,
    className,
    'aria-label': ariaLabel,
    ...rest
  },
  ref
) {
  const isControlled = typeof value === 'number'

  const [internalValue, setInternalValue] = React.useState<number>(() => {
    const initial = typeof defaultValue === 'number' ? defaultValue : min
    return clampValue(initial, min, max)
  })

  React.useEffect(() => {
    if (isControlled) {
      setInternalValue(clampValue(value as number, min, max))
    }
  }, [isControlled, value, min, max])

  const currentValue = isControlled ? clampValue(value as number, min, max) : internalValue
  const range = Math.max(max - min, 0.0001)
  const percent = ((currentValue - min) / range) * 100

  const markItems = React.useMemo(() => {
    if (!marks) return []

    const createMark = (markValue: number, label?: React.ReactNode): SliderMark => ({
      value: clampValue(markValue, min, max),
      label,
    })

    if (Array.isArray(marks)) {
      return marks.map((mark) => createMark(mark.value, mark.label))
    }

    if (step <= 0) return [createMark(min), createMark(max)]

    const items: SliderMark[] = []
    const stepsCount = Math.floor((max - min) / step)
    for (let i = 0; i <= stepsCount; i += 1) {
      const valueAtStep = min + i * step
      items.push(createMark(valueAtStep, valueAtStep))
    }

    if (items[items.length - 1]?.value !== max) {
      items.push(createMark(max, max))
    }

    return items
  }, [marks, min, max, step])

  const trackRef = React.useRef<HTMLDivElement | null>(null)
  const pointerActiveRef = React.useRef(false)

  React.useImperativeHandle(ref, () => trackRef.current as HTMLDivElement)

  const setValueFromRaw = React.useCallback(
    (raw: number) => {
      const snapped = snapValue(raw, min, max, step)
      const clamped = clampValue(snapped, min, max)
      if (clamped === currentValue) return
      if (!isControlled) {
        setInternalValue(clamped)
      }
      onChange?.(clamped)
    },
    [currentValue, isControlled, max, min, onChange, step]
  )

  const updateFromPointer = React.useCallback(
    (clientX: number, clientY: number) => {
      const track = trackRef.current
      if (!track) return

      const rect = track.getBoundingClientRect()
      if (orientation === 'horizontal') {
        if (rect.width === 0) return
        const ratio = clamp01((clientX - rect.left) / rect.width)
        const raw = min + ratio * (max - min)
        setValueFromRaw(raw)
      } else {
        if (rect.height === 0) return
        const ratio = clamp01((rect.bottom - clientY) / rect.height)
        const raw = min + ratio * (max - min)
        setValueFromRaw(raw)
      }
    },
    [max, min, orientation, setValueFromRaw]
  )

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    event.preventDefault()
    pointerActiveRef.current = true
    event.currentTarget.focus()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    updateFromPointer(event.clientX, event.clientY)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerActiveRef.current || disabled) return
    updateFromPointer(event.clientX, event.clientY)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerActiveRef.current) return
    pointerActiveRef.current = false
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    updateFromPointer(event.clientX, event.clientY)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return

    const { key } = event
    if (key === 'ArrowRight' || key === 'ArrowUp') {
      event.preventDefault()
      setValueFromRaw(currentValue + step)
    } else if (key === 'ArrowLeft' || key === 'ArrowDown') {
      event.preventDefault()
      setValueFromRaw(currentValue - step)
    } else if (key === 'Home') {
      event.preventDefault()
      setValueFromRaw(min)
    } else if (key === 'End') {
      event.preventDefault()
      setValueFromRaw(max)
    }
  }

  const trackClasses = cn(
    'relative flex select-none items-center outline-none',
    orientation === 'vertical' ? 'h-full w-3 flex-col' : 'h-3 w-full'
  )

  const fillStyle =
    orientation === 'horizontal' ? { width: `${percent}%`, left: 0 } : { height: `calc(${percent}% + 10px)`, bottom: 0 }

  const thumbStyle = orientation === 'horizontal' ? { left: `${percent}%` } : { bottom: `${percent}%` }

  const rootClasses = cn(
    'inline-flex rounded-lg bg-gray-50 p-2',
    orientation === 'vertical' ? 'h-full' : 'w-full',
    className
  )

  const railClasses = cn(
    'absolute rounded-full bg-secondary',
    orientation === 'horizontal' ? 'top-1/2 h-1 w-full -translate-y-1/2' : 'left-1/2 h-full w-1 -translate-x-1/2'
  )

  const fillClasses = cn(
    'absolute bg-primary',
    orientation === 'horizontal'
      ? 'top-1/2 h-1 w-full -translate-y-1/2 rounded-full'
      : 'left-1/2 w-5 -translate-x-1/2 rounded-b-full'
  )

  const thumbClasses = cn(
    'absolute flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border border-primary bg-background shadow transition-shadow',
    orientation === 'horizontal' && '-translate-y-1/2',
    disabled ? 'opacity-40' : 'focus-visible:ring-ring hover:shadow-md focus-visible:ring-2'
  )

  const markBaseClasses = 'text-muted-foreground pointer-events-none absolute flex items-center text-xs w-40'

  const markPositionClasses = orientation === 'horizontal' ? 'top-full mt-1 -translate-x-1/2' : 'left-6'

  const markTickBaseClasses = 'block bg-border'

  const markTickPositionClasses = orientation === 'horizontal' ? 'mb-1 h-2 w-px' : 'mr-1 h-px w-2'

  return (
    <div className={rootClasses} {...rest}>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-disabled={disabled}
        aria-orientation={orientation}
        aria-label={ariaLabel}
        className={trackClasses}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        <div className={railClasses} style={orientation === 'horizontal' ? undefined : { top: '0', height: '100%' }} />

        <div className={fillClasses} style={fillStyle} />

        <div
          className={thumbClasses}
          style={orientation === 'horizontal' ? { ...thumbStyle, top: '50%' } : { ...thumbStyle, left: '50%' }}
        />

        {markItems.map((mark) => {
          const markPercent = ((mark.value - min) / range) * 100
          const positionStyle =
            orientation === 'horizontal' ? { left: `${markPercent}%` } : { bottom: `${markPercent}%` }

          return (
            <div key={`mark-${mark.value}`} className={cn(markBaseClasses, markPositionClasses)} style={positionStyle}>
              <span className={cn(markTickBaseClasses, markTickPositionClasses)} />
              {mark.label ?? mark.value}
            </div>
          )
        })}
      </div>
    </div>
  )
})

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max))
}

function snapValue(value: number, min: number, max: number, step: number) {
  if (step <= 0) return value
  const steps = Math.round((value - min) / step)
  const snapped = min + steps * step
  return clampValue(snapped, min, max)
}

function clamp01(value: number) {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}
