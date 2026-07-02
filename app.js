// 1. CẤU HÌNH
const API_URL = 'https://script.google.com/macros/s/AKfycbypBd6bsZ6ZtGxF5xf6zdJP1jjCYB6YMQAZ-B3IgrxpbeMaumndi4OP0yk5AJDu_7dLAQ/exec';
let liveProducts = []; 
let currentPage = 1;
const productsPerPage = 15; // 3 hàng x 5 sản phẩm/hàng

// 2. HÀM PHÂN TRANG (Chỉ hiện tối đa 5 nút)
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / productsPerPage);
    const container = document.getElementById("paginationContainer");
    if (!container) return;
    
    container.innerHTML = "";
    
    // Vòng lặp chỉ chạy tới 5 hoặc tổng số trang
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        if (i === currentPage) btn.classList.add("active");

        btn.onclick = () => {
            currentPage = i;
            renderProducts(liveProducts);
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        };
        container.appendChild(btn);
    }
}

// 3. HÀM HIỂN THỊ SẢN PHẨM
function renderProducts(list) {
    const productContainer = document.getElementById("productContainer");
    if (!productContainer) return;

    // Tính toán chỉ mục sản phẩm
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

    renderPagination(list.length);
}

// 4. HÀM LẤY DỮ LIỆU
async function fetchProductsFromSheets() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Không thể kết nối tới Google Sheets');
        const data = await response.json();
        liveProducts = data; 
        renderProducts(liveProducts); 
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

// Khởi chạy
fetchProductsFromSheets();
