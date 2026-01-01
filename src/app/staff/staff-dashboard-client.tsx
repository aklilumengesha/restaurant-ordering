"use client"
import { useEffect, useState } from 'react'
import { Package, Calendar, Bell, Clock, Users, CheckCircle, XCircle, ChefHat, Truck, CalendarClock, ArrowRight, User, MapPin, ShoppingBag, Filter, Send, MessageSquare, AlertTriangle, Trash2, Eye, EyeOff, UtensilsCrossed, Search, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react'

const ORDER_STATUSES = ['PENDING','PREPARING','READY','DELIVERED'] as const
type OrderStatus = typeof ORDER_STATUSES[number]
type Category = 'APPETIZERS' | 'MAINS' | 'DESSERTS' | 'DRINKS'

type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: Category
  imageUrl?: string | null
  isActive: boolean
}

type Order = {
  id: string
  status: OrderStatus
  total: number
  createdAt: string
  user?: { id: string; name?: string; email: string }
  assignedTo?: { id: string; name?: string; email: string } | null
  assignedToId?: string | null
  items: { id: string; quantity: number; menuItem: { name: string; price: number } }[]
}
type StaffMember = { id: string; name?: string; email: string }
type Reservation = {
  id: string
  name: string
  email: string
  phone?: string | null
  partySize: number
  startTime: string
  endTime: string
  notes?: string | null
  status?: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'COMPLETED'
  assignedToId?: string | null
  assignedTo?: { id: string; name?: string; email: string } | null
}
type Shift = {
  id: string
  startTime: string
  endTime: string
  note?: string | null
}
type Notification = { id: string; type: string; title: string; message?: string | null; severity: string; createdAt: string; read?: boolean }

