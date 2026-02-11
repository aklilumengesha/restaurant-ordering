"use client"
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useSession, signOut } from 'next-auth/react'
import { CartIcon } from '@/components/cart-icon'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Sun, Moon, LogOut, User, ChefHat, Menu, X } from 'lucide-react'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Menu', show: true },
    { href: '/reservations', label: 'Reservations', show: true },
    { href: '/orders', label: 'My Orders', show: !!session },
    { href: '/admin', label: 'Admin Dashboard', show: (session as any)?.user?.role === 'ADMIN' },
    { href: '/staff', label: 'Staff Dashboard', show: (session as any)?.user?.role === 'STAFF' },
  ]

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {!isAdmin && (
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:shadow-red-500/30 transition-shadow">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text hidden sm:block">RestoNext</span>
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.filter(l => l.show).map(link => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className={`btn-ghost ${pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href)) ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
          
          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Admin Panel</span>
            </Link>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {!isAdmin && <CartIcon />}
            
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="btn-icon"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            {status === 'loading' ? (
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ) : session ? (
              <>
                {/* Desktop Profile */}
                <div className="hidden sm:flex items-center gap-2">
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-semibold">
                      {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {session.user?.name || session.user?.email?.split('@')[0] || 'Profile'}
                    </span>
                  </Link>
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })} 
                    className="btn-icon hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
                {/* Mobile Profile Icon */}
                <Link 
                  href="/profile"
                  className="sm:hidden btn-icon"
                  aria-label="Profile"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-semibold">
                    {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </Link>
              </>
            ) : (
              <Link href="/signin" className="btn-primary text-sm hidden sm:inline-flex">
                Sign in
              </Link>
            )}

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && !isAdmin && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col gap-1">
              {navLinks.filter(l => l.show).map(link => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-800 mt-2 pt-2">
                {session ? (
                  <>
                    <Link 
                      href="/profile" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span>{session.user?.name || session.user?.email?.split('@')[0] || 'Profile'}</span>
                    </Link>
                    <button 
                      onClick={() => { signOut({ callbackUrl: '/' }); setMobileMenuOpen(false); }} 
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/signin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-center btn-primary"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
