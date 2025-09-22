// import all modules here
import {Book, User} from './models';
import {BookService, LibraryService, UserService} from './services';
import {Validation} from "./validation";

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';


// etc.
class App {
    private bookService = new BookService();
    private userService = new UserService();
    private currentBookToBorrow: Book | null = null;

    private currentPage: number = 1;
    private pageSize: number = 5;

    constructor() {
        console.log('Initializing... nigga');
        this.bindForms();
        this.renderBooks();
        this.bindSearch();
        this.renderUsers();
    }

    bindModalButtons() {
        const confirmBtn = document.getElementById("confirmBorrowBtn")!;
        const modalEl = document.getElementById("borrowModal")!;

        confirmBtn.addEventListener("click", () => {
            const input = document.getElementById("borrowUserId") as HTMLInputElement;
            const userId = Number(input.value);

            if (isNaN(userId)) {
                this.showNotification("Введіть коректний числовий ID користувача!", "danger");
                return;
            }

            const user = this.userService.getAll().find(u => u.getId() === userId);
            if (!user) {
                this.showNotification("Користувача з таким ID не знайдено!", "danger");
                return;
            }

            if (!this.currentBookToBorrow) return;

            const borrowedBooksCount = this.bookService.getAll().filter(b => b.getBorrowedBy() === userId).length;
            if (borrowedBooksCount >= 3) {
                this.showNotification("Користувач не може позичити більше 3 книг!", "danger");
                return;
            }

            this.bookService.borrow(this.currentBookToBorrow, userId);
            this.showNotification(`Книга "${this.currentBookToBorrow.getTitle()}" успішно позичена користувачу #${userId}`, "success");
            this.currentBookToBorrow = null;
            this.renderBooks();
            input.value = "";

            (window as any).bootstrap.Modal.getInstance(modalEl)?.hide();
        });
    }

    private handleAddBook(event: Event) {
        event.preventDefault();

        console.log("nigga");
        const titleInput = document.getElementById("bookTitle") as HTMLInputElement;
        const authorInput = document.getElementById("bookAuthor") as HTMLInputElement;
        const yearInput = document.getElementById("bookYear") as HTMLInputElement;

        const titleError = document.getElementById("bookTitleError") as HTMLDivElement;
        const authorError = document.getElementById("bookAuthorError") as HTMLDivElement;
        const yearError = document.getElementById("bookYearError") as HTMLDivElement;

        titleInput.classList.remove("is-invalid");
        authorInput.classList.remove("is-invalid");
        yearInput.classList.remove("is-invalid");
        titleError.textContent = "";
        authorError.textContent = "";
        yearError.textContent = "";

        let hasError = false;

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const year = yearInput.value.trim();

        if (!Validation.required(title)) {
            titleInput.classList.add("is-invalid");
            titleError.textContent = "Назва книги обов'язкова!";
            hasError = true;
        } else {
            titleInput.classList.add("is-valid");
        }

        if (!Validation.required(author)) {
            authorInput.classList.add("is-invalid");
            authorError.textContent = "Автор обов'язковий!";
            hasError = true;
        } else {
            authorInput.classList.add("is-valid");
        }

        if (!Validation.required(year)) {
            yearInput.classList.add("is-invalid");
            yearError.textContent = "Рік видання обов'язковий!";
            hasError = true;
        } else if (!Validation.isNumber(year)) {
            yearInput.classList.add("is-invalid");
            yearError.textContent = "Рік видання має бути числом!";
            hasError = true;
        } else if (!Validation.isYear(year)) {
            yearInput.classList.add("is-invalid");
            yearError.textContent = "Введіть коректний рік (1000–2999)!";
            hasError = true;
        } else {
            yearInput.classList.add("is-valid");
        }

        if (hasError) return;

        const book = new Book(title, author, Number(year));
        this.bookService.add(book);
        this.renderBooks();
        (event.target as HTMLFormElement).reset();
    }

    private handleAddUser(event: Event) {
        event.preventDefault();

        const nameInput = document.getElementById("userName") as HTMLInputElement;
        const emailInput = document.getElementById("userEmail") as HTMLInputElement;

        const nameError = document.getElementById("userNameError") as HTMLDivElement;
        const emailError = document.getElementById("userEmailError") as HTMLDivElement;

        nameInput.classList.remove("is-invalid");
        emailInput.classList.remove("is-invalid");
        nameError.textContent = "";
        emailError.textContent = "";

        let hasError = false;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        if (!Validation.required(name)) {
            nameInput.classList.add("is-invalid");
            nameError.textContent = "Ім'я користувача обов'язкове!";
            hasError = true;
        }

        if (!Validation.required(email)) {
            emailInput.classList.add("is-invalid");
            emailError.textContent = "Email обов'язковий!";
            hasError = true;
        } else if (!Validation.isEmail(email)) {
            emailInput.classList.add("is-invalid");
            emailError.textContent = "Введіть коректний Email!";
            hasError = true;
        }

        if (hasError) return;

        const newUser = new User(null, name, email);
        this.userService.add(newUser);
        this.renderUsers();
        (event.target as HTMLFormElement).reset();
    }

