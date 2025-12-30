import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getRecommendations } from '@/lib/recommend'

export async function GET() {
  const session = await getServerSession(authOptions)
  let userId: string | null = null
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    userId = user?.id || null
  }
  const items = await getRecommendations(userId, 10)
  return NextResponse.json(items)
}
