import {Book, User, IBook, IUser} from './models';
import {Library} from './library';
import {IStorage} from "./storage";

export class LibraryService<T extends { toString(): string }> {
    private library: Library<T>;

    constructor() {
        this.library = new Library<T>();
    }

    public add(item: T): void {
        this.library.add(item);
    }

    public remove(predicate: (item: T) => boolean): void {
        this.library.remove(predicate);
    }

    public find(predicate: (item: T) => boolean): T | undefined {
        return this.library.find(predicate);
    }

    public getAll(): T[] {
        return this.library.getAll();
    }

    public count(): number {
        return this.library.count();
    }
}
export class BookService {
    private storage = new IStorage();
    private books: LibraryService<Book> = new LibraryService<Book>();

    constructor() {
        const saved = this.storage.get<Book[]>('books');
        if (saved) {
            saved.forEach(b =>
                this.books.add(new Book(b.title, b.author, b.year, b.borrowedById))
            );
        }
    }

    public add(book: Book): void {
        this.books.add(book);
        this.save();
    }

    public getAll(): Book[] {
        return this.books.getAll();
    }

    public borrow(book: Book, userId: number): void {
        const found = this.books.find(
            b => b.getTitle() === book.getTitle() &&
                b.getAuthor() === book.getAuthor() &&
                b.getYear() === book.getYear()
        );
        if (found) {
            found.borrow(userId);
            this.save();
        }
    }

    public returnBook(book: Book): void {
        const found = this.books.find(
            b => b.getTitle() === book.getTitle() &&
                b.getAuthor() === book.getAuthor() &&
                b.getYear() === book.getYear()
        );
        if (found) {
            found.returnBook();
            this.save();
        }
    }

    save(): void {
        this.storage.set('books', this.books.getAll());
    }

    public search(query: string): Book[] {
        const lowerQuery = query.toLowerCase();
        return this.books.getAll().filter(b =>
            b.getTitle().toLowerCase().includes(lowerQuery) ||
            b.getAuthor().toLowerCase().includes(lowerQuery)
        );
    }

    public remove(book: Book): void {
        this.books.remove(b =>
            b.getTitle() === book.getTitle() &&
            b.getAuthor() === book.getAuthor() &&
            b.getYear() === book.getYear()
        );
        this.save();
    }
}

export class UserService {
    private storage = new IStorage();
    private users: Library<User> = new Library<User>();

    constructor() {
        const saved = this.storage.get<User[]>('users');
        if (saved) {
            saved.forEach(u => this.users.add(new User(u.id, u.name, u.email)));
        }
    }

    public add(user: User): void {
        this.users.add(user);
        this.save();
    }

    public getAll(): User[] {
        return this.users.getAll();
    }

    private save(): void {
        this.storage.set('users', this.users.getAll());
    }

    public remove(user: User): void {
        this.users.remove(u => u.getName() === user.getName() && u.getEmail() === user.getEmail());
        this.save();
    }
}