const notificationTypeConfig: Record<string, { icon: any; bg: string; text: string; label: string }> = {
  NEW_ORDER: { icon: Package, bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', label: 'New Order' },
  NEW_RESERVATION: { icon: Calendar, bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', label: 'New Reservation' },
  INTERNAL_NOTE: { icon: MessageSquare, bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', label: 'Staff Note' },
  KITCHEN_NOTE: { icon: ChefHat, bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', label: 'Kitchen' },
  SERVICE_NOTE: { icon: Users, bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', label: 'Service' },
  ERROR: { icon: AlertTriangle, bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', label: 'Error' },
}

const statusConfig = {
  PENDING: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: Clock, label: 'Pending', next: 'PREPARING' as OrderStatus },
  PREPARING: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: ChefHat, label: 'Preparing', next: 'READY' as OrderStatus },
  READY: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', icon: CheckCircle, label: 'Ready', next: 'DELIVERED' as OrderStatus },
  DELIVERED: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: Truck, label: 'Delivered', next: null },
}

export default function StaffDashboardClient({ initialOrders, initialReservations, myShifts = [] }: { initialOrders: Order[]; initialReservations: Reservation[]; myShifts?: Shift[] }) {
  const [tab, setTab] = useState<'orders'|'reservations'|'menu'|'shifts'|'notifications'>('orders')
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [shifts] = useState<Shift[]>(myShifts)
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [expandedReservation, setExpandedReservation] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [capacityUsed, setCapacityUsed] = useState<number>(0)
  const maxCapacity = 20 // This could come from env or settings
  
  // Menu states
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [menuLoading, setMenuLoading] = useState(false)
  const [menuSearch, setMenuSearch] = useState('')
  const [menuCategory, setMenuCategory] = useState<Category | 'ALL'>('ALL')
  const [updatingItem, setUpdatingItem] = useState<string | null>(null)
  
  // Notification states
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteMessage, setNewNoteMessage] = useState('')
  const [newNoteType, setNewNoteType] = useState<'INTERNAL_NOTE' | 'KITCHEN_NOTE' | 'SERVICE_NOTE'>('INTERNAL_NOTE')
  const [sendingNote, setSendingNote] = useState(false)
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'orders' | 'reservations' | 'notes'>('all')

  // Separate upcoming and past shifts
  const now = new Date()
  const upcomingShifts = shifts.filter(s => new Date(s.startTime) >= now)
  const pastShifts = shifts.filter(s => new Date(s.startTime) < now).slice(0, 5)

  // Fetch staff members for assignment
  useEffect(() => {
    fetch('/api/users?role=STAFF,ADMIN')
      .then(r => r.json())
      .then(setStaffMembers)
      .catch(() => {})
  }, [])

  // Fetch menu items when menu tab is selected
  useEffect(() => {
    if (tab === 'menu' && menuItems.length === 0) {
      setMenuLoading(true)
      fetch('/api/menu/all')
        .then(r => r.json())
        .then(setMenuItems)
        .catch(() => {
          // Fallback to regular menu endpoint
          fetch('/api/menu').then(r => r.json()).then(setMenuItems).catch(() => {})
        })
        .finally(() => setMenuLoading(false))
    }
  }, [tab, menuItems.length])

  const toggleItemAvailability = async (item: MenuItem) => {
    setUpdatingItem(item.id)
    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isActive: !item.isActive })
      })
      if (res.ok) {
        setMenuItems(items => items.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i))
      }
    } catch (e) {
      console.error('Failed to update item', e)
    } finally {
      setUpdatingItem(null)
    }
  }

  // Filter menu items
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                          item.description.toLowerCase().includes(menuSearch.toLowerCase())
    const matchesCategory = menuCategory === 'ALL' || item.category === menuCategory
    return matchesSearch && matchesCategory
  })

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
    if (res.ok) {
      const updated = await res.json()
      setOrders((rows) => rows.map(r => r.id === id ? { ...r, ...payload, assignedTo: staffMembers.find(s => s.id === payload.assignedToId) } : r))
    }
  }

  const advanceStatus = async (order: Order) => {
    const config = statusConfig[order.status]
    if (config.next) {
      await updateOrder(order.id, { status: config.next })
    }
  }

  // Filter orders
  const activeOrders = orders.filter(o => ['PENDING','PREPARING','READY'].includes(o.status))
  const filteredOrders = statusFilter === 'ALL' 
    ? activeOrders 
    : activeOrders.filter(o => o.status === statusFilter)

  // Order counts by status
  const orderCounts = {
    PENDING: orders.filter(o => o.status === 'PENDING').length,
    PREPARING: orders.filter(o => o.status === 'PREPARING').length,
    READY: orders.filter(o => o.status === 'READY').length,
  }

  const approve = async (id: string) => { await fetch(`/api/reservations/${id}/approve`, { method: 'POST' }); refreshReservations() }
  const reject = async (id: string) => { await fetch(`/api/reservations/${id}/reject`, { method: 'POST' }); refreshReservations() }
  const refreshReservations = async () => {
    const r = await fetch(`/api/reservations?date=${selectedDate}`, { cache: 'no-store' }).then(res => res.json())
    setReservations(r)
    // Calculate capacity used
    const totalGuests = r.reduce((sum: number, res: Reservation) => sum + res.partySize, 0)
    setCapacityUsed(totalGuests)
  }

  // Refresh reservations when date changes
  useEffect(() => {
    refreshReservations()
  }, [selectedDate])

  // Group reservations by time slot
  const groupedReservations = reservations.reduce((acc, r) => {
    const hour = new Date(r.startTime).getHours()
    const timeSlot = `${hour}:00`
    if (!acc[timeSlot]) acc[timeSlot] = []
    acc[timeSlot].push(r)
    return acc
  }, {} as Record<string, Reservation[]>)

  const sortedTimeSlots = Object.keys(groupedReservations).sort((a, b) => {
    return parseInt(a) - parseInt(b)
  })

  const tabs = [
    { key: 'orders', label: 'Orders', icon: Package, count: orders.filter((o:any)=> ['PENDING','PREPARING','READY'].includes(o.status)).length },
    { key: 'reservations', label: 'Reservations', icon: Calendar, count: reservations.length },
    { key: 'menu', label: 'Menu', icon: UtensilsCrossed, count: menuItems.filter(i => !i.isActive).length },
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
        <div className="space-y-6">
          {/* Status Overview Cards */}
          <div className="grid grid-cols-3 gap-4">
            {(['PENDING', 'PREPARING', 'READY'] as const).map(status => {
              const config = statusConfig[status]
              const Icon = config.icon
              const count = orderCounts[status]
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(statusFilter === status ? 'ALL' : status)}
                  className={`card p-4 text-left transition-all duration-200 ${
                    statusFilter === status ? 'ring-2 ring-red-500 shadow-lg' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${config.text}`} />
                    </div>
                    <span className={`text-2xl font-bold ${config.text}`}>{count}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">{config.label}</p>
                </button>
              )
            })}
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-red-500" />
              Orders Queue
              {statusFilter !== 'ALL' && (
                <span className={`badge ${statusConfig[statusFilter].bg} ${statusConfig[statusFilter].text}`}>
                  {statusConfig[statusFilter].label}
                </span>
              )}
            </h2>
            {statusFilter !== 'ALL' && (
              <button 
                onClick={() => setStatusFilter('ALL')}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" /> Clear filter
              </button>
            )}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="card p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                {statusFilter === 'ALL' ? 'No active orders' : `No ${statusConfig[statusFilter].label.toLowerCase()} orders`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => {
                const config = statusConfig[order.status]
                const StatusIcon = config.icon
                const isExpanded = expandedOrder === order.id
                
                return (
                  <div key={order.id} className="card overflow-hidden">
                    {/* Order Header */}
                    <div 
                      className="p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center`}>
                            <StatusIcon className={`w-6 h-6 ${config.text}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900 dark:text-white">#{order.id.slice(0,8)}</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                                {config.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {order.user?.name || order.user?.email || 'Customer'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{order.items.length} items</p>
                            <p className="text-xl font-bold gradient-text">${Number(order.total).toFixed(2)}</p>
                          </div>
                          <ArrowRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 p-5 space-y-4">
                        {/* Order Items */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Items</h4>
                          <div className="space-y-2">
                            {order.items.map(item => (
                              <div key={item.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  {item.quantity}x {item.menuItem.name}
                                </span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                  ${(Number(item.menuItem.price) * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Status Workflow */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Update Status</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            {ORDER_STATUSES.map((status, idx) => {
                              const sConfig = statusConfig[status]
                              const SIcon = sConfig.icon
                              const isActive = order.status === status
                              const isPast = ORDER_STATUSES.indexOf(order.status) > idx
                              
                              return (
                                <div key={status} className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      updateOrder(order.id, { status })
                                    }}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                      isActive 
                                        ? `${sConfig.bg} ${sConfig.text} ring-2 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-800 ${sConfig.text.replace('text-', 'ring-')}`
                                        : isPast
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                                        : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                                    }`}
                                  >
                                    <SIcon className="w-4 h-4" />
                                    {sConfig.label}
                                  </button>
                                  {idx < ORDER_STATUSES.length - 1 && (
                                    <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Quick Advance Button */}
                        {config.next && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              advanceStatus(order)
                            }}
                            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
                          >
                            <ArrowRight className="w-4 h-4" />
                            Move to {statusConfig[config.next].label}
                          </button>
                        )}

                        {/* Assign Staff */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Assign Delivery/Pickup
                          </h4>
                          <div className="flex items-center gap-3">
                            <select
                              value={order.assignedToId || ''}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation()
                                updateOrder(order.id, { assignedToId: e.target.value || null })
                              }}
                              className="input flex-1"
                            >
                              <option value="">Unassigned</option>
                              {staffMembers.map(staff => (
                                <option key={staff.id} value={staff.id}>
                                  {staff.name || staff.email}
                                </option>
                              ))}
                            </select>
                            {order.assignedTo && (
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                                  {order.assignedTo.name || order.assignedTo.email}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'reservations' && (
        <div className="space-y-6">
          {/* Capacity Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{reservations.length}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Total Bookings</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{capacityUsed}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Total Guests</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  capacityUsed >= maxCapacity ? 'bg-red-100 dark:bg-red-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'
                }`}>
                  <MapPin className={`w-5 h-5 ${
                    capacityUsed >= maxCapacity ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`} />
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${
                    capacityUsed >= maxCapacity ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>{maxCapacity - capacityUsed}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">/{maxCapacity}</span>
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Seats Available</p>
              {/* Capacity Bar */}
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    capacityUsed >= maxCapacity ? 'bg-red-500' : capacityUsed >= maxCapacity * 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min((capacityUsed / maxCapacity) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-500" />
              Reservations
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const d = new Date(selectedDate)
                  d.setDate(d.getDate() - 1)
                  setSelectedDate(d.toISOString().slice(0, 10))
                }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input py-2 px-3"
              />
              <button
                onClick={() => {
                  const d = new Date(selectedDate)
                  d.setDate(d.getDate() + 1)
                  setSelectedDate(d.toISOString().slice(0, 10))
                }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Today
              </button>
            </div>
          </div>

          {/* Reservations List */}
          {reservations.length === 0 ? (
            <div className="card p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No reservations for this date</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedTimeSlots.map(timeSlot => (
                <div key={timeSlot} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {parseInt(timeSlot) > 12 ? `${parseInt(timeSlot) - 12}:00 PM` : `${timeSlot} AM`}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {groupedReservations[timeSlot].length} booking{groupedReservations[timeSlot].length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="space-y-3 pl-4">
                    {groupedReservations[timeSlot].map(r => {
                      const isExpanded = expandedReservation === r.id
                      const statusColors = {
                        PENDING: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
                        CONFIRMED: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
                        REJECTED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
                        COMPLETED: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
                      }
                      
                      return (
                        <div key={r.id} className="card overflow-hidden">
                          <div 
                            className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            onClick={() => setExpandedReservation(isExpanded ? null : r.id)}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                  {r.partySize}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900 dark:text-white">{r.name}</span>
                                    {r.status && (
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || statusColors.PENDING}`}>
                                        {r.status}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(r.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    {' - '}
                                    {new Date(r.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); approve(r.id) }} 
                                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium text-sm hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="hidden sm:inline">Confirm</span>
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); reject(r.id) }} 
                                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                >
                                  <XCircle className="w-4 h-4" />
                                  <span className="hidden sm:inline">Reject</span>
                                </button>
                                <ArrowRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              </div>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 p-4 space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Information</h4>
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                      <User className="w-4 h-4" />
                                      {r.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                      <Bell className="w-4 h-4" />
                                      {r.email}
                                    </p>
                                    {r.phone && (
                                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        {r.phone}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Booking Details</h4>
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                      <Users className="w-4 h-4" />
                                      Party of {r.partySize}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                      <Clock className="w-4 h-4" />
                                      {new Date(r.startTime).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {r.notes && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Special Requests</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    {r.notes}
                                  </p>
                                </div>
                              )}

                              {/* Assign Table/Staff */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  Assign Staff
                                </h4>
                                <select
                                  value={r.assignedToId || ''}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={async (e) => {
                                    e.stopPropagation()
                                    await fetch(`/api/reservations/${r.id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ assignedToId: e.target.value || null })
                                    })
                                    refreshReservations()
                                  }}
                                  className="input w-full"
                                >
                                  <option value="">Unassigned</option>
                                  {staffMembers.map(staff => (
                                    <option key={staff.id} value={staff.id}>
                                      {staff.name || staff.email}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Quick Actions */}
                              <div className="flex gap-2 pt-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); approve(r.id) }}
                                  className="flex-1 py-2.5 rounded-xl font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Confirm Booking
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); reject(r.id) }}
                                  className="flex-1 py-2.5 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject Booking
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'menu' && (
        <div className="space-y-6">
          {/* Menu Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{menuItems.length}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Total Items</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{menuItems.filter(i => i.isActive).length}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Available</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">{menuItems.filter(i => !i.isActive).length}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Sold Out</p>
            </div>
            <div className="card p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <p className="text-sm text-amber-700 dark:text-amber-400">Staff can only toggle availability</p>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search menu items..."
                className="input pl-10 w-full"
              />
            </div>
            <div className="flex gap-2">
              {(['ALL', 'APPETIZERS', 'MAINS', 'DESSERTS', 'DRINKS'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setMenuCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    menuCategory === cat
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items List */}
          {menuLoading ? (
            <div className="card p-12 text-center">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Loading menu items...</p>
            </div>
          ) : filteredMenuItems.length === 0 ? (
            <div className="card p-12 text-center">
              <UtensilsCrossed className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No menu items found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredMenuItems.map(item => (
                <div 
                  key={item.id} 
                  className={`card p-4 transition-all duration-200 ${
                    !item.isActive ? 'opacity-60 bg-gray-50 dark:bg-gray-800/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UtensilsCrossed className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.isActive 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {item.isActive ? 'Available' : 'Sold Out'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{item.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-lg font-bold gradient-text">${Number(item.price).toFixed(2)}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Toggle Button */}
                    <button
                      disabled={updatingItem === item.id}
                      onClick={() => toggleItemAvailability(item)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                        item.isActive
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                      }`}
                    >
                      {updatingItem === item.id ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : item.isActive ? (
                        <>
                          <ToggleRight className="w-5 h-5" />
                          <span className="hidden sm:inline">Mark Sold Out</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5" />
                          <span className="hidden sm:inline">Mark Available</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-4">
            <button
              onClick={async () => {
                const soldOut = menuItems.filter(i => i.isActive)
                if (soldOut.length === 0) return
                if (!confirm(`Mark all ${soldOut.length} items as sold out?`)) return
                for (const item of soldOut) {
                  await toggleItemAvailability(item)
                }
              }}
              className="flex-1 py-3 rounded-xl font-medium border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Mark All Sold Out
            </button>
            <button
              onClick={async () => {
                const available = menuItems.filter(i => !i.isActive)
                if (available.length === 0) return
                if (!confirm(`Mark all ${available.length} items as available?`)) return
                for (const item of available) {
                  await toggleItemAvailability(item)
                }
              }}
              className="flex-1 py-3 rounded-xl font-medium border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark All Available
            </button>
          </div>
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
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">{notifs.filter(n => !n.read).length}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Unread</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{notifs.filter(n => n.type === 'NEW_ORDER').length}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Orders</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{notifs.filter(n => n.type === 'NEW_RESERVATION').length}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Reservations</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{notifs.filter(n => ['INTERNAL_NOTE', 'KITCHEN_NOTE', 'SERVICE_NOTE'].includes(n.type)).length}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Staff Notes</p>
            </div>
          </div>

          {/* Create Internal Note */}
          <div className="card p-5 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              Send Internal Note
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Note Type</label>
                <select
                  value={newNoteType}
                  onChange={(e) => setNewNoteType(e.target.value as any)}
                  className="input"
                >
                  <option value="INTERNAL_NOTE">General Staff Note</option>
                  <option value="KITCHEN_NOTE">Kitchen Note</option>
                  <option value="SERVICE_NOTE">Service Note</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="e.g., Table 5 needs attention"
                  className="input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message (optional)</label>
              <textarea
                value={newNoteMessage}
                onChange={(e) => setNewNoteMessage(e.target.value)}
                placeholder="Add more details..."
                className="input min-h-[80px] resize-none"
              />
            </div>
            <button
              disabled={sendingNote || !newNoteTitle.trim()}
              onClick={async () => {
                setSendingNote(true)
                try {
                  await fetch('/api/notifications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      type: newNoteType,
                      title: newNoteTitle,
                      message: newNoteMessage || undefined,
                      severity: 'info'
                    })
                  })
                  setNewNoteTitle('')
                  setNewNoteMessage('')
                  // Refresh notifications
                  const n = await fetch('/api/notifications').then(r => r.json())
                  setNotifs(n)
                } catch (e) {
                  console.error('Failed to send note', e)
                } finally {
                  setSendingNote(false)
                }
              }}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {sendingNote ? 'Sending...' : 'Send Note'}
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-500" />
              Notifications
            </h2>
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'orders', label: 'Orders' },
                { key: 'reservations', label: 'Reservations' },
                { key: 'notes', label: 'Notes' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setNotifFilter(f.key as any)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    notifFilter === f.key
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          {(() => {
            let filtered = notifs
            if (notifFilter === 'unread') filtered = notifs.filter(n => !n.read)
            else if (notifFilter === 'orders') filtered = notifs.filter(n => n.type === 'NEW_ORDER')
            else if (notifFilter === 'reservations') filtered = notifs.filter(n => n.type === 'NEW_RESERVATION')
            else if (notifFilter === 'notes') filtered = notifs.filter(n => ['INTERNAL_NOTE', 'KITCHEN_NOTE', 'SERVICE_NOTE'].includes(n.type))

            if (filtered.length === 0) {
              return (
                <div className="card p-12 text-center">
                  <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No notifications</p>
                </div>
              )
            }

            return (
              <div className="space-y-3">
                {filtered.map(n => {
                  const config = notificationTypeConfig[n.type] || notificationTypeConfig.INTERNAL_NOTE
                  const Icon = config.icon
                  const isNew = !n.read && (Date.now() - new Date(n.createdAt).getTime()) < 300000 // 5 minutes
                  
                  return (
                    <div 
                      key={n.id} 
                      className={`card p-4 transition-all duration-200 ${
                        !n.read ? 'border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                          <Icon className={`w-5 h-5 ${config.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className={`font-medium ${!n.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {n.title}
                                </p>
                                {isNew && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white animate-pulse">
                                    NEW
                                  </span>
                                )}
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                                  {config.label}
                                </span>
                              </div>
                              {n.message && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{n.message}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(n.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={async () => {
                                  await fetch('/api/notifications', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ id: n.id, read: !n.read })
                                  })
                                  setNotifs(notifs.map(notif => 
                                    notif.id === n.id ? { ...notif, read: !n.read } : notif
                                  ))
                                }}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title={n.read ? 'Mark as unread' : 'Mark as read'}
                              >
                                {n.read ? (
                                  <EyeOff className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                )}
                              </button>
                              <button
                                onClick={async () => {
                                  await fetch(`/api/notifications?id=${n.id}`, { method: 'DELETE' })
                                  setNotifs(notifs.filter(notif => notif.id !== n.id))
                                }}
                                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                title="Delete notification"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })()}

          {/* Mark All as Read */}
          {notifs.some(n => !n.read) && (
            <button
              onClick={async () => {
                await Promise.all(
                  notifs.filter(n => !n.read).map(n =>
                    fetch('/api/notifications', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: n.id, read: true })
                    })
                  )
                )
                setNotifs(notifs.map(n => ({ ...n, read: true })))
              }}
              className="w-full py-3 rounded-xl font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark All as Read
            </button>
          )}
        </div>
      )}
    </div>
  )
}
