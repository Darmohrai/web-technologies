export interface IBook {
    getTitle(): string;
    getAuthor(): string;
    getYear(): number;
    isBorrowed(): boolean;
    borrow(userId: number): void;
    returnBook(): void;
}

export class Book implements IBook {
    title: string;
    author: string;
    year: number;
    borrowedById: number | null = null; // зберігаємо id користувача

    constructor(title: string, author: string, year: number, borrowedById: number | null = null) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.borrowedById = borrowedById;
    }

    public getTitle() { return this.title; }
    public getAuthor() { return this.author; }
    public getYear() { return this.year; }
    public isBorrowed() { return this.borrowedById !== null; }

    public borrow(userId: number): void {
        if (this.borrowedById) throw new Error("Книга вже позичена!");
        this.borrowedById = userId;
    }

    public returnBook(): void {
        this.borrowedById = null;
    }

    public getBorrowedBy(): number | null {
        return this.borrowedById;
    }

    public toString(): string {
        return `${this.title} — ${this.author} (${this.year})` +
            (this.borrowedById ? ` [Позичена користувачем #${this.borrowedById}]` : '');
    }
}

export interface IUser {
    getId(): number;
    getName(): string;
    getEmail(): string;
    toString(): string;
}

export class User implements IUser{
    private static nextId = 1; // статичний лічильник для авто-id
    private id: number;
    public name: string;
    public email: string;

    constructor(name: string, email: string) {
        this.id = User.nextId++;
        this.name = name;
        this.email = email;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public toString(): string {
        return `#${this.id} ${this.name} (${this.email})`;
    }
}
