"use client"
import { useMemo, useState } from 'react'

export default function StaffClient({ staff, openOrders, upcomingReservations, shifts, perfOrders, perfRes }: any) {
  const [orders, setOrders] = useState(openOrders)
  const [reservations, setReservations] = useState(upcomingReservations)
  const [shiftRows, setShiftRows] = useState(shifts)
  const [tab, setTab] = useState<'assign'|'performance'|'shifts'>('assign')

  const perf = useMemo(() => {
    const map: Record<string, { orders: number; reservations: number; name: string }> = {}
    for (const s of staff) map[s.id] = { orders: 0, reservations: 0, name: s.name || s.email }
    for (const p of perfOrders) if (p.assignedToId && map[p.assignedToId]) map[p.assignedToId].orders = p._count._all
    for (const p of perfRes) if (p.assignedToId && map[p.assignedToId]) map[p.assignedToId].reservations = p._count._all
    return Object.entries(map).map(([id, v]) => ({ id, ...v }))
  }, [staff, perfOrders, perfRes])

  const updateOrder = async (id: string, payload: any) => {
    const res = await fetch('/api/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...payload }) })
    if (res.ok) setOrders((rows:any[]) => rows.map(r => r.id === id ? { ...r, ...payload } : r))
  }
  const updateReservation = async (id: string, payload: any) => {
    const res = await fetch(`/api/reservations/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) setReservations((rows:any[]) => rows.map(r => r.id === id ? { ...r, ...payload } : r))
  }

  const createShift = async (payload: any) => {
    const res = await fetch('/api/shifts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      const newShift = await res.json()
      setShiftRows((rows: any[]) => [...rows, newShift])
      return { success: true }
    } else {
      const errorText = await res.text()
      return { success: false, error: errorText }
    }
  }
  const deleteShift = async (id: string) => {
    const res = await fetch(`/api/shifts?id=${id}`, { method: 'DELETE' })
    if (res.ok) setShiftRows((rows:any[]) => rows.filter(r => r.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {(['assign','performance','shifts'] as const).map(t => (
          <button key={t} onClick={()=>setTab(t)} className={`px-3 py-1 text-sm rounded border ${tab===t?'bg-brand text-white border-brand':''}`}>{t[0].toUpperCase()+t.slice(1)}</button>
        ))}
      </div>

      {tab === 'assign' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="p-3 rounded border">
            <div className="font-medium mb-2">Open Orders</div>
            <div className="space-y-2">
              {orders.map((o:any)=>(
                <div key={o.id} className="border rounded p-2">
                  <div className="flex items-center justify-between"><div className="text-sm">#{o.id.slice(0,6)} • ${Number(o.total).toFixed(2)}</div><div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div></div>
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-sm">Assign</label>
                    <select value={o.assignedToId || ''} onChange={(e)=>updateOrder(o.id, { assignedToId: e.target.value || null })} className="border rounded px-2 py-1 text-sm">
                      <option value="">Unassigned</option>
                      {staff.map((s:any)=>(<option key={s.id} value={s.id}>{s.name || s.email}</option>))}
                    </select>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <div className="text-sm text-gray-500">No open orders.</div>}
            </div>
          </section>
          <section className="p-3 rounded border">
            <div className="font-medium mb-2">Upcoming Reservations</div>
            <div className="space-y-2">
              {reservations.map((r:any)=>(
                <div key={r.id} className="border rounded p-2">
                  <div className="flex items-center justify-between"><div className="text-sm">{r.name} • Party {r.partySize}</div><div className="text-xs text-gray-500">{new Date(r.startTime).toLocaleString()}</div></div>
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-sm">Assign</label>
                    <select value={r.assignedToId || ''} onChange={(e)=>updateReservation(r.id, { assignedToId: e.target.value || null })} className="border rounded px-2 py-1 text-sm">
                      <option value="">Unassigned</option>
                      {staff.map((s:any)=>(<option key={s.id} value={s.id}>{s.name || s.email}</option>))}
                    </select>
                  </div>
                </div>
              ))}
              {reservations.length === 0 && <div className="text-sm text-gray-500">No upcoming reservations.</div>}
            </div>
          </section>
        </div>
      )}

      {tab === 'performance' && (
        <section className="p-3 rounded border">
          <div className="font-medium mb-2">Staff Performance (last 30 days)</div>
          <table className="w-full text-left text-sm">
            <thead><tr><th className="p-2">Staff</th><th className="p-2">Delivered Orders</th><th className="p-2">Reservations Handled</th></tr></thead>
            <tbody>
              {perf.map((p:any)=> (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.orders}</td>
                  <td className="p-2">{p.reservations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === 'shifts' && (
        <section className="p-3 rounded border space-y-3">
          <div className="font-medium">Manage Shifts</div>
          <ShiftForm staff={staff} onCreate={createShift} />
          <div className="divide-y rounded border">
            {shiftRows.map((s:any)=> (
              <div key={s.id} className="p-2 flex items-center justify-between">
                <div className="text-sm">{s.user?.name || s.user?.email} • {new Date(s.startTime).toLocaleString()} - {new Date(s.endTime).toLocaleString()}</div>
                <button onClick={()=>deleteShift(s.id)} className="text-xs px-2 py-1 border rounded">Delete</button>
              </div>
            ))}
            {shiftRows.length === 0 && <div className="p-2 text-sm text-gray-500">No shifts scheduled.</div>}
          </div>
        </section>
      )}
    </div>
  )
}

function ShiftForm({ staff, onCreate }: any) {
  const [userId, setUserId] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    
    if (!userId || !start || !end) {
      setError('Please fill in all required fields')
      return
    }

    const startDate = new Date(start)
    const endDate = new Date(end)
    
    if (endDate <= startDate) {
      setError('End time must be after start time')
      return
    }

    const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
    if (durationHours < 1) {
      setError('Shift must be at least 1 hour')
      return
    }

    setLoading(true)
    const result = await onCreate({ userId, startTime: start, endTime: end, note })
    setLoading(false)

    if (result?.success) {
      setUserId('')
      setStart('')
      setEnd('')
      setNote('')
    } else if (result?.error) {
      setError(result.error.replace('Bad Request: ', ''))
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Staff</div>
          <select value={userId} onChange={e=>setUserId(e.target.value)} className="border rounded px-2 py-1 text-sm min-w-40 dark:bg-gray-800 dark:border-gray-700">
            <option value="">Select staff</option>
            {staff.map((s:any)=> <option key={s.id} value={s.id}>{s.name || s.email}</option>)}
          </select>
        </div>
        <div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Start</div>
          <input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <div className="text-xs text-gray-600 dark:text-gray-400">End</div>
          <input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div className="flex-1 min-w-40">
          <div className="text-xs text-gray-600 dark:text-gray-400">Note</div>
          <input type="text" value={note} onChange={e=>setNote(e.target.value)} className="w-full border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700" placeholder="Optional" />
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="px-3 py-1 text-sm rounded border hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add shift'}
        </button>
      </div>
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  )
}
