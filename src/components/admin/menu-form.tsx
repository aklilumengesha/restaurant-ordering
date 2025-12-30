"use client"
import { useState } from 'react'
import { Category, MenuItem } from '@prisma/client'

const categories: { key: Category; label: string }[] = [
  { key: 'APPETIZERS', label: 'Appetizers' },
  { key: 'MAINS', label: 'Mains' },
  { key: 'DESSERTS', label: 'Desserts' },
  { key: 'DRINKS', label: 'Drinks' },
]

export function MenuForm({ initial }: { initial?: Partial<MenuItem> }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [price, setPrice] = useState(initial?.price ? Number(initial.price) : 0)
  const [category, setCategory] = useState<Category>((initial?.category as Category) ?? 'MAINS')
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '')
  const [isActive, setIsActive] = useState(initial?.isActive ?? true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    try {
      const payload = { name, description, price: Number(price), category, imageUrl: imageUrl || undefined, isActive }
      const res = await fetch('/api/menu', {
        method: initial?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initial?.id ? { id: initial.id, ...payload } : payload),
      })
      if (res.ok) {
        setMessage('Saved')
        if (!initial?.id) {
          setName(''); setDescription(''); setPrice(0); setCategory('MAINS'); setImageUrl(''); setIsActive(true)
        }
      } else {
        setMessage((await res.text()) || 'Failed')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-w-xl">
      <div>
        <label className="block text-sm mb-1">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm mb-1">Price</label>
          <input type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full border rounded px-3 py-2">
            {categories.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input id="active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <label htmlFor="active" className="text-sm">Active</label>
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Image URL</label>
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <button disabled={busy} className="px-4 py-2 rounded bg-brand text-white disabled:opacity-50">{busy ? 'Saving…' : 'Save item'}</button>
      {message && <div className="text-sm text-gray-600">{message}</div>}
    </form>
  )
}
