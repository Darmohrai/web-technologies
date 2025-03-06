function findMinMax(arr) {
    if (arr.length === 0) return null;

    let min = arr[0];
    let max = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return { min, max };
}

// const numbers = [3, 7, 1, 9, 5];
// const { min, max } = findMinMax(numbers);
// console.log("Min:", min, "Max:", max);
function handleMinMax() {
    const input = document.getElementById('numbers').value;
    const arr = input.split(',').map(num => parseFloat(num.trim()));

    const { min, max } = findMinMax(arr);

    const result = document.getElementById('minMaxResult');
    if (min !== undefined && max !== undefined) {
        result.textContent = `Мінімум: ${min}, Максимум: ${max}`;
    } else {
        result.textContent = 'Будь ласка, введіть правильний масив чисел.';
    }
}



function compareObjects(obj1, obj2) {
    if (obj1.age === obj2.age && obj2.name === obj1.name) {
        return "Об'єкти однакові";
    } else {
        return "Об'єкти різні";
    }
}

// const student1 = { name: "Олександр", age: 20 };
// const student2 = { name: "Олександр", age: 20 };
// const student3 = { name: "Марія", age: 22 };
// console.log(compareObjects(student1, student2));
// console.log(compareObjects(student1, student3));
function handleObjectComparison() {
    const name1 = document.getElementById('name1').value;
    const age1 = parseInt(document.getElementById('age1').value);
    const name2 = document.getElementById('name2').value;
    const age2 = parseInt(document.getElementById('age2').value);

    const student1 = { name: name1, age: age1 };
    const student2 = { name: name2, age: age2 };

    const result = compareObjects(student1, student2);
    const comparisonResult = document.getElementById('objectComparisonResult');
    comparisonResult.textContent = result;
}