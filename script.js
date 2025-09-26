// 🔧 KONFIGURACJA
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1421240788985057542/Mi9w9x6mPLTVZvlSwBS_ahTkAi8jq7hEU-h0LlJqqc4a1OfWbN9Iy2zyYKL4pN0kZtXw';
const DISCORD_INVITE_LINK = 'https://discord.gg/97RG2wc847'; // 🔧 ZMIENIĆ NA PRAWDZIWY LINK

// COMING SOON Products
const COMING_SOON_PRODUCTS = [
    { name: 'Streamer Pack', price: 25, releaseDate: '2024-03-15' },
    { name: 'VR Optimization', price: 40, releaseDate: '2024-04-01' },
    { name: 'Enterprise Edition', price: 99, releaseDate: '2024-05-01' }
];

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
        this.showNotification(`✅ Added to cart: ${name}`);
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
            cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Cart is empty</p></div>';
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

    showNotification(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            padding: 15px 20px;
            border-radius: 10px;
            border-left: 4px solid ${type === 'success' ? 'var(--secondary)' : 'var(--danger)'};
            z-index: 1001;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 1px solid var(--border-color);
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize Cart
const cart = new Cart();

// Theme Management
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme toggle animation
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.style.animation = 'none';
    setTimeout(() => {
        themeToggle.style.animation = 'bounce 0.5s ease';
    }, 10);
}

// Initialize Theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Coming Soon Products
function initComingSoon() {
    COMING_SOON_PRODUCTS.forEach((product, index) => {
        const card = document.querySelector(`.offer-card:nth-child(${index + 5})`);
        if (card) {
            card.classList.add('coming-soon');
            
            const overlay = document.createElement('div');
            overlay.className = 'coming-soon-overlay';
            overlay.innerHTML = `
                <div class="coming-soon-content">
                    <i class="fas fa-clock"></i>
                    <h3>Coming Soon</h3>
                    <p>${product.name} - ${product.price} zł</p>
                    <div class="countdown" id="countdown-${index}">
                        <div class="countdown-item">
                            <span class="countdown-number" id="days-${index}">00</span>
                            <span class="countdown-label">Days</span>
                        </div>
                        <div class="countdown-item">
                            <span class="countdown-number" id="hours-${index}">00</span>
                            <span class="countdown-label">Hours</span>
                        </div>
                        <div class="countdown-item">
                            <span class="countdown-number" id="minutes-${index}">00</span>
                            <span class="countdown-label">Minutes</span>
                        </div>
                    </div>
                    <button class="notify-btn" onclick="notifyMe('${product.name}')">
                        <i class="fas fa-bell"></i> Notify Me
                    </button>
                </div>
            `;
            
            card.appendChild(overlay);
            startCountdown(product.releaseDate, index);
        }
    });
}

function startCountdown(releaseDate, index) {
    const countdownFunction = () => {
        const now = new Date().getTime();
        const release = new Date(releaseDate).getTime();
        const distance = release - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        document.getElementById(`days-${index}`).textContent = days.toString().padStart(2, '0');
        document.getElementById(`hours-${index}`).textContent = hours.toString().padStart(2, '0');
        document.getElementById(`minutes-${index}`).textContent = minutes.toString().padStart(2, '0');

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector(`#countdown-${index}`).innerHTML = '<span>Available Now!</span>';
        }
    };

    countdownFunction();
    const countdownInterval = setInterval(countdownFunction, 1000);
}

function notifyMe(productName) {
    cart.showNotification(`We'll notify you when ${productName} is available!`, 'success');
}

// Generate Order Number
function generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `GC-${timestamp}-${random}`;
}

