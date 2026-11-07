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

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const mood = await prisma.mood.findUnique({ where: { id } })
  if (!mood || mood.ownerId !== (session.user as any).id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.mood.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
