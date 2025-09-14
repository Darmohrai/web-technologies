// 1. Interface
interface Animal {
  name: string;             // required property
  age?: number;             // optional
  habitat?: string;         // optional

  move(): void;             // required method
  makeSound?(): void;       // optional method
}

// 2. Class Cat
class Cat implements Animal {
  name: string;
  age?: number;

  constructor(name: string, age?: number) {
    this.name = name;
    this.age = age;
  }

  move(): void {
    console.log(`${this.name} is running on its paws.`);
  }

  makeSound(): void {
    console.log(`${this.name} says: Meow!`);
  }
}

// 3. Class Bird
class Bird implements Animal {
  name: string;
  habitat?: string;

  constructor(name: string, habitat?: string) {
    this.name = name;
    this.habitat = habitat;
  }

  move(): void {
    console.log(`${this.name} is flying in the sky.`);
  }

  makeSound(): void {
    console.log(`${this.name} sings: Chirp chirp!`);
  }
}

// 4. Class Fish
class Fish implements Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  move(): void {
    console.log(`${this.name} is swimming in the water.`);
  }

  // makeSound is not implemented (optional)
}

// 5. Testing with Animal[] array
const animals: Animal[] = [
  new Cat("Whiskers", 3),
  new Bird("Canary", "forest"),
  new Fish("Goldfish")
];

for (const a of animals) {
  a.move();
  a.makeSound?.();  // safe optional call
}
