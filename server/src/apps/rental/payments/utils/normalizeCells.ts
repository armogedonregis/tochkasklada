export const NormalizeCells = (value: string): string => {
    return String(value)
        .toUpperCase()
        .replace(/А/g, 'A')
        .replace(/В/g, 'B')
        .replace(/С/g, 'C')
        .replace(/Е/g, 'E');
}