import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/guard'
import UsersClient from './users-client'

export default async function UsersAdminPage() {
  await requireAdmin()
  
  const users = await prisma.user.findMany({ 
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      image: true
    }
  })
  
  return <UsersClient users={JSON.parse(JSON.stringify(users))} />
}
