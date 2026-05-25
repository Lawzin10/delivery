/* ============================================
   SABOR PRIME - DELIVERY PREMIUM
   JAVASCRIPT COMPLETO - FUNCIONALIDADES
   ============================================ */

// ========== ESTADO DO CARRINHO ==========
let cart = [];

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initCardapioTabs();
    initCart();
    initScrollAnimations();
    initSmoothScroll();
    initFormValidation();
    initCategoryCards();
    initPromoButtons();
});

// ========== HEADER SCROLL ==========
function initHeaderScroll() {
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ========== MENU MOBILE ==========
function initMobileMenu() {
    const btnMenuMobile = document.getElementById('btnMenuMobile');
    const btnCloseMenu = document.getElementById('btnCloseMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openMenu() {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    btnMenuMobile.addEventListener('click', openMenu);
    btnCloseMenu.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// ========== TABS DO CARDÁPIO ==========
function initCardapioTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;

            // Remove active de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Adiciona active ao clicado
            btn.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });
}

// ========== CATEGORIA CARDS ==========
function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;

            // Scroll para cardápio
            document.getElementById('cardapio').scrollIntoView({ behavior: 'smooth' });

            // Ativa a tab correspondente
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            const targetBtn = document.querySelector(`.tab-btn[data-tab="${category}"]`);
            if (targetBtn) {
                targetBtn.classList.add('active');
                document.getElementById(`tab-${category}`).classList.add('active');
            }

            // Ativa visualmente o card
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}

// ========== CARRINHO ==========
function initCart() {
    const btnCart = document.getElementById('btnCart');
    const btnCloseCart = document.getElementById('btnCloseCart');
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    const btnCheckout = document.getElementById('btnCheckout');

    // Botões de adicionar produto
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            addToCart(name, price);
        });
    });

    // Abrir carrinho
    btnCart.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Fechar carrinho
    btnCloseCart.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);

    // Finalizar pedido via WhatsApp
    btnCheckout.addEventListener('click', finalizeOrder);
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
}

function initPromoButtons() {
    document.querySelectorAll('.btn-add-promo').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            addToCart(name, price);
        });
    });
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCartUI();
    showToast(`${name} adicionado ao carrinho!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCartUI();
    }
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const totalPrice = document.getElementById('totalPrice');
    const cartEmpty = document.getElementById('cartEmpty');

    // Atualiza contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Atualiza total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = formatPrice(total);

    // Atualiza lista
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <p>Seu carrinho está vazio</p>
                <span>Adicione itens do cardápio</span>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>${formatPrice(item.price)}</span>
                </div>
                <div class="cart-item-qty">
                    <button class="btn-qty" onclick="updateQuantity(${index}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button class="btn-qty" onclick="updateQuantity(${index}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="btn-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

function finalizeOrder() {
    if (cart.length === 0) {
        showToast('Adicione itens ao carrinho primeiro!');
        return;
    }

    const endereco = document.getElementById('endereco')?.value || '';
    const bairro = document.getElementById('bairro')?.value || '';
    const cep = document.getElementById('cep')?.value || '';

    let message = '*🍔 NOVO PEDIDO - SABOR PRIME*\n\n';
    message += '*Itens do Pedido:*\n';

    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n*Total: ${formatPrice(total)}*\n\n`;

    if (endereco) {
        message += `*Endereço de Entrega:*\n`;
        message += `${endereco}\n`;
        if (bairro) message += `Bairro: ${bairro}\n`;
        if (cep) message += `CEP: ${cep}\n`;
    }

    message += `\nAguardo confirmação do pedido! ✅`;

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

// ========== TOAST NOTIFICATION ==========
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Adiciona classe fade-in aos elementos
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const elements = section.querySelectorAll('.section-header, .category-card, .product-card, .promo-card, .review-card, .feature-item, .delivery-item, .contato-card, .sobre-content, .sobre-images, .entrega-form, .entrega-content');
        elements.forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    });
}

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========== FORM VALIDATION ==========
function initFormValidation() {
    const contatoForm = document.getElementById('contatoForm');

    if (contatoForm) {
        contatoForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const assunto = document.getElementById('assunto').value;
            const mensagem = document.getElementById('mensagem').value;

            if (!nome || !email || !assunto || !mensagem) {
                showToast('Por favor, preencha todos os campos!');
                return;
            }

            // Simula envio
            showToast('Mensagem enviada com sucesso!');
            contatoForm.reset();
        });
    }

    // Máscara de CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
        });
    }
}

// ========== NAV LINK ACTIVE ON SCROLL ==========
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========== PARALLAX EFFECT ==========
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-pattern');

    parallaxElements.forEach(el => {
        el.style.transform = `translateY(${scrolled * 0.3}px)`;
    });
});

// ========== COUNTER ANIMATION ==========
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }

    updateCounter();
}

// Inicia contadores quando visíveis
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numberEl = entry.target.querySelector('.stat-number');
            if (numberEl && !numberEl.classList.contains('counted')) {
                const target = parseInt(numberEl.textContent);
                if (!isNaN(target)) {
                    animateCounter(numberEl, target);
                    numberEl.classList.add('counted');
                }
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(item => {
    statObserver.observe(item);
});