    private bindSearch() {
        const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
        const searchInput = document.getElementById("searchQuery") as HTMLInputElement;

        searchBtn.addEventListener("click", () => {
            const query = searchInput.value.trim();
            if (!query) {
                this.renderBooks();
                return;
            }
            const results = this.bookService.search(query);
            this.renderBooks(results);
        });
    }

    private renderBooks(books?: Book[]) {
        const booksList = document.getElementById("booksList") as HTMLUListElement;
        booksList.innerHTML = "";

        const allBooks = books ?? this.bookService.getAll();

        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const pageBooks = allBooks.slice(start, end);

        pageBooks.forEach(book => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";

            const span = document.createElement("span");
            span.textContent = book.toString();
            li.appendChild(span);

            const btnGroup = document.createElement("div");
            btnGroup.className = "d-flex";

            const borrowBtn = document.createElement("button");
            borrowBtn.className = book.isBorrowed() ? "btn btn-sm btn-warning me-2" : "btn btn-sm btn-primary me-2";
            borrowBtn.textContent = book.isBorrowed() ? "Повернути" : "Позичити";
            borrowBtn.addEventListener("click", () => this.handleBorrowReturn(book, borrowBtn));
            btnGroup.appendChild(borrowBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-sm btn-danger";
            deleteBtn.textContent = "Видалити";
            deleteBtn.addEventListener("click", () => {
                this.bookService.remove(book);
                this.renderBooks();
            });
            btnGroup.appendChild(deleteBtn);

            li.appendChild(btnGroup);
            booksList.appendChild(li);
        });

        this.renderPagination(allBooks.length);
    }


    private renderUsers(users?: User[]) {
        const usersList = document.getElementById("usersList") as HTMLUListElement;
        usersList.innerHTML = "";

        (users ?? this.userService.getAll()).forEach(user => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";

            const span = document.createElement("span");
            span.textContent = user.toString();
            li.appendChild(span);

            const btnDelete = document.createElement("button");
            btnDelete.className = "btn btn-sm btn-danger";
            btnDelete.textContent = "Видалити";
            btnDelete.addEventListener("click", () => {

                this.bookService.getAll().forEach(book => {
                    if (book.getBorrowedBy() === user.getId()) {
                        book.returnBook();
                    }
                });
                this.bookService.save();

                this.userService.remove(user);

                this.showNotification(`Користувач "${user.getName()}" видалений. Усі його книги повернені.`, "danger");
                this.renderUsers();
                this.renderBooks();
            });

            li.appendChild(btnDelete);
            usersList.appendChild(li);
        });
    }


    private bindForms() {
        console.log("bindForms викликано");

        const bookForm = document.getElementById("bookForm") as HTMLFormElement;
        const userForm = document.getElementById("userForm") as HTMLFormElement;

        bookForm.addEventListener("submit", (e) => this.handleAddBook(e));
        userForm.addEventListener("submit", (e) => this.handleAddUser(e));
    }

    private showNotification(message: string, title: string = "Повідомлення") {
        const modalEl = document.getElementById("notificationModal")!;
        const modalTitle = document.getElementById("notificationTitle")!;
        const modalBody = document.getElementById("notificationBody")!;

        modalTitle.textContent = title;
        modalBody.textContent = message;

        const modal = new (window as any).bootstrap.Modal(modalEl);
        modal.show();
    }

    private handleBorrowReturn(book: Book, btn: HTMLButtonElement) {
        if (book.isBorrowed()) {
            this.bookService.returnBook(book);
            btn.textContent = "Позичити";
            btn.className = "btn btn-sm btn-primary me-2";
        } else {
            this.currentBookToBorrow = book;
            const modalEl = document.getElementById("borrowModal");
            if (!modalEl) return;
            const modal = new (window as any).bootstrap.Modal(modalEl);
            modal.show();
        }
    }

    private renderPagination(totalItems: number) {
        const pagination = document.getElementById("pagination") as HTMLUListElement;
        if (!pagination) return;

        pagination.innerHTML = "";

        const totalPages = Math.ceil(totalItems / this.pageSize);

        const prevLi = document.createElement("li");
        prevLi.className = "page-item" + (this.currentPage === 1 ? " disabled" : "");
        prevLi.innerHTML = `<a class="page-link" href="#">«</a>`;
        prevLi.addEventListener("click", (e) => {
            e.preventDefault();
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderBooks();
            }
        });
        pagination.appendChild(prevLi);

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            li.className = "page-item" + (i === this.currentPage ? " active" : "");
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener("click", (e) => {
                e.preventDefault();
                this.currentPage = i;
                this.renderBooks();
            });
            pagination.appendChild(li);
        }

        const nextLi = document.createElement("li");
        nextLi.className = "page-item" + (this.currentPage === totalPages ? " disabled" : "");
        nextLi.innerHTML = `<a class="page-link" href="#">»</a>`;
        nextLi.addEventListener("click", (e) => {
            e.preventDefault();
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderBooks();
            }
        });
        pagination.appendChild(nextLi);
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.bindModalButtons();
});

