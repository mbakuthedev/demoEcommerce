const cart = document.querySelector("nav .cart")
const cartSidebar = document.querySelector(".cart-sidebar")
const closeCart = document.querySelector(" .close-cart")
const Burger = document.querySelector(".burger")
const menuSidebar = document.querySelector(".menu-sidebar")
const closeMenu = document.querySelector(".close-menu")
const cartItemstotal = document.querySelector("noi")
const cartPricetotal = document.querySelector(".total-Amount")
const cartUI = document.querySelector(".cart-sidebar .cart")
const totalDiv = document.querySelector(".total-sum")
const clearBtn = document.querySelector(".clear-cart-btn")
const cartContent = document.querySelector(".cart-content")

let Cart = []
let buttonsDOM = []

cart.addEventListener("click",()=> {    
    cartSidebar.style.transform = "translate(0%)"
    const bodyOverlay = document.createElement("div")
    bodyOverlay.classList.add("overlay")
    setTimeout(()=> {
        document.querySelector("body").append(bodyOverlay)

    }, 300)

})
closeCart.addEventListener("click", ()=> {
    cartSidebar.style.transform = "translate(100%)"
    const bodyOverlay = document.querySelector(".overlay")
    document.querySelector("body").removeChild(bodyOverlay)
})
try {
    Burger.addEventListener("click", ()=>{
        menuSidebar.style.transform = "translate (0%)"
    })
    closeCart.addEventListener("click", ()=>{
        closeMenu.style.transform = "translate (-100%)"
    })
} catch (error) {
    error;
}

class Product {
    async getProduct(){
        const response = await fetch("products.json");
        const data = await response.json();
        let Products = data.items;
        Products = Products.map(items => {
            const {title, price} = items.fields;
            const {id} = items.sys;
            const image = items.fields.image.fields.file.url;
            return {title,price,id,image};
        })
        return Products; 

        
    }
}
class UI{
    displayProducts(products){
        let result = "";
        products.forEach(products => {
            const productDiv = document.createElement("div")
            productDiv.innerHTML = `<div class="product-card">
            <img src="${products.image}" alt="product">
            <span class="add-to-cart" data-id= "${products.id}"> 
            <i class ="fa fa-cart--plus fa-1x"  style= "margin-left:0.1em; font-size: 1em;"></i>
            </span>
            <div class ="product-name">${products.title}</div>
            <div class ="product-pricing">${products.price}</div>
            </div>
            `
            const p = document.querySelector(".product")
            p.append(products);
        })

    }
    getButtons(){
        const buttons = document.querySelectorAll("add-to-cart")
        Array.from(buttons)
        buttonsDOM = buttons
        buttons.forEach((buttons)=>{
            let Id = buttons.dataset.id
            let inCart = Cart.find((e)=>e.id === Id);
            if (inCart) {
                buttons.innerHTML = "In cart";
                buttons.disabled = true;
            }
            buttons.addEventListener("click", (e)=>{
                e.currentTarget.innerHTML = "In cart"
                e.currentTarget.style.color = "white"
                e.currentTarget.pointerEvents = "none"
                let cartItem = {...Storage.getStorageProducts(Id), 'amount': 1}
                Cart.push(cartItem);
                Storage.saveCart(Cart)
                this.setCartValues(Cart)
                this.addCartItems(cartItem)
            })
        })
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map((items)=> {
            tempTotal += (items.price * items.amount);
            itemsTotal += items.amount;
            parseFloat(tempTotal.toFixed(2));

        })
        cartItemstotal.innerHTML = itemsTotal;
        cartPricetotal.innerHTML = parseFloat(tempTotal.toFixed(2)); 

    }
    addCartItem(cartItem){
        let cartItemUi = document.createElement("div")
        cartItemUi.innerHTML = `
        <div class ="cart-product">
        <div class="product-image">
        <img src="${cartItem.image}" alt="product">
        </div>
        <div class="cart-product-content">
        <div class="cart-product-name">
        <h3> ${cartItem.title} </h3>
        </div>
        <div class="cart-product-price">
        <h3> $${cartItem.price} </h3>
        </div>
        <div class="cart-product-remove" data-id="${cartItem.id}">
        <a href="#" style ="color: red"> remove </a> 
        </div> 
        </div>
        <div class ="plus-minus">
        <i class="fa fa-angle-left add-amount" data-id="${cartItem.id}">
        <span class="no-of-items">${cartItem.amount}</span>
        </div>
        </div>`
        cartContent.append(cartItemUi);
    }
    setUpApp(){
        Cart = Storage.getCart()
        this.setCartValues(Cart);
        Cart.map((items)=>{
            this.addCartItem(items);
        })
    }
   
