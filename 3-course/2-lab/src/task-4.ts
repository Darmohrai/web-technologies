// 1. Abstract class Employee
abstract class Employee {
    protected name: string;
    protected age: number;
    protected salary: number;

    constructor(name: string, age: number, salary: number) {
        this.name = name;
        this.age = age;
        this.salary = salary;
    }

    abstract getAnnualBonus(): number;

    public getName(): string {
        return this.name;
    }

    public getAge(): number {
        return this.age;
    }
}

// 2. Interface Payable
interface Payable {
    pay(): void;
}

// 3. Developer class
class Developer extends Employee implements Payable {
    constructor(name: string, age: number, salary: number) {
        super(name, age, salary);
    }

    getAnnualBonus(): number {
        return this.salary * 0.1; // 10% bonus
    }

    pay(): void {
        console.log(`${this.name} (Developer) has been paid a salary of $${this.salary}`);
    }
}

// 4. Manager class
class Manager extends Employee implements Payable {
    constructor(name: string, age: number, salary: number) {
        super(name, age, salary);
    }

    getAnnualBonus(): number {
        return this.salary * 0.2; // 20% bonus
    }

    pay(): void {
        console.log(`${this.name} (Manager) has been paid a salary of $${this.salary}`);
    }
}

// 5. Test with array
const employees: Employee[] = [
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
