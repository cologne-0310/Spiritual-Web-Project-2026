// cart.js - Shopping Cart and E-commerce Logic

document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartIcon();

    // 1. Add to Cart Logic
    const addBtns = document.querySelectorAll('.add-to-cart-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const basePrice = parseInt(btn.getAttribute('data-price'));

            // Find linked select for options
            const card = btn.closest('.course-card');
            const select = card.querySelector('.product-select');
            let optionText = '';
            let finalPrice = basePrice;

            if (select) {
                const selectedOption = select.options[select.selectedIndex];
                optionText = selectedOption.text;

                // Simple price modifier parsing: look for (+NT$X,XXX)
                const priceMatch = optionText.match(/\(\+NT\$([\d,]+)\)/);
                if (priceMatch) {
                    const extra = parseInt(priceMatch[1].replace(/,/g, ''));
                    finalPrice += extra;
                }
            }

            const item = {
                id: `${id}-${optionText}`,
                name: name,
                price: finalPrice,
                option: optionText,
                quantity: 1
            };

            addToCart(item);

            // Button feedback
            const originalText = btn.innerText;
            btn.innerText = '✅ 已加入';
            btn.style.backgroundColor = '#10b981';
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
            }, 1500);
        });
    });

    // 2. Cart Sidebar Toggling
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartSidebar = document.getElementById('cart-sidebar');

    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            renderCart();
            cartSidebar.classList.add('open');
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });
    }

    // 3. Referral Tracking (URL Parameter: ref)
    const urlParams = new URLSearchParams(window.location.search);
    const refId = urlParams.get('ref');
    if (refId) {
        localStorage.setItem('referralId', refId);
        console.log(`已記錄推薦來源：${refId}`);
        // Optionally show a welcome message or discount notification
    }

    // --- Helper Functions ---

    function addToCart(item) {
        const existing = cart.find(i => i.id === item.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push(item);
        }
        saveCart();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartIcon();
    }

    function updateCartIcon() {
        const countEl = document.querySelector('.cart-count');
        if (countEl) {
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            countEl.innerText = count;
            // Hide/Show badge based on count
            countEl.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    function renderCart() {
        const container = document.getElementById('cart-items-container');
        const totalEl = document.getElementById('cart-total-amount');

        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #94a3b8; margin-top: 3rem;">您的購物車空空如也...</p>';
            totalEl.innerText = 'NT$ 0';
            return;
        }

        let total = 0;
        container.innerHTML = cart.map((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            return `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <span class="cart-item-title">${item.name}</span>
                        ${item.option ? `<span class="cart-item-option">${item.option}</span>` : ''}
                        <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
                            <span class="cart-item-price">NT$ ${item.price.toLocaleString()}</span>
                            <div class="qty-control" style="font-size: 0.85rem; color: #64748b;">
                                數量: ${item.quantity}
                            </div>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${index})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.2rem;">✕</button>
                </div>
            `;
        }).join('');

        totalEl.innerText = `NT$ ${total.toLocaleString()}`;
    }

    // Expose for onclick
    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    };
});
