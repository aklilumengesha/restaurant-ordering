"use client"
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function MenuStatusToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const toggle = async () => {
    startTransition(async () => {
      await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive }),
      })
      router.refresh()
    })
  }
  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`px-2 py-1 text-xs rounded border ${isActive ? 'border-amber-500 text-amber-700' : 'border-emerald-600 text-emerald-700'}`}
      title={isActive ? 'Mark as sold out (deactivate)' : 'Activate item'}
    >
      {pending ? 'Saving…' : isActive ? 'Deactivate' : 'Activate'}
    </button>
  )
}
