// Function to calculate ice cream price
function calculateIceCreamPrice(): void {
    // Choose size
    let size: string | null = prompt("Choose size: small (10 UAH) or large (25 UAH)");
    let price: number = 0;

    if (size === "small") {
        price += 10;
    } else if (size === "large") {
        price += 25;
    } else {
        alert("Invalid size selected!");
        return;
    }

    // Choose toppings (must be at least one)
    let toppings: string | null = prompt("Choose toppings (separated by comma): chocolate (+5), caramel (+6), berries (+10)");

    if (!toppings) {
        alert("You must choose at least one topping!");
        return;
    }

    let toppingsArray: string[] = toppings.split(",").map(t => t.trim().toLowerCase());

    for (let topping of toppingsArray) {
        if (topping === "chocolate") {
            price += 5;
        } else if (topping === "caramel") {
            price += 6;
        } else if (topping === "berries") {
            price += 10;
        } else {
            alert(`Unknown topping: ${topping}`);
        }
    }

    // Optional marshmallow
    let marshmallow: string | null = prompt("Do you want marshmallow? yes/no (+5 UAH)");
    if (marshmallow && marshmallow.toLowerCase() === "yes") {
        price += 5;
    }

    alert(`Your ice cream price is: ${price} UAH`);
}

// Run the function
calculateIceCreamPrice();