        cartLogic(){
            clearBtn.addEventListener("click",()=>{
                this.closeCart()
            })
            cartContent.addEventListener("click", ()=>{
                if (event.target.classList.contains("cart-product-remove")) {
                    let Id = event.target.dataset.id
                    this.removeItem(Id)
                    let div = event.target.parentElement.parentElement.parentElement.parentElement
                    div.removeChild(event.target.parentElement.parentElement.parentElement.parentElement)

                }
                else if(event.target.classList.contains("add-amount")){
                    let Id = event.target.classList.dataset
                    let item = Cart.find((items)=> item.id === Id)
                    item.amount++
                    Storage.saveCart(Cart)
                    this.setCartValues(Cart)

                }
                else if(event.target.classList.contains("reduce-amount")){
                    let Id = event.target.dataset.id
                    let item = Cart.find((items)=> item.id === Id)
                    if (item.amount > 1) {
                        item.amount--
                        Storage.saveCart(Cart)
                        this.setCartValues(Cart)
                        event.target.previousElementSibling.innerHTML = item.amount

                    }
                    else{
                        this.removeItem(Id)
                        let div = event.target.parentElement.parentElement.parentElement.parentElement
                        div.removeChild(event.target.parentElement.parentElement.parentElement.parentElement)
                    }
                }
            })
        }

        addAmount(){
            const addBtn = document.querySelector(".add-amount")
            addBtn.forEach((btn)=>{
                btn.addEventListener("click",(event)=>{
                    let Id = event.currentTarget.dataset.id
                    Cart.map((item)=>{
                       
                        if (item.id === Id) {
                            item.amount++
                            Storage.saveCart(Cart)
                            this.setCartValues(Cart)
                            const amountUi = event.currentTarget.parentElement.children[1]
                            amountUi.innerHTML = item.amount
                        }
                    })
                })
            })
        }
        reduceAmount(){
            const removeBtn = document.querySelector(".remove-amount")
            btn.addEventListener("click",(event)=>{
               
                removeBtn.forEach((btn)=>{
                    let Id = event.currentTarget.dataset.id
                    Cart.map((item)=>{
                        if (item.id === Id) {
                            item.amount--
                            Storage.saveCart(Cart)
                            this.setCartValues(Cart)
                            const amountUi = event.currentTarget.parentElement.children[1]
                            amountUi.innerHTML = item.amount
                        }
                        else{
                            event.currentTarget.parentElement.parentElement.removeChild(event.currentTarget.parentElement.parentElement)
                            this.removeItem(Id)

                        }
                    })
                })
            })
        }
        clearCart(){
            let cartItem = Cart.map(item=> item.id)
            cartItem.forEach((id)=>this.removeItem(id))
            const cartProduct = document.querySelectorAll(".cart-product")
            cartProduct.forEach((item)=>{
                if (item) {
                    item.parentElement.removeChild
                }
            })
        }
        removeItem(id){
            Cart.filter((item)=>item.id!== id)
            this.setCartValues(Cart)
            Storage.saveCart(Cart)
            let button = this.getSingleButton(id)
            button.style.pointerEvents = "unset"
            button.innerHTML = `<i class = "fa fa-cart-plus"> </i> Add to Cart`

        }
        getSingleButton(id){
            let btn;
            buttonsDOM.forEach((button)=>{
                if(button.dataset.id === id){
                    btn = button;
                }
            })
            return btn
        }
    }
    class Storage{
        static saveProducts(products){
            localStorage.setItem("products", JSON.stringify(products))
        }
        static getStorageProducts(id){
            let products = JSON.parse(localStorage.getItem("products"))
            return products.find((item)=> item.id === id)

        }
        static saveCart(Cart){
            localStorage.setItem("Cart",JSON.stringify(Cart))
        }
        static getCart(){
            
            let products = localStorage.getItem('Cart')? JSON.parse(localStorage.getItem("Cart")):[]
            return products;
        }
         
    }
    document.addEventListener("DOMContentLoaded",()=>{
        const products = new Product()
        const Ui = new UI()
        Ui.setUpApp();
        products.getProduct().then(products=>{
            Ui.displayProducts(products)
            Storage.saveProducts(products)
        }).then(()=>{
            Ui.getButtons();
            Ui.cartLogic();
        })
    })
