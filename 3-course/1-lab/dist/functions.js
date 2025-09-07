"use strict";
// Function with a default parameter
function greetUser(name, age = 18) {
    return `Hello, ${name}! Your age is: ${age}`;
}
// Function calls
console.log(greetUser("John", 25)); // both parameters
console.log(greetUser("Alice")); // age defaults to 18
