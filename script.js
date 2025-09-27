// 🔧 KONFIGURACJA
const CONFIG = {
    DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/1421240788985057542/Mi9w9x6mPLTVZvlSwBS_ahTkAi8jq7hEU-h0LlJqqc4a1OfWbN9Iy2zyYKL4pN0kZtXw',
    DISCORD_INVITE_LINK: 'https://discord.gg/97RG2wc847',
    COMPANY_NAME: 'GALAXY CODE',
    VERSION: '2.0.0'
};

// 🎵 Audio Effects
const AUDIO = {
    click: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA'),
    success: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA'),
    error: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA')
};

// 🚀 Galaxy Code Application Class
class GalaxyApp {
    constructor() {
        this.cart = new ShoppingCart();
        this.theme = new ThemeManager();
        this.audio = new AudioManager();
        this.animations = new AnimationManager();
        this.init();
    }

    async init() {
        try {
            await this.preloadAssets();
            this.setupEventListeners();
            this.initComponents();
            this.startAnimations();
            
            // Pokazujemy stronę po załadowaniu
            setTimeout(() => {
                this.hideLoadingScreen();
                this.showWelcomeNotification();
            }, 2000);

        } catch (error) {
            console.error('App initialization error:', error);
            this.showError('Failed to initialize application');
        }
    }

