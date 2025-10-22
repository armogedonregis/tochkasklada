export const NormalizeName = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return value;
    return trimmed
        .split(/\s+/)
        .map((word) =>
            word
                .split('-')
                .map((seg) => seg.charAt(0).toLocaleUpperCase('ru-RU') + seg.slice(1).toLocaleLowerCase('ru-RU'))
                .join('-')
        )
        .join(' ');
}