/**
 * Функция для парсинга размера и локаций при ответе из тильды
 * @param str "sizeform":"7 Кудрово",
 * @returns 
 */
export const NormalizeRequestForm = (str?: string) => {
    let parsedSize: string | undefined;
    let parsedLocation: string | undefined;
    if (typeof str === 'string') {
      const m = str.match(/^\s*([^\s]+)\s+(.+?)\s*$/);
      if (m) {
        parsedSize = m[1];
        parsedLocation = m[2];
      }
    }
    return { parsedSize, parsedLocation };
};