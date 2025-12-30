import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { MenuStatusToggle } from './status-client'

const categoryOrder = ['APPETIZERS','MAINS','DESSERTS','DRINKS'] as const
const categoryLabels: Record<string,string> = { APPETIZERS: 'Appetizers', MAINS: 'Mains', DESSERTS: 'Desserts', DRINKS: 'Drinks' }

export default async function MenuAdminPage() {
  const items = await prisma.menuItem.findMany({ orderBy: [{ category: 'asc' }, { name: 'asc' }] })
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    acc[item.category] = acc[item.category] || []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Menu Management</h1>
        <Link href="/admin/menu/new" className="px-3 py-2 rounded bg-brand text-white hover:opacity-90">
          Add new dish
        </Link>
      </div>

      <div className="space-y-8">
        {categoryOrder.map((cat) => (
          <section key={cat}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">{categoryLabels[cat]}</h2>
              <div className="text-xs text-gray-500">{(grouped[cat]?.length ?? 0)} items</div>
            </div>
            <ul className="divide-y rounded border bg-white/50 dark:bg-gray-900/50">
              {(grouped[cat] ?? []).map((i) => (
                <li key={i.id} className="p-3 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {i.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={i.imageUrl} alt={i.name} className="w-14 h-14 object-cover rounded border" />
                    ) : (
                      <div className="w-14 h-14 rounded border bg-gray-50 dark:bg-gray-800" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{i.name}</div>
                        {!i.isActive && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Inactive</span>}
                      </div>
                      <div className="text-xs text-gray-500">${Number(i.price).toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{categoryLabels[i.category]}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* @ts-expect-error Server -> Client */}
                    <MenuStatusToggle id={i.id} isActive={i.isActive} />
                    <Link href={`/admin/menu/${i.id}`} className="px-2 py-1 text-xs rounded border">Edit</Link>
                  </div>
                </li>
              ))}
              {(grouped[cat] ?? []).length === 0 && (
                <li className="p-3 text-sm text-gray-500">No items in this category.</li>
              )}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
