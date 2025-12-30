"use client"
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart'

type Item = { id: string; name: string; price: number; quantity: number }

export default function ClientControls({ orderId, status, items }: { orderId: string; status: string; items: Item[] }) {
  const [current, setCurrent] = useState(status)
  const [loading, setLoading] = useState(false)

  // Polling for real-time updates
  useEffect(() => {
    let active = true
    const fn = async () => {
      try {
        const res = await fetch(`/api/my/orders/${orderId}`)
        if (res.ok) {
          const data = await res.json()
          if (active) setCurrent(data.status)
        }
      } catch {}
    }
    fn()
    const t = setInterval(fn, 5000)
    return () => {
      active = false
      clearInterval(t)
    }
  }, [orderId])

  const cancel = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/my/orders/${orderId}/cancel`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setCurrent(data.status)
      }
    } finally {
      setLoading(false)
    }
  }

  const reorder = () => {
    const { add } = useCart.getState()
    items.forEach((i) => add({ id: i.id, name: i.name, price: i.price }, i.quantity))
    window.location.href = '/cart'
  }

  const cancellable = current === 'PENDING'

  return (
    <div className="flex items-center gap-3">
      <button onClick={reorder} className="px-3 py-2 border rounded text-sm">Reorder</button>
      <button disabled={!cancellable || loading} onClick={cancel} className={`px-3 py-2 rounded text-sm ${cancellable ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
        {loading ? 'Cancelling…' : 'Cancel order'}
      </button>
    </div>
  )
}
