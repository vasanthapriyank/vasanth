/**
 * BIKERS GARAGE - New Year Sale 2026 Interactive Script
 */

// Sample Product Database
const products = [
  {
    id: 1,
    name: "Brembo Sintered Front Brake Pads",
    category: "spares",
    originalPrice: 3499,
    discountedPrice: 2499,
    discount: "28% OFF",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    name: "Motul 7100 4T 10W50 Synthetic Oil (1L)",
    category: "spares",
    originalPrice: 1899,
    discountedPrice: 1499,
    discount: "21% OFF",
    rating: 4.8,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    name: "Digital Workshop Torque Wrench Set",
    category: "tools",
    originalPrice: 4299,
    discountedPrice: 2199,
    discount: "48% OFF",
    rating: 4.7,
    reviews: 85,
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    name: "Universal Heavy Duty Paddock Stand",
    category: "tools",
    originalPrice: 3999,
    discountedPrice: 2799,
    discount: "30% OFF",
    rating: 4.9,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5,
    name: "Waterproof Touring Saddlebags (45L)",
    category: "touring",
    originalPrice: 2599,
    discountedPrice: 1299,
    discount: "50% OFF",
    rating: 4.6,
    reviews: 96,
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6,
    name: "CREE LED Auxiliary Fog Lights Pair",
    category: "touring",
    originalPrice: 3199,
    discountedPrice: 1999,
    discount: "37% OFF",
    rating: 4.8,
    reviews: 174,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 7,
    name: "DID Gold O-Ring Drive Chain Kit",
    category: "spares",
    originalPrice: 1599,
    discountedPrice: 999,
    discount: "37% OFF",
    rating: 4.5,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 8,
    name: "All-in-One Chain Cleaner & Lube Spray",
    category: "accessories",
    originalPrice: 1299,
    discountedPrice: 899,
    discount: "30% OFF",
    rating: 4.9,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80"
  }
];

// App State Management
let cart = JSON.parse(localStorage.getItem('bg_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('bg_wishlist')) || [];

// DOM Ready initialization
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  updateCartUI();
  updateWishlistUI();
  initCountdown();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  // Mobile Nav Toggle
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Category Tab Filtering
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.getAttribute('data-filter');
      renderProducts(filter);
    });
  });

  // Search Input Handler
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    filterProductsBySearch(query);
  });

  // Cart Drawer Listeners
  const cartBtn = document.getElementById('cart-btn');
  const closeCart = document.getElementById('close-cart');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartDrawer = document.getElementById('cart-drawer');

  cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
  });

  closeCart.addEventListener('click', () => {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  });

  cartOverlay.addEventListener('click', () => {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  });

  // Newsletter Form Handler
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm.addEventListener('submit', handleNewsletterSubmit);

  // Back To Top Scroll
  const backToTopBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Render Products Grid
function renderProducts(filter = 'all') {
  const productsGrid = document.getElementById('products-grid');
  productsGrid.innerHTML = '';

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No products found matching the criteria.</p>`;
    return;
  }

  filteredProducts.forEach(product => {
    const isWishlisted = wishlist.includes(product.id);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <span class="product-badge">${product.discount}</span>
      <div class="wishlist-icon ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
        <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
      </div>
      <div class="product-img-wrapper">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-rating">
          <i class="fa-solid fa-star"></i> ${product.rating} <span>(${product.reviews})</span>
        </div>
        <div class="price-box">
          <span class="current-price">₹${product.discountedPrice.toLocaleString()}</span>
          <span class="original-price">₹${product.originalPrice.toLocaleString()}</span>
        </div>
        <button class="btn btn-primary btn-sm btn-block" onclick="addToCart(${product.id})">
          <i class="fa-solid fa-cart-plus"></i> Add To Cart
        </button>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

// Search Functionality
function filterProductsBySearch(query) {
  const productsGrid = document.getElementById('products-grid');
  productsGrid.innerHTML = '';

  const searched = products.filter(p => p.name.toLowerCase().includes(query));

  if (searched.length === 0) {
    productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No spare parts or tools match "${query}".</p>`;
    return;
  }

  searched.forEach(product => {
    const isWishlisted = wishlist.includes(product.id);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <span class="product-badge">${product.discount}</span>
      <div class="wishlist-icon ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
        <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
      </div>
      <div class="product-img-wrapper">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-rating">
          <i class="fa-solid fa-star"></i> ${product.rating} <span>(${product.reviews})</span>
        </div>
        <div class="price-box">
          <span class="current-price">₹${product.discountedPrice.toLocaleString()}</span>
          <span class="original-price">₹${product.originalPrice.toLocaleString()}</span>
        </div>
        <button class="btn btn-primary btn-sm btn-block" onclick="addToCart(${product.id})">
          <i class="fa-solid fa-cart-plus"></i> Add To Cart
        </button>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

// Quick Category Filtering from Collection Cards
function filterCategory(cat) {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(b => {
    if (b.getAttribute('data-filter') === cat) b.classList.add('active');
    else b.classList.remove('active');
  });
  renderProducts(cat);
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Add to Cart
function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, qty: 1 });
  }
  
  saveCart();
  updateCartUI();
  showToast('Item added to your shopping cart!');
}

