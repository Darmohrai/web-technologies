// import all modules here
import {Book, User} from './models';
import {BookService, LibraryService, UserService} from './services';
import {Validation} from "./validation";

// etc.
class App {
    private bookService = new BookService();
    private userService = new UserService();
    private currentBookToBorrow: Book | null = null;

    constructor() {
        this.bindForms();
        this.renderBooks();
        this.bindSearch();
        this.renderUsers();
    }

    // --- Сповіщення через Bootstrap toast ---
    private notify(message: string, type: "success" | "danger" | "info" = "info") {
        const container = document.getElementById("notifications")!;
        const toast = document.createElement("div");
        toast.className = `toast align-items-center text-white bg-${type} border-0 mb-2`;
        toast.role = "alert";
        toast.setAttribute("aria-live", "assertive");
        toast.setAttribute("aria-atomic", "true");

        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        container.appendChild(toast);
        const bsToast = new (window as any).bootstrap.Toast(toast, {delay: 3000});
        bsToast.show();
        toast.addEventListener('hidden.bs.toast', () => toast.remove());
    }

    // --- Кнопки модального вікна позичання ---
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

    // --- Додавання книги ---
    private handleAddBook(event: Event) {
        event.preventDefault();

        const titleInput = document.getElementById("bookTitle") as HTMLInputElement;
        const authorInput = document.getElementById("bookAuthor") as HTMLInputElement;
        const yearInput = document.getElementById("bookYear") as HTMLInputElement;

        // блоки для помилок
        const titleError = document.getElementById("bookTitleError") as HTMLDivElement;
        const authorError = document.getElementById("bookAuthorError") as HTMLDivElement;
        const yearError = document.getElementById("bookYearError") as HTMLDivElement;

        // очищаємо попередні помилки
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
        }
        if (!Validation.required(author)) {
            authorInput.classList.add("is-invalid");
            authorError.textContent = "Автор обов'язковий!";
            hasError = true;
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
        }

        if (hasError) return;

        const book = new Book(title, author, Number(year));
        this.bookService.add(book);
        this.renderBooks();
        (event.target as HTMLFormElement).reset();
        //this.showNotification(`Книга "${title}" додана успішно`, "success");
    }

    // --- Додавання користувача ---
    private handleAddUser(event: Event) {
        event.preventDefault();

        const nameInput = document.getElementById("userName") as HTMLInputElement;
        const emailInput = document.getElementById("userEmail") as HTMLInputElement;

        const nameError = document.getElementById("userNameError") as HTMLDivElement;
        const emailError = document.getElementById("userEmailError") as HTMLDivElement;

        // очищаємо попередні помилки
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

        const newUser = new User(name, email);
        this.userService.add(newUser);
        this.renderUsers();
        (event.target as HTMLFormElement).reset();
        //this.showNotification(`Користувач "${name}" доданий успішно`, "success");
    }

    private bindSearch() {
        const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
        const searchInput = document.getElementById("searchQuery") as HTMLInputElement;

        searchBtn.addEventListener("click", () => {
            const query = searchInput.value.trim();
            if (!query) {
                this.renderBooks(); // якщо пусто — показуємо всі книги
                return;
            }
            const results = this.bookService.search(query);
            this.renderBooks(results);
        });
    }

    // --- Відображення книг ---
    private renderBooks(books?: Book[]) {
        const booksList = document.getElementById("booksList") as HTMLUListElement;
        booksList.innerHTML = "";

        (books ?? this.bookService.getAll()).forEach(book => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";

            // назва книги
            const span = document.createElement("span");
            span.textContent = book.toString();
            li.appendChild(span);

            // кнопки
            const btnGroup = document.createElement("div");
            btnGroup.className = "d-flex";

            // Позичити / Повернути
            const borrowBtn = document.createElement("button");
            borrowBtn.className = book.isBorrowed() ? "btn btn-sm btn-warning me-2" : "btn btn-sm btn-primary me-2";
            borrowBtn.textContent = book.isBorrowed() ? "Повернути" : "Позичити";
            borrowBtn.addEventListener("click", () => this.handleBorrowReturn(book, borrowBtn));
            btnGroup.appendChild(borrowBtn);

            // Видалити
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-sm btn-danger";
            deleteBtn.textContent = "Видалити";
            deleteBtn.addEventListener("click", () => {
                this.bookService.remove(book);
                this.renderBooks();
                //this.showNotification(`Книга "${book.getTitle()}" видалена`, "danger");
            });
            btnGroup.appendChild(deleteBtn);

            li.appendChild(btnGroup);
            booksList.appendChild(li);
        });
    }


    // --- Відображення користувачів ---
    private renderUsers(users?: User[]) {
        const usersList = document.getElementById("usersList") as HTMLUListElement;
        usersList.innerHTML = "";

        (users ?? this.userService.getAll()).forEach(user => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";

            const span = document.createElement("span");
            span.textContent = user.toString();
            li.appendChild(span);

            // Кнопка Видалити
            const btnDelete = document.createElement("button");
            btnDelete.className = "btn btn-sm btn-danger";
            btnDelete.textContent = "Видалити";
            btnDelete.addEventListener("click", () => {

                // 1. Повертаємо всі книги, які позичив цей юзер
                this.bookService.getAll().forEach(book => {
                    if (book.getBorrowedBy() === user.getId()) {
                        book.returnBook();
                    }
                });
                this.bookService.save(); // зберігаємо зміни в localStorage

                // 2. Видаляємо юзера
                this.userService.remove(user);

                // 3. Повідомлення + оновлення списків
                this.showNotification(`Користувач "${user.getName()}" видалений. Усі його книги повернені.`, "danger");
                this.renderUsers();
                this.renderBooks();
            });

            li.appendChild(btnDelete);
            usersList.appendChild(li);
        });
    }


    private bindForms() {
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
            this.notify(`Книга "${book.getTitle()}" повернена`, "info");
        } else {
            this.currentBookToBorrow = book;
            const modalEl = document.getElementById("borrowModal");
            if (!modalEl) return;
            const modal = new (window as any).bootstrap.Modal(modalEl);
            modal.show();
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.bindModalButtons(); // тут DOM вже повністю завантажений
});

