"use client"
import Link from 'next/link'
import { useCart } from '@/lib/cart'
import { ShoppingBag } from 'lucide-react'

export function CartIcon() {
  const count = useCart((s) => s.count())
  return (
    <Link 
      href="/cart" 
      className="relative flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 group"
    >
      <ShoppingBag className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-red-500 transition-colors" />
      <span className="text-sm font-medium hidden sm:block">Cart</span>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full min-w-[22px] h-[22px] px-1.5 shadow-lg shadow-red-500/30 animate-pulse">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
