document.getElementById('header__burger-button').addEventListener('change', function () {
    const navContainer = document.querySelector('.nav-container__list');
    if (this.checked) {
        navContainer.style.display = 'block';
    } else {
        navContainer.style.display = 'none';
    }
});
const products = [
    {
        id: 1,
        name:"Airpods",
        price:"100$",
        category:"Headphones",
        img:{
            src:"pictures/airpods.jpg",
            alt:name
        },
        createdAt:new Date(2024,12,2),
        updatedAt:new Date(2025,1,1)
    },
    {
        id: 2,
        name:"Acer Aspire",
        price:"700$",
        category:"Laptop",
        img:{
            src:"pictures/acer-aspire.jpg",
            alt:name
        },
        createdAt:new Date(2022,7,5),
        updatedAt:new Date(2023,2,3)
    },
    {
        id: 3,
        name:"Iphone 12",
        price:"400$",
        category:"Phone",
        img:{
            src:"pictures/iphone.jpg",
            alt:name
        },
        createdAt:new Date(2018,12,2),
        updatedAt:new Date(2020,1,1)
    },
    {
        id: 4,
        name:"Lenovo Think-pad",
        price:"2000$",
        category:"Laptop",
        img:{
            src:"pictures/lenovo-laptop.jpg",
            alt:name
        },
        createdAt:new Date(2021,11,5),
        updatedAt:new Date(2021,12,6)
    },
    {
        id: 5,
        name:"Macbook Air Pro",
        price:"1500$",
        category:"Laptop",
        img:{
            src:"pictures/macbook.jpg",
            alt:name
        },
        createdAt:new Date(2022,12,2),
        updatedAt:new Date(2022,12,3)
    },
    {
        id: 6,
        name:"Samsung Galaxy",
        price:"800$",
        category:"Phone",
        img:{
            src:"pictures/samsung.jpg",
            alt:name
        },
        createdAt:new Date(2024,12,2),
        updatedAt:new Date(2025,1,1)
    },
    {
        id: 7,
        name:"Xiaomi Redmi Super Pro Max",
        price:"450$",
        category:"Phone",
        img:{
            src:"pictures/xiaomi.jpg",
            alt:name
        },
        createdAt:new Date(2015,12,2),
        updatedAt:new Date(2020,1,1)
    }
];
const cardsContainer = document.getElementsByClassName("main__carts-container")[0];
const sortSelect = document.getElementsByClassName("main__sort-btn")[0];
const filterSelect = document.getElementsByClassName("main__filter-btn")[0];
const modalOverlay = document.getElementById('modal-overlay');
const form = document.getElementById('modal-form');

const filtersParams = ["Filter By","Phone","Headphones","Laptop"];
const categories = ["Phone","Headphones","Laptop"];
const sortParams = ["Sort By","Price","Last Update","Creation Date"];

let savedSort = "";
let savedFilter = "";


function deleteProductById(id){
    const index = products.findIndex(el => el.id === Number.parseInt(id));
    if (index !== -1){
        products.splice(index, 1);
    }
}

function addDeleteEventListener(item){
    const itemId = item.getAttribute('name');
    item.addEventListener('click',function () {
        deleteProductById(itemId);

        rerenderCards();
        showToast(`Product With Id: ${itemId} was successfully deleted`)
    })
}

function addEditEventListener(item){
    const itemId = Number.parseInt(item.getAttribute('name'));
    item.addEventListener('click',function (){
        openModal('Edit Product',itemId);
    });
}

function clearProducts(){
    cardsContainer.innerHTML = "";
}

function renderSelectOptions(params, el) {
    for (let param of params) {
        const option = document.createElement("option");
        option.textContent = param;
        option.value = param;
        el.appendChild(option);
    }
}

function addCardToPage(item){
    const card = document.createElement("div");
    card.classList.add("cart");

    const cardImgContainer = document.createElement("picture");
    cardImgContainer.classList.add("cart__picture-container");

    const cardImg = document.createElement("img");
    cardImg.classList.add("cart__picture");
    cardImg.src = item.img.src;
    cardImg.alt = item.name;

    cardImgContainer.appendChild(cardImg);

    const cardContent = document.createElement("div");
    cardContent.classList.add("cart__content");

    const cardName = document.createElement("h3");
    cardName.classList.add("cart__name");
    cardName.innerHTML = item.name;

    const cardPrice = document.createElement("h5");
    cardPrice.classList.add("cart__price");
    cardPrice.innerHTML = item.price;

    const cardId = document.createElement("p");
    cardId.classList.add("cart__id");
    cardId.innerHTML = `Id: ${item.id}`;

    const cardCategory = document.createElement("p");
    cardCategory.classList.add("cart__category");
    cardCategory.innerHTML = `Category: ${item.category}`;

    cardContent.appendChild(cardName);
    cardContent.appendChild(cardPrice);
    cardContent.appendChild(cardId);
    cardContent.appendChild(cardCategory);

    const cardButtons = document.createElement("div");
    cardButtons.classList.add("cart__buttons");

    const cardEditBtn = document.createElement("a");
    cardEditBtn.classList.add("cart__btn", "edit-btn");
    cardEditBtn.setAttribute("name",item.id)
    cardEditBtn.href = "#";
    addEditEventListener(cardEditBtn);

    const cardDeleteBtn = document.createElement("a");
    cardDeleteBtn.classList.add("cart__btn", "delete-btn");
    cardDeleteBtn.setAttribute("name",item.id)
    cardDeleteBtn.href = "#";
    addDeleteEventListener(cardDeleteBtn);

    cardButtons.appendChild(cardEditBtn);
    cardButtons.appendChild(cardDeleteBtn);

    card.appendChild(cardImgContainer);
    card.appendChild(cardContent);
    card.appendChild(cardButtons);

    cardsContainer.appendChild(card);
}

