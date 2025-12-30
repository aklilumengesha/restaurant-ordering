"use client"
import { useMemo } from 'react'

type Daily = { day: string; total: number }
type Monthly = { month: string; total: number }
type Yearly = { year: string; total: number }

type MenuItemPerf = { id: string; name: string; quantity: number }

type ReservationsTrend = { day: string; count: number }

type Props = {
  daily: Daily[]
  monthly: Monthly[]
  yearly: Yearly[]
  bestSellers: MenuItemPerf[]
  leastOrdered: MenuItemPerf[]
  reservations: ReservationsTrend[]
}

function toCSV(rows: Record<string, any>[]) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const escape = (v: any) => {
    const s = String(v ?? '')
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
    return s
  }
  const lines = [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))]
  return lines.join('\n')
}

function download(filename: string, text: string, mime = 'text/csv') {
  const blob = new Blob([text], { type: mime + ';charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ReportsClient({ daily, monthly, yearly, bestSellers, leastOrdered, reservations }: Props) {
  const maxDaily = useMemo(()=> Math.max(1, ...daily.map(d=>d.total)), [daily])
  const maxMonthly = useMemo(()=> Math.max(1, ...monthly.map(d=>d.total)), [monthly])
  const maxYearly = useMemo(()=> Math.max(1, ...yearly.map(d=>d.total)), [yearly])
  const maxRes = useMemo(()=> Math.max(1, ...reservations.map(r=>r.count)), [reservations])

  const exportDaily = () => download('revenue_daily.csv', toCSV(daily))
  const exportMonthly = () => download('revenue_monthly.csv', toCSV(monthly))
  const exportYearly = () => download('revenue_yearly.csv', toCSV(yearly))
  const exportBest = () => download('menu_best_sellers.csv', toCSV(bestSellers))
  const exportLeast = () => download('menu_least_ordered.csv', toCSV(leastOrdered))
  const exportReservations = () => download('reservation_trends.csv', toCSV(reservations))

  const exportPDF = () => {
    // Simple print-to-PDF using browser print dialog
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={exportDaily} className="px-3 py-1 text-sm rounded border">Export Daily CSV</button>
        <button onClick={exportMonthly} className="px-3 py-1 text-sm rounded border">Export Monthly CSV</button>
        <button onClick={exportYearly} className="px-3 py-1 text-sm rounded border">Export Yearly CSV</button>
        <button onClick={exportBest} className="px-3 py-1 text-sm rounded border">Export Best Sellers CSV</button>
        <button onClick={exportLeast} className="px-3 py-1 text-sm rounded border">Export Least Ordered CSV</button>
        <button onClick={exportReservations} className="px-3 py-1 text-sm rounded border">Export Reservations CSV</button>
        <button onClick={exportPDF} className="ml-auto px-3 py-1 text-sm rounded border">Export to PDF</button>
      </div>

      <section className="p-4 rounded border bg-white/50 dark:bg-gray-900/50">
        <div className="font-medium mb-2">Revenue (Daily - last 30 days)</div>
        <div className="space-y-2">
          {daily.map(d => (
            <div key={d.day} className="flex items-center gap-3">
              <div className="w-24 text-xs text-gray-600">{d.day}</div>
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="h-2 bg-emerald-500 rounded" style={{ width: `${(d.total / maxDaily) * 100}%` }} />
              </div>
              <div className="w-20 text-right text-xs">${d.total.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="p-4 rounded border bg-white/50 dark:bg-gray-900/50">
          <div className="font-medium mb-2">Revenue (Monthly - last 12 months)</div>
          <div className="space-y-2">
            {monthly.map(m => (
              <div key={m.month} className="flex items-center gap-3">
                <div className="w-28 text-xs text-gray-600">{m.month}</div>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <div className="h-2 bg-blue-500 rounded" style={{ width: `${(m.total / maxMonthly) * 100}%` }} />
                </div>
                <div className="w-20 text-right text-xs">${m.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="p-4 rounded border bg-white/50 dark:bg-gray-900/50">
          <div className="font-medium mb-2">Revenue (Yearly)</div>
          <div className="space-y-2">
            {yearly.map(y => (
              <div key={y.year} className="flex items-center gap-3">
                <div className="w-20 text-xs text-gray-600">{y.year}</div>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <div className="h-2 bg-purple-500 rounded" style={{ width: `${(y.total / maxYearly) * 100}%` }} />
                </div>
                <div className="w-20 text-right text-xs">${y.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="p-4 rounded border bg-white/50 dark:bg-gray-900/50">
          <div className="font-medium mb-2">Menu Performance - Best Sellers</div>
          <div className="divide-y">
            {bestSellers.length === 0 && <div className="text-sm text-gray-500">No data.</div>}
            {bestSellers.map((it, idx) => (
              <div key={it.id} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="w-6 text-xs text-gray-500">{idx+1}</span><span>{it.name}</span></div>
                <div className="text-xs text-gray-600">{it.quantity} sold</div>
              </div>
            ))}
          </div>
        </section>
        <section className="p-4 rounded border bg-white/50 dark:bg-gray-900/50">
          <div className="font-medium mb-2">Menu Performance - Least Ordered</div>
          <div className="divide-y">
            {leastOrdered.length === 0 && <div className="text-sm text-gray-500">No data.</div>}
            {leastOrdered.map((it, idx) => (
              <div key={it.id} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="w-6 text-xs text-gray-500">{idx+1}</span><span>{it.name}</span></div>
                <div className="text-xs text-gray-600">{it.quantity} sold</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="p-4 rounded border bg-white/50 dark:bg-gray-900/50">
        <div className="font-medium mb-2">Reservation Trends (last 30 days)</div>
        <div className="space-y-2">
          {reservations.map(r => (
            <div key={r.day} className="flex items-center gap-3">
              <div className="w-24 text-xs text-gray-600">{r.day}</div>
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="h-2 bg-amber-500 rounded" style={{ width: `${(r.count / maxRes) * 100}%` }} />
              </div>
              <div className="w-12 text-right text-xs">{r.count}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
