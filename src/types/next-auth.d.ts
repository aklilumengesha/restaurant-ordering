import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      role?: 'ADMIN' | 'STAFF' | 'CUSTOMER'
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'ADMIN' | 'STAFF' | 'CUSTOMER'
  }
}
