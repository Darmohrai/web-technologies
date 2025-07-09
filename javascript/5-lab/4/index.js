let products = new Map();
let orders = new Set();
let productHistory = new WeakMap();
let users = new WeakSet();

const btnAddProduct = document.getElementById('add-product');

btnAddProduct.addEventListener('click', () => {
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const quantity = parseInt(document.getElementById('product-quantity').value);

    if (name && !isNaN(price) && !isNaN(quantity)) {
        const product = { name, price, quantity };
        const productId = `${name}-${Date.now()}`;
        products.set(productId, product);
        productHistory.set(product, { added: new Date() });

        displayProducts();
        clearProductForm();
    } else {
        alert("Будь ласка, заповніть усі поля коректно.");
    }
});

document.getElementById('place-order').addEventListener('click', () => {
    const productId = document.getElementById('order-product-id').value.trim();
    const orderQuantity = parseInt(document.getElementById('order-quantity').value);

    if (productId && !isNaN(orderQuantity)) {
        const product = products.get(productId);
        if (product && product.quantity >= orderQuantity) {
            product.quantity -= orderQuantity;
            orders.add({ productId, quantity: orderQuantity });
            displayOrders();
            displayProducts();
        } else {
            alert("Недостатньо товару на складі або неправильний ідентифікатор продукту.");
        }
    } else {
        alert("Будь ласка, заповніть всі поля для замовлення.");
    }
});

document.getElementById('search-product-button').addEventListener('click', () => {
    const searchName = document.getElementById('search-product').value.toLowerCase();
    const product = Array.from(products.values()).find(p => p.name.toLowerCase() === searchName);

    if (product) {
        alert(`Продукт знайдено: ${product.name}, Ціна: ${product.price}, Кількість на складі: ${product.quantity}`);
    } else {
        alert("Продукт не знайдено.");
    }
});

function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach((product, productId) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${product.name} - Ціна: ${product.price} - Кількість: ${product.quantity}
            - Ідентифікатор: ${productId}
        `;
        productList.appendChild(listItem);
    });
}

function displayOrders() {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';
    orders.forEach(order => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `Продукт ID: ${order.productId} - Кількість: ${order.quantity}`;
        orderList.appendChild(listItem);
    });
}

function clearProductForm() {
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-quantity').value = '';
}