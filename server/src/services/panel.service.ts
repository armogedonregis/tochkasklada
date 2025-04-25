import { Panel, Prisma } from '@prisma/client'
import prisma from '../lib/prisma'
import { encrypt, decrypt } from '../utils/crypto'

type PanelWithRelays = Panel & {
  relays: {
    id: string
    name: string
    relayNumber: number
    type: 'SECURITY' | 'LIGHT' | 'GATE'
  }[]
}

export const createPanel = async (data: {
  name: string
  ipAddress: string
  port: number
  login: string
  password: string
}): Promise<Panel> => {
  if (!data.login || !data.password) {
    throw new Error('Логин и пароль обязательны')
  }

  if (!data.ipAddress.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
    throw new Error('Неверный формат IP адреса')
  }

  if (data.port < 1 || data.port > 65535) {
    throw new Error('Порт должен быть от 1 до 65535')
  }

  const encryptedPanel = {
    ...data,
    login: encrypt(data.login),
    password: encrypt(data.password)
  }

  return prisma.panel.create({ data: encryptedPanel })
}

export const updatePanel = async (
  id: string,
  data: Partial<{
    name: string
    ipAddress: string
    port: number
    login: string
    password: string
  }>
): Promise<Panel> => {
  const updateData: any = { ...data }

  if (data.login) {
    updateData.login = encrypt(data.login)
  }
  if (data.password) {
    updateData.password = encrypt(data.password)
  }

  return prisma.panel.update({
    where: { id },
    data: updateData
  })
}

export const getPanels = async (): Promise<PanelWithRelays[]> => {
  const panels = await prisma.panel.findMany({
    include: {
      relays: {
        select: {
          id: true,
          name: true,
          relayNumber: true,
          type: true
        }
      }
    }
  })

  return panels.map(panel => ({
    ...panel,
    login: decrypt(panel.login),
    password: decrypt(panel.password)
  }))
}

export const getPanelById = async (id: string): Promise<PanelWithRelays | null> => {
  const panel = await prisma.panel.findUnique({
    where: { id },
    include: {
      relays: {
        select: {
          id: true,
          name: true,
          relayNumber: true,
          type: true
        }
      }
    }
  })

  if (!panel) return null

  return {
    ...panel,
    login: decrypt(panel.login),
    password: decrypt(panel.password)
  }
}

export const deletePanel = async (id: string): Promise<void> => {
  await prisma.panel.delete({ where: { id } })
}

export const checkPanelConnection = async (id: string): Promise<boolean> => {
  const panel = await getPanelById(id)
  if (!panel) throw new Error('Панель не найдена')

  try {
    const response = await fetch(`http://${panel.ipAddress}:${panel.port}/pstat.xml`)
    return response.status === 200
  } catch {
    return false
  }
}

export default {
  createPanel,
  updatePanel,
  getPanels,
  getPanelById,
  deletePanel,
  checkPanelConnection
}