'use client'

import * as React from 'react'
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast'

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: 'default' | 'destructive'
}

let toasts: ToasterToast[] = []

export function useToast() {
  const [state, setState] = React.useState<ToasterToast[]>([])

  React.useEffect(() => {
    setState(toasts)
  }, [])

  const toast = React.useCallback(
    ({ ...props }: Omit<ToasterToast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast = { id, ...props }
      
      toasts = [newToast, ...toasts].slice(0, TOAST_LIMIT)
      setState([...toasts])

      setTimeout(() => {
        toasts = toasts.filter((t) => t.id !== id)
        setState([...toasts])
      }, TOAST_REMOVE_DELAY)

      return id
    },
    []
  )

  return { toast }
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])

  React.useEffect(() => {
    const interval = setInterval(() => {
      setToasts([...toasts])
    }, 100)

    return () => clearInterval(interval)
  }, [toasts])

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant }) => (
        <Toast key={id} variant={variant}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
