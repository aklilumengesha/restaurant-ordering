"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, Mail, Lock, Save, CheckCircle, AlertCircle, Package, Calendar, Clock, Users, ArrowRight, ShoppingBag, Settings } from 'lucide-react'

type TabType = 'settings' | 'orders' | 'reservations'

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  items: { id: string; quantity: number; menuItem: { name: string } }[]
}

interface Reservation {
  id: string
  startTime: string
  partySize: number
  status: string
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('settings')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [reservationsLoading, setReservationsLoading] = useState(false)

  useEffect(() => {
    let mounted = true
      ; (async () => {
        const resSession = await fetch('/api/auth/session')
        const session = await resSession.json()
        if (!mounted) return
        if (!session?.user) {
          setSignedIn(false)
          setLoading(false)
          return
        }
        setSignedIn(true)
        try {
          const res = await fetch('/api/my/profile')
          if (!res.ok) throw new Error('Failed to load profile')
          const json = await res.json()
          if (!mounted) return
          setName(json.name || '')
          setEmail(json.email || '')
        } catch (e: any) {
          setError(e?.message || 'Failed to load profile')
        } finally {
          setLoading(false)
        }
      })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (signedIn && activeTab === 'orders' && orders.length === 0) {
      setOrdersLoading(true)
      fetch('/api/my/orders')
        .then(r => r.json())
        .then(setOrders)
        .catch(() => { })
        .finally(() => setOrdersLoading(false))
    }
  }, [signedIn, activeTab, orders.length])

  useEffect(() => {
    if (signedIn && activeTab === 'reservations' && reservations.length === 0) {
      setReservationsLoading(true)
      fetch('/api/reservations?me=1')
        .then(r => r.json())
        .then(setReservations)
        .catch(() => { })
        .finally(() => setReservationsLoading(false))
    }
  }, [signedIn, activeTab, reservations.length])

  const handleSave = async () => {
    setError(null)
    setOk(null)
    setSaving(true)
    try {
      const res = await fetch('/api/my/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: password.trim() ? password : undefined }),
      })
      if (!res.ok) throw new Error('Failed to update profile')
      setOk('Profile saved successfully!')
      setPassword('')
    } catch (e: any) {
      setError(e?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card p-8 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (signedIn === false) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Sign in to manage your profile settings.</p>
          <a href="/signin?callbackUrl=/profile" className="btn-primary inline-flex items-center gap-2">
            Sign in to continue
          </a>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
    { id: 'orders' as TabType, label: 'Orders', icon: Package },
    { id: 'reservations' as TabType, label: 'Reservations', icon: Calendar },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      PREPARING: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      READY: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="section-title">My Account</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your profile, orders, and reservations</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="card p-6 space-y-6 animate-in fade-in duration-200">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {ok && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <p className="text-sm text-emerald-700 dark:text-emerald-300">{ok}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <User className="w-4 h-4" /> Name
            </label>
            <input
              className="input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Lock className="w-4 h-4" /> New Password
            </label>
            <input
              className="input"
              type="password"
              placeholder="Leave blank to keep current"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">Only fill this if you want to change your password</p>
          </div>

          <button
            disabled={saving}
            onClick={handleSave}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {ordersLoading ? (
            <div className="card p-8">
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-500 dark:text-gray-400">Loading orders...</span>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Start exploring our menu and place your first order!</p>
              <Link href="/" className="btn-primary inline-flex items-center gap-2">
                Browse Menu
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="card p-5 hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Order #{order.id.slice(0, 8)}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                      <p className="text-xl font-bold gradient-text">${Number(order.total).toFixed(2)}</p>
                    </div>
                    <Link href={`/orders/${order.id}`} className="btn-secondary flex items-center gap-2">
                      View <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reservations Tab */}
      {activeTab === 'reservations' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {reservationsLoading ? (
            <div className="card p-8">
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-500 dark:text-gray-400">Loading reservations...</span>
              </div>
            </div>
          ) : reservations.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No reservations yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Book a table for your next dining experience!</p>
              <Link href="/reservations" className="btn-primary inline-flex items-center gap-2">
                Make a Reservation
              </Link>
            </div>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation.id} className="card p-5 hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {new Date(reservation.startTime).toLocaleDateString('en-US', {
                            weekday: 'long', month: 'long', day: 'numeric'
                          })}
                        </h3>
                        {reservation.status && (
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                            {reservation.status}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {new Date(reservation.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          Party of {reservation.partySize}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href="/reservations" className="btn-secondary flex items-center gap-2">
                    Manage <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
