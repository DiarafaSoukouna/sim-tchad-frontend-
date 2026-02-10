'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Settings,
  Package,
  Users,
  User,
  BarChart3,
  ChevronDown,
  LogOut,
  HomeIcon,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './ui/alert-dialog'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const parametrageItems = [
  { href: '/parametrage/secteurs', label: 'Secteurs' },
  { href: '/parametrage/categories', label: 'Catégories' },
  { href: '/parametrage/speculations', label: 'Spéculations' },
  { href: '/parametrage/zones', label: 'Zones de Production' },
  { href: '/parametrage/autres', label: 'Autre Paramétrage' },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  const isParametrageActive = pathname.startsWith('/parametrage')
  const [parametrageOpen, setParametrageOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  // 🔒 Secure route: redirect to / if no token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/')
    }
  }, [router])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2 mr-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">SIM</span>
        </div>

        <nav className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              pathname === '/dashboard'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
            )}
          >
            Tableau de bord
          </Link>

          {/* Menu Paramétrage */}
          <DropdownMenu
            open={parametrageOpen}
            onOpenChange={setParametrageOpen}
          >
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors outline-none',
                  isParametrageActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
                )}
                aria-expanded={parametrageOpen}
                aria-haspopup="menu"
              >
                <Settings className="h-4 w-4" />
                Paramétrage
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    parametrageOpen ? 'rotate-180' : '',
                  )}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border border-border rounded-lg shadow-lg py-1 min-w-48">
              {parametrageItems.map((item) => (
                <DropdownMenuItem asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'block px-4 py-2.5 text-sm transition-colors',
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-secondary',
                    )}
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/acteurs"
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
              pathname === '/acteurs'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
            )}
          >
            <Users className="h-4 w-4" />
            Acteurs
          </Link>
          <Link
            href="/produits"
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
              pathname === '/produits'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
            )}
          >
            <Package className="h-4 w-4" />
            Produits
          </Link>
          <Link
            href="/magasins"
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
              pathname === '/magasins'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
            )}
          >
            <HomeIcon className="h-4 w-4" />
            Magasins
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu
            open={userDropdownOpen}
            onOpenChange={setUserDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-md focus:outline-none ">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">
                    AS
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">Admin SIM</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    userDropdownOpen ? 'rotate-180' : '',
                  )}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
              <DropdownMenuItem
                onClick={() => {
                  router.push('../profil')
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
              >
                <User className="h-5 w-5" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setShowLogoutDialog(true)
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-600 
           hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-600
           rounded-md transition-colors cursor-pointer"
              >
                <LogOut className="h-5 w-5 text-red-600 hover:text-red-700" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog
            open={showLogoutDialog}
            onOpenChange={setShowLogoutDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir vous déconnecter ? Cette action vous
                  fera quitter votre compte.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-700 hover:bg-red-600"
                  onClick={handleLogout}
                >
                  Se déconnecter
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  )
}
