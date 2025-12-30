import { prisma } from '@/lib/prisma'
import UsersClient from './users-client'

export default async function UsersAdminPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Users & Roles</h1>
      {/* @ts-expect-error Server Component to Client Component props */}
      <UsersClient users={users} />
    </div>
  )
}
