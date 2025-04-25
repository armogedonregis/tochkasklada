import { Relay, Prisma } from '@prisma/client'
import prisma from '../lib/prisma'
import axios from 'axios'

export const createRelay = async (data: Prisma.RelayCreateInput): Promise<Relay> => {
  return prisma.relay.create({ data })
}

export const toggleRelay = async (id: string, state: boolean): Promise<void> => {
  const relay = await prisma.relay.findUniqueOrThrow({
    where: { id },
    include: { panel: true }
  })

  if (!relay.panel.password) {
    throw new Error('Не указан пароль для панели')
  }

  // Формат из документации: http://[Логин]:[Пароль]@[IP адрес]/protect/rb[N]f.cgi
  const command = state ? 'n' : 'f' // n - включить, f - выключить
  const url = `http://admin:${relay.panel.password}@${relay.panel.ipAddress}/protect/rb${relay.relayNumber}${command}.cgi`

  const response = await axios.get(url)
  
  if (response.data !== 'Success!') {
    throw new Error('Ошибка управления реле')
  }
}

export const pulseRelay = async (id: string): Promise<void> => {
  const relay = await prisma.relay.findUniqueOrThrow({
    where: { id },
    include: { panel: true }
  })

  if (!relay.panel.password) {
    throw new Error('Не указан пароль для панели')
  }

  const url = `http://admin:${relay.panel.password}@${relay.panel.ipAddress}/protect/rb${relay.relayNumber}s.cgi`

  const response = await axios.get(url)
  
  if (response.data !== 'Success!') {
    throw new Error('Ошибка отправки импульса')
  }
}

export default {
  createRelay,
  toggleRelay,
  pulseRelay
}