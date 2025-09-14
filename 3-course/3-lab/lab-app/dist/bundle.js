/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/bootstrap/dist/css/bootstrap.min.css":
/*!***********************************************************!*\
  !*** ./node_modules/bootstrap/dist/css/bootstrap.min.css ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/models.ts":
/*!***********************!*\
  !*** ./src/models.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Book: () => (/* binding */ Book),
/* harmony export */   User: () => (/* binding */ User)
/* harmony export */ });
var Book = (function () {
    function Book(title, author, year, borrowedById) {
        if (borrowedById === void 0) { borrowedById = null; }
        this.borrowedById = null;
        this.title = title;
        this.author = author;
        this.year = year;
        this.borrowedById = borrowedById;
    }
    Book.prototype.getTitle = function () { return this.title; };
    Book.prototype.getAuthor = function () { return this.author; };
    Book.prototype.getYear = function () { return this.year; };
    Book.prototype.isBorrowed = function () { return this.borrowedById !== null; };
    Book.prototype.borrow = function (userId) {
        if (this.borrowedById)
            throw new Error("Книга вже позичена!");
        this.borrowedById = userId;
    };
    Book.prototype.returnBook = function () {
        this.borrowedById = null;
    };
    Book.prototype.getBorrowedBy = function () {
        return this.borrowedById;
    };
    Book.prototype.toString = function () {
        return "".concat(this.title, " \u2014 ").concat(this.author, " (").concat(this.year, ")") +
            (this.borrowedById ? " [\u041F\u043E\u0437\u0438\u0447\u0435\u043D\u0430 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0435\u043C #".concat(this.borrowedById, "]") : '');
    };
    return Book;
}());

var User = (function () {
    function User(name, email) {
        this.id = User.nextId++;
        this.name = name;
        this.email = email;
    }
    User.prototype.getId = function () {
        return this.id;
    };
    User.prototype.getName = function () {
        return this.name;
    };
    User.prototype.getEmail = function () {
        return this.email;
    };
    User.prototype.toString = function () {
        return "#".concat(this.id, " ").concat(this.name, " (").concat(this.email, ")");
    };
    User.nextId = 1;
    return User;
}());



/***/ }),

/***/ "./src/services.ts":
/*!*************************!*\
  !*** ./src/services.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BookService: () => (/* binding */ BookService),
/* harmony export */   LibraryService: () => (/* binding */ LibraryService),
/* harmony export */   UserService: () => (/* binding */ UserService)
/* harmony export */ });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ "./src/models.ts");
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./storage */ "./src/storage.ts");
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};


var LibraryService = (function () {
    function LibraryService() {
        this.items = [];
    }
    LibraryService.prototype.add = function (item) {
        this.items.push(item);
    };
    LibraryService.prototype.remove = function (predicate) {
        this.items = this.items.filter(function (item) { return !predicate(item); });
    };
    LibraryService.prototype.find = function (predicate) {
        return this.items.find(predicate);
    };
    LibraryService.prototype.getAll = function () {
        return __spreadArray([], this.items, true);
    };
    LibraryService.prototype.count = function () {
        return this.items.length;
    };
    return LibraryService;
}());

