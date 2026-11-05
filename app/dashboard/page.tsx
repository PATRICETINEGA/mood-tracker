import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AddMood from '@/components/AddMood'
export default async function Dash() {
  const s = await getSession()
  if (!s) redirect('/login')
  const uid = (s.user as any).id
  const moods = await prisma.mood.findMany({ where: { ownerId: uid }, orderBy: { date: 'desc' } })
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Moods</h1>
        <Link href="/api/auth/signout" className="text-sm text-red-600">Sign out</Link>
      </div>
      <AddMood />
      <div className="space-y-2">
        {moods.map((m: any) => (
          <div key={m.id} className="bg-white p-3 rounded shadow text-sm">
            <div className="flex justify-between"><span className="font-medium capitalize">{m.mood}</span><span className="text-xs text-gray-400">{m.date}</span></div>
            {m.note && <p className="text-gray-600 mt-1">{m.note}</p>}
          </div>
        ))}
        {moods.length === 0 && <p className="text-gray-500">No entries yet</p>}
      </div>
    </div>
  )
}
