import { requireAdmin } from '@/lib/guard'
import { prisma } from '@/lib/prisma'
import { SettingsClient } from './settings-client'

export default async function SettingsPage() {
  await requireAdmin()

  // Get or create default settings
  let settings = await prisma.systemSettings.findUnique({
    where: { id: 'default' }
  })

  if (!settings) {
    settings = await prisma.systemSettings.create({
      data: { id: 'default' }
    })
  }

  return <SettingsClient initialSettings={settings as any} />
}
