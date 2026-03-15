'use client'

import { Heart, ChefHat, MapPin, Mail, Phone, Clock } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type OpeningHours = {
  [key: string]: { open: string; close: string; closed: boolean }
}

type Settings = {
  restaurantName: string
  restaurantAddress: string
  restaurantEmail: string
  restaurantPhone: string
  openingHours: OpeningHours | null
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

function groupHours(hours: OpeningHours) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const groups: { days: string; hours: string }[] = []
  
  let i = 0
  while (i < days.length) {
    const day = days[i]
    const current = hours[day]
    if (!current) { i++; continue }
    
    let endIdx = i
    for (let j = i + 1; j < days.length; j++) {
      const next = hours[days[j]]
      if (next && next.closed === current.closed && next.open === current.open && next.close === current.close) {
        endIdx = j
      } else break
    }
    
    const startDay = days[i].charAt(0).toUpperCase() + days[i].slice(1, 3)
    const endDay = days[endIdx].charAt(0).toUpperCase() + days[endIdx].slice(1, 3)
    const dayRange = i === endIdx ? startDay : `${startDay} - ${endDay}`
    const hoursStr = current.closed ? 'Closed' : `${formatTime(current.open)} - ${formatTime(current.close)}`
    
    groups.push({ days: dayRange, hours: hoursStr })
    i = endIdx + 1
  }
  
  return groups.slice(0, 3)
}

export function Footer() {
  const [settings, setSettings] = useState<Settings>({
    restaurantName: 'RestoNext',
    restaurantAddress: 'Addis Ababa, Ethiopia',
    restaurantEmail: 'aklilumengesha57@gmail.com',
    restaurantPhone: '0998121942',
    openingHours: null
  })

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => {
        if (!res.ok) return null
        return res.json()
      })
      .then(data => {
        if (data) {
          setSettings({
            restaurantName: data.restaurantName || 'RestoNext',
            restaurantAddress: data.restaurantAddress || 'Addis Ababa, Ethiopia',
            restaurantEmail: data.restaurantEmail || 'aklilumengesha57@gmail.com',
            restaurantPhone: data.restaurantPhone || '0998121942',
            openingHours: data.openingHours as OpeningHours
          })
        }
      })
      .catch(() => {
        // Use defaults
      })
  }, [])

  const hoursGroups = settings.openingHours ? groupHours(settings.openingHours) : [
    { days: 'Mon - Fri', hours: '11:00 AM - 10:00 PM' },
    { days: 'Sat - Sun', hours: '10:00 AM - 11:00 PM' }
  ]

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 bg-white/50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">{settings.restaurantName}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Experience the finest dining with our carefully crafted menu. Order online, make reservations, and enjoy exceptional service.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors inline-flex items-center gap-2">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors inline-flex items-center gap-2">
                  Reservations
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors inline-flex items-center gap-2">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors inline-flex items-center gap-2">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
                <span className="whitespace-pre-line">{settings.restaurantAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                <a href={`mailto:${settings.restaurantEmail}`} className="hover:text-red-500 transition-colors">{settings.restaurantEmail}</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                <a href={`tel:${settings.restaurantPhone.replace(/\D/g, '')}`} className="hover:text-red-500 transition-colors">{settings.restaurantPhone}</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Opening Hours</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {hoursGroups.map((group, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{group.days}</p>
                    <p>{group.hours}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} {settings.restaurantName}. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Developed by{' '}
              <a 
                href="mailto:aklilumengesha57@gmail.com" 
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
              >
                Aklilu Mengesha
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
