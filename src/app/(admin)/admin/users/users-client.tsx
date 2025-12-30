"use client"
import { useState } from 'react'

export default function UsersClient({ users }: { users: any[] }) {
  const [rows, setRows] = useState(users)

  const changeRole = async (id: string, role: string) => {
    const res = await fetch('/api/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, role }) })
    if (res.ok) {
      const updated = await res.json()
      setRows(rows.map(r => r.id === id ? updated : r))
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    const res = await fetch('/api/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, isActive }) })
    if (res.ok) {
      const updated = await res.json()
      setRows(rows.map(r => r.id === id ? updated : r))
    }
  }

  return (
    <table className="w-full text-left border">
      <thead>
        <tr className="border-b">
          <th className="p-2">Email</th>
          <th className="p-2">Name</th>
          <th className="p-2">Role</th>
          <th className="p-2">Status</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(u => (
          <tr key={u.id} className="border-b">
            <td className="p-2">{u.email}</td>
            <td className="p-2">{u.name}</td>
            <td className="p-2">
              <select value={u.role} onChange={(e)=>changeRole(u.id, e.target.value)} className="border rounded px-2 py-1 text-sm">
                {['ADMIN','STAFF','CUSTOMER'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </td>
            <td className="p-2 text-sm">{u.isActive === false ? 'Blocked' : 'Active'}</td>
            <td className="p-2">
              <button onClick={()=>toggleActive(u.id, !(u.isActive !== false))} className={`text-xs px-2 py-1 rounded border ${u.isActive === false ? 'border-emerald-600 text-emerald-700' : 'border-red-600 text-red-700'}`}>
                {u.isActive === false ? 'Unblock' : 'Block'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
