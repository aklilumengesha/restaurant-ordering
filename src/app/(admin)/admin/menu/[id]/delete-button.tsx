"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteButton({ itemId }: { itemId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return
    setDeleting(true)
    try {
      await fetch(`/api/menu?id=${itemId}`, { method: 'DELETE' })
      router.push('/admin/menu')
    } catch {
      setDeleting(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={deleting}
      className="mt-4 px-3 py-2 rounded border text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
