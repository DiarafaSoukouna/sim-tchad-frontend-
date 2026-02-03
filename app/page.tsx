'use client'

import type React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { axiosInstance } from '../functions/axiosInstance'

interface LoginResponse {
  token: string
  user: any
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const phone = (e.currentTarget[0] as HTMLInputElement).value
      const password = (e.currentTarget[1] as HTMLInputElement).value

      const response = await axiosInstance.post<LoginResponse>(
        '/api/actor/login',
        {
          phone,
          password,
        },
      )

      const { user, token } = response.data

      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)

      router.push('/dashboard')
    } catch (error: any) {
      console.error('Erreur de connexion', error)
      alert(
        error?.response?.data?.message ||
          'Erreur lors de la connexion, veuillez réessayer.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">
                S
              </span>
            </div>
            <span className="font-bold text-3xl text-foreground">SIM</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground">Bon retour !</h1>
            <p className="mt-2 text-muted-foreground">
              Connectez-vous pour accéder à l&apos;application
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Phone"
              type="text"
              placeholder="+223 89097654"
              required
            />

            <div className="relative">
              <FormField
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border bg-input"
                />
                <span className="text-sm text-muted-foreground">
                  Se souvenir de moi
                </span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Connexion...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Se connecter
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte ? Contactez l&apos;administrateur.
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-background p-8">
        <div className="max-w-lg text-center">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <img
              src="/image12.jpg"
              alt="Dashboard illustration"
              className="relative z-10 rounded-2xl shadow-2xl"
            />
          </div>

          <p className="mt-4 text-muted-foreground leading-relaxed">
            Système d&apos;information sur les marchés
          </p>
        </div>
      </div>
    </div>
  )
}
