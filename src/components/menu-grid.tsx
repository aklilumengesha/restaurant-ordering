"use client"
import Image from 'next/image'
import { MenuItem } from '@prisma/client'
import { useCart } from '@/lib/cart'
import { Plus, ShoppingBag } from 'lucide-react'

export function MenuGrid({ items }: { items: MenuItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((i) => (
        <div key={i.id} className="card card-hover overflow-hidden group">
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
            {i.imageUrl ? (
              <Image
                src={i.imageUrl}
                alt={i.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600" />
              </div>
            )}
            {!i.isActive && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">Sold Out</span>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className="badge bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 backdrop-blur-sm">
                {i.category.charAt(0) + i.category.slice(1).toLowerCase()}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{i.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{i.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold gradient-text">${Number(i.price).toFixed(2)}</span>
              <button
                disabled={!i.isActive}
                onClick={() => useCart.getState().add({ id: i.id, name: i.name, price: Number(i.price), imageUrl: i.imageUrl || undefined })}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${i.isActive
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
