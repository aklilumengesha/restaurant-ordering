const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@restonext.com'
  const name = 'Admin'
  const password = 'admin123'
  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.upsert({
    where: { email },
    update: { name, role: 'ADMIN', passwordHash },
    create: { email, name, role: 'ADMIN', passwordHash },
  })

  console.log('Seed: admin user ensured ->', email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
