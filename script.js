// 🔧 KONFIGURACJA WEBHOOK
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1421240788985057542/Mi9w9x6mPLTVZvlSwBS_ahTkAi8jq7hEU-h0LlJqqc4a1OfWbN9Iy2zyYKL4pN0kZtXw';
const DISCORD_INVITE_LINK = 'https://discord.gg/97RG2wc847'; // 🔧 Zmień na swój link Discord

// Particle.js Config
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#6366f1" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#6366f1",
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
        }
    }
});

class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('galaxyCart')) || [];
        this.updateCartDisplay();
    }

    addItem(name, price) {
        this.items.push({ name, price, id: Date.now() });
        this.save();
        this.updateCartDisplay();
        this.showNotification(`✅ Dodano: ${name}`);
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
        this.updateCartDisplay();
    }

    clear() {
        this.items = [];
        this.save();
        this.updateCartDisplay();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    save() {
        localStorage.setItem('galaxyCart', JSON.stringify(this.items));
    }

    updateCartDisplay() {
        const count = this.items.length;
        const total = this.getTotal();
        
        document.querySelector('.cart-count').textContent = count;
        document.getElementById('cartTotal').textContent = total + ' zł';
        
        this.renderCartItems();
    }

    renderCartItems() {
        const cartItems = document.getElementById('cartItems');
        cartItems.innerHTML = '';

        if (this.items.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Koszyk jest pusty</p></div>';
            return;
        }

        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                    <div>${item.price} zł</div>
                </div>
                <button class="remove-item" onclick="cart.removeItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(itemElement);
        });
    }

    showNotification(message) {
        // Usuń istniejące notyfikacje
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: var(--dark);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            border-left: 4px solid var(--secondary);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicjalizacja koszyka
const cart = new Cart();

// Generowanie numeru zamówienia
function generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `GC-${timestamp}-${random}`;
}

// Wysyłanie webhooka do Discorda
async function sendDiscordWebhook(orderData) {
    const embed = {
        title: "🚀 **NOWE ZAMÓWIENIE GALAXY CODE!**",
        color: 0x6366f1,
        thumbnail: { url: "https://i.imgur.com/rocket.png" },
        fields: [
            {
                name: "📋 **NUMER ZAMÓWIENIA**",
                value: `\`\`\`${orderData.orderNumber}\`\`\``,
                inline: false
            },
            {
                name: "👤 **DISCORD KLIENTA**",
                value: `\`\`\`${orderData.discordTag}\`\`\``,
                inline: false
            },
            {
                name: "📦 **ZAMÓWIONE PRODUKTY**",
                value: orderData.items.map(item => `• **${item.name}** - ${item.price} zł`).join('\n'),
                inline: false
            },
            {
                name: "💰 **SUMA ZAMÓWIENIA**",
                value: `**${orderData.total} zł**`,
                inline: true
            },
            {
                name: "🕒 **DATA ZŁOŻENIA**",
                value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
                inline: true
            }
        ],
        footer: { 
            text: "Galaxy Code System • " + new Date().toLocaleDateString('pl-PL'),
            icon_url: "https://i.imgur.com/rocket.png" 
        },
        timestamp: new Date().toISOString()
    };

    const payload = {
        embeds: [embed],
        content: `@here 🎉 **NOWE ZAMÓWIENIE!** Klient czeka na ticket!`
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('✅ Webhook wysłany pomyślnie');
            return true;
        } else {
            console.error('❌ Błąd webhooka:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Błąd przy wysyłaniu webhooka:', error);
        return false;
    }
}

// Funkcje globalne
function addToCart(name, price) {
    cart.addItem(name, price);
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    
    if (!sidebar.classList.contains('active')) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        overlay.onclick = toggleCart;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
    } else {
        sidebar.classList.remove('active');
        document.querySelector('.cart-overlay')?.remove();
        document.body.style.overflow = '';
    }
}

function checkout() {
    if (cart.items.length === 0) {
        showError('Koszyk jest pusty!');
        return;
    }

    openModal();
}

function openModal() {
    // Aktualizuj podsumowanie w modal
    const modalItems = document.getElementById('modalOrderItems');
    const modalTotal = document.getElementById('modalTotal');
    
    modalItems.innerHTML = cart.items.map(item => 
        `<div class="modal-item">${item.name} - <strong>${item.price} zł</strong></div>`
    ).join('');
    
    modalTotal.textContent = cart.getTotal() + ' zł';
    
    document.getElementById('orderModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('orderModal').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('discordTag').value = '';
}

async function confirmOrder() {
    const discordTag = document.getElementById('discordTag').value.trim();
    const discordRegex = /^.{3,32}#[0-9]{4}$|^[a-zA-Z0-9_]{2,32}$/;

    if (!discordTag) {
        showError('Proszę podać swój tag Discorda!');
        return;
    }

    if (!discordRegex.test(discordTag)) {
        showError('Proszę podać poprawny tag Discorda (np. uzytkownik#1234 lub nazwa_użytkownika)');
        return;
    }

    const orderNumber = generateOrderNumber();
    const orderData = {
        orderNumber: orderNumber,
        discordTag: discordTag,
        items: cart.items,
        total: cart.getTotal(),
        date: new Date().toISOString()
    };

    // Pokazanie loading
    const confirmBtn = document.querySelector('.btn-confirm');
    const originalText = confirmBtn.innerHTML;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';
    confirmBtn.disabled = true;

    // Wysyłanie webhooka
    const webhookSuccess = await sendDiscordWebhook(orderData);

    if (webhookSuccess) {
        // Sukces
        const successMessage = `🎉 **ZAMÓWIENIE ZŁOŻONE POMYŚLNIE!**

📋 **Numer zamówienia:** ${orderNumber}
👤 **Twój Discord:** ${discordTag}
💰 **Do zapłaty:** ${orderData.total} zł

🔗 **Wbij na Discord:** ${DISCORD_INVITE_LINK}
🎫 **Stwórz ticket z numerem:** **${orderNumber}**

Dziękujemy za zakupy! 🚀`;

        showSuccess(successMessage);
        
        // Czyszczenie koszyka
        cart.clear();
        closeModal();
        toggleCart();
    } else {
        showError('❌ Błąd przy składaniu zamówienia. Spróbuj ponownie lub skontaktuj się z supportem.');
    }

    confirmBtn.innerHTML = originalText;
    confirmBtn.disabled = false;
}

function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: var(--danger);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showSuccess(message) {
    // Custom success modal
    const successModal = document.createElement('div');
    successModal.className = 'modal active';
    successModal.innerHTML = `
        <div class="modal-content success">
            <div class="modal-header">
                <div class="modal-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Zamówienie złożone!</h3>
                <button class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="success-message">
                    ${message.replace(/\n/g, '<br>')}
                </div>
                <div class="modal-buttons">
                    <button class="btn-confirm" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-check"></i> Rozumiem
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
}

// Loading screen
window.addEventListener('load', function() {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingScreen').remove();
        }, 500);
    }, 2000);
});

// Animacje CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .empty-cart {
        text-align: center;
        color: var(--gray);
        padding: 40px 20px;
    }
    
    .empty-cart i {
        font-size: 3rem;
        margin-bottom: 15px;
        opacity: 0.5;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .modal-item {
        padding: 8px 0;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    
    .success-message {
        line-height: 1.6;
        margin-bottom: 20px;
    }
    
    .btn-confirm:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Inicjalizacja particles
window.addEventListener('resize', function() {
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        window.pJSDom[0].pJS.fn.canvasRefresh();
    }
});