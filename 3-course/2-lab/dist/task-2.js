"use strict";
// 2. Circle
class Circle {
    constructor(radius) {
        this.radius = radius;
    }
    getArea() {
        return Math.PI * this.radius * this.radius;
    }
    getPerimeter() {
        return 2 * Math.PI * this.radius;
    }
    scale(factor) {
        this.radius *= factor;
    }
}
// 3. Rectangle
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    getArea() {
        return this.width * this.height;
    }
    getPerimeter() {
        return 2 * (this.width + this.height);
    }
    scale(factor) {
        this.width *= factor;
        this.height *= factor;
    }
}
// 4. Triangle (звичайний, за довжинами сторін)
class Triangle {
    constructor(a, b, c) {
        if (a + b <= c || a + c <= b || b + c <= a) {
            throw new Error("Invalid triangle sides");
        }
        this.a = a;
        this.b = b;
        this.c = c;
    }
    getArea() {
        const s = this.getPerimeter() / 2; // півпериметр
        return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c)); // формула Герона
    }
    getPerimeter() {
        return this.a + this.b + this.c;
    }
    scale(factor) {
        this.a *= factor;
        this.b *= factor;
        this.c *= factor;
    }
}
// 5. Test with array of shapes
const shapes = [
    new Circle(5),
    new Rectangle(4, 6),
    new Triangle(3, 4, 5)
];
let totalArea = 0;
let totalPerimeter = 0;
for (const shape of shapes) {
    totalArea += shape.getArea();
    totalPerimeter += shape.getPerimeter();
}
console.log("Total Area:", totalArea.toFixed(2));
console.log("Total Perimeter:", totalPerimeter.toFixed(2));
// Example of scaling
console.log("\nScaling all shapes by factor 2...\n");
for (const shape of shapes) {
    shape.scale(2);
    console.log("Area after scaling:", shape.getArea().toFixed(2));
    console.log("Perimeter after scaling:", shape.getPerimeter().toFixed(2));
}