var BookService = (function () {
    function BookService() {
        this.storage = new _storage__WEBPACK_IMPORTED_MODULE_1__.IStorage();
        this.books = [];
        var saved = this.storage.get('books');
        if (saved) {
            this.books = saved.map(function (b) { return new _models__WEBPACK_IMPORTED_MODULE_0__.Book(b.title, b.author, b.year, b.borrowedById); });
        }
    }
    BookService.prototype.add = function (book) {
        this.books.push(book);
        this.save();
    };
    BookService.prototype.getAll = function () {
        return __spreadArray([], this.books, true);
    };
    BookService.prototype.borrow = function (book, userId) {
        var index = this.books.findIndex(function (b) { return b.getTitle() === book.getTitle() && b.getAuthor() === book.getAuthor() && b.getYear() === book.getYear(); });
        if (index !== -1) {
            this.books[index].borrow(userId);
            this.save();
        }
    };
    BookService.prototype.returnBook = function (book) {
        var index = this.books.findIndex(function (b) { return b.getTitle() === book.getTitle() &&
            b.getAuthor() === book.getAuthor() &&
            b.getYear() === book.getYear(); });
        if (index !== -1) {
            this.books[index].returnBook();
            this.save();
        }
    };
    BookService.prototype.save = function () {
        this.storage.set('books', this.books);
    };
    BookService.prototype.search = function (query) {
        var lowerQuery = query.toLowerCase();
        return this.books.filter(function (b) {
            return b.getTitle().toLowerCase().includes(lowerQuery) ||
                b.getAuthor().toLowerCase().includes(lowerQuery);
        });
    };
    BookService.prototype.remove = function (book) {
        this.books = this.books.filter(function (b) { return b !== book; });
        this.storage.set('books', this.books);
    };
    return BookService;
}());

var UserService = (function () {
    function UserService() {
        this.storage = new _storage__WEBPACK_IMPORTED_MODULE_1__.IStorage();
        this.users = [];
        var saved = this.storage.get('users');
        if (saved) {
            this.users = saved.map(function (u) { return new _models__WEBPACK_IMPORTED_MODULE_0__.User(u.name, u.email); });
        }
    }
    UserService.prototype.add = function (user) {
        this.users.push(user);
        this.save();
    };
    UserService.prototype.getAll = function () {
        return __spreadArray([], this.users, true);
    };
    UserService.prototype.save = function () {
        this.storage.set('users', this.users);
    };
    UserService.prototype.remove = function (user) {
        this.users = this.users.filter(function (u) { return u !== user; });
        this.storage.set('users', this.users);
    };
    return UserService;
}());



/***/ }),

/***/ "./src/storage.ts":
/*!************************!*\
  !*** ./src/storage.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IStorage: () => (/* binding */ IStorage)
/* harmony export */ });
var IStorage = (function () {
    function IStorage() {
        this.storage = window.localStorage;
    }
    IStorage.prototype.set = function (key, value) {
        var json = JSON.stringify(value);
        this.storage.setItem(key, json);
    };
    IStorage.prototype.get = function (key) {
        var data = this.storage.getItem(key);
        return data ? JSON.parse(data) : null;
    };
    IStorage.prototype.remove = function (key) {
        this.storage.removeItem(key);
    };
    IStorage.prototype.clear = function () {
        this.storage.clear();
    };
    IStorage.prototype.has = function (key) {
        return this.storage.getItem(key) !== null;
    };
    return IStorage;
}());



/***/ }),

/***/ "./src/styles/main.scss":
/*!******************************!*\
  !*** ./src/styles/main.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/validation.ts":
/*!***************************!*\
  !*** ./src/validation.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Validation: () => (/* binding */ Validation)
/* harmony export */ });
var Validation;
(function (Validation) {
    function required(value) {
        return value.trim().length > 0;
    }
    Validation.required = required;
    function isNumber(value) {
        return /^\d+$/.test(value);
    }
    Validation.isNumber = isNumber;
    function isYear(value) {
        var year = Number(value);
        return !isNaN(year) && year >= 0 && year <= 2025;
    }
    Validation.isYear = isYear;
    function isEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    Validation.isEmail = isEmail;
})(Validation || (Validation = {}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ "./src/models.ts");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./services */ "./src/services.ts");
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./validation */ "./src/validation.ts");
/* harmony import */ var bootstrap_dist_css_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bootstrap/dist/css/bootstrap.min.css */ "./node_modules/bootstrap/dist/css/bootstrap.min.css");
/* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles/main.scss */ "./src/styles/main.scss");