// Discord Webhook
async function sendDiscordWebhook(orderData) {
    const embed = {
        title: "🚀 **NEW GALAXY CODE ORDER!**",
        color: 0x6366f1,
        thumbnail: { url: "https://i.imgur.com/rocket.png" },
        fields: [
            {
                name: "📋 **ORDER NUMBER**",
                value: `\`\`\`${orderData.orderNumber}\`\`\``,
                inline: false
            },
            {
                name: "👤 **DISCORD TAG**",
                value: `\`\`\`${orderData.discordTag}\`\`\``,
                inline: false
            },
            {
                name: "📦 **ORDERED PRODUCTS**",
                value: orderData.items.map(item => `• **${item.name}** - ${item.price} zł`).join('\n'),
                inline: false
            },
            {
                name: "💰 **TOTAL AMOUNT**",
                value: `**${orderData.total} zł**`,
                inline: true
            },
            {
                name: "🕒 **ORDER DATE**",
                value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
                inline: true
            }
        ],
        footer: { 
            text: "Galaxy Code System • " + new Date().toLocaleDateString('pl-PL')
        },
        timestamp: new Date().toISOString()
    };

    const payload = {
        embeds: [embed],
        content: `@here 🎉 **NEW ORDER!** Customer waiting for ticket!`
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        return response.ok;
    } catch (error) {
        console.error('Webhook error:', error);
        return false;
    }
}

// Navigation Functions
function scrollToOffers() {
    document.getElementById('offers').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Cart Functions
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
        cart.showNotification('Cart is empty!', 'error');
        return;
    }
    openModal();
}

// Modal Functions
function openModal() {
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
        cart.showNotification('Please enter your Discord tag!', 'error');
        return;
    }

    if (!discordRegex.test(discordTag)) {
        cart.showNotification('Please enter a valid Discord tag (e.g., username#1234)', 'error');
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

    const confirmBtn = document.querySelector('.btn-confirm');
    const originalText = confirmBtn.innerHTML;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    confirmBtn.disabled = true;

    const webhookSuccess = await sendDiscordWebhook(orderData);

    if (webhookSuccess) {
        showSuccessModal(orderData);
        cart.clear();
        closeModal();
        toggleCart();
    } else {
        cart.showNotification('Order failed. Please try again or contact support.', 'error');
    }

    confirmBtn.innerHTML = originalText;
    confirmBtn.disabled = false;
}

function showSuccessModal(orderData) {
    const successModal = document.createElement('div');
    successModal.className = 'modal active';
    successModal.innerHTML = `
        <div class="modal-content success">
            <div class="modal-header">
                <div class="modal-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Order Confirmed! 🎉</h3>
                <button class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="success-message">
                    <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
                    <p><strong>Discord:</strong> ${orderData.discordTag}</p>
                    <p><strong>Total:</strong> ${orderData.total} zł</p>
                    <br>
                    <p>📋 <strong>Join our Discord and create a ticket with your order number!</strong></p>
                    <a href="discord.html" class="discord-btn" style="margin: 15px 0; display: inline-block;">
                        <i class="fab fa-discord"></i> Join Discord
                    </a>
                </div>
                <div class="modal-buttons">
                    <button class="btn-confirm" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-check"></i> Understood
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initComingSoon();
    initFAQ();
    
    // Animate cards on load
    const cards = document.querySelectorAll('.offer-card, .feature-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });

    // Initialize tilt.js for 3D effects
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.offer-card'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.2
        });
    }

    // Close modal with ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingScreen').remove();
        }, 500);
    }, 2000);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
        40%, 43% { transform: translate3d(0,-10px,0); }
        70% { transform: translate3d(0,-5px,0); }
        90% { transform: translate3d(0,-2px,0); }
    }
    
    .offer-card.coming-soon {
        position: relative;
    }
    
    .offer-card.coming-soon .buy-btn {
        background: var(--gray) !important;
        color: var(--text-secondary) !important;
        cursor: not-allowed;
    }
    
    .offer-card.coming-soon .buy-btn:hover {
        transform: none !important;
        box-shadow: none !important;
    }
`;
document.head.appendChild(style);
