// Tabs switcher
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
let isValid = true;
let login = false;
let register = false;


tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', () => {
        const input = icon.previousElementSibling;
        input.type = input.type === 'password' ? 'text' : 'password';
        icon.textContent = input.type === 'password' ? '👁️' : '🙈';
    });
});

// Dynamic City select
const citiesByCountry = {
    Ukraine: ['Київ', 'Львів', 'Одеса', 'Харків'],
    Poland: ['Варшава', 'Краків', 'Вроцлав']
};

const countrySelect = document.getElementById('country');
const citySelect = document.getElementById('city');

countrySelect.addEventListener('change', function () {
    citySelect.innerHTML = '<option disabled selected>Оберіть місто</option>';
    citySelect.disabled = false;
    const cities = citiesByCountry[this.value] || [];
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
});

// Phone number format
function formatPhoneNumber(input) {
    let phoneNumber = input.value.replace(/\D/g, ''); // Remove all non-digit characters

    if (phoneNumber.length <= 3) {
        phoneNumber = '+380';
    } else if (phoneNumber.length > 3 && phoneNumber.length <= 5) {
        phoneNumber = '+380-' + phoneNumber.slice(3, 5);
    } else if (phoneNumber.length > 5 && phoneNumber.length <= 7) {
        phoneNumber = '+380-' + phoneNumber.slice(3, 5) + '-' + phoneNumber.slice(5, 7);
    } else if (phoneNumber.length > 7 && phoneNumber.length <= 9) {
        phoneNumber = '+380-' + phoneNumber.slice(3, 5) + '-' + phoneNumber.slice(5, 7) + '-' + phoneNumber.slice(7, 9);
    } else if (phoneNumber.length > 9) {
        phoneNumber = '+380-' + phoneNumber.slice(3, 5) + '-' + phoneNumber.slice(5, 7) + '-' + phoneNumber.slice(7, 9) + '-' + phoneNumber.slice(9, 12);
    }

    input.value = phoneNumber;
}

function validatePhoneNumber(phoneNumber) {
    let cleanNumber = phoneNumber.replace(/\D/g, ''); // Remove all non-digit characters
    return cleanNumber.length === 12 && cleanNumber.startsWith('380');
}

// Handle phone input formatting
document.getElementById('registerForm').querySelector('input[name="phone"]').addEventListener('input', function () {
    formatPhoneNumber(this);
});

// Validation function
function validateInput(input, condition, errorMessage) {
    const small = input.parentElement.querySelector('small');
    console.log(condition);
    if (condition) {
        input.classList.add('valid');
        input.classList.remove('invalid');
        small.style.display = 'none';
    } else {
        input.classList.add('invalid');
        input.classList.remove('valid');
        small.textContent = errorMessage;
        small.style.display = 'block';
        isValid = false;
    }
}

// Show success message
function showSuccessMessage(message) {
    const successMessage = document.querySelector('.success-message');
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    setTimeout(() => successMessage.style.display = 'none', 2500);
}

// Show error message
function showErrorMessage(message) {
    const errorMessage = document.querySelector('.error-message');

    // Перевіряємо, чи елемент існує
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => errorMessage.style.display = 'none', 2500);
    }
}

// Handle registration form submission
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const firstName = this.firstName;
    const lastName = this.lastName;
    const email = this.email;
    const password = this.password;
    const confirmPassword = this.confirmPassword;
    const phone = this.phone;
    const birthDate = this.birthDate;
    const sex = this.sex;
    const country = this.country;
    const city = this.city;

    isValid = true;

    validateInput(firstName, firstName.value.length >= 3 && firstName.value.length <= 30, "Ім'я має містити від 3 до 30 символів");
    validateInput(lastName, lastName.value.length >= 3 && lastName.value.length <= 30, "Прізвище має містити від 3 до 30 символів");
    validateInput(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value), "Невірний email");
    validateInput(password, password.value.length >= 6, "Пароль має містити щонайменше 6 символів");
    validateInput(confirmPassword, confirmPassword.value === password.value, "Паролі не співпадають");
    validateInput(phone, validatePhoneNumber(phone.value), "Невірний телефон (+380...)");


    const userBirthDate = new Date(birthDate.value);
    const today = new Date();
    const age = today.getFullYear() - userBirthDate.getFullYear();
    const monthDiff = today.getMonth() - userBirthDate.getMonth();

    let isOldEnough = age > 12 || (age === 12 && monthDiff >= 0);
    validateInput(birthDate, userBirthDate < today && isOldEnough, "Недостатній вік або майбутня дата");

    validateInput(sex, sex.value, "Оберіть стать");
    validateInput(country, country.value, "Оберіть країну");
    validateInput(city, city.value, "Оберіть місто");

    console.log(isValid);

    if (isValid) {
        sendRegistration(e).then(() => {
            if (!register) {
                showErrorMessage("Будь ласка, перевірте введені дані.");
                return;
            }
            showSuccessMessage("Реєстрація успішна!");
            this.reset();
            document.querySelectorAll('input, select').forEach(input => {
                input.classList.remove('valid', 'invalid');
                input.parentElement.querySelector('small').style.display = 'none';
            });
            citySelect.disabled = true;
        })

    } else {
        showErrorMessage("Будь ласка, перевірте введені дані.");
    }
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = this.username;
    const password = this.password;

    let isValid = true;

    validateInput(username, username.value.trim() !== "", "Заповніть ім'я користувача");
    validateInput(password, password.value.length >= 6, "Пароль має містити щонайменше 6 символів");

    console.log(isValid);

    if (isValid) {
        await sendLogin(e);
        const token = localStorage.getItem("token");
        if (token == null) {
            showErrorMessage("Невірні дані для авторизації.");
            return;
        }
        if (!login) return;
        showSuccessMessage("Авторизація успішна!");
        this.reset();
        const people = [];
        const pages = loadPagesFromUrl(); // Set of page numbers
        console.log(Array.from(pages) + "pages");
        if (pages.size > 0) {
            for (const page of pages) {
                console.log(page);
                const persons = await fetchPersons(page); // припускаємо: fetchPersons(page) повертає масив
                people.push(...persons); // додаємо всіх людей до масиву
            }
        }
        else {
            page = 1;
            const persons = await fetchPersons(page); // припускаємо: fetchPersons(page) повертає масив
            people.push(...persons);
        }
        console.log(people);
        showFriendSearchApp(people);
        document.querySelectorAll('input').forEach(input => {
            input.classList.remove('valid', 'invalid');
            const small = input.parentElement.querySelector('small');
            if (small) {
                small.style.display = 'none';
            }
        });
    } else {
        showErrorMessage("Невірні дані для авторизації.");
    }
});

