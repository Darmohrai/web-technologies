// 1
function sumFirst50Numbers() {
    let sum = 0;
    let i = 1;
    while (i <= 50) {
        sum += i;
        i++;
    }
    console.log("Завдання 1: Сума перших 50 натуральних чисел =", sum);
}

// 2
function factorial() {
    let n = parseInt(prompt("Введіть число для обчислення факторіала:"));
    let result = 1;
    for (let i = 1; i <= n; i++) {
        result *= i;
    }
    console.log("Завдання 2: Факторіал", n, "=", result);
}

// 3
function getMonthName() {
    let monthNumber = parseInt(prompt("Введіть номер місяця (1-12):"));
    let month;
    switch (monthNumber) {
        case 1: month = "Січень"; break;
        case 2: month = "Лютий"; break;
        case 3: month = "Березень"; break;
        case 4: month = "Квітень"; break;
        case 5: month = "Травень"; break;
        case 6: month = "Червень"; break;
        case 7: month = "Липень"; break;
        case 8: month = "Серпень"; break;
        case 9: month = "Вересень"; break;
        case 10: month = "Жовтень"; break;
        case 11: month = "Листопад"; break;
        case 12: month = "Грудень"; break;
        default: month = "Невірний номер місяця";
    }
    console.log("Завдання 3:", month);
}

// 4
function sumEvenNumbers() {
    let numbers = prompt("Введіть числа через кому:").split(",").map(Number);
    let sum = numbers.filter(num => num % 2 === 0).reduce((acc, num) => acc + num, 0);
    console.log("Завдання 4: Сума парних чисел =", sum);
}

// 5
const countVowels = () => {
    let str = prompt("Введіть рядок для підрахунку голосних:");
    const vowels = "аеєиіїоуюяАЕЄИІЇОУЮЯ";
    let count = [...str].filter(char => vowels.includes(char)).length;
    console.log("Завдання 5: Кількість голосних у рядку =", count);
};

// 6
function power() {
    let base = parseFloat(prompt("Введіть число (base):"));
    let exponent = parseInt(prompt("Введіть степінь (exponent):"));
    console.log("Завдання 6:", base, "^", exponent, "=", Math.pow(base, exponent));
}

// Виклик функцій
sumFirst50Numbers();
factorial();
getMonthName();
sumEvenNumbers();
countVowels();
power();
