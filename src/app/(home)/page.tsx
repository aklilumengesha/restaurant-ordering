import { prisma } from '@/lib/prisma'
import { MenuGrid } from '@/components/menu-grid'
import { MenuFilters } from '@/components/menu-filters'
import { Pagination } from '@/components/pagination'
import { Category } from '@prisma/client'
import { Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{
  q?: string
  category?: string
  page?: string
}>

const PAGE_SIZE = 12

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? '1'))
  const q = (params.q ?? '').trim()
  const category = (params.category ?? '').toUpperCase() as Category | ''

  const where: any = { isActive: true }
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } }, 
      { description: { contains: q, mode: 'insensitive' } }
    ]
  }
  if (category && ['APPETIZERS', 'MAINS', 'DESSERTS', 'DRINKS'].includes(category)) {
    where.category = category
  }
  
  const [items, total] = await Promise.all([
    prisma.menuItem.findMany({ 
      where, 
      orderBy: { createdAt: 'desc' }, 
      take: PAGE_SIZE, 
      skip: (page - 1) * PAGE_SIZE 
    }),
    prisma.menuItem.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Fresh & Delicious
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Explore Our <span className="gradient-text">Menu</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Discover our carefully crafted dishes made with the finest ingredients
        </p>
      </div>

      <MenuFilters />
      
      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {q ? `No items found for "${q}". Try a different search term.` : 'No items found. Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <MenuGrid items={items} />
      )}
      
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
