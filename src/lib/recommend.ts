import { prisma } from '@/lib/prisma'

export async function getRecommendations(userId: string | null, limit = 10) {
  // Global popularity
  const popular = await prisma.orderItem.groupBy({
    by: ['menuItemId'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: limit * 3,
  })
  const popularWeight: Record<string, number> = {}
  popular.forEach((p, idx) => {
    popularWeight[p.menuItemId] = (popular.length - idx) // higher for top
  })

  const scores = new Map<string, number>()

  if (userId) {
    const userItems = await prisma.orderItem.findMany({
      where: { order: { userId } },
      select: { menuItemId: true, quantity: true },
    })
    const freq: Record<string, number> = {}
    userItems.forEach((it) => {
      freq[it.menuItemId] = (freq[it.menuItemId] || 0) + it.quantity
    })

    // Boost items user ordered and similar category items
    if (Object.keys(freq).length) {
      const likedIds = Object.keys(freq)
      const liked = await prisma.menuItem.findMany({ where: { id: { in: likedIds } } })
      const likedCats = new Set(liked.map((m) => m.category))

      // Score liked again + similar categories
      const similar = await prisma.menuItem.findMany({ where: { category: { in: Array.from(likedCats) }, isActive: true } })
      for (const m of similar) {
        const base = freq[m.id] || 0
        const add = base ? 10 * base : 3
        scores.set(m.id, (scores.get(m.id) || 0) + add)
      }
    }
  }

  // Add popular baseline
  for (const [id, w] of Object.entries(popularWeight)) {
    scores.set(id, (scores.get(id) || 0) + w)
  }

  // Filter only active items and order by score
  const ids = Array.from(scores.keys())
  const items = await prisma.menuItem.findMany({ where: { id: { in: ids }, isActive: true } })
  const byId = new Map(items.map((i) => [i.id, i]))
  const ranked = ids
    .filter((id) => byId.has(id))
    .sort((a, b) => (scores.get(b)! - scores.get(a)!))
    .slice(0, limit)
    .map((id) => byId.get(id)!)

  // If not enough, backfill with most recent active items
  if (ranked.length < limit) {
    const extra = await prisma.menuItem.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: limit - ranked.length })
    return ranked.concat(extra)
  }

  return ranked
}
