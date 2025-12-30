import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true, name: true, email: true } })
  if (!user) return new NextResponse('Unauthorized', { status: 401 })
  return NextResponse.json(user)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })
  const json = await req.json()
  const { name, email, password } = json as { name?: string; email?: string; password?: string }

  const data: any = {}
  if (typeof name === 'string') data.name = name.trim()
  if (typeof email === 'string') data.email = email.trim().toLowerCase()
  if (typeof password === 'string' && password.trim()) {
    data.passwordHash = await hash(password.trim(), 10)
  }

  const updated = await prisma.user.update({ where: { email: session.user.email }, data, select: { id: true, name: true, email: true } })
  return NextResponse.json(updated)
}
