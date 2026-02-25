/**
 * cart.js - 全域購物車邏輯 (Global Shopping Cart Logic)
 */

let cart = [];

// 1. 初始化購物車 (從 localStorage 讀取)
document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('soul_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }

    // 監聽結帳按鈕，如果已在結帳頁面，自動加載數據
    if (window.location.pathname.includes('checkout.html')) {
        renderCheckoutSummary();
    }
});

// 2. 加入購物車 (Add to Cart)
function addToCart(name, price, type, img) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            type: type,
            img: img,
            quantity: 1
        });
    }

    saveAndUpdate();

    // 視覺反饋
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = '已加入！';
    btn.classList.add('added');
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('added');
    }, 1500);
}

// 3. 切換購物車顯示 (Toggle Sidebar)
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

// 4. 更新數量 (Update Quantity)
function updateQuantity(name, delta) {
    const item = cart.find(i => i.name === name);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.name !== name);
    }

    saveAndUpdate();
}

// 5. 移除項目 (Remove Item)
function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    saveAndUpdate();
}

// 6. 核心更新邏輯
function saveAndUpdate() {
    localStorage.setItem('soul_cart', JSON.stringify(cart));
    updateCartUI();
    if (window.location.pathname.includes('checkout.html')) {
        renderCheckoutSummary();
    }
}

// 7. 更新 UI 元件
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalAmountSpan = document.getElementById('cart-total-amount');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">您的清單是空的</div>';
        if (cartCount) cartCount.innerText = '0';
        if (totalAmountSpan) totalAmountSpan.innerText = 'NT$ 0';
        return;
    }

    let total = 0;
    let count = 0;

    cartItemsContainer.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        count += item.quantity;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>NT$ ${item.price.toLocaleString()}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.name}', 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.name}')">移除</button>
                </div>
                <div class="cart-item-price">NT$ ${(item.price * item.quantity).toLocaleString()}</div>
            </div>
        `;
    }).join('');

    if (cartCount) cartCount.innerText = count;
    if (totalAmountSpan) totalAmountSpan.innerText = `NT$ ${total.toLocaleString()}`;
}

// 8. 結帳頁面專用渲染 (For checkout.html)
function renderCheckoutSummary() {
    const summaryContainer = document.getElementById('order-summary-list');
    const finalTotal = document.getElementById('final-total-amount');

    if (!summaryContainer || !finalTotal) return;

    if (cart.length === 0) {
        summaryContainer.innerHTML = '<div class="empty-cart-msg">無待結帳項目</div>';
        finalTotal.innerText = 'NT$ 0';
        return;
    }

    let total = 0;
    summaryContainer.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="order-summary-item">
                <div class="item-info">
                    <span class="item-name">${item.name} x ${item.quantity}</span>
                    <span class="item-meta">${item.type === 'academy' ? '課程' : '服務'}</span>
                </div>
                <span class="item-price">NT$ ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `;
    }).join('');

    finalTotal.innerText = `NT$ ${total.toLocaleString()}`;
}
