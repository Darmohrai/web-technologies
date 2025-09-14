import {Book, User, IBook, IUser} from './models';
import {Library} from './library';
import {IStorage} from "./storage";

export class LibraryService<T extends { toString(): string; }> {
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

export class BookService {
    private storage = new IStorage();
    private books: Book[] = [];

    constructor() {
        const saved = this.storage.get<Book[]>('books');
        if (saved) {
            this.books = saved.map(b => new Book(b.title, b.author, b.year, b.borrowedById));
        }
    }

    public add(book: Book): void {
        this.books.push(book);
        this.save();
    }

    public getAll(): Book[] {
        return [...this.books];
    }

    public borrow(book: Book, userId: number): void {
        const index = this.books.findIndex(b => b.getTitle() === book.getTitle() && b.getAuthor() === book.getAuthor() && b.getYear() === book.getYear());
        if (index !== -1) {
            this.books[index].borrow(userId);  // оновлюємо конкретну книгу
            this.save();  // зберігаємо весь масив
        }
    }

    public returnBook(book: Book): void {
        const index = this.books.findIndex(
            b => b.getTitle() === book.getTitle() &&
                b.getAuthor() === book.getAuthor() &&
                b.getYear() === book.getYear()
        );

        if (index !== -1) {
            this.books[index].returnBook();
            this.save();
        }
    }

    save() {
        this.storage.set('books', this.books);
    }

    public search(query: string): Book[] {
        const lowerQuery = query.toLowerCase();
        return this.books.filter(b =>
            b.getTitle().toLowerCase().includes(lowerQuery) ||
            b.getAuthor().toLowerCase().includes(lowerQuery)
        );
    }

    public remove(book: Book): void {
        this.books = this.books.filter(b => b !== book);
        this.storage.set('books', this.books);
    }
}

export class UserService {
    private storage = new IStorage();
    private users: User[] = [];

    constructor() {
        const saved = this.storage.get<User[]>('users');
        if (saved) {
            this.users = saved.map(u => new User(u.name, u.email))
        }
    }

    public add(user: User): void {
        this.users.push(user);
        this.save();
    }

    public getAll(): User[] {
        return [...this.users];
    }

    private save(): void {
        this.storage.set('users', this.users);
    }

    public remove(user: User): void {
        this.users = this.users.filter(u => u !== user);
        this.storage.set('users', this.users);
    }
}