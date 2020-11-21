//variables

const cartbtn = document.querySelector('.cart-icon');
const closecartbtn = document.querySelector('.close-btn');
const clearcartbtn = document.querySelector('.clear-btn');
const cartdom = document.querySelector('.cart');
const cartoverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.num');
const cartTotal = document.querySelector('.total');

const cartcontent = document.querySelector('.cart-content');
const productsdom = document.querySelector('.product-center');

// scroll down function
function scrolldown() {
    window.scrollTo(0, 400);
}
//cart
let cart = [];
//buttons
let buttonsDom = [];
// getting product
class Products {
    async getProducts() {
        try {
            let result = await fetch('/static/products.json');
            let data = await result.json();
            let products = data.items;
            products = products.map(items => {
                const { title, price } = items.fields;
                const { id } = items.sys;
                const image = items.fields.image.fields.file.url;
                return { title, price, id, image };
            });
            return products;
        } catch (error) {
            console.log(error);
        }

    }
}
// display product
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += `
            <div class="product-detail">
                    <img src=${product.image} alt="furniture" class="image1" >
                    <button class="addbtn" data-id=${product.id}><i class="fa fa-shopping-cart"></i>add to bag</button>
                    <h4 class="detail-1">${product.title}</h4>
                    <h5 class="price">$${product.price}</h5>
            </div> 
            `;
        });
        productsdom.innerHTML = result;
    }
    getBagButtons() {
        const buttons = [...document.querySelectorAll('.addbtn')];
        buttonsDom = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let incart = cart.find(item => item.id === id);
            if (incart) {
                button.innerText = "In Cart";
                button.disabled = true;
            }

            button.addEventListener('click', (event) => {
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                // get product from products 
                let cartItem = {...Storage.getProduct(id), amount: 1 };

                //add product to the cart
                cart = [...cart, cartItem];

                //save cart in local storage
                Storage.saveCart(cart);
                //set cart values ,
                this.setCartValues(cart);
                // dispaly cart item,
                this.addCartItem(cartItem);
                //show cart
                this.showCart();
            });

        });
    }
    setCartValues(cart) {
        let temptotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            temptotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(temptotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-cont');
        div.innerHTML = ` <img src=${item.image} alt="item" class="items-img">
   <div class="cart-item">
       <h3 class="item-name">${item.title}</h3>
       <h4 class="item-price">$${item.price}</h4>
       <button class="remove-btn" data-id=${item.id}>remove</button>
   </div>
   <div class="counter">
      <i class="fa fa-sort-up" data-id=${item.id}></i>
      <h5 class="item-amount">${item.amount}</h5>
      <i class="fa fa-sort-down" data-id=${item.id}></i>
   </div>`;
        cartcontent.appendChild(div);
    }
    showCart() {
        cartoverlay.classList.add('transparentbcg');
        cartdom.classList.add('showCart');
    }
    setupApp() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populate(cart);
        cartbtn.addEventListener('click', this.showCart);
        closecartbtn.addEventListener('click', this.hideCart);
    }
    populate(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart() {
        cartoverlay.classList.remove('transparentbcg');
        cartdom.classList.remove('showCart');
    }
    cartLogic() {
        clearcartbtn.addEventListener('click', () => {
            this.clearCart();
        });
        // cart functionality
        cartcontent.addEventListener('click', event => {
            if (event.target.classList.contains('remove-btn')) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartcontent.removeChild(removeItem.parentElement.parentElement);

                this.removeItem(id);
            } else if (event.target.classList.contains('fa-sort-up')) {
                let addamount = event.target;
                let id = addamount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addamount.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains('fa-sort-down')) {
                let redamount = event.target;
                let id = redamount.dataset.id;
                let tempItem = cart.find(item => item.id === id);

                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    redamount.previousElementSibling.innerText = tempItem.amount;
                } else {
                    cartcontent.removeChild(redamount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        });
    }
    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));

        while (cartcontent.children.length > 0) {
            cartcontent.removeChild(cartcontent.children[0]);
        }
    }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fa fa-shopping-cart"></i>add to bag`;
    }
    getSingleButton(id) {
        return buttonsDom.find(button => button.dataset.id === id);
    }
}
// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    // setup app
    ui.setupApp();
    //get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
        ui.cartLogic();
    });
});

function UpdatedbCart() {
    var len = cart.length;
    $.ajax({
        type: "POST",
        url: "/products/buy/",
        data: {
            'cart': cart,
            'size': len
        },
        dataType: "html",
        success: function() {
            // console.log('yay');
            window.location.href = '/products/buy/';
        },
        failure: function() {
            alert('No success');
            // console.log('Noo');
        }
    });
}

$(document).ready(function() {
    $('#buy-btn').click(function() {
        UpdatedbCart();
    });
});