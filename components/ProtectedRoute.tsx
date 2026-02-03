'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/') // ou '/login'
    }
  }, [router])

  return <>{children}</>
}
