"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, Mail, Lock, Save, CheckCircle, AlertCircle, Package, Calendar, ShoppingBag, LogOut, Edit2, X } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  items: { id: string; quantity: number }[]
}

interface Reservation {
  id: string
  startTime: string
  partySize: number
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
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
        const [profileRes, ordersRes, reservationsRes] = await Promise.all([
          fetch('/api/my/profile'),
          fetch('/api/my/orders'),
          fetch('/api/reservations?me=1')
        ])
        
        if (profileRes.ok) {
          const profile = await profileRes.json()
          setName(profile.name || '')
          setEmail(profile.email || '')
        }
        if (ordersRes.ok) setOrders(await ordersRes.json())
        if (reservationsRes.ok) setReservations(await reservationsRes.json())
      } catch (e: any) {
        setError(e?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleSave = async () => {
    setError(null)
    setSuccess(null)
    setSaving(true)
    try {
      const res = await fetch('/api/my/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: password.trim() ? password : undefined }),
      })
      if (!res.ok) throw new Error('Failed to update profile')
      setSuccess('Profile updated successfully!')
      setPassword('')
      setEditing(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (e: any) {
      setError(e?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      PREPARING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      READY: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      CANCELED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    }
    return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="card p-6 animate-pulse">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (signedIn === false) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign in Required</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Please sign in to view your profile</p>
          <Link href="/signin?callbackUrl=/profile" className="btn-primary inline-flex items-center gap-2">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
          <div className="card p-4 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 flex items-center gap-3 shadow-lg">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="card p-4 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Profile Card */}
        <div className="lg:col-span-1">
          <div className="card p-6 space-y-6 sticky top-24">
            {/* Avatar */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || 'U'}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{name || 'User'}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{email}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <Package className="w-5 h-5 mx-auto mb-1 text-red-500" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Orders</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reservations.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Reservations</p>
              </div>
            </div>

            {/* Edit Profile Button */}
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditing(false)
                  setPassword('')
                  setError(null)
                }}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}

            {/* Sign Out */}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Right Content - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          {editing && (
            <div className="card p-6 space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Profile</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" /> Name
                </label>
                <input
                  className="input-field"
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
                  className="input-field"
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
                  className="input-field"
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

          {/* Recent Orders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-red-500" />
                Recent Orders
              </h3>
              <Link href="/orders" className="text-sm text-red-500 hover:text-red-600 font-medium">
                View All
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">No orders yet</p>
                <Link href="/" className="btn-primary inline-flex items-center gap-2">
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders`}
                    className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            Order #{order.id.slice(0, 8)}
                          </p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })} • {order.items.length} items
                        </p>
                      </div>
                      <p className="text-lg font-bold gradient-text">${Number(order.total).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Reservations */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Upcoming Reservations
              </h3>
              <Link href="/reservations" className="text-sm text-red-500 hover:text-red-600 font-medium">
                View All
              </Link>
            </div>

            {reservations.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">No reservations yet</p>
                <Link href="/reservations" className="btn-primary inline-flex items-center gap-2">
                  Make Reservation
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.slice(0, 3).map((reservation) => (
                  <Link
                    key={reservation.id}
                    href="/reservations"
                    className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                          {new Date(reservation.startTime).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(reservation.startTime).toLocaleTimeString('en-US', {
                            hour: '2-digit', minute: '2-digit'
                          })} • Party of {reservation.partySize}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
