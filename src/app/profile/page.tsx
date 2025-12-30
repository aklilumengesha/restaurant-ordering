"use client"
import { useEffect, useState } from 'react'
import { User, Mail, Lock, Save, CheckCircle, AlertCircle } from 'lucide-react'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signedIn, setSignedIn] = useState<boolean | null>(null)

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

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="section-title">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account information</p>
      </div>

      <div className="card p-6 space-y-6">
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
    </div>
  )
}
