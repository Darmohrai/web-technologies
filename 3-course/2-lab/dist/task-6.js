"use strict";
// 2. Classes Book, Magazine, DVD
class Book {
    constructor(title, author, pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isBorrowed = false;
    }
    borrow() {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log(`Book "${this.title}" has been borrowed.`);
        }
        else {
            console.log(`Book "${this.title}" is already borrowed.`);
        }
    }
    getInfo() {
        return `Book: "${this.title}" by ${this.author}, Pages: ${this.pages}, Borrowed: ${this.isBorrowed}`;
    }
}
class Magazine {
    constructor(title, author, issueNumber) {
        this.title = title;
        this.author = author;
        this.issueNumber = issueNumber;
        this.isBorrowed = false;
    }
    borrow() {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log(`Magazine "${this.title}" has been borrowed.`);
        }
        else {
            console.log(`Magazine "${this.title}" is already borrowed.`);
        }
    }
    getInfo() {
        return `Magazine: "${this.title}" by ${this.author}, Issue: ${this.issueNumber}, Borrowed: ${this.isBorrowed}`;
    }
}
class DVD {
    constructor(title, author, duration // minutes
    ) {
        this.title = title;
        this.author = author;
        this.duration = duration;
        this.isBorrowed = false;
    }
    borrow() {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log(`DVD "${this.title}" has been borrowed.`);
        }
        else {
            console.log(`DVD "${this.title}" is already borrowed.`);
        }
    }
    getInfo() {
        return `DVD: "${this.title}" by ${this.author}, Duration: ${this.duration} min, Borrowed: ${this.isBorrowed}`;
    }
}
// 3. Class Library
class Library {
    constructor() {
        this.items = [];
    }
    addItem(item) {
        this.items.push(item);
    }
    findItemByName(name) {
        return this.items.find(item => item.title.toLowerCase() === name.toLowerCase());
    }
    listAvailableItems() {
        console.log("Available items in library:");
        this.items.forEach(item => {
            if (!item.isBorrowed) {
                if (item instanceof Book) {
                    console.log(item.getInfo());
                }
                else if (item instanceof Magazine) {
                    console.log(item.getInfo());
                }
                else if (item instanceof DVD) {
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
