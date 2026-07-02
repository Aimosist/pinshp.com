// 1. URL API Web App của bạn
const API_URL = 'https://script.google.com/macros/s/AKfycbypBd6bsZ6ZtGxF5xf6zdJP1jjCYB6YMQAZ-B3IgrxpbeMaumndi4OP0yk5AJDu_7dLAQ/exec';

let liveProducts = []; 

// Thêm 2 biến này vào đầu file app.js
let currentPage = 1;
const productsPerPage = 15;

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / productsPerPage);
    const container = document.getElementById("paginationContainer");
    if (!container) return;
    container.innerHTML = "";

    // Hiển thị tối đa 5 trang
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

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / productsPerPage);
    const container = document.getElementById("paginationContainer");
    
    // Nếu không tìm thấy thẻ trong index.html thì dừng, không tự tạo lung tung
    if (!container) return; 
    
    container.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        btn.style.margin = "0 5px";
        btn.onclick = () => {
            currentPage = i;
            renderProducts(liveProducts);
            window.scrollTo({ top: document.getElementById('products').offsetTop, behavior: 'smooth' });
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
