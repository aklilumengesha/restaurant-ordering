import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    // Debug: Check if key is loaded
    const stripeKey = process.env.STRIPE_SECRET_KEY
    console.log('Stripe key loaded:', stripeKey ? `${stripeKey.substring(0, 12)}...` : 'NOT FOUND')
    
    if (!stripeKey || stripeKey === 'sk_test_...' || stripeKey.length < 20) {
      return NextResponse.json({ error: 'Stripe API key not configured. Please set STRIPE_SECRET_KEY in .env file.' }, { status: 500 })
    }
    
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await req.json()
    const { items } = body
    
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    const line_items = [] as any[]
    for (const it of items) {
      const mi = await prisma.menuItem.findUnique({ where: { id: it.menuItemId } })
      if (!mi) continue
      line_items.push({
        quantity: it.quantity,
        price_data: {
          currency: 'usd',
          product_data: { name: mi.name },
          unit_amount: Math.round(Number(mi.price) * 100)
        }
      })
    }

    if (line_items.length === 0) {
      return NextResponse.json({ error: 'No valid items found' }, { status: 400 })
    }

    const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    
    const checkout = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${appUrl}/checkout/success`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        userEmail: session.user.email
      }
    })
    
    return NextResponse.json({ url: checkout.url })
  } catch (e: any) {
    console.error('Checkout error:', e)
    const { notifyError } = await import('@/lib/notify')
    await notifyError('Checkout session failed', e?.message || 'Stripe error', { code: e?.code })
    return NextResponse.json({ error: e?.message || 'Checkout failed' }, { status: 500 })
  }
}
