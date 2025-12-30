import ReservationsCalendar from './calendar-client'

export default async function AdminReservationsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Reservations Management</h1>
      </div>
      {/* @ts-expect-error Server -> Client */}
      <ReservationsCalendar />
    </div>
  )
}