// Quantity Adjustments
function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    saveCart();
    updateCartUI();
  }
}

// Remove Item from Cart
function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
  showToast('Item removed from cart.');
}

// Save Cart to LocalStorage
function saveCart() {
  localStorage.setItem('bg_cart', JSON.stringify(cart));
}

// Update Cart UI Drawer & Counters
function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartDiscount = document.getElementById('cart-discount');
  const cartTotal = document.getElementById('cart-total');

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalQty;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin-top: 40px;">Your cart is currently empty.</p>`;
    cartSubtotal.textContent = '₹0';
    cartDiscount.textContent = '-₹0';
    cartTotal.textContent = '₹0';
    return;
  }

  cartItemsContainer.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.discountedPrice * item.qty;
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">₹${item.discountedPrice.toLocaleString()}</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          <span class="remove-item" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash-can"></i></span>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  const discountAmount = Math.round(subtotal * 0.10); // 10% Extra New Year discount
  const finalTotal = subtotal - discountAmount;

  cartSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
  cartDiscount.textContent = `-₹${discountAmount.toLocaleString()}`;
  cartTotal.textContent = `₹${finalTotal.toLocaleString()}`;
}

// Wishlist Functionality
function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast('Removed from Wishlist.');
  } else {
    wishlist.push(productId);
    showToast('Added to Wishlist!');
  }
  localStorage.setItem('bg_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
  
  // Re-render currently displayed active tab
  const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-filter');
  renderProducts(activeTab);
}

function updateWishlistUI() {
  const wishlistCount = document.getElementById('wishlist-count');
  wishlistCount.textContent = wishlist.length;
}

// Countdown Timer Logic
function initCountdown() {
  // Set target date: November 8, 2026
  const targetDate = new Date('November 8, 2026 23:59:59').getTime();

  const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(timerInterval);
      document.getElementById('countdown').innerHTML = `<h3 style="color: var(--gold-primary);">NEW YEAR SALE HAS ENDED!</h3>`;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days < 10 ? '0' + days : days;
    document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;
  }, 1000);
}

// Handle Newsletter Form
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const emailInput = document.getElementById('newsletter-email');
  const messageEl = document.getElementById('newsletter-message');
  const email = emailInput.value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    messageEl.textContent = 'Please enter a valid email address.';
    messageEl.className = 'form-message error';
    return;
  }

  messageEl.textContent = '🎉 Subscription successful! Check your inbox for your 10% coupon code.';
  messageEl.className = 'form-message success';
  emailInput.value = '';

  setTimeout(() => {
    messageEl.textContent = '';
  }, 5000);
}

// Checkout simulation
function handleCheckout() {
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }
  alert('🎉 Happy New Year! Thank you for choosing BIKERS GARAGE. Proceeding to mock checkout page...');
  cart = [];
  saveCart();
  updateCartUI();
  document.getElementById('cart-drawer').classList.remove('active');
  document.getElementById('cart-overlay').classList.remove('active');
}

// Toast System
function showToast(message) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--gold-primary);"></i> ${message}`;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}