"use client"
import { useEffect, useState } from 'react'

type Row = { id: string; type: string; title: string; message?: string | null; severity: string; createdAt: string; read: boolean }

export function AdminAlerts() {
  const [rows, setRows] = useState<Row[]>([])
  const [open, setOpen] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch('/api/notifications', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (mounted) setRows(data)
        }
      } catch {}
    }
    load()
    const id = setInterval(load, 5000)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  const unread = rows.filter(r => !r.read)

  const markRead = async (id: string) => {
    await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, read: true }) })
    setRows(rs => rs.map(r => r.id === id ? { ...r, read: true } : r))
  }

  if (!open) return null
  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Admin Alerts</div>
        <button onClick={()=>setOpen(false)} className="text-xs px-2 py-0.5 border rounded">Hide</button>
      </div>
      {unread.length === 0 && <div className="text-xs text-gray-500">No new alerts.</div>}
      {unread.map(n => (
        <div key={n.id} className={`border rounded p-2 text-sm ${n.severity === 'error' ? 'border-red-500' : n.severity === 'warning' ? 'border-amber-500' : 'border-gray-300'}`}>
          <div className="font-medium">{n.title}</div>
          {n.message && <div className="text-xs text-gray-600">{n.message}</div>}
          <div className="mt-1 flex items-center justify-between">
            <div className="text-[10px] text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
            <button onClick={()=>markRead(n.id)} className="text-[10px] px-2 py-0.5 border rounded">Mark read</button>
          </div>
        </div>
      ))}
    </div>
  )
}
