"use strict";
var _a;
// 2. Class Cat
class Cat {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    move() {
        console.log(`${this.name} is running on its paws.`);
    }
    makeSound() {
        console.log(`${this.name} says: Meow!`);
    }
}
// 3. Class Bird
class Bird {
    constructor(name, habitat) {
        this.name = name;
        this.habitat = habitat;
    }
    move() {
        console.log(`${this.name} is flying in the sky.`);
    }
    makeSound() {
        console.log(`${this.name} sings: Chirp chirp!`);
    }
}
// 4. Class Fish
class Fish {
    constructor(name) {
        this.name = name;
    }
    move() {
        console.log(`${this.name} is swimming in the water.`);
    }
}
// 5. Testing with Animal[] array
const animals = [
    new Cat("Whiskers", 3),
    new Bird("Canary", "forest"),
    new Fish("Goldfish")
];
for (const a of animals) {
    a.move();
    (_a = a.makeSound) === null || _a === void 0 ? void 0 : _a.call(a); // safe optional call
}
