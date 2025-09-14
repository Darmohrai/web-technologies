"use strict";
// 1. Abstract parent class
class Car {
    constructor(brand, model, year, price) {
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.price = price;
    }
    getPrice() {
        return this.price;
    }
}
// 2. Derived class: Toyota
class Toyota extends Car {
    constructor(model, year, price, engineType) {
        super("Toyota", model, year, price);
        this.engineType = engineType;
    }
    getCarInfo() {
        console.log(`--- Toyota Car ---`);
        console.log(`Brand: ${this.brand}`);
        console.log(`Model: ${this.model}`);
        console.log(`Year: ${this.year}`);
        console.log(`Engine: ${this.engineType}`);
        console.log(`Price: $${this.getPrice()}`);
        console.log();
    }
}
// 3. Derived class: BMW
class BMW extends Car {
    constructor(model, year, price, country) {
        super("BMW", model, year, price);
        this.country = country;
    }
    getCarInfo() {
        console.log(`--- BMW Car ---`);
        console.log(`Brand: ${this.brand}`);
        console.log(`Model: ${this.model}`);
        console.log(`Year: ${this.year}`);
        console.log(`Made in: ${this.country}`);
        console.log(`Price: $${this.getPrice()}`);
        console.log();
    }
}
// 4. Derived class: Tesla
class Tesla extends Car {
    constructor(model, year, price, batteryCapacity) {
        super("Tesla", model, year, price);
        this.batteryCapacity = batteryCapacity;
    }
    getCarInfo() {
        console.log(`--- Tesla Car ---`);
        console.log(`Brand: ${this.brand}`);
        console.log(`Model: ${this.model}`);
        console.log(`Year: ${this.year}`);
        console.log(`Battery: ${this.batteryCapacity} kWh`);
        console.log(`Price: $${this.getPrice()}`);
        console.log();
    }
}
// 5. Creating instances
const cars = [
    new Toyota("Corolla", 2020, 20000, "Gasoline"),
    new Toyota("Camry", 2021, 28000, "Hybrid"),
    new BMW("X5", 2019, 50000, "Germany"),
    new BMW("M3", 2022, 70000, "Germany"),
    new Tesla("Model 3", 2023, 45000, 75),
    new Tesla("Model S", 2022, 90000, 100),
];
// 6. Output
for (const car of cars) {
    car.getCarInfo();
}
