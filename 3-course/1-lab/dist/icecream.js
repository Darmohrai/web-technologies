"use strict";
function calculateIceCreamPrice() {
    let size = prompt("Choose size: small (10 UAH) or large (25 UAH)");
    let price = 0;
    if (size === "small") {
        price += 10;
    }
    else if (size === "large") {
        price += 25;
    }
    else {
        alert("Invalid size selected!");
        return;
    }
    let toppings = prompt("Choose toppings (separated by comma): chocolate (+5), caramel (+6), berries (+10)");
    if (!toppings) {
        alert("You must choose at least one topping!");
        return;
    }
    let toppingsArray = toppings.split(",").map(t => t.trim().toLowerCase());
    for (let topping of toppingsArray) {
        if (topping === "chocolate") {
            price += 5;
        }
        else if (topping === "caramel") {
            price += 6;
        }
        else if (topping === "berries") {
            price += 10;
        }
        else {
            alert(`Unknown topping: ${topping}`);
        }
    }
    let marshmallow = prompt("Do you want marshmallow? yes/no (+5 UAH)");
    if (marshmallow && marshmallow.toLowerCase() === "yes") {
        price += 5;
    }
    alert(`Your ice cream price is: ${price} UAH`);
}
calculateIceCreamPrice();
