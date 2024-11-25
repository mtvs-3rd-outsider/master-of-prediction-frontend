import { useState, useEffect } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState<{ title: string; description: string; variant?: 'default' | 'destructive' }[]>([])

  const toast = ({ title, description, variant = 'default' }: { title: string; description: string; variant?: 'default' | 'destructive' }) => {
    setToasts((prevToasts) => [...prevToasts, { title, description, variant }])
  }

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prevToasts) => prevToasts.slice(1))
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [toasts])

  return { toast, toasts }
}

