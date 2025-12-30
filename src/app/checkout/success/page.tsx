"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart'

export default function CheckoutSuccessPage() {
  const clearCart = useCart((s) => s.clear)
  const [summary, setSummary] = useState<null | { items: any[]; sub: number; tax: number; total: number }>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('restonext_last_order')
      if (raw) {
        const parsed = JSON.parse(raw)
        setSummary(parsed)
        // Try to create order in backend if user is logged-in
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: parsed.items.map((i: any) => ({ menuItemId: i.id, quantity: i.quantity })) }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => {
            if (data?.id) setOrderId(data.id)
          })
          .finally(() => {
            clearCart()
            localStorage.removeItem('restonext_last_order')
          })
      }
    } catch {}
  }, [clearCart])

  if (!summary) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Payment successful</h1>
        <p>Your order is being processed.</p>
        <Link className="text-brand" href="/">Back to menu</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Order confirmed</h1>
      {orderId && <div className="text-sm text-gray-600">Order #{orderId.slice(0, 6)}</div>}
      <div className="border rounded p-4 space-y-2">
        {summary.items.map((i: any) => (
          <div key={i.id} className="flex justify-between text-sm">
            <div>
              <div className="font-medium">{i.name}</div>
              <div className="text-gray-500">Qty {i.quantity}</div>
            </div>
            <div>${(i.price * i.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="space-y-1 text-right">
        <div className="text-sm">Subtotal ${summary.sub.toFixed(2)}</div>
        <div className="text-sm">Tax ${summary.tax.toFixed(2)}</div>
        <div className="font-semibold text-lg">Total ${summary.total.toFixed(2)}</div>
      </div>
      <Link className="text-brand" href="/">Back to menu</Link>
    </div>
  )
}
