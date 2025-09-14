export class IStorage {
    private storage: Storage;

    constructor() {
        this.storage = window.localStorage;
    }

    // Зберігає будь-які дані під ключем
    public set<T>(key: string, value: T): void {
        const json = JSON.stringify(value);
        this.storage.setItem(key, json);
    }

    // Отримує дані і повертає тип T або null
    public get<T>(key: string): T | null {
        const data = this.storage.getItem(key);
        return data ? JSON.parse(data) as T : null;
    }

    public remove(key: string): void {
        this.storage.removeItem(key);
    }

    public clear(): void {
        this.storage.clear();
    }

    public has(key: string): boolean {
        return this.storage.getItem(key) !== null;
    }
}