document.getElementById('firstName').addEventListener('blur', () => {
    const firstName = document.getElementById('firstName');
    validateInput(firstName, firstName.value.length >= 3 && firstName.value.length <= 30, "Ім'я має містити від 3 до 30 символів");
});

document.getElementById('lastName').addEventListener('blur', () => {
    const lastName = document.getElementById('lastName');
    validateInput(lastName, lastName.value.length >= 3 && lastName.value.length <= 30, "Прізвище має містити від 3 до 30 символів");
});

document.getElementById('email').addEventListener('blur', () => {
    const email = document.getElementById('email');
    validateInput(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value), "Невірний email");
});

document.getElementById('password').addEventListener('blur', () => {
    const password = document.getElementById('password');
    validateInput(password, password.value.length >= 6, "Пароль має містити щонайменше 6 символів");
});

document.getElementById('confirmPassword').addEventListener('blur', () => {
    const confirmPassword = document.getElementById('confirmPassword');
    const password = document.getElementById('password');
    validateInput(confirmPassword, confirmPassword.value === password.value, "Паролі не співпадають");
});

document.getElementById('phone').addEventListener('blur', () => {
    const phone = document.getElementById('phone');
    validateInput(phone, validatePhoneNumber(phone.value), "Невірний телефон (+380...)");
});

document.getElementById('birthDate').addEventListener('blur', () => {
    const birthDate = document.getElementById('birthDate');
    const userBirthDate = new Date(birthDate.value);
    const today = new Date();
    const age = today.getFullYear() - userBirthDate.getFullYear();
    const monthDiff = today.getMonth() - userBirthDate.getMonth();
    const isOldEnough = age > 12 || (age === 12 && monthDiff >= 0);
    validateInput(birthDate, userBirthDate < today && isOldEnough, "Недостатній вік або майбутня дата");
});

document.getElementById('sex').addEventListener('blur', () => {
    const sex = document.getElementById('sex');
    validateInput(sex, sex.value, "Оберіть стать");
});

document.getElementById('country').addEventListener('blur', () => {
    const country = document.getElementById('country');
    validateInput(country, country.value, "Оберіть країну");
});

document.getElementById('city').addEventListener('blur', () => {
    const city = document.getElementById('city');
    validateInput(city, city.value, "Оберіть місто");
});

document.getElementById('username').addEventListener('blur', () => {
    const firstName = document.getElementById('username');
    validateInput(firstName, firstName.value.length >= 3 && firstName.value.length <= 30, "Ім'я має містити від 3 до 30 символів");
});

document.getElementById('loginPassword').addEventListener('blur', () => {
    const password = document.getElementById('loginPassword');
    validateInput(password, password.value.length >= 6, "Пароль має містити щонайменше 6 символів");
});


async function sendRegistration(e) {
    e.preventDefault();

    const form = e.target;

    const formData = new FormData();

    const birthDateString = form.birthDate.value;
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    console.log('Nationality:', form.nationality.value);

    const personRequest = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        password: form.password.value,
        age: age,
        sex: form.sex.value,
        phoneNumber: form.phone.value,
        nationality: form.nationality.value,
        militaryRank: parseInt(form.militaryRank.value, 10) || 0
    };

    formData.append("personRequest", new Blob(
        [JSON.stringify(personRequest)],
        {type: "application/json"}
    ));

    const photo = form.photo.files[0];
    if (photo) {
        formData.append("image", photo);
    }

    register = true;

    try {
        const response = await fetch("http://localhost:8080/reich-media/auth/add", {
            method: "PUT",
            body: formData
        });

        if (!response.ok) {
            register = false
            throw new Error("Помилка під час надсилання форми");
        }

        const result = await response.json();

        console.log("Успішна реєстрація:", result);
    } catch (error) {
        console.error("Помилка:", error);
        register = false;
        showErrorMessage("Помилка реєстрації")
    }
    console.log(register + "lallalalalalla");
};


async function sendLogin(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.username.value;
    const password = (form.password.value);

    const loginData = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('http://localhost:8080/reich-media/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            login = false;
            const errorText = await response.text();
            throw new Error("Помилка входу: " + errorText);
        }

        const token = await response.text();
        console.log("JWT Token:", token);
        localStorage.setItem("token", token);
        if (token) {
            login = true;
        }
    } catch (error) {
        console.error("Помилка логіну:", error);
        if (error.response.status === 403) {
            showErrorMessage("Помилка логіну: невірно введені дані")
        } else {
            showErrorMessage("Сталася помилка при логіні");
        }
    }
};