var App = (function () {
    function App() {
        this.bookService = new _services__WEBPACK_IMPORTED_MODULE_1__.BookService();
        this.userService = new _services__WEBPACK_IMPORTED_MODULE_1__.UserService();
        this.currentBookToBorrow = null;
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.bindForms();
        this.renderBooks();
        this.bindSearch();
        this.renderUsers();
    }
    App.prototype.notify = function (message, type) {
        if (type === void 0) { type = "info"; }
        var container = document.getElementById("notifications");
        var toast = document.createElement("div");
        toast.className = "toast align-items-center text-white bg-".concat(type, " border-0 mb-2");
        toast.role = "alert";
        toast.setAttribute("aria-live", "assertive");
        toast.setAttribute("aria-atomic", "true");
        toast.innerHTML = "\n            <div class=\"d-flex\">\n                <div class=\"toast-body\">".concat(message, "</div>\n                <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\" aria-label=\"Close\"></button>\n            </div>\n        ");
        container.appendChild(toast);
        var bsToast = new window.bootstrap.Toast(toast, { delay: 3000 });
        bsToast.show();
        toast.addEventListener('hidden.bs.toast', function () { return toast.remove(); });
    };
    App.prototype.bindModalButtons = function () {
        var _this = this;
        var confirmBtn = document.getElementById("confirmBorrowBtn");
        var modalEl = document.getElementById("borrowModal");
        confirmBtn.addEventListener("click", function () {
            var _a;
            var input = document.getElementById("borrowUserId");
            var userId = Number(input.value);
            if (isNaN(userId)) {
                _this.showNotification("Введіть коректний числовий ID користувача!", "danger");
                return;
            }
            var user = _this.userService.getAll().find(function (u) { return u.getId() === userId; });
            if (!user) {
                _this.showNotification("Користувача з таким ID не знайдено!", "danger");
                return;
            }
            if (!_this.currentBookToBorrow)
                return;
            var borrowedBooksCount = _this.bookService.getAll().filter(function (b) { return b.getBorrowedBy() === userId; }).length;
            if (borrowedBooksCount >= 3) {
                _this.showNotification("Користувач не може позичити більше 3 книг!", "danger");
                return;
            }
            _this.bookService.borrow(_this.currentBookToBorrow, userId);
            _this.showNotification("\u041A\u043D\u0438\u0433\u0430 \"".concat(_this.currentBookToBorrow.getTitle(), "\" \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u043F\u043E\u0437\u0438\u0447\u0435\u043D\u0430 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0443 #").concat(userId), "success");
            _this.currentBookToBorrow = null;
            _this.renderBooks();
            input.value = "";
            (_a = window.bootstrap.Modal.getInstance(modalEl)) === null || _a === void 0 ? void 0 : _a.hide();
        });
    };
    App.prototype.handleAddBook = function (event) {
        event.preventDefault();
        var titleInput = document.getElementById("bookTitle");
        var authorInput = document.getElementById("bookAuthor");
        var yearInput = document.getElementById("bookYear");
        var titleError = document.getElementById("bookTitleError");
        var authorError = document.getElementById("bookAuthorError");
        var yearError = document.getElementById("bookYearError");
        titleInput.classList.remove("is-invalid");
        authorInput.classList.remove("is-invalid");
        yearInput.classList.remove("is-invalid");
        titleError.textContent = "";
        authorError.textContent = "";
        yearError.textContent = "";
        var hasError = false;
        var title = titleInput.value.trim();
        var author = authorInput.value.trim();
        var year = yearInput.value.trim();
        if (!_validation__WEBPACK_IMPORTED_MODULE_2__.Validation.required(title)) {
            titleInput.classList.add("is-invalid");
            titleError.textContent = "Назва книги обов'язкова!";
            hasError = true;
        }
        if (!_validation__WEBPACK_IMPORTED_MODULE_2__.Validation.required(author)) {
            authorInput.classList.add("is-invalid");
            authorError.textContent = "Автор обов'язковий!";
            hasError = true;
        }
        if (!_validation__WEBPACK_IMPORTED_MODULE_2__.Validation.required(year)) {
            yearInput.classList.add("is-invalid");
            yearError.textContent = "Рік видання обов'язковий!";
            hasError = true;
        }
        else if (!_validation__WEBPACK_IMPORTED_MODULE_2__.Validation.isNumber(year)) {
            yearInput.classList.add("is-invalid");
            yearError.textContent = "Рік видання має бути числом!";
            hasError = true;
        }
        else if (!_validation__WEBPACK_IMPORTED_MODULE_2__.Validation.isYear(year)) {
            yearInput.classList.add("is-invalid");
            yearError.textContent = "Введіть коректний рік (1000–2999)!";
            hasError = true;
        }
        if (hasError)
            return;
        var book = new _models__WEBPACK_IMPORTED_MODULE_0__.Book(title, author, Number(year));
        this.bookService.add(book);
        this.renderBooks();
        event.target.reset();
    };
    App.prototype.handleAddUser = function (event) {
        event.preventDefault();
        var nameInput = document.getElementById("userName");
        var emailInput = document.getElementById("userEmail");
        var nameError = document.getElementById("userNameError");
        var emailError = document.getElementById("userEmailError");
        nameInput.classList.remove("is-invalid");
        emailInput.classList.remove("is-invalid");
        nameError.textContent = "";
        emailError.textContent = "";
        var hasError = false;
        var name = nameInput.value.trim();
        var email = emailInput.value.trim();
        if (!_validation__WEBPACK_IMPORTED_MODULE_2__.Validation.required(name)) {
            nameInput.classList.add("is-invalid");
            nameError.textContent = "Ім'я користувача обов'язкове!";
            hasError = true;
        }
        if (!_validation__WEBPACK_IMPORTED_MODULE_2__.Validation.required(email)) {
            emailInput.classList.add("is-invalid");
            emailError.textContent = "Email обов'язковий!";
            hasError = true;
        }
        else if (!_validation__WEBPACK_IMPORTED_MODULE_2__.Validation.isEmail(email)) {
            emailInput.classList.add("is-invalid");
            emailError.textContent = "Введіть коректний Email!";
            hasError = true;
        }
        if (hasError)
            return;
        var newUser = new _models__WEBPACK_IMPORTED_MODULE_0__.User(name, email);
        this.userService.add(newUser);
        this.renderUsers();
        event.target.reset();
    };
    App.prototype.bindSearch = function () {
        var _this = this;
        var searchBtn = document.getElementById("searchBtn");
        var searchInput = document.getElementById("searchQuery");
        searchBtn.addEventListener("click", function () {
            var query = searchInput.value.trim();
            if (!query) {
                _this.renderBooks();
                return;
            }
            var results = _this.bookService.search(query);
            _this.renderBooks(results);
        });
    };
    App.prototype.renderBooks = function (books) {
        var _this = this;
        if (books === void 0) { books = this.bookService.getAll(); }
        var booksList = document.getElementById("booksList");
        booksList.innerHTML = "";
        var totalItems = books.length;
        var totalPages = Math.ceil(totalItems / this.itemsPerPage);
        var startIndex = (this.currentPage - 1) * this.itemsPerPage;
        var endIndex = startIndex + this.itemsPerPage;
        var pageBooks = books.slice(startIndex, endIndex);
        pageBooks.forEach(function (book) {
            var li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            var span = document.createElement("span");
            span.textContent = book.toString();
            li.appendChild(span);
            var btnGroup = document.createElement("div");
            btnGroup.className = "d-flex";
            var borrowBtn = document.createElement("button");
            borrowBtn.className = book.isBorrowed() ? "btn btn-sm btn-warning me-2" : "btn btn-sm btn-primary me-2";
            borrowBtn.textContent = book.isBorrowed() ? "Повернути" : "Позичити";
            borrowBtn.addEventListener("click", function () { return _this.handleBorrowReturn(book, borrowBtn); });
            btnGroup.appendChild(borrowBtn);
            var deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-sm btn-danger";
            deleteBtn.textContent = "Видалити";
            deleteBtn.addEventListener("click", function () {
                _this.bookService.remove(book);
                _this.renderBooks();
                _this.notify("\u041A\u043D\u0438\u0433\u0430 \"".concat(book.getTitle(), "\" \u0432\u0438\u0434\u0430\u043B\u0435\u043D\u0430"), "danger");
            });
            btnGroup.appendChild(deleteBtn);
            li.appendChild(btnGroup);
            booksList.appendChild(li);
        });
        this.renderBookPagination(totalPages);
    };
    App.prototype.renderBookPagination = function (totalPages) {
        var _this = this;
        var pagination = document.getElementById("booksPagination");
        pagination.innerHTML = "";
        if (totalPages <= 1)
            return;
        var nav = document.createElement("nav");
        var ul = document.createElement("ul");
        ul.className = "pagination justify-content-center mt-3";
        var _loop_1 = function (i) {
            var li = document.createElement("li");
            li.className = "page-item ".concat(i === this_1.currentPage ? "active" : "");
            var btn = document.createElement("button");
            btn.className = "page-link";
            btn.textContent = i.toString();
            btn.addEventListener("click", function () {
                _this.currentPage = i;
                _this.renderBooks();
            });
            li.appendChild(btn);
            ul.appendChild(li);
        };
        var this_1 = this;
        for (var i = 1; i <= totalPages; i++) {
            _loop_1(i);
        }
        nav.appendChild(ul);
        pagination.appendChild(nav);
    };
    App.prototype.renderUsers = function (users) {
        var _this = this;
        var usersList = document.getElementById("usersList");
        usersList.innerHTML = "";
        (users !== null && users !== void 0 ? users : this.userService.getAll()).forEach(function (user) {
            var li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            var span = document.createElement("span");
            span.textContent = user.toString();
            li.appendChild(span);
            var btnDelete = document.createElement("button");
            btnDelete.className = "btn btn-sm btn-danger";
            btnDelete.textContent = "Видалити";
            btnDelete.addEventListener("click", function () {
                _this.bookService.getAll().forEach(function (book) {
                    if (book.getBorrowedBy() === user.getId()) {
                        book.returnBook();
                    }
                });
                _this.bookService.save();
                _this.userService.remove(user);
                _this.showNotification("\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447 \"".concat(user.getName(), "\" \u0432\u0438\u0434\u0430\u043B\u0435\u043D\u0438\u0439. \u0423\u0441\u0456 \u0439\u043E\u0433\u043E \u043A\u043D\u0438\u0433\u0438 \u043F\u043E\u0432\u0435\u0440\u043D\u0435\u043D\u0456."), "danger");
                _this.renderUsers();
                _this.renderBooks();
            });
            li.appendChild(btnDelete);
            usersList.appendChild(li);
        });
    };
    App.prototype.bindForms = function () {
        var _this = this;
        var bookForm = document.getElementById("bookForm");
        var userForm = document.getElementById("userForm");
        bookForm.addEventListener("submit", function (e) { return _this.handleAddBook(e); });
        userForm.addEventListener("submit", function (e) { return _this.handleAddUser(e); });
    };
    App.prototype.showNotification = function (message, title) {
        if (title === void 0) { title = "Повідомлення"; }
        var modalEl = document.getElementById("notificationModal");
        var modalTitle = document.getElementById("notificationTitle");
        var modalBody = document.getElementById("notificationBody");
        modalTitle.textContent = title;
        modalBody.textContent = message;
        var modal = new window.bootstrap.Modal(modalEl);
        modal.show();
    };
    App.prototype.handleBorrowReturn = function (book, btn) {
        if (book.isBorrowed()) {
            this.bookService.returnBook(book);
            btn.textContent = "Позичити";
            btn.className = "btn btn-sm btn-primary me-2";
            this.notify("\u041A\u043D\u0438\u0433\u0430 \"".concat(book.getTitle(), "\" \u043F\u043E\u0432\u0435\u0440\u043D\u0435\u043D\u0430"), "info");
        }
        else {
            this.currentBookToBorrow = book;
            var modalEl = document.getElementById("borrowModal");
            if (!modalEl)
                return;
            var modal = new window.bootstrap.Modal(modalEl);
            modal.show();
        }
    };
    return App;
}());
document.addEventListener('DOMContentLoaded', function () {
    var app = new App();
    app.bindModalButtons();
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map