'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface CountdownTimerProps {
  readonly endDate: Date | string
  readonly onExpire?: () => void
}

export function CountdownTimer({ endDate, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = +new Date(endDate) - +new Date()
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      if (newTimeLeft.expired && onExpire) {
        onExpire()
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate, onExpire])

  if (timeLeft.expired) {
    return (
      <div className="flex items-center gap-2 text-red-500 font-semibold">
        <Clock className="h-5 w-5" />
        <span>Deal Expired</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-5 w-5 text-primary" />
      <div className="flex items-center gap-1 font-mono font-semibold">
        {timeLeft.days > 0 && (
          <>
            <div className="flex flex-col items-center bg-primary/10 px-2 py-1 rounded">
              <span className="text-lg">{timeLeft.days.toString().padStart(2, '0')}</span>
              <span className="text-xs text-muted-foreground">Days</span>
            </div>
            <span className="text-xl">:</span>
          </>
        )}
        <div className="flex flex-col items-center bg-primary/10 px-2 py-1 rounded">
          <span className="text-lg">{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="text-xs text-muted-foreground">Hrs</span>
        </div>
        <span className="text-xl">:</span>
        <div className="flex flex-col items-center bg-primary/10 px-2 py-1 rounded">
          <span className="text-lg">{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="text-xs text-muted-foreground">Min</span>
        </div>
        <span className="text-xl">:</span>
        <div className="flex flex-col items-center bg-primary/10 px-2 py-1 rounded">
          <span className="text-lg">{timeLeft.seconds.toString().padStart(2, '0')}</span>
          <span className="text-xs text-muted-foreground">Sec</span>
        </div>
      </div>
    </div>
  )
}
