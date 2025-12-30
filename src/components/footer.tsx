import { Heart, ChefHat, MapPin, Mail, Phone, Clock } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
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
              <span className="text-xl font-bold gradient-text">RestoNext</span>
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
                <span>123 Restaurant Street<br />Foodie City, FC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                <a href="mailto:contact@restonext.com" className="hover:text-red-500 transition-colors">contact@restonext.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                <a href="tel:+15551234567" className="hover:text-red-500 transition-colors">(555) 123-4567</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Opening Hours</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Mon - Fri</p>
                  <p>11:00 AM - 10:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Sat - Sun</p>
                  <p>10:00 AM - 11:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} RestoNext. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> for food lovers
          </p>
        </div>
      </div>
    </footer>
  )
}
