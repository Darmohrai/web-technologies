// Tabs switcher
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
let isValid = true;

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

    if (cleanNumber.length === 12 && cleanNumber.startsWith('380')) {
        return true;
    }
    return false;
}

// Handle phone input formatting
document.getElementById('registerForm').querySelector('input[name="phone"]').addEventListener('input', function () {
    formatPhoneNumber(this);
});

// Validation function
function validateInput(input, condition, errorMessage) {
    const small = input.parentElement.querySelector('small');
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
    setTimeout(() => successMessage.style.display = 'none', 5000);
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

    validateInput(firstName, firstName.value.length >= 3 && firstName.value.length <= 15, "Ім'я має містити від 3 до 15 символів");
    validateInput(lastName, lastName.value.length >= 3 && lastName.value.length <= 15, "Прізвище має містити від 3 до 15 символів");
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
        showSuccessMessage("Реєстрація успішна!");
        this.reset();
        document.querySelectorAll('input, select').forEach(input => {
            input.classList.remove('valid', 'invalid');
            input.parentElement.querySelector('small').style.display = 'none';
        });
        citySelect.disabled = true;
    } else {
        showErrorMessage("Будь ласка, перевірте введені дані.");
    }
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = this.username;
    const password = this.password;

    let isValid = true;

    validateInput(username, username.value.trim() !== "", "Заповніть ім'я користувача") || (isValid = false);
    validateInput(password, password.value.length >= 6, "Пароль має містити щонайменше 6 символів") || (isValid = false);

    if (isValid) {
        showSuccessMessage("Авторизація успішна!");
        this.reset();
        document.querySelectorAll('input').forEach(input => {
            input.classList.remove('valid', 'invalid');
            input.parentElement.querySelector('small').style.display = 'none';
        });
    } else {
        showErrorMessage("Невірні дані для авторизації.");
    }
});
