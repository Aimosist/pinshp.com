// 1. CẤU HÌNH
const API_URL = 'https://script.google.com/macros/s/AKfycbypBd6bsZ6ZtGxF5xf6zdJP1jjCYB6YMQAZ-B3IgrxpbeMaumndi4OP0yk5AJDu_7dLAQ/exec';
let liveProducts = []; 
let displayedProducts = []; // Biến này để lưu danh sách đang hiển thị (sau khi lọc)
let currentPage = 1;
const productsPerPage = 15; 

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
            renderProducts(list); // Truyền đúng danh sách đang hiển thị vào
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

    renderPagination(list); // Truyền danh sách vào hàm phân trang
}

// 4. HÀM DANH MỤC
function renderCategories(list) {
    const categoryContainer = document.getElementById("categoryContainer");
    if (!categoryContainer) return;

    const categories = [...new Set(list.map(p => p.category))];

    categoryContainer.innerHTML = "";
    
    // Nút "Tất cả" - Thêm class category-btn
    categoryContainer.innerHTML += `<button class="category-btn active" onclick="filterByCategory('all', this)">Tất cả</button>`;

    // Tạo các nút danh mục - Thêm class category-btn
    categories.forEach(cat => {
        if(cat && cat.trim() !== "") { 
            categoryContainer.innerHTML += `<button class="category-btn" onclick="filterByCategory('${cat}', this)">${cat}</button>`;
        }
    });
}

filterByCategory

// 5. HÀM LẤY DỮ LIỆU
async function fetchProductsFromSheets() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Không thể kết nối tới Google Sheets');
        const data = await response.json();
        
        liveProducts = data; 
        displayedProducts = data; // Mặc định lúc đầu hiển thị tất cả
        
        renderProducts(displayedProducts); 
        renderCategories(liveProducts); 
        
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

// Khởi chạy
document.addEventListener('DOMContentLoaded', fetchProductsFromSheets);
