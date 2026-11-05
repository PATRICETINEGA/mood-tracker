import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { mood, note, date } = body
  if (!mood) return NextResponse.json({ error: 'Mood required' }, { status: 400 })

  const entry = await prisma.mood.create({
    data: { mood, note, date: date || new Date().toISOString().slice(0,10), ownerId: (session.user as any).id },
  })
  return NextResponse.json(entry)
}
