import * as bcrypt from 'bcrypt';

/**
 * Хеширует пароль с использованием bcrypt
 * @param password Пароль в открытом виде
 * @param saltRounds Количество раундов соли (по умолчанию 10)
 * @returns Хешированный пароль
 */
export const hashPassword = async (password: string, saltRounds = 10): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

/**
 * Проверяет соответствие пароля и хеша
 * @param password Пароль в открытом виде
 * @param hashedPassword Хешированный пароль
 * @returns true, если пароль соответствует хешу
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Генерирует случайный пароль
 * @param length Длина пароля (по умолчанию 8)
 * @returns Сгенерированный пароль
 */
export const generateRandomPassword = (length = 8): string => {
  return Math.random().toString(36).slice(-length);
}; 