'use client'

import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useState, useEffect } from 'react'

export function GetInTouch() {
  const [restaurantEmail, setRestaurantEmail] = useState('aklilumengesha57@gmail.com')
  const [restaurantPhone, setRestaurantPhone] = useState('0998121942')
  const [restaurantAddress, setRestaurantAddress] = useState('Addis Ababa, Ethiopia')

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => {
        if (!res.ok) return null
        return res.json()
      })
      .then(data => {
        if (data) {
          setRestaurantEmail(data.restaurantEmail || 'aklilumengesha57@gmail.com')
          setRestaurantPhone(data.restaurantPhone || '0998121942')
          setRestaurantAddress(data.restaurantAddress?.replace(/\n/g, ', ') || 'Addis Ababa, Ethiopia')
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Have questions or special requests? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Email Card */}
            <a
              href={`mailto:${restaurantEmail}`}
              className="group card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/30">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email Us</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Send us an email anytime
              </p>
              <p className="text-red-500 dark:text-red-400 font-medium group-hover:underline flex items-center gap-2">
                {restaurantEmail}
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </p>
            </a>

            {/* Phone Card */}
            <a
              href={`tel:${restaurantPhone.replace(/\D/g, '')}`}
              className="group card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/30">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Call Us</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Mon-Fri from 9am to 10pm
              </p>
              <p className="text-emerald-500 dark:text-emerald-400 font-medium group-hover:underline flex items-center gap-2">
                {restaurantPhone}
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </p>
            </a>

            {/* Location Card */}
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(restaurantAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Visit Us</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Come say hello at our location
              </p>
              <p className="text-purple-500 dark:text-purple-400 font-medium group-hover:underline flex items-center gap-2">
                View on map
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
