"use client"
import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

const CATEGORIES = [
  { key: 'APPETIZERS', label: 'Appetizers', emoji: '🥗' },
  { key: 'MAINS', label: 'Mains', emoji: '🍽️' },
  { key: 'DESSERTS', label: 'Desserts', emoji: '🍰' },
  { key: 'DRINKS', label: 'Drinks', emoji: '🍹' },
] as const

export function MenuFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [q, setQ] = useState<string>(() => searchParams.get('q') || '')

  const activeCategory = (searchParams.get('category') || '').toUpperCase()

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (q) params.set('q', q)
      else params.delete('q')
      params.delete('page')
      router.replace(`${pathname}?${params.toString()}`)
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  const onCategoryClick = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (activeCategory === key) params.delete('category')
    else params.set('category', key)
    params.delete('page')
    router.replace(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setQ('')
    router.replace(pathname)
  }

  const hasFilters = q || activeCategory

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = activeCategory === c.key
            return (
              <button
                key={c.key}
                onClick={() => onCategoryClick(c.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  active 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            )
          })}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search dishes..."
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all duration-200 placeholder:text-gray-400"
            />
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
