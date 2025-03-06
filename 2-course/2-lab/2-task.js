function isInRange(num, min, max) {
    return num >= min && num <= max;
}

// console.log(isInRange(5, 1, 10));
// console.log(isInRange(15, 1, 10));
function handleRangeCheck() {
    const num = parseFloat(document.getElementById('num').value);
    const min = parseFloat(document.getElementById('min').value);
    const max = parseFloat(document.getElementById('max').value);

    const result = isInRange(num, min, max);
    const rangeResult = document.getElementById('rangeResult');

    if (result) {
        rangeResult.textContent = `Число ${num} знаходиться в межах діапазону (${min} - ${max})`;
    } else {
        rangeResult.textContent = `Число ${num} НЕ знаходиться в межах діапазону (${min} - ${max})`;
    }
}

let isActive = true;
console.log("Before:", isActive);

// isActive = !isActive;
// console.log("After:", isActive);
function toggleActive() {
    isActive = !isActive;
    const isActiveStatus = document.getElementById('isActiveStatus');
    isActiveStatus.textContent = `Перед зміною: ${isActive}`;
}