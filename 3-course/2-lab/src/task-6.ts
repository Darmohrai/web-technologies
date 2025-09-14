// 1. Interface LibraryItem
interface LibraryItem {
    title: string;
    author: string;
    isBorrowed: boolean;

    borrow(): void;
}

// 2. Classes Book, Magazine, DVD
class Book implements LibraryItem {
    public isBorrowed: boolean = false;

    constructor(
        public title: string,
        public author: string,
        private pages: number
    ) {}

    borrow(): void {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log(`Book "${this.title}" has been borrowed.`);
        } else {
            console.log(`Book "${this.title}" is already borrowed.`);
        }
    }

    getInfo(): string {
        return `Book: "${this.title}" by ${this.author}, Pages: ${this.pages}, Borrowed: ${this.isBorrowed}`;
    }
}

class Magazine implements LibraryItem {
    public isBorrowed: boolean = false;

    constructor(
        public title: string,
        public author: string,
        private issueNumber: number
    ) {}

    borrow(): void {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log(`Magazine "${this.title}" has been borrowed.`);
        } else {
            console.log(`Magazine "${this.title}" is already borrowed.`);
        }
    }

    getInfo(): string {
        return `Magazine: "${this.title}" by ${this.author}, Issue: ${this.issueNumber}, Borrowed: ${this.isBorrowed}`;
    }
}

class DVD implements LibraryItem {
    public isBorrowed: boolean = false;

    constructor(
        public title: string,
        public author: string,
        private duration: number // minutes
    ) {}

    borrow(): void {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log(`DVD "${this.title}" has been borrowed.`);
        } else {
            console.log(`DVD "${this.title}" is already borrowed.`);
        }
    }

    getInfo(): string {
        return `DVD: "${this.title}" by ${this.author}, Duration: ${this.duration} min, Borrowed: ${this.isBorrowed}`;
    }
}

// 3. Class Library
class Library {
    private items: LibraryItem[] = [];

    addItem(item: LibraryItem): void {
        this.items.push(item);
    }

    findItemByName(name: string): LibraryItem | undefined {
        return this.items.find(item => item.title.toLowerCase() === name.toLowerCase());
    }

    listAvailableItems(): void {
        console.log("Available items in library:");
        this.items.forEach(item => {
            if (!item.isBorrowed) {
                if (item instanceof Book) {
                    console.log(item.getInfo());
                } else if (item instanceof Magazine) {
                    console.log(item.getInfo());
                } else if (item instanceof DVD) {
                    console.log(item.getInfo());
                }
            }
        });
    }
}

// 4. Demo
const library = new Library();

// Create items
const book1 = new Book("The Great Gatsby", "F. Scott Fitzgerald", 180);
const book2 = new Book("1984", "George Orwell", 328);
const magazine1 = new Magazine("National Geographic", "Various", 202);
const dvd1 = new DVD("Inception", "Christopher Nolan", 148);

// Add items to library
library.addItem(book1);
library.addItem(book2);
library.addItem(magazine1);
library.addItem(dvd1);

// Borrow some items
book1.borrow();
dvd1.borrow();

// List available items
library.listAvailableItems();

// Find item by name
const foundItem = library.findItemByName("1984");
if (foundItem) {
    console.log(`Found item: "${foundItem.title}" by ${foundItem.author}`);
}
