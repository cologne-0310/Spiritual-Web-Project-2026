// Shopping Cart Logic

let cart = [];

// Initialize Cart from LocalStorage
function initCart() {
    const savedCart = localStorage.getItem('source_health_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartUI();
}

// Add Item Function
function addToCart(name, price, option = "") {
    const existing = cart.find(item => item.name === name && item.option === option);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price: parseInt(price), option, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    openCart();
}

// Update Cart UI
function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    const cartCountElements = document.querySelectorAll('.cart-count');
    const cartTotalElement = document.getElementById('cart-total-amount');

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; margin-top: 2rem;">購物車是空的</p>';
    } else {
        container.innerHTML = cart.map((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            count += item.quantity;
            return `
                <div class="cart-item">
                    <div class="item-info">
                        <strong>${item.name}</strong>
                        <p style="font-size: 0.8rem; color: #777;">${item.option || '標準'}</p>
                    </div>
                    <div class="item-price">
                        NT$ ${item.price.toLocaleString()} x ${item.quantity}
                        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#e74c3c; cursor:pointer; margin-left:10px;">✕</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    cartCountElements.forEach(el => el.textContent = count);
    if (cartTotalElement) cartTotalElement.textContent = `NT$ ${total.toLocaleString()}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('source_health_cart', JSON.stringify(cart));
}

function openCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) sidebar.classList.add('open');
}

function closeCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) sidebar.classList.remove('open');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initCart();

    const toggle = document.getElementById('cart-toggle');
    const close = document.getElementById('cart-close');
    
    if (toggle) toggle.addEventListener('click', openCart);
    if (close) close.addEventListener('click', closeCart);

    // Dynamic Binding for Add Buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            const price = btn.getAttribute('data-price');
            // Check for options select in the same card
            const card = btn.closest('.course-card');
            const select = card ? card.querySelector('.option-select') : null;
            const option = select ? select.options[select.selectedIndex].text : "";
            addToCart(name, price, option);
        });
    });
});

window.removeFromCart = removeFromCart;
