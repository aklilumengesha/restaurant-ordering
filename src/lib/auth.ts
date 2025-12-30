import type { NextAuthOptions } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null
        const rawEmail = credentials.email.trim()
        let user = await prisma.user.findUnique({ where: { email: rawEmail } })
        if (!user) {
          user = await prisma.user.findUnique({ where: { email: rawEmail.toLowerCase() } })
        }
        if (!user?.passwordHash) return null
        const valid = await compare(credentials.password, user.passwordHash)
        if (!valid) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const email = (user?.email || '').toLowerCase().trim()
        if (!email) return false
        
        try {
          let existing = await prisma.user.findUnique({ where: { email } })
          
          if (!existing) {
            existing = await prisma.user.create({
              data: {
                email,
                name: user.name || email.split('@')[0],
                image: user.image || null,
                role: 'CUSTOMER',
              },
            })
          }
          
          const existingAccount = await prisma.account.findFirst({
            where: { provider: 'google', providerAccountId: account.providerAccountId },
          })
          
          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existing.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token || null,
                access_token: account.access_token || null,
                expires_at: account.expires_at || null,
                token_type: account.token_type || null,
                scope: account.scope || null,
                id_token: account.id_token || null,
              },
            })
          }
          
          user.id = existing.id
        } catch (e) {
          console.error('Google signIn error:', e)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role || 'CUSTOMER'
        token.id = user.id
      }
      
      if (account?.provider === 'google' && token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } })
        if (dbUser) {
          token.role = dbUser.role
          token.id = dbUser.id
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const userAny = session.user as any
        userAny.role = token.role
        userAny.id = token.id || token.sub
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
