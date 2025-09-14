"use strict";
// 1. Abstract class Employee
class Employee {
    constructor(name, age, salary) {
        this.name = name;
        this.age = age;
        this.salary = salary;
    }
    getName() {
        return this.name;
    }
    getAge() {
        return this.age;
    }
}
// 3. Developer class
class Developer extends Employee {
    constructor(name, age, salary) {
        super(name, age, salary);
    }
    getAnnualBonus() {
        return this.salary * 0.1; // 10% bonus
    }
    pay() {
        console.log(`${this.name} (Developer) has been paid a salary of $${this.salary}`);
    }
}
// 4. Manager class
class Manager extends Employee {
    constructor(name, age, salary) {
        super(name, age, salary);
    }
    getAnnualBonus() {
        return this.salary * 0.2; // 20% bonus
    }
    pay() {
        console.log(`${this.name} (Manager) has been paid a salary of $${this.salary}`);
    }
}
// 5. Test with array
const employees = [
    new Developer("Alice", 25, 50000),
    new Developer("Bob", 30, 60000),
    new Manager("Charlie", 40, 80000),
    new Manager("Diana", 35, 90000),
];
let totalBonus = 0;
for (const emp of employees) {
    console.log(`${emp.getName()} bonus: $${emp.getAnnualBonus()}`);
    totalBonus += emp.getAnnualBonus();
}
console.log(`\nTotal annual bonuses: $${totalBonus}`);
