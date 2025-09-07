// Function with a default parameter
function greetUser(name: string, age: number = 18): string {
    return `Hello, ${name}! Your age is: ${age}`;
}

// Function calls
console.log(greetUser("John", 25));  // both parameters
console.log(greetUser("Alice"));     // age defaults to 18
