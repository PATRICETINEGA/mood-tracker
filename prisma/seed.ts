import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('demo123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@moods.app' },
    update: {},
    create: { email: 'demo@moods.app', password },
  })

  await prisma.mood.upsert({
    where: { id: 'seed-mood' },
    update: {},
    create: { id: 'seed-mood', mood: 'happy', note: 'Good day', date: '2026-11-05', ownerId: user.id },
  })

  console.log('Seed done')
}

main().finally(() => prisma.$disconnect())
