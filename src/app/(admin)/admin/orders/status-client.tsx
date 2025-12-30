"use client"
import { useEffect, useMemo, useState } from 'react'

const STATUSES = ['PENDING','PREPARING','READY','DELIVERED','CANCELED'] as const

type OrderRow = any

type Staff = { id: string; name?: string | null; email: string }

export default function OrdersControls({ orders, staff }: { orders: OrderRow[]; staff: Staff[] }) {
  const [rows, setRows] = useState<OrderRow[]>(orders)
  const [activeTab, setActiveTab] = useState<typeof STATUSES[number] | 'ALL'>('PENDING')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // Polling for real-time updates
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setRows((prev) => {
            // keep local quick changes but prefer server truth by id
            const map = new Map(prev.map((p:any) => [p.id, p]))
            for (const d of data) map.set(d.id, { ...(map.get(d.id) || {}), ...d })
            return Array.from(map.values()).sort((a:any,b:any)=> (a.createdAt > b.createdAt ? -1:1))
          })
        }
      } catch {}
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const update = async (id: string, payload: any) => {
    const res = await fetch('/api/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...payload }) })
    if (res.ok) {
      const updated = await res.json()
      setRows((rows) => rows.map(r => r.id === id ? { ...r, ...updated } : r))
    }
  }

  const filtered = useMemo(() => {
    return rows.filter(r => activeTab === 'ALL' ? true : r.status === activeTab)
  }, [rows, activeTab])

  const toggleExpand = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }))

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(['ALL', ...STATUSES] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`px-3 py-1 text-sm rounded border ${activeTab === t ? 'bg-brand text-white border-brand' : 'bg-white dark:bg-gray-900'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((o) => (
          <div key={o.id} className="border rounded p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm">#{o.id.slice(0,6)} • {o.user?.email || 'Guest'} • <span className="text-gray-500">{new Date(o.createdAt).toLocaleString()}</span></div>
              <div className="font-semibold">${Number(o.total).toFixed(2)}</div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <label className="text-sm">Status</label>
              <select value={o.status} onChange={(e)=>update(o.id, { status: e.target.value })} className="border rounded px-2 py-1 text-sm">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <label className="text-sm ml-2">Assign</label>
              <select value={o.assignedToId || ''} onChange={(e)=>update(o.id, { assignedToId: e.target.value || null })} className="border rounded px-2 py-1 text-sm">
                <option value="">Unassigned</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name || s.email}</option>)}
              </select>

              <button onClick={()=>update(o.id, { assignedToId: null })} className="text-xs px-2 py-1 border rounded">Unassign</button>

              <button onClick={()=>toggleExpand(o.id)} className="ml-auto text-xs px-2 py-1 border rounded">{expanded[o.id] ? 'Hide' : 'Details'}</button>
            </div>

            {expanded[o.id] && (
              <div className="mt-3 rounded bg-gray-50 dark:bg-gray-900 p-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="font-medium mb-1">Customer</div>
                    <div className="text-gray-700 dark:text-gray-300">{o.user?.name || o.user?.email || 'Guest'}</div>
                    <div className="text-xs text-gray-500">Order ID: {o.id}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Payment</div>
                    <div className="text-gray-700 dark:text-gray-300">Status: N/A</div>
                    <div className="text-xs text-gray-500">Payments not modeled in schema</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Fulfillment</div>
                    <div className="text-gray-700 dark:text-gray-300">{o.assignedToId ? `Delivery by ${(staff.find(s=>s.id===o.assignedToId)?.name) || 'Staff'}` : 'Pickup'}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="font-medium mb-1">Items</div>
                  <ul className="divide-y rounded border bg-white/50 dark:bg-gray-950/40">
                    {o.items.map((it:any)=> (
                      <li key={it.id} className="p-2 flex items-center justify-between">
                        <div>{it.menuItem?.name} × {it.quantity}</div>
                        <div className="text-gray-700 dark:text-gray-300">${(Number(it.unitPrice) * it.quantity).toFixed(2)}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-gray-500">No orders in this status.</div>
        )}
      </div>
    </div>
  )
}
