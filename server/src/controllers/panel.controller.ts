import { Request, Response } from 'hyper-express'
import * as panelService from '../services/panel.service'

export const getPanels = async (_req: Request, res: Response): Promise<void> => {
  try {
    const panels = await panelService.getPanels()
    res.json(panels)
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка при получении списка панелей',
      details: error.message 
    })
  }
}

export const getPanelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const panel = await panelService.getPanelById(id)
    
    if (!panel) {
      res.status(404).json('Панель не найдена')
      return
    }

    res.json(panel)
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка при получении панели',
      details: error.message 
    })
  }
}

export const createPanel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, ipAddress, port, login, password } = req.body

    if (!name || !ipAddress || !port || !login || !password) {
      res.status(400).json({ 
        success: false, 
        error: 'Не все обязательные поля заполнены' 
      })
      return
    }

    const panel = await panelService.createPanel({
      name,
      ipAddress,
      port: Number(port),
      login,
      password
    })

    res.status(201).json({ success: true, data: panel })
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка при создании панели',
      details: error.message 
    })
  }
}

export const updatePanel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { name, ipAddress, port, login, password } = req.body

    const panel = await panelService.updatePanel(id, {
      ...(name && { name }),
      ...(ipAddress && { ipAddress }),
      ...(port && { port: Number(port) }),
      ...(login && { login }),
      ...(password && { password })
    })

    res.json({ success: true, data: panel })
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка при обновлении панели',
      details: error.message 
    })
  }
}

export const deletePanel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    await panelService.deletePanel(id)
    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка при удалении панели',
      details: error.message 
    })
  }
}

export const checkConnection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const isConnected = await panelService.checkPanelConnection(id)
    res.json({ success: true, connected: isConnected })
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка при проверке соединения',
      details: error.message 
    })
  }
}

export default {
  getPanels,
  getPanelById,
  createPanel,
  updatePanel,
  deletePanel,
  checkConnection
}