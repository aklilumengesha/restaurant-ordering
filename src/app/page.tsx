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
      {/* Hero Section with Background Image */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 mb-12">
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80)',
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>
          
          {/* Content */}
          <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="text-center max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                Fresh & Delicious
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up">
                Explore Our <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Menu</span>
              </h1>
              <p className="text-gray-200 text-lg md:text-xl mb-8 animate-fade-in-up animation-delay-200">
                Discover our carefully crafted dishes made with the finest ingredients
              </p>
              <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up animation-delay-400">
                <a href="#menu" className="btn-primary bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg shadow-red-500/30">
                  Browse Menu
                </a>
                <a href="/reservations" className="px-6 py-3 rounded-xl font-medium text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all">
                  Make Reservation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="menu" className="scroll-mt-20">
        <MenuFilters />
      </div>
      
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
