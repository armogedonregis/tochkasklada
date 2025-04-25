import { Request, Response } from 'hyper-express'
import * as relayService from '../services/relay.service'
import * as accessService from '../services/access.service'

export const toggleRelay = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { state } = await req.json()
    const userId = req.locals.user?.id // из middleware auth

    const hasAccess = await accessService.checkAccess(userId, id)
    if (!hasAccess) {
      res.status(403).json({ success: false, error: 'Нет доступа' })
      return
    }

    await relayService.toggleRelay(id, state)
    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}

export default {
  toggleRelay
} 