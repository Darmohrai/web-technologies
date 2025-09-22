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
    borrowedById: number | null = null;

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
    private static nextId = 1;
    public id: number;
    public name: string;
    public email: string;

    constructor(id: number | null, name: string, email: string) {
        if (id === null) {
            this.id = User.nextId++;
        }
        else {
            this.id = id;
            User.nextId = id+1;
        }

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
