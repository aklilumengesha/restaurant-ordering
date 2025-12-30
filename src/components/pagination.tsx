"use client"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    router.replace(`${pathname}?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5
    let start = Math.max(1, page - Math.floor(showPages / 2))
    let end = Math.min(totalPages, start + showPages - 1)
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1)
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex items-center gap-1">
      <button 
        disabled={page <= 1} 
        onClick={() => setPage(page - 1)} 
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>
      
      <div className="flex items-center gap-1 mx-2">
        {getPageNumbers().map((p, i) => (
          typeof p === 'number' ? (
            <button
              key={i}
              onClick={() => setPage(p)}
              className={`min-w-[40px] h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                p === page
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={i} className="px-2 text-gray-400">...</span>
          )
        ))}
      </div>
      
      <button 
        disabled={page >= totalPages} 
        onClick={() => setPage(page + 1)} 
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
