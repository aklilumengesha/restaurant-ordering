import { addMinutes, format, setHours, setMinutes } from 'date-fns'

export function parseTimeToDate(dateISO: string, timeHHMM: string) {
  const [h, m] = timeHHMM.split(':').map(Number)
  const d = new Date(dateISO + 'T00:00:00')
  return setMinutes(setHours(d, h), m)
}

export function generateSlots(dateISO: string, open = process.env.RES_OPEN ?? '11:00', close = process.env.RES_CLOSE ?? '22:00', stepMin = Number(process.env.RES_SLOT_MINUTES ?? '30')) {
  const start = parseTimeToDate(dateISO, open)
  const end = parseTimeToDate(dateISO, close)
  const slots: string[] = []
  let cur = start
  while (cur < end) {
    slots.push(format(cur, 'HH:mm'))
    cur = addMinutes(cur, stepMin)
  }
  return slots
}

export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd
}
