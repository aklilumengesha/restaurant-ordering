"use client"
import { useEffect, useState } from 'react'
import { Package, Calendar, Bell, Clock, Users, CheckCircle, XCircle, ChefHat, Truck, CalendarClock } from 'lucide-react'

const ORDER_STATUSES = ['PENDING','PREPARING','READY','DELIVERED'] as const

type Order = any
type Reservation = {
  id: string
  name: string
  email: string
  phone?: string | null
  partySize: number
  startTime: string
  endTime: string
  assignedToId?: string | null
}
type Shift = {
  id: string
  startTime: string
  endTime: string
  note?: string | null
}
type Notification = { id: string; title: string; message?: string | null; severity: string; createdAt: string; read?: boolean }

const statusConfig = {
  PENDING: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: Clock },
  PREPARING: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: ChefHat },
  READY: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', icon: CheckCircle },
  DELIVERED: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: Truck },
}

export default function StaffDashboardClient({ initialOrders, initialReservations, myShifts = [] }: { initialOrders: Order[]; initialReservations: Reservation[]; myShifts?: Shift[] }) {
  const [tab, setTab] = useState<'orders'|'reservations'|'shifts'|'notifications'>('orders')
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [shifts] = useState<Shift[]>(myShifts)
  const [notifs, setNotifs] = useState<Notification[]>([])

  // Separate upcoming and past shifts
  const now = new Date()
  const upcomingShifts = shifts.filter(s => new Date(s.startTime) >= now)
  const pastShifts = shifts.filter(s => new Date(s.startTime) < now).slice(0, 5)

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const [o, r, n] = await Promise.all([
          fetch('/api/orders', { cache: 'no-store' }).then(res => res.json()).catch(()=>[]),
          fetch(`/api/reservations?date=${new Date().toISOString().slice(0,10)}`, { cache: 'no-store' }).then(res => res.json()).catch(()=>[]),
          fetch('/api/notifications', { cache: 'no-store' }).then(res => res.ok ? res.json() : []).catch(()=>[]),
        ])
        setOrders(o)
        setReservations(r)
        setNotifs(n)
      } catch {}
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const updateOrder = async (id: string, payload: any) => {
    const res = await fetch('/api/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...payload }) })
    if (res.ok) setOrders((rows:any[]) => rows.map(r => r.id === id ? { ...r, ...payload } : r))
  }

  const approve = async (id: string) => { await fetch(`/api/reservations/${id}/approve`, { method: 'POST' }); refreshReservations() }
  const reject = async (id: string) => { await fetch(`/api/reservations/${id}/reject`, { method: 'POST' }); refreshReservations() }
  const refreshReservations = async () => {
    const r = await fetch(`/api/reservations?date=${new Date().toISOString().slice(0,10)}`, { cache: 'no-store' }).then(res => res.json())
    setReservations(r)
  }

  const tabs = [
    { key: 'orders', label: 'Orders', icon: Package, count: orders.filter((o:any)=> ['PENDING','PREPARING','READY'].includes(o.status)).length },
    { key: 'reservations', label: 'Reservations', icon: Calendar, count: reservations.length },
    { key: 'shifts', label: 'My Shifts', icon: CalendarClock, count: upcomingShifts.length },
    { key: 'notifications', label: 'Notifications', icon: Bell, count: notifs.filter(n => !n.read).length },
  ] as const

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="section-title">Staff Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage orders and reservations</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map(t => {
          const Icon = t.icon
          const isActive = tab === t.key
          return (
            <button 
              key={t.key} 
              onClick={() => setTab(t.key as any)} 
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md' 
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
              {t.count > 0 && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {tab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-red-500" />
            Active Orders
          </h2>
          {orders.filter((o:any)=> ['PENDING','PREPARING','READY'].includes(o.status)).length === 0 ? (
            <div className="card p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No pending orders</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.filter((o:any)=> ['PENDING','PREPARING','READY'].includes(o.status)).map(o => {
                const config = statusConfig[o.status as keyof typeof statusConfig]
                const StatusIcon = config?.icon || Clock
                return (
                  <div key={o.id} className="card p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${config?.bg} flex items-center justify-center`}>
                          <StatusIcon className={`w-6 h-6 ${config?.text}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white">#{o.id.slice(0,8)}</span>
                            <span className={`badge ${config?.bg} ${config?.text}`}>{o.status}</span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{o.user?.email || 'Customer'}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(o.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold gradient-text">${Number(o.total).toFixed(2)}</span>
                        <select 
                          value={o.status} 
                          onChange={(e) => updateOrder(o.id, { status: e.target.value })} 
                          className="input w-auto py-2"
                        >
                          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'reservations' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-500" />
            Upcoming Reservations
          </h2>
          {reservations.length === 0 ? (
            <div className="card p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No upcoming reservations</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reservations.map(r => (
                <div key={r.id} className="card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{r.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Party of {r.partySize}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(r.startTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => approve(r.id)} 
                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium text-sm hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirm
                      </button>
                      <button 
                        onClick={() => reject(r.id)} 
                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'shifts' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-red-500" />
              Upcoming Shifts
            </h2>
            {upcomingShifts.length === 0 ? (
              <div className="card p-12 text-center">
                <CalendarClock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No upcoming shifts scheduled</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {upcomingShifts.map(s => {
                  const startDate = new Date(s.startTime)
                  const endDate = new Date(s.endTime)
                  const isToday = startDate.toDateString() === now.toDateString()
                  const isTomorrow = startDate.toDateString() === new Date(now.getTime() + 86400000).toDateString()
                  
                  return (
                    <div key={s.id} className="card p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isToday ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                          }`}>
                            <CalendarClock className={`w-6 h-6 ${
                              isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                              </p>
                              {isToday && (
                                <span className="badge bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Today</span>
                              )}
                              {isTomorrow && (
                                <span className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">Tomorrow</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {s.note && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Note: {s.note}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {Math.round((endDate.getTime() - startDate.getTime()) / 3600000)} hours
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {pastShifts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                Recent Shifts
              </h2>
              <div className="grid gap-3">
                {pastShifts.map(s => {
                  const startDate = new Date(s.startTime)
                  const endDate = new Date(s.endTime)
                  
                  return (
                    <div key={s.id} className="card p-4 opacity-70">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                              {startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{Math.round((endDate.getTime() - startDate.getTime()) / 3600000)}h</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'notifications' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" />
            Notifications
          </h2>
          {notifs.length === 0 ? (
            <div className="card p-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifs.map(n => (
                <div key={n.id} className="card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        n.severity === 'error' ? 'bg-red-100 dark:bg-red-900/30' : 
                        n.severity === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' : 
                        'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        <Bell className={`w-5 h-5 ${
                          n.severity === 'error' ? 'text-red-600 dark:text-red-400' : 
                          n.severity === 'warning' ? 'text-amber-600 dark:text-amber-400' : 
                          'text-blue-600 dark:text-blue-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{n.title}</p>
                        {n.message && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{n.message}</p>}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
