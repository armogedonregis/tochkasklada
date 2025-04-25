import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const algorithm = 'aes-256-gcm'
const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex')

export const encrypt = (text: string): string => {
  const iv = randomBytes(16)  
  const cipher = createCipheriv(algorithm, key, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return JSON.stringify({
    iv: iv.toString('hex'),
    content: encrypted,
    tag: authTag.toString('hex')
  })
}

export const decrypt = (encrypted: string): string => {
  const { iv, content, tag } = JSON.parse(encrypted)
  
  const decipher = createDecipheriv(
    algorithm, 
    key, 
    Buffer.from(iv, 'hex')
  )
  
  decipher.setAuthTag(Buffer.from(tag, 'hex'))
  
  let decrypted = decipher.update(content, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

export default {
  encrypt,
  decrypt
} 