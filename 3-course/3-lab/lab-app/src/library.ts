export class Library<T> {
    private items: T[] = [];

    public add(item: T): void {
        this.items.push(item);
    }

    public remove(predicate: (item: T) => boolean): void {
        this.items = this.items.filter(item => !predicate(item));
    }

    public find(predicate: (item: T) => boolean): T | undefined {
        return this.items.find(predicate);
    }

    public getAll(): T[] {
        return [...this.items];
    }

    public count(): number {
        return this.items.length;
    }
}
