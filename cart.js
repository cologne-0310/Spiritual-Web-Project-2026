// 購物車功能實現
document.addEventListener('DOMContentLoaded', () => {
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartClose = document.getElementById('cart-close');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartCount = document.querySelector('.cart-count');

    let cart = JSON.parse(localStorage.getItem('spiritual_cart')) || [];

    function updateCartUI() {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: #999; margin-top: 2rem;">購物車是空的</p>';
            if (cartTotalAmount) cartTotalAmount.textContent = 'NT$ 0';
            if (cartCount) cartCount.textContent = '0';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.style.display = 'flex';
            itemElement.style.justifyContent = 'space-between';
            itemElement.style.alignItems = 'center';
            itemElement.style.marginBottom = '1rem';
            itemElement.style.padding = '1rem';
            itemElement.style.backgroundColor = '#f9f9f9';
            itemElement.style.borderRadius = '8px';

            itemElement.innerHTML = `
                <div>
                    <h4 style="font-size: 0.9rem; margin-bottom: 0.2rem;">${item.name}</h4>
                    <p style="font-size: 0.8rem; color: #6b8e88;">NT$ ${item.price.toLocaleString()}</p>
                </div>
                <button class="remove-item" data-index="${index}" style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 1.2rem;">✕</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price;
        });

        if (cartTotalAmount) cartTotalAmount.textContent = `NT$ ${total.toLocaleString()}`;
        if (cartCount) cartCount.textContent = cart.length;

        // 綁定刪除事件
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart.splice(index, 1);
                localStorage.setItem('spiritual_cart', JSON.stringify(cart));
                updateCartUI();
            });
        });
    }

    // Toggle Sidebar
    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            cartSidebar.classList.add('open');
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });
    }

    // Add to Cart
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'));
            
            cart.push({ name, price });
            localStorage.setItem('spiritual_cart', JSON.stringify(cart));
            updateCartUI();
            
            // Auto open cart
            cartSidebar.classList.add('open');
        });
    });

    updateCartUI();
});
