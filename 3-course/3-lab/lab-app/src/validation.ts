export namespace Validation {
    export function required(value: string): boolean {
        return value.trim().length > 0;
    }

    export function isNumber(value: string): boolean {
        return /^\d+$/.test(value);
    }

    export function isYear(value: string): boolean {
        const year = Number(value);
        return !isNaN(year) && year >= 0 && year <= 2025;
    }

    export function isEmail(value: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
}
