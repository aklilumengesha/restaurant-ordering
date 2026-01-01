"use client"
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart, calcTotals } from '@/lib/cart'
import { ShoppingBag, Trash2, Plus, Minus, CreditCard, ArrowLeft, Loader2 } from 'lucide-react'

export default function CartPage() {
  const { items, setQuantity, remove, subtotal, clear } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sub = subtotal()
  const { tax, total } = calcTotals(sub)

  const checkout = async () => {
    if (items.length === 0) return
    setLoading(true)
    setError(null)
    
    try {
      const resSession = await fetch('/api/auth/session')
      const session = await resSession.json()
      if (!session?.user) {
        router.push('/signin?callbackUrl=/cart')
        return
      }
      
      localStorage.setItem('restonext_last_order', JSON.stringify({ items, sub, tax, total }))
      
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map((i) => ({ menuItemId: i.id, quantity: i.quantity })) }),
      })
      
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Checkout failed')
      }
      
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-2">
            <ArrowLeft className="w-4 h-4" />
            Continue shopping
          </Link>
          <h1 className="section-title">Your Cart</h1>
        </div>
        {items.length > 0 && (
          <button onClick={() => clear()} className="text-sm text-red-500 hover:text-red-600 font-medium">
            Clear cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added anything yet.</p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((i) => (
              <div key={i.id} className="card p-4 flex items-center gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  {i.imageUrl ? (
                    <Image src={i.imageUrl} alt={i.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{i.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">${i.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setQuantity(i.id, Math.max(1, i.quantity - 1))}
                    className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{i.quantity}</span>
                  <button 
                    onClick={() => setQuantity(i.id, i.quantity + 1)}
                    className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">${(i.price * i.quantity).toFixed(2)}</p>
                  <button 
                    onClick={() => remove(i.id)} 
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 mt-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-1">
            <div className="card p-6 sticky top-24 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({items.reduce((n, x) => n + x.quantity, 0)} items)</span>
                  <span>${sub.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="gradient-text">${total.toFixed(2)}</span>
                </div>
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
              <button 
                onClick={checkout} 
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Proceed to Checkout
                  </>
                )}
              </button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Secure checkout powered by Stripe
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
