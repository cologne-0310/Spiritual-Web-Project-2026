/**
 * Cart Logic for 源點身&心靈工作坊
 */

let cart = JSON.parse(localStorage.getItem('yuan_point_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    detectReferral();
    initCartUI();
    updateCartCount();
    renderCartItems();

    // Event Delegation for "Add to Cart"
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const name = btn.dataset.name;
            const basePrice = parseInt(btn.dataset.price);

            // Get selected option
            const card = btn.closest('.course-card');
            const select = card.querySelector('.option-select');
            const optionText = select.options[select.selectedIndex].text;

            // Simple logic: if text contains "+ NT$ XXX", add it to price
            let finalPrice = basePrice;
            const extraMatch = optionText.match(/\+ NT\$ ([\d,]+)/);
            if (extraMatch) {
                finalPrice += parseInt(extraMatch[1].replace(/,/g, ''));
            }

            addToCart({ name, option: optionText, price: finalPrice });
        }

        // Toggle Cart
        if (e.target.closest('#cart-toggle')) {
            document.getElementById('cart-sidebar').classList.add('active');
        }
        if (e.target.closest('#cart-close')) {
            document.getElementById('cart-sidebar').classList.remove('active');
        }
    });
});

function initCartUI() {
    // Basic sidebar layout exists in HTML
}

function addToCart(item) {
    // Check if item with same name and option already exists
    const existingIdx = cart.findIndex(i => i.name === item.name && i.option === item.option);

    if (existingIdx > -1) {
        cart[existingIdx].quantity = (cart[existingIdx].quantity || 1) + 1;
    } else {
        cart.push({
            id: Date.now(),
            quantity: 1,
            ...item
        });
    }

    saveCart();
    updateCartCount();
    renderCartItems();

    // Visual Feedback on button (optional but good)
    const activeBtn = document.querySelector(`.add-to-cart-btn[data-name="${item.name}"]`);
    if (activeBtn) {
        const originalHtml = activeBtn.innerHTML;
        activeBtn.innerHTML = '<span>✅ 已加入</span>';
        activeBtn.classList.add('added');
        setTimeout(() => {
            activeBtn.innerHTML = originalHtml;
            activeBtn.classList.remove('added');
        }, 2000);
    }

    // Open sidebar to show progress
    document.getElementById('cart-sidebar').classList.add('active');
}

function updateQuantity(id, delta) {
    const idx = cart.findIndex(item => item.id === id);
    if (idx > -1) {
        cart[idx].quantity = Math.max(1, (cart[idx].quantity || 1) + delta);
        saveCart();
        updateCartCount();
        renderCartItems();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    const counts = document.querySelectorAll('.cart-count');
    counts.forEach(c => c.textContent = cart.length);
}

function saveCart() {
    localStorage.setItem('yuan_point_cart', JSON.stringify(cart));
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-amount');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart-msg">購物車是空的</div>';
        totalEl.textContent = 'NT$ 0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * (item.quantity || 1);
        total += itemTotal;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.option}</p>
                    <span class="cart-item-price">NT$ ${item.price.toLocaleString()}</span>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity || 1}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">移除</button>
                </div>
            </div>
        `;
    }).join('');

    totalEl.textContent = `NT$ ${total.toLocaleString()}`;
}

function detectReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
        localStorage.setItem('yuan_point_ref', ref);
        console.log('Referral detected and stored:', ref);
    }
}

// Make globally accessible for the onclick attribute
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