function displayCards(cards) {
    if (cards.length === 0){
        let emptyPageMsg = document.createElement("p");
        emptyPageMsg.innerHTML = "No Products in the current collection";
        cardsContainer.appendChild(emptyPageMsg);
        return;
    }
    for (const item of cards) {
        addCardToPage(item);
    }
}

function rerenderCards(){
    const filteredCards = filterCards(products,savedFilter);
    sortCards(filteredCards,savedSort)

    clearProducts();

    const sum = calculateOverallCardsPrice(filteredCards);

    setOverallPrice(sum);
    displayCards(filteredCards);
}

function setSortCardsStrategyBySortName(list,param){
    switch (param){
        case "Price":
            return list.sort((card1, card2) => Number.parseInt(card1.price.replace("$","")) - Number.parseInt(card2.price.replace("$","")));
        case "Last Update":
            return list.sort((card1,card2) => card1.updatedAt - card2.updatedAt)
        case  "Creation Date":
            return list.sort((card1,card2) => card1.createdAt - card2.createdAt)
        default:
            break;
    }
}

function sortCards(productList,param){
    if (param !== "Filter By" && param !== ""){
        setSortCardsStrategyBySortName(productList, param);
    }
    clearProducts();
    displayCards(productList);
}

function filterCards(productList,filterBy){
    if (filterBy !== "Filter By" && filterBy !== ""){
        return productList.filter(item => item.category === filterBy);
    }else{
        return productList;
    }
}

function showToast(message, duration = 3000) {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => container.removeChild(toast), 400);
    }, duration);
}

function openModal(buttonText,itemId) {
    const modalBtn= document.getElementsByClassName("modal__button")[0];
    const modalCategory = document.getElementById('modal-category');
    renderSelectOptions(categories,modalCategory);
    if (itemId !== null){
        const item = products.find(p => p.id === itemId);
        modalCategory.value = item.category;
        document.getElementById('modal-id').value = itemId;
        document.getElementById('modal-price').value = Number.parseFloat(item.price.replace('$',""));
        document.getElementById('modal-name').value = item.name;
        document.getElementById('modal-img').value = item.img.src;
    }
    modalOverlay.style.display = 'flex';
    document.getElementById('modal-title').innerText = buttonText;
    modalBtn.innerHTML = buttonText;
}

function closeModal() {
    modalOverlay.style.display = 'none';
}

function openAddNewProductModal(){
    const formTitle = "Add new Product";
    openModal(formTitle, null);
}

function createNewProduct(newProduct){
    const product = {
        id:products.length + 1,
        name: newProduct.name,
        price:newProduct.price,
        category:newProduct.category,
        img:{
            src:newProduct.img.src,
            alt:this.name
        },
        createdAt:new Date(),
        updatedAt:new Date()
    }
    products.push(product);
    return product;
}

function updateExistingProduct(itemId,newData){
    const existingProduct = products.find(p => p.id === itemId);
    existingProduct.name = newData.name;
    existingProduct.price = newData.price;
    existingProduct.category = newData.category;
    existingProduct.img = newData.img;
    existingProduct.updatedAt = new Date();
}

function calculateOverallCardsPrice(productsList) {
    return productsList
        .map(item => Number.parseFloat(item.price.replace('$','')))
        .reduce((sum, item) => sum + item, 0);
}

function setOverallPrice(overallPrice){
    const overallPriceHolder = document.getElementById("overall");
    overallPriceHolder.innerHTML = `Overall Price: ${overallPrice}$`;
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const productId = document.getElementById('modal-id').value;
    const productData = {
        name: document.getElementById('modal-name').value,
        price: document.getElementById('modal-price').value + '$',
        category: document.getElementById('modal-category').value,
        img:{
            src: document.getElementById('modal-img').value,
            alt:this.name
        }
    };
    let msg;
    if (productId !== null && productId !== undefined && productId !== ""){
        updateExistingProduct(Number.parseInt(productId), productData);
        msg = `Product with id ${productId} was edited`;

    }else{
        const createdProduct = createNewProduct(productData);
        msg = `Product with id ${createdProduct.id} was added`;
    }

    showToast(msg);
    rerenderCards();
    closeModal();
});

filterSelect.addEventListener('change',function (param){
    savedFilter = param.target.value;
    rerenderCards();
});

sortSelect.addEventListener('change',function (param){
    savedSort = param.target.value
    rerenderCards();
});

let emptyList = [];
displayCards(emptyList);
renderSelectOptions(filtersParams, filterSelect);
renderSelectOptions(sortParams, sortSelect);
setOverallPrice(calculateOverallCardsPrice(products));
