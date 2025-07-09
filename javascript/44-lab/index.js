// Завдання 1
function task1() {
    let fruits = ["яблуко", "банан", "вишня", "груша"];
    fruits.pop();
    console.log("Завдання 1.1:", fruits);
    fruits.unshift("ананас");
    console.log("Завдання 1.2:", fruits);
    fruits.sort().reverse();
    console.log("Завдання 1.3:", fruits);
    console.log("Завдання 1.4:", fruits.indexOf("яблуко"));
}

// Завдання 2
function task2() {
    let colors = ["червоний", "зелений", "синій", "жовтий", "темно-синій"];
    let longest = colors.reduce((a, b) => (a.length >= b.length ? a : b));
    let shortest = colors.reduce((a, b) => (a.length <= b.length ? a : b));
    console.log("Завдання 2.2:", longest, shortest);
    colors = colors.filter(color => color.includes("синій"));
    console.log("Завдання 2.3:", colors);
    console.log("Завдання 2.5:", colors.join(", "));
}

// Завдання 3
function task3() {
    let employees = [
        { name: "Анна", age: 28, position: "розробник" },
        { name: "Борис", age: 35, position: "менеджер" },
        { name: "Віктор", age: 22, position: "розробник" }
    ];
    employees.sort((a, b) => a.name.localeCompare(b.name));
    console.log("Завдання 3.2:", employees);
    console.log("Завдання 3.3:", employees.filter(e => e.position === "розробник"));
    employees = employees.filter(e => e.age !== 35);
    console.log("Завдання 3.4:", employees);
    employees.push({ name: "Ганна", age: 30, position: "дизайнер" });
    console.log("Завдання 3.5:", employees);
}

// Завдання 4
function task4() {
    let students = [
        { name: "Олексій", age: 20, course: 2 },
        { name: "Марина", age: 21, course: 3 },
        { name: "Іван", age: 22, course: 1 }
    ];
    students = students.filter(s => s.name !== "Олексій");
    console.log("Завдання 4.2:", students);
    students.push({ name: "Сергій", age: 19, course: 1 });
    console.log("Завдання 4.3:", students);
    students.sort((a, b) => b.age - a.age);
    console.log("Завдання 4.4:", students);
    console.log("Завдання 4.5:", students.find(s => s.course === 3));
}


// Завдання 5
function task5() {
    let numbers = [1, 2, 3, 4, 5];
    console.log("Завдання 5.1:", numbers.map(n => n ** 2));
    console.log("Завдання 5.2:", numbers.filter(n => n % 2 === 0));
    console.log("Завдання 5.3:", numbers.reduce((sum, n) => sum + n, 0));
    let extraNumbers = [6, 7, 8, 9, 10];
    numbers = [...numbers, ...extraNumbers];
    numbers.splice(0, 3);
    console.log("Завдання 5.5:", numbers);
}

// Завдання 6
function libraryManagement() {
    let library = [
        { title: "Книга 1", author: "Автор 1", genre: "Фантастика", pages: 300, isAvailable: true },
        { title: "Книга 2", author: "Автор 2", genre: "Детектив", pages: 250, isAvailable: false }
    ];

    function addBook(title, author, genre, pages) {
        library.push({ title, author, genre, pages, isAvailable: true });
    }

    function removeBook(title) {
        library = library.filter(book => book.title !== title);
    }

    function findBooksByAuthor(author) {
        return library.filter(book => book.author === author);
    }

    function toggleBookAvailability(title, isBorrowed) {
        let book = library.find(book => book.title === title);
        if (book) book.isAvailable = !isBorrowed;
    }

    function sortBooksByPages() {
        library.sort((a, b) => a.pages - b.pages);
    }

    function getBooksStatistics() {
        let total = library.length;
        let available = library.filter(book => book.isAvailable).length;
        let taken = total - available;
        let avgPages = total ? library.reduce((sum, book) => sum + book.pages, 0) / total : 0;
        return { total, available, taken, avgPages };
    }

    addBook("Книга 3", "Автор 3", "Роман", 200);
    removeBook("Книга 1");
    console.log("Завдання 6.1 (Книги певного автора):", findBooksByAuthor("Автор 3"));
    toggleBookAvailability("Книга 2", true);
    sortBooksByPages();
    console.log("Завдання 6.2 (Відсортовані книги):", library);
    console.log("Завдання 6.3 (Статистика):", getBooksStatistics());
}

// Завдання 7
function task7() {
    let student = { name: "Іван", age: 21, course: 3 };
    student.subjects = ["Математика", "Фізика", "Програмування"];
    delete student.age;
    console.log("Завдання 7:", student);
}