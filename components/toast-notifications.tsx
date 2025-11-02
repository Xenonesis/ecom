'use client'

import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ToastOptions {
  title?: string
  description: string
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
}

export function useNotification() {
  const { toast } = useToast()

  const notify = ({ title, description, variant = 'default' }: ToastOptions) => {
    const icons = {
      success: CheckCircle2,
      error: XCircle,
      warning: AlertCircle,
      info: Info,
      default: Info,
    }

    const Icon = icons[variant]

    toast({
      title: title || (variant === 'success' ? 'Success' : variant === 'error' ? 'Error' : 'Notification'),
      description,
      variant: variant === 'error' ? 'destructive' : 'default',
      action: Icon ? (
        <Icon className={`h-5 w-5 ${
          variant === 'success' ? 'text-green-500' :
          variant === 'error' ? 'text-red-500' :
          variant === 'warning' ? 'text-yellow-500' :
          'text-blue-500'
        }`} />
      ) : undefined,
    })
  }

  return {
    success: (description: string, title?: string) => notify({ description, title, variant: 'success' }),
    error: (description: string, title?: string) => notify({ description, title, variant: 'error' }),
    warning: (description: string, title?: string) => notify({ description, title, variant: 'warning' }),
    info: (description: string, title?: string) => notify({ description, title, variant: 'info' }),
    notify,
  }
}
