import { Clock, CheckCircle, Truck, XCircle, ChefHat } from 'lucide-react'

const statusConfig = {
  PENDING: { 
    bg: 'bg-amber-100 dark:bg-amber-900/30', 
    text: 'text-amber-700 dark:text-amber-400', 
    border: 'border-amber-200 dark:border-amber-800',
    icon: Clock
  },
  PREPARING: { 
    bg: 'bg-blue-100 dark:bg-blue-900/30', 
    text: 'text-blue-700 dark:text-blue-400', 
    border: 'border-blue-200 dark:border-blue-800',
    icon: ChefHat
  },
  READY: { 
    bg: 'bg-purple-100 dark:bg-purple-900/30', 
    text: 'text-purple-700 dark:text-purple-400', 
    border: 'border-purple-200 dark:border-purple-800',
    icon: CheckCircle
  },
  DELIVERED: { 
    bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
    text: 'text-emerald-700 dark:text-emerald-400', 
    border: 'border-emerald-200 dark:border-emerald-800',
    icon: Truck
  },
  CANCELED: { 
    bg: 'bg-gray-100 dark:bg-gray-800', 
    text: 'text-gray-600 dark:text-gray-400', 
    border: 'border-gray-200 dark:border-gray-700',
    icon: XCircle
  },
}

export function StatusBadge({ status }: { status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELED' }) {
  const config = statusConfig[status]
  const Icon = config.icon
  
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}
