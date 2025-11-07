
console.log('✅ script.js loaded successfully!');

// Simple test - add a test product manually
document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ DOM Content Loaded');

    // Test if we can find the container
    const container = document.getElementById('products-container');
    if (container) {
        console.log('✅ Products container found');
        container.innerHTML = '<div class="col-12"><p>Тестовый товар - скрипт работает!</p></div>';
    } else {
        console.error('❌ Products container NOT found');
    }
});
// Product data
const products = [
    { id: 1, name: "Минималистичное платье", price: 4500, category: "dresses", sizes: ["XS", "S", "M", "L"], image: "placeholder" },
    { id: 2, name: "Сдержанная блуза", price: 3200, category: "tops", sizes: ["XS", "S", "M"], image: "placeholder" },
    { id: 3, name: "Элегантные брюки", price: 3800, category: "bottoms", sizes: ["S", "M", "L", "XL"], image: "placeholder" },
    { id: 4, name: "Универсальная юбка", price: 2900, category: "bottoms", sizes: ["XS", "S", "M"], image: "placeholder" },
    { id: 5, name: "Базовая футболка", price: 1500, category: "tops", sizes: ["XS", "S", "M", "L", "XL"], image: "placeholder" },
    { id: 6, name: "Структурированное пальто", price: 8900, category: "tops", sizes: ["S", "M", "L"], image: "placeholder" },
    { id: 7, name: "Повседневное платье", price: 5200, category: "dresses", sizes: ["XS", "S", "M", "L"], image: "placeholder" },
    { id: 8, name: "Классические джинсы", price: 4100, category: "bottoms", sizes: ["XS", "S", "M", "L"], image: "placeholder" },
    { id: 9, name: "Элегантный топ", price: 2300, category: "tops", sizes: ["XS", "S", "M"], image: "placeholder" },
    { id: 10, name: "Миди-платье", price: 5700, category: "dresses", sizes: ["S", "M", "L"], image: "placeholder" }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize page based on current URL
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded - current page:', window.location.pathname);

    const path = window.location.pathname;
    const page = path.split("/").pop();

    if (page === 'catalog.html' || page === 'catalog') {
        console.log('Initializing catalog page');
        initializeCatalog();
    }

    // Update cart counter in navbar
    updateCartCounter();
});

// Update cart counter in navbar
function updateCartCounter() {
    const cartItems = document.querySelectorAll('.cart-counter');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    cartItems.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'inline' : 'none';
    });
}

// Catalog page functionality
function initializeCatalog() {
    console.log('Initializing catalog...');
    displayProducts(products);

    // Price range filter
    const priceRange = document.getElementById('price-range');
    const minPrice = document.getElementById('min-price');

    if (priceRange && minPrice) {
        priceRange.addEventListener('input', function () {
            minPrice.textContent = this.value;
        });

        // Set initial value
        minPrice.textContent = priceRange.value;
    }

    // Apply filters button
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    // Sort functionality
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
}

function displayProducts(productsToDisplay) {
    const container = document.getElementById('products-container');
    if (!container) {
        console.error('Products container not found!');
        return;
    }

    container.innerHTML = '';

    if (productsToDisplay.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5"><p>Товары не найдены</p></div>';
        return;
    }

    console.log('Displaying', productsToDisplay.length, 'products');

    productsToDisplay.forEach(product => {
        const productCard = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <div class="product-image rounded-top d-flex align-items-center justify-content-center bg-light" style="height: 250px;">
                        <div class="text-center text-muted">
                            <div style="font-size: 3rem; opacity: 0.5;">✧</div>
                            <p class="mt-2 small">Изображение товара</p>
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text fw-bold text-primary">${product.price.toLocaleString()} руб.</p>
                        <div class="mt-auto">
                            <button class="btn btn-outline-dark w-100 add-to-cart" data-id="${product.id}">
                                Добавить в корзину
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });

    // Add event listeners to "Add to cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

function applyFilters() {
    const priceRange = document.getElementById('price-range');
    const selectedSizes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    const selectedCategory = document.querySelector('input[name="category"]:checked').value;
    const sortBy = document.getElementById('sort-by').value;

    let filteredProducts = products.filter(product => {
        // Price filter
        if (product.price > parseInt(priceRange.value)) {
            return false;
        }

        // Size filter
        if (selectedSizes.length > 0 && !selectedSizes.some(size => product.sizes.includes(size))) {
            return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
            return false;
        }

        return true;
    });

    // Sort products
    if (sortBy === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts(filteredProducts);
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();

    // Show notification
    alert(`Товар "${product.name}" добавлен в корзину`);
}