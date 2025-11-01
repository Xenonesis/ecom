'use client'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { formatPrice } from '@/lib/utils'

interface PriceRangeSliderProps {
  readonly min: number
  readonly max: number
  readonly value: [number, number]
  readonly onChange: (value: number | number[]) => void
}

export function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-primary">{formatPrice(value[0])}</span>
        <span className="text-muted-foreground">to</span>
        <span className="font-medium text-primary">{formatPrice(value[1])}</span>
      </div>
      <Slider
        range
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full"
        trackStyle={[{ backgroundColor: 'hsl(var(--primary))' }]}
        handleStyle={[
          { borderColor: 'hsl(var(--primary))', backgroundColor: 'hsl(var(--primary))' },
          { borderColor: 'hsl(var(--primary))', backgroundColor: 'hsl(var(--primary))' },
        ]}
        railStyle={{ backgroundColor: 'hsl(var(--muted))' }}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  )
}
