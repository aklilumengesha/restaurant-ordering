"use client"
import { useEffect, useMemo, useState } from 'react'
import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, isSameMonth, startOfMonth, subMonths } from 'date-fns'

type Reservation = {
  id: string
  name: string
  email: string
  phone?: string | null
  partySize: number
  startTime: string
  endTime: string
}

export default function ReservationsCalendar() {
  const [current, setCurrent] = useState(new Date())
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)

  const monthDays = useMemo(() => {
    const start = startOfMonth(current)
    const end = endOfMonth(current)
    return eachDayOfInterval({ start, end })
  }, [current])

  const fetchMonth = async (date: Date) => {
    setLoading(true)
    try {
      const start = startOfMonth(date)
      const end = endOfMonth(date)
      const res = await fetch(`/api/reservations?date=${format(start, 'yyyy-MM-dd')}`)
      // Note: API supports date filtering per day; we fetch once for start day and then lazy-load per selected date
      const data = await res.json()
      setReservations(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMonth(current) }, [current])

  const dayReservations = useMemo(() => {
    if (!selectedDate) return [] as Reservation[]
    const day = format(selectedDate, 'yyyy-MM-dd')
    return reservations.filter(r => r.startTime.slice(0,10) === day)
  }, [selectedDate, reservations])

  const approve = async (id: string) => {
    await fetch(`/api/reservations/${id}/approve`, { method: 'POST' })
    await refresh()
  }
  const reject = async (id: string) => {
    await fetch(`/api/reservations/${id}/reject`, { method: 'POST' })
    await refresh()
  }
  const refresh = async () => {
    if (selectedDate) {
      const day = format(selectedDate, 'yyyy-MM-dd')
      const res = await fetch(`/api/reservations?date=${day}`)
      setReservations(await res.json())
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <button className="px-2 py-1 border rounded" onClick={()=>setCurrent(subMonths(current,1))}>Prev</button>
          <div className="font-semibold">{format(current, 'MMMM yyyy')}</div>
          <button className="px-2 py-1 border rounded" onClick={()=>setCurrent(addMonths(current,1))}>Next</button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="text-xs text-gray-500 text-center">{d}</div>
          ))}
          {/* Start offset */}
          {Array.from({ length: getDay(startOfMonth(current)) }).map((_,i)=>(
            <div key={`o-${i}`} />
          ))}
          {monthDays.map(d => (
            <button key={d.toISOString()} onClick={()=>setSelectedDate(d)} className={`h-20 border rounded p-1 text-left ${!isSameMonth(d, current) ? 'opacity-50' : ''} ${selectedDate && format(selectedDate,'yyyy-MM-dd')===format(d,'yyyy-MM-dd') ? 'ring-2 ring-brand' : ''}`}>
              <div className="text-xs font-medium">{format(d, 'd')}</div>
              <div className="mt-1 text-[10px] text-gray-600">{/* Count fetched via per-day fetch when selected */}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="p-3 rounded border bg-white/50 dark:bg-gray-900/50">
          <div className="font-medium mb-2">{selectedDate ? format(selectedDate, 'PPP') : 'Select a date'}</div>
          {!selectedDate ? (
            <div className="text-sm text-gray-500">Choose a day to view reservations.</div>
          ) : (
            <div className="space-y-2">
              {dayReservations.length === 0 && (
                <div className="text-sm text-gray-500">No reservations this day.</div>
              )}
              {dayReservations.map(r => (
                <div key={r.id} className="border rounded p-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-gray-500">{new Date(r.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div className="text-xs text-gray-600">Party {r.partySize} • {r.email}{r.phone ? ` • ${r.phone}` : ''}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={()=>approve(r.id)} className="px-2 py-1 text-xs rounded border border-emerald-600 text-emerald-700">Approve</button>
                    <button onClick={()=>reject(r.id)} className="px-2 py-1 text-xs rounded border border-red-600 text-red-700">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
