import { RelayAccess, Prisma } from '@prisma/client'
import prisma from '../lib/prisma'

export const grantAccess = async (data: Prisma.RelayAccessCreateInput): Promise<RelayAccess> => {
  return prisma.relayAccess.create({ data })
}

export const checkAccess = async (supabaseUserId: string, relayId: string): Promise<boolean> => {
  const access = await prisma.relayAccess.findFirst({
    where: {
      supabaseUserId,
      relayId,
      isActive: true,
      validUntil: {
        gt: new Date()
      }
    }
  })
  
  return !!access
}

export default {
  grantAccess,
  checkAccess
} 