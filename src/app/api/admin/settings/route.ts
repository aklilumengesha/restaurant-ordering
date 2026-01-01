import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let settings = await prisma.systemSettings.findUnique({
    where: { id: 'default' }
  })

  if (!settings) {
    settings = await prisma.systemSettings.create({
      data: { id: 'default' }
    })
  }

  return NextResponse.json(settings)
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    const settings = await prisma.systemSettings.upsert({
      where: { id: 'default' },
      update: {
        restaurantName: data.restaurantName,
        restaurantLogo: data.restaurantLogo,
        restaurantPhone: data.restaurantPhone,
        restaurantEmail: data.restaurantEmail,
        restaurantAddress: data.restaurantAddress,
        openingHours: data.openingHours,
        paymentGateway: data.paymentGateway,
        stripePublicKey: data.stripePublicKey,
        stripeSecretKey: data.stripeSecretKey,
        paypalClientId: data.paypalClientId,
        paypalClientSecret: data.paypalClientSecret,
        squareAccessToken: data.squareAccessToken,
        squareLocationId: data.squareLocationId,
        emailNotifications: data.emailNotifications,
        smsNotifications: data.smsNotifications,
        smtpHost: data.smtpHost,
        smtpPort: data.smtpPort,
        smtpUser: data.smtpUser,
        smtpPassword: data.smtpPassword,
        smtpFromEmail: data.smtpFromEmail,
        twilioAccountSid: data.twilioAccountSid,
        twilioAuthToken: data.twilioAuthToken,
        twilioPhoneNumber: data.twilioPhoneNumber,
      },
      create: {
        id: 'default',
        restaurantName: data.restaurantName,
        restaurantLogo: data.restaurantLogo,
        restaurantPhone: data.restaurantPhone,
        restaurantEmail: data.restaurantEmail,
        restaurantAddress: data.restaurantAddress,
        openingHours: data.openingHours,
        paymentGateway: data.paymentGateway,
        stripePublicKey: data.stripePublicKey,
        stripeSecretKey: data.stripeSecretKey,
        paypalClientId: data.paypalClientId,
        paypalClientSecret: data.paypalClientSecret,
        squareAccessToken: data.squareAccessToken,
        squareLocationId: data.squareLocationId,
        emailNotifications: data.emailNotifications,
        smsNotifications: data.smsNotifications,
        smtpHost: data.smtpHost,
        smtpPort: data.smtpPort,
        smtpUser: data.smtpUser,
        smtpPassword: data.smtpPassword,
        smtpFromEmail: data.smtpFromEmail,
        twilioAccountSid: data.twilioAccountSid,
        twilioAuthToken: data.twilioAuthToken,
        twilioPhoneNumber: data.twilioPhoneNumber,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
