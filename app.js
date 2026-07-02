// 1. CẤU HÌNH
const API_URL = 'https://script.google.com/macros/s/AKfycbypBd6bsZ6ZtGxF5xf6zdJP1jjCYB6YMQAZ-B3IgrxpbeMaumndi4OP0yk5AJDu_7dLAQ/exec';
let liveProducts = []; 
let displayedProducts = []; 
let currentPage = 1;
const productsPerPage = window.innerWidth <= 768 ? 6 : 15; 

// 2. HÀM PHÂN TRANG
function renderPagination(list) {
    const totalPages = Math.ceil(list.length / productsPerPage);
    const container = document.getElementById("paginationContainer");
    if (!container) return;
    
    container.innerHTML = "";
    
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        if (i === currentPage) btn.classList.add("active");

        btn.onclick = () => {
            currentPage = i;
            renderProducts(list); 
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        };
        container.appendChild(btn);
    }
}

// 3. HÀM HIỂN THỊ SẢN PHẨM
function renderProducts(list) {
    const productContainer = document.getElementById("productContainer");
    if (!productContainer) return;

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageItems = list.slice(startIndex, endIndex);

    productContainer.innerHTML = "";
    pageItems.forEach((p) => {
        const imgUrl = Array.isArray(p.image) ? p.image[0] : p.image;
        productContainer.innerHTML += `
            <div class="product">
               <img src="${imgUrl}" onerror="this.src='https://placehold.co/150x150?text=PIN'">
               <div class="product-info">
                   <p class="product-name">${p.name}</p>
                   <p class="product-price">${Number(p.price).toLocaleString()}đ</p>
               </div>
            </div>
        `;
    });

    renderPagination(list); 
}

// 4. HÀM DANH MỤC
function renderCategories(list) {
    const categoryContainer = document.getElementById("categoryContainer");
    if (!categoryContainer) return;

    const categories = [...new Set(list.map(p => p.category))];

    categoryContainer.innerHTML = "";
    
    // Nút "Tất cả"
    categoryContainer.innerHTML += `<button class="category-btn active" onclick="filterByCategory('all', this)">Tất cả</button>`;

    categories.forEach(cat => {
        if(cat && cat.trim() !== "") { 
            categoryContainer.innerHTML += `<button class="category-btn" onclick="filterByCategory('${cat}', this)">${cat}</button>`;
        }
    });
}

// HÀM LỌC SẢN PHẨM THEO DANH MỤC
function filterByCategory(category, btnElement) {
    // Reset ô tìm kiếm khi bấm chọn danh mục
    document.getElementById("searchInput").value = ""; 
    currentPage = 1;
    
    if (btnElement) {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
    }

    if (category === 'all') {
        displayedProducts = liveProducts;
    } else {
        displayedProducts = liveProducts.filter(p => p.category === category);
    }
    
    renderProducts(displayedProducts); 
}

// 5. HÀM TÌM KIẾM (MỚI THÊM)
function initSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    const performSearch = () => {
        const query = searchInput.value.toLowerCase();
        currentPage = 1;

        // Bỏ active của các nút danh mục khi đang tìm kiếm
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));

        if (query === "") {
            displayedProducts = liveProducts;
        } else {
            displayedProducts = liveProducts.filter(p => 
                p.name.toLowerCase().includes(query) || 
                (p.category && p.category.toLowerCase().includes(query))
            );
        }
        renderProducts(displayedProducts);
    };

    // Tìm khi bấm nút
    searchBtn.addEventListener("click", performSearch);

    // Tìm khi nhấn Enter
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") performSearch();
    });
}

// 6. HÀM LẤY DỮ LIỆU
async function fetchProductsFromSheets() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Không thể kết nối tới Google Sheets');
        const data = await response.json();
        
        liveProducts = data; 
        displayedProducts = data; 
        
        renderProducts(displayedProducts); 
        renderCategories(liveProducts); 
        initSearch(); // Kích hoạt chức năng tìm kiếm sau khi có dữ liệu
        
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

// Khởi chạy
document.addEventListener('DOMContentLoaded', fetchProductsFromSheets);
