import { prisma } from '@/lib/prisma'
import { MenuForm } from '@/components/admin/menu-form'
import { DeleteButton } from './delete-button'

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.menuItem.findUnique({ where: { id } })
  if (!item) return <div>Item not found</div>
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit Menu Item</h1>
      <MenuForm initial={item} />
      <DeleteButton itemId={item.id} />
    </div>
  )
}
