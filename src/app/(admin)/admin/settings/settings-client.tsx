'use client'

import { useState } from 'react'
import { Store, CreditCard, Bell, Save, Eye, EyeOff, Clock } from 'lucide-react'

type OpeningHours = {
  [key: string]: { open: string; close: string; closed: boolean }
}

type Settings = {
  id: string
  restaurantName: string
  restaurantLogo: string | null
  restaurantPhone: string | null
  restaurantEmail: string | null
  restaurantAddress: string | null
  openingHours: OpeningHours | null
  paymentGateway: string
  stripePublicKey: string | null
  stripeSecretKey: string | null
  paypalClientId: string | null
  paypalClientSecret: string | null
  squareAccessToken: string | null
  squareLocationId: string | null
  emailNotifications: boolean
  smsNotifications: boolean
  smtpHost: string | null
  smtpPort: number | null
  smtpUser: string | null
  smtpPassword: string | null
  smtpFromEmail: string | null
  twilioAccountSid: string | null
  twilioAuthToken: string | null
  twilioPhoneNumber: string | null
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const defaultHours: OpeningHours = DAYS.reduce((acc, day) => {
  acc[day] = { open: '09:00', close: '22:00', closed: false }
  return acc
}, {} as OpeningHours)

export function SettingsClient({ initialSettings }: { initialSettings: Settings }) {
  const [activeTab, setActiveTab] = useState<'restaurant' | 'payment' | 'notifications'>('restaurant')
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})

  const openingHours: OpeningHours = (settings.openingHours as OpeningHours) || defaultHours

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Failed to save settings')
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof Settings, value: unknown) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const updateHours = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    const newHours = { ...openingHours }
    newHours[day] = { ...newHours[day], [field]: value }
    updateField('openingHours', newHours)
  }

  const toggleSecret = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const tabs = [
    { id: 'restaurant' as const, label: 'Restaurant Info', icon: Store },
    { id: 'payment' as const, label: 'Payment Gateway', icon: CreditCard },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">System Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Configure your restaurant settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${
          message.type === 'success' 
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Restaurant Info Tab */}
      {activeTab === 'restaurant' && (
        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Store className="w-5 h-5" />
            Restaurant Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                value={settings.restaurantName}
                onChange={e => updateField('restaurantName', e.target.value)}
                className="input-field"
                placeholder="My Restaurant"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Logo URL
              </label>
              <input
                type="text"
                value={settings.restaurantLogo || ''}
                onChange={e => updateField('restaurantLogo', e.target.value)}
                className="input-field"
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.restaurantPhone || ''}
                onChange={e => updateField('restaurantPhone', e.target.value)}
                className="input-field"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={settings.restaurantEmail || ''}
                onChange={e => updateField('restaurantEmail', e.target.value)}
                className="input-field"
                placeholder="contact@restaurant.com"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <textarea
                value={settings.restaurantAddress || ''}
                onChange={e => updateField('restaurantAddress', e.target.value)}
                className="input-field"
                rows={2}
                placeholder="123 Main St, City, State 12345"
              />
            </div>
          </div>

          {/* Opening Hours */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4" />
              Opening Hours
            </h3>
            <div className="space-y-3">
              {DAYS.map(day => (
                <div key={day} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="w-28 font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {day}
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!openingHours[day]?.closed}
                      onChange={e => updateHours(day, 'closed', !e.target.checked)}
                      className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Open</span>
                  </label>
                  {!openingHours[day]?.closed && (
                    <>
                      <input
                        type="time"
                        value={openingHours[day]?.open || '09:00'}
                        onChange={e => updateHours(day, 'open', e.target.value)}
                        className="input-field w-32"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={openingHours[day]?.close || '22:00'}
                        onChange={e => updateHours(day, 'close', e.target.value)}
                        className="input-field w-32"
                      />
                    </>
                  )}
                  {openingHours[day]?.closed && (
                    <span className="text-gray-500 dark:text-gray-400 italic">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Tab */}
      {activeTab === 'payment' && (
        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Gateway Configuration
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Provider
            </label>
            <select
              value={settings.paymentGateway}
              onChange={e => updateField('paymentGateway', e.target.value)}
              className="input-field"
            >
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="square">Square</option>
            </select>
          </div>

          {/* Stripe Settings */}
          {settings.paymentGateway === 'stripe' && (
            <div className="space-y-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <h3 className="font-medium text-purple-900 dark:text-purple-300">Stripe Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Public Key
                  </label>
                  <input
                    type="text"
                    value={settings.stripePublicKey || ''}
                    onChange={e => updateField('stripePublicKey', e.target.value)}
                    className="input-field"
                    placeholder="pk_live_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets['stripeSecret'] ? 'text' : 'password'}
                      value={settings.stripeSecretKey || ''}
                      onChange={e => updateField('stripeSecretKey', e.target.value)}
                      className="input-field pr-10"
                      placeholder="sk_live_..."
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('stripeSecret')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSecrets['stripeSecret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PayPal Settings */}
          {settings.paymentGateway === 'paypal' && (
            <div className="space-y-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-blue-900 dark:text-blue-300">PayPal Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={settings.paypalClientId || ''}
                    onChange={e => updateField('paypalClientId', e.target.value)}
                    className="input-field"
                    placeholder="Client ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets['paypalSecret'] ? 'text' : 'password'}
                      value={settings.paypalClientSecret || ''}
                      onChange={e => updateField('paypalClientSecret', e.target.value)}
                      className="input-field pr-10"
                      placeholder="Client Secret"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('paypalSecret')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSecrets['paypalSecret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Square Settings */}
          {settings.paymentGateway === 'square' && (
            <div className="space-y-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <h3 className="font-medium text-green-900 dark:text-green-300">Square Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Access Token
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets['squareToken'] ? 'text' : 'password'}
                      value={settings.squareAccessToken || ''}
                      onChange={e => updateField('squareAccessToken', e.target.value)}
                      className="input-field pr-10"
                      placeholder="Access Token"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('squareToken')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSecrets['squareToken'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location ID
                  </label>
                  <input
                    type="text"
                    value={settings.squareLocationId || ''}
                    onChange={e => updateField('squareLocationId', e.target.value)}
                    className="input-field"
                    placeholder="Location ID"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </h2>

          {/* Toggle switches */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={e => updateField('emailNotifications', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500"
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">Email Notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={e => updateField('smsNotifications', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500"
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">SMS Notifications</span>
            </label>
          </div>

          {/* Email (SMTP) Settings */}
          {settings.emailNotifications && (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <h3 className="font-medium text-amber-900 dark:text-amber-300">SMTP Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.smtpHost || ''}
                    onChange={e => updateField('smtpHost', e.target.value)}
                    className="input-field"
                    placeholder="smtp.example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={settings.smtpPort || ''}
                    onChange={e => updateField('smtpPort', e.target.value ? parseInt(e.target.value) : null)}
                    className="input-field"
                    placeholder="587"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    value={settings.smtpUser || ''}
                    onChange={e => updateField('smtpUser', e.target.value)}
                    className="input-field"
                    placeholder="username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SMTP Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets['smtpPassword'] ? 'text' : 'password'}
                      value={settings.smtpPassword || ''}
                      onChange={e => updateField('smtpPassword', e.target.value)}
                      className="input-field pr-10"
                      placeholder="password"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('smtpPassword')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSecrets['smtpPassword'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.smtpFromEmail || ''}
                    onChange={e => updateField('smtpFromEmail', e.target.value)}
                    className="input-field"
                    placeholder="noreply@restaurant.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SMS (Twilio) Settings */}
          {settings.smsNotifications && (
            <div className="space-y-4 p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
              <h3 className="font-medium text-cyan-900 dark:text-cyan-300">Twilio SMS Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account SID
                  </label>
                  <input
                    type="text"
                    value={settings.twilioAccountSid || ''}
                    onChange={e => updateField('twilioAccountSid', e.target.value)}
                    className="input-field"
                    placeholder="AC..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Auth Token
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets['twilioToken'] ? 'text' : 'password'}
                      value={settings.twilioAuthToken || ''}
                      onChange={e => updateField('twilioAuthToken', e.target.value)}
                      className="input-field pr-10"
                      placeholder="Auth Token"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('twilioToken')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSecrets['twilioToken'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twilio Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settings.twilioPhoneNumber || ''}
                    onChange={e => updateField('twilioPhoneNumber', e.target.value)}
                    className="input-field"
                    placeholder="+1234567890"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
