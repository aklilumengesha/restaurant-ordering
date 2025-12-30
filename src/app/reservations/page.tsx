"use client"
import { useEffect, useState } from 'react'
import { Calendar, Clock, Users, Phone, Mail, User, FileText, CheckCircle, AlertCircle } from 'lucide-react'

export default function ReservationsPage() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/auth/session')
        const session = await res.json()
        if (!mounted) return
        setSignedIn(!!session?.user)
      } catch {
        if (!mounted) return
        setSignedIn(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const [form, setForm] = useState({ name: '', email: '', phone: '', partySize: 2, date: '', time: '', notes: '' })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [myReservations, setMyReservations] = useState<any[]>([])

  useEffect(() => {
    if (signedIn) {
      fetch('/api/my/profile').then(r => r.json()).then(p => setForm(f => ({ ...f, name: p.name || '', email: p.email || '' }))).catch(() => {})
      fetch('/api/reservations?me=1').then(r => r.json()).then(setMyReservations).catch(() => {})
    }
  }, [signedIn])

  const handleSubmit = async () => {
    setBusy(true)
    setMsg(null)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      })
      if (!res.ok) throw new Error(await res.text())
      setMsg({ type: 'success', text: 'Reservation confirmed! A confirmation email has been sent.' })
      setForm((f) => ({ ...f, phone: '', notes: '', date: '', time: '' }))
      const mine = await fetch('/api/reservations?me=1').then(r => r.json())
      setMyReservations(mine)
    } catch (e: any) {
      setMsg({ type: 'error', text: e?.message || 'Failed to create reservation' })
    } finally { 
      setBusy(false) 
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="section-title">Reserve a Table</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Book your dining experience with us</p>
      </div>

      {!signedIn && signedIn !== null && (
        <div className="card p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            You can fill the form, but you need to{' '}
            <a href="/signin?callbackUrl=/reservations" className="font-semibold underline hover:no-underline">sign in</a>
            {' '}to confirm your reservation.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reservation Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" /> Name
                </label>
                <input 
                  placeholder="Your name" 
                  className="input" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <input 
                  placeholder="your@email.com" 
                  type="email" 
                  className="input" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone
                </label>
                <input 
                  placeholder="(555) 123-4567" 
                  className="input" 
                  value={form.phone} 
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Party Size
                </label>
                <input 
                  type="number" 
                  min={1} 
                  className="input" 
                  value={form.partySize} 
                  onChange={(e) => setForm({ ...form, partySize: Math.max(1, Number(e.target.value)||1) })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Date
                </label>
                <input 
                  type="date" 
                  className="input" 
                  value={form.date} 
                  onChange={(e) => setForm({ ...form, date: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Time
                </label>
                <input 
                  type="time" 
                  className="input" 
                  value={form.time} 
                  onChange={(e) => setForm({ ...form, time: e.target.value })} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Special Requests (optional)
              </label>
              <textarea 
                placeholder="Any dietary restrictions, special occasions, or preferences..." 
                className="input min-h-[100px] resize-none" 
                value={form.notes} 
                onChange={(e) => setForm({ ...form, notes: e.target.value })} 
              />
            </div>

            {msg && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                msg.type === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                {msg.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <p className={`text-sm ${msg.type === 'success' ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                  {msg.text}
                </p>
              </div>
            )}

            <button
              disabled={busy || !signedIn}
              onClick={handleSubmit}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                signedIn 
                  ? 'btn-primary' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {signedIn ? (busy ? 'Booking...' : 'Confirm Reservation') : 'Sign in to Confirm'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Reservations</h2>
            {!signedIn ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to view your reservations.</p>
            ) : myReservations.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No reservations yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myReservations.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-1">
                      <Calendar className="w-4 h-4 text-red-500" />
                      {new Date(r.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {new Date(r.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Users className="w-4 h-4" />
                      Party of {r.partySize}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
