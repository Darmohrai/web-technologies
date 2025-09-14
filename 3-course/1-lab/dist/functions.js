"use strict";
function greetUser(name, age = 18) {
    return `Hello, ${name}! Your age is: ${age}`;
}
console.log(greetUser("John", 25));
console.log(greetUser("Alice"));
