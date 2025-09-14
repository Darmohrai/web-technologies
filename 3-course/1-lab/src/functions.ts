function greetUser(name: string, age: number = 18): string {
    return `Hello, ${name}! Your age is: ${age}`;
}

console.log(greetUser("John", 25));
console.log(greetUser("Alice"));