    async preloadAssets() {
        // Preload critical assets
        const assets = [
            'https://api.dicebear.com/6.x/avataaars/svg?seed=John',
            'https://api.dicebear.com/6.x/avataaars/svg?seed=Sarah',
            'https://api.dicebear.com/6.x/avataaars/svg?seed=Mike'
        ];

        await Promise.all(assets.map(url => this.loadImage(url)));
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    setupEventListeners() {
        // Navigation smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    this.updateActiveNav(anchor.getAttribute('href'));
                }
            });
        });

        // Scroll spy for navigation
        window.addEventListener('scroll', () => this.handleScroll());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Page visibility
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    initComponents() {
        // Initialize counters
        this.initCounters();
        
        // Initialize FAQ accordion
        this.initFAQ();
        
        // Initialize tilt effects
        this.initTilt();
        
        // Initialize particles
        this.initParticles();
    }

    startAnimations() {
        // Animate elements on scroll
        this.animations.observeElements();
        
        // Start floating animations
        this.animations.startFloating();
        
        // Start metric animations
        this.animateMetrics();
    }

    initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const suffix = counter.getAttribute('data-suffix') || '';
            this.animateCounter(counter, target, suffix);
        });
    }

    animateCounter(element, target, suffix) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 20);
    }

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                this.audio.play('click');
            });
        });
    }

    initTilt() {
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
                max: 15,
                speed: 400,
                glare: true,
                'max-glare': 0.2,
                scale: 1.05
            });
        }
    }

    initParticles() {
        particlesJS('particles-js', {
            particles: {
                number: { value: 100, density: { enable: true, value_area: 800 } },
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
    }

    handleScroll() {
        this.updateActiveNav();
        this.animations.animateOnScroll();
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    handleKeyboard(e) {
        // Escape key closes modals
        if (e.key === 'Escape') {
            this.closeModals();
        }
        
        // Theme toggle with T key
        if (e.key === 't' && e.ctrlKey) {
            e.preventDefault();
            this.theme.toggle();
        }
    }

    handleVisibilityChange() {
        if (!document.hidden) {
            this.animations.resume();
        }
    }

    animateMetrics() {
        const metrics = document.querySelectorAll('.metric-bar');
        metrics.forEach(metric => {
            const value = metric.getAttribute('data-value');
            metric.style.setProperty('--metric-width', value + '%');
        });
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    showWelcomeNotification() {
        this.showNotification(`🚀 Welcome to ${CONFIG.COMPANY_NAME} v${CONFIG.VERSION}`, 'success');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    closeModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.style.display = 'none');
        document.body.style.overflow = '';
    }
}

// 🛒 Shopping Cart Class
class ShoppingCart {
    constructor() {
        this.items = this.loadFromStorage();
        this.updateDisplay();
    }

    addItem(name, price) {
        const item = {
            id: Date.now(),
            name,
            price,
            timestamp: new Date().toISOString()
        };
        
        this.items.push(item);
        this.saveToStorage();
        this.updateDisplay();
        this.showAddNotification(name);
        
        // Play sound
        AUDIO.click.play().catch(() => {}); // Ignore audio errors
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToStorage();
        this.updateDisplay();
    }

    clear() {
        this.items = [];
        this.saveToStorage();
        this.updateDisplay();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    getItemCount() {
        return this.items.length;
    }

    loadFromStorage() {
        try {
            return JSON.parse(localStorage.getItem('galaxy_cart')) || [];
        } catch {
            return [];
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('galaxy_cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Failed to save cart:', error);
        }
    }

    updateDisplay() {
        // Update cart count
        const countElement = document.querySelector('.cart-count');
        if (countElement) {
            countElement.textContent = this.getItemCount();
        }

        // Update cart total
        const totalElement = document.getElementById('cartTotal');
        if (totalElement) {
            totalElement.textContent = this.getTotal() + ' zł';
        }

        // Update cart items
        this.renderCartItems();
    }

    renderCartItems() {
        const container = document.getElementById('cartItems');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-info">
                    <strong>${item.name}</strong>
                    <span class="item-price">${item.price} zł</span>
                </div>
                <button class="remove-item" onclick="galaxyApp.cart.removeItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    showAddNotification(productName) {
        galaxyApp.showNotification(`✅ Added to cart: ${productName}`);
    }
}

// 🌙 Theme Manager Class
class ThemeManager {
    constructor() {
        this.currentTheme = this.loadTheme();
        this.applyTheme();
    }

    loadTheme() {
        return localStorage.getItem('galaxy_theme') || 'dark';
    }

    saveTheme(theme) {
        localStorage.setItem('galaxy_theme', theme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.saveTheme(this.currentTheme);
        this.animateToggle();
        
        galaxyApp.showNotification(
            `Switched to ${this.currentTheme} theme`, 
            'success'
        );
    }

    animateToggle() {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                toggle.style.transform = 'scale(1)';
            }, 150);
        }
    }
}

// 🔊 Audio Manager Class
class AudioManager {
    constructor() {
        this.enabled = this.loadAudioSetting();
        this.updateToggle();
    }

    loadAudioSetting() {
        return localStorage.getItem('galaxy_audio') !== 'false'; // Default to true
    }

    saveAudioSetting(enabled) {
        localStorage.setItem('galaxy_audio', enabled.toString());
    }

    toggle() {
        this.enabled = !this.enabled;
        this.saveAudioSetting(this.enabled);
        this.updateToggle();
        
        galaxyApp.showNotification(
            `Sound ${this.enabled ? 'enabled' : 'disabled'}`,
            'success'
        );
    }

    updateToggle() {
        const toggle = document.querySelector('.audio-toggle');
        if (toggle) {
            toggle.classList.toggle('muted', !this.enabled);
        }
    }

    play(sound) {
        if (this.enabled && AUDIO[sound]) {
            AUDIO[sound].play().catch(() => {}); // Ignore playback errors
        }
    }
}

// ✨ Animation Manager Class
class AnimationManager {
    constructor() {
        this.observer = null;
        this.initIntersectionObserver();
    }

    initIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
    }

    observeElements() {
        const elements = document.querySelectorAll('.feature-card, .offer-card, .review-card');
        elements.forEach(el => this.observer.observe(el));
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    startFloating() {
        const floaters = document.querySelectorAll('.float-element');
        floaters.forEach((floater, index) => {
            floater.style.animationDelay = `${index * 2}s`;
        });
    }

    animateOnScroll() {
        // Parallax effects
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }

    resume() {
        // Resume any paused animations
        document.querySelectorAll('animation, [animation]').forEach(anim => {
            anim.getAnimations().forEach(animation => {
                animation.play();
            });
        });
    }
}

// 🌐 API Manager Class
class ApiManager {
    static async sendDiscordWebhook(orderData) {
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
                text: `${CONFIG.COMPANY_NAME} • v${CONFIG.VERSION}`
            },
            timestamp: new Date().toISOString()
        };

        const payload = {
            embeds: [embed],
            content: `@here 🎉 **NEW ORDER!** Customer waiting for support!`
        };

        try {
            const response = await fetch(CONFIG.DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'User-Agent': `${CONFIG.COMPANY_NAME}/v${CONFIG.VERSION}`
                },
                body: JSON.stringify(payload),
                timeout: 10000
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return true;
        } catch (error) {
            console.error('Webhook error:', error);
            throw new Error('Failed to send order notification');
        }
    }
}

