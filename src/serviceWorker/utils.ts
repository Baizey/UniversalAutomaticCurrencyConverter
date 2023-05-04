export function isCurrencyTag(value: any): boolean {
    return typeof value === 'string' && /^[A-Z]{3}$/.test(value)
}