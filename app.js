// 1. URL API Web App của bạn
const API_URL = 'https://script.google.com/macros/s/AKfycbypBd6bsZ6ZtGxF5xf6zdJP1jjCYB6YMQAZ-B3IgrxpbeMaumndi4OP0yk5AJDu_7dLAQ/exec';

let liveProducts = []; 

// Thêm 2 biến này vào đầu file app.js
let currentPage = 1;
const productsPerPage = 18;

// Sửa hàm renderProducts thành như sau:
function renderProducts(list) {
    const productContainer = document.getElementById("productContainer");
    if (!productContainer) return;

    // 1. Tính toán sản phẩm của trang hiện tại
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageItems = list.slice(startIndex, endIndex);

    productContainer.innerHTML = "";
    
    // 2. Render 18 sản phẩm
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

    // 3. Gọi hàm tạo nút chuyển trang
    renderPagination(list.length);
}

// 4. THÊM HÀM MỚI NÀY VÀO DƯỚI HÀM RENDER
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / productsPerPage);
    let container = document.getElementById("paginationContainer");
    
    if (!container) {
        container = document.createElement("div");
        container.id = "paginationContainer";
        container.style.textAlign = "center";
        container.style.margin = "20px 0";
        document.body.appendChild(container);
    }
    
    container.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        btn.style.margin = "0 5px";
        btn.onclick = () => {
            currentPage = i;
            renderProducts(liveProducts); // Dùng lại danh sách đã tải
            window.scrollTo(0, 0); 
        };
        if (i === currentPage) btn.style.fontWeight = "bold";
        container.appendChild(btn);
    }
}
// 3. Hàm lấy dữ liệu
async function fetchProductsFromSheets() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Không thể kết nối tới Google Sheets');
        
        const data = await response.json();
        liveProducts = data; 
        
        // Gọi hàm render sau khi đã có dữ liệu
        renderProducts(liveProducts); 
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

// 4. Gọi hàm tải dữ liệu khi trang web được tải
fetchProductsFromSheets();