// 📦 Order Management
class OrderManager {
    static generateOrderNumber() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `GC-${timestamp}-${random}`;
    }

    static validateDiscordTag(tag) {
        const regex = /^.{3,32}#[0-9]{4}$|^[a-zA-Z0-9_]{2,32}$/;
        return regex.test(tag.trim());
    }

    static async processOrder(cart, discordTag) {
        if (cart.getItemCount() === 0) {
            throw new Error('Cart is empty');
        }

        if (!this.validateDiscordTag(discordTag)) {
            throw new Error('Please enter a valid Discord tag (username#1234 or username)');
        }

        const orderData = {
            orderNumber: this.generateOrderNumber(),
            discordTag: discordTag.trim(),
            items: cart.items,
            total: cart.getTotal(),
            date: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language
        };

        // Send to Discord webhook
        await ApiManager.sendDiscordWebhook(orderData);
        return orderData;
    }
}

// 🎮 Global Functions for HTML onclick handlers
function toggleTheme() {
    galaxyApp.theme.toggle();
}

function toggleAudio() {
    galaxyApp.audio.toggle();
}

function toggleMenu() {
    const menu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.nav-hamburger');
    
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const isActive = sidebar.classList.contains('active');
    
    if (isActive) {
        sidebar.classList.remove('active');
        document.querySelector('.cart-overlay')?.remove();
    } else {
        sidebar.classList.add('active');
        const overlay = document.createElement('div');
        overlay.className = 'cart-overlay';
        overlay.onclick = toggleCart;
        document.body.appendChild(overlay);
    }
    
    document.body.style.overflow = isActive ? '' : 'hidden';
}

function addToCart(name, price) {
    galaxyApp.cart.addItem(name, price);
    galaxyApp.audio.play('click');
}

function checkout() {
    if (galaxyApp.cart.getItemCount() === 0) {
        galaxyApp.showError('Your cart is empty!');
        return;
    }
    openOrderModal();
}

function openOrderModal() {
    const modal = document.getElementById('orderModal');
    const itemsContainer = document.getElementById('modalOrderItems');
    const totalContainer = document.getElementById('modalTotal');
    
    // Update modal content
    itemsContainer.innerHTML = galaxyApp.cart.items.map(item => `
        <div class="modal-item">${item.name} - <strong>${item.price} zł</strong></div>
    `).join('');
    
    totalContainer.textContent = galaxyApp.cart.getTotal() + ' zł';
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    galaxyApp.audio.play('click');
}

function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
    document.body.style.overflow = '';
    galaxyApp.audio.play('click');
}

async function confirmOrder() {
    const discordTag = document.getElementById('discordTag').value;
    const confirmBtn = document.querySelector('.btn-confirm');
    const originalText = confirmBtn.innerHTML;
    
    try {
        // Show loading state
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        confirmBtn.disabled = true;
        
        // Process order
        const orderData = await OrderManager.processOrder(galaxyApp.cart, discordTag);
        
        // Show success
        showOrderSuccess(orderData);
        
        // Clear cart
        galaxyApp.cart.clear();
        
        // Close modal
        closeModal();
        toggleCart();
        
    } catch (error) {
        galaxyApp.showError(error.message);
    } finally {
        // Reset button
        confirmBtn.innerHTML = originalText;
        confirmBtn.disabled = false;
    }
}

function showOrderSuccess(orderData) {
    const successHTML = `
        <div class="order-success">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Order Confirmed! 🎉</h3>
            <div class="order-details">
                <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
                <p><strong>Discord:</strong> ${orderData.discordTag}</p>
                <p><strong>Total:</strong> ${orderData.total} zł</p>
            </div>
            <div class="success-instructions">
                <p>📋 <strong>Join our Discord and create a ticket with your order number!</strong></p>
                <button class="discord-btn" onclick="openDiscord()">
                    <i class="fab fa-discord"></i> Join Discord Server
                </button>
            </div>
            <button class="close-success" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
    `;
    
    const successModal = document.createElement('div');
    successModal.className = 'modal active';
    successModal.innerHTML = successHTML;
    document.body.appendChild(successModal);
    
    galaxyApp.audio.play('success');
}

function openDiscord() {
    window.open(CONFIG.DISCORD_INVITE_LINK, '_blank');
    galaxyApp.audio.play('click');
}

function scrollToOffers() {
    document.getElementById('offers').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    galaxyApp.audio.play('click');
}

function notifyComingSoon(productName) {
    galaxyApp.showNotification(`🔔 We'll notify you when ${productName} is available!`, 'success');
    galaxyApp.audio.play('click');
}

// 🚀 Initialize Application
let galaxyApp;

document.addEventListener('DOMContentLoaded', () => {
    galaxyApp = new GalaxyApp();
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Service Worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
