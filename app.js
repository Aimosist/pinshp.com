// 1. URL API Web App của bạn
const API_URL = 'https://script.google.com/macros/s/AKfycbypBd6bsZ6ZtGxF5xf6zdJP1jjCYB6YMQAZ-B3IgrxpbeMaumndi4OP0yk5AJDu_7dLAQ/exec';

let liveProducts = []; 

// 2. Định nghĩa hàm renderProducts (phải có hàm này thì web mới chạy được)
function renderProducts(list) {
    const productContainer = document.getElementById("productContainer");
    if (!productContainer) return; // Kiểm tra nếu không có container thì dừng
    
    productContainer.innerHTML = "";
    
    list.forEach((p) => {
        // Lấy link ảnh từ dữ liệu JSON (đã chuẩn hóa là mảng)
        const imgUrl = Array.isArray(p.image) ? p.image[0] : p.image;
        
        productContainer.innerHTML += `
            <div class="product">
                // Thay thế đoạn cũ bằng đoạn này:
               <img src="${imgUrl}" onerror="this.src='https://placehold.co/150x150?text=PIN'">
                <div class="product-info">
                    <p class="product-name">${p.name}</p>
                    <p class="product-price">${Number(p.price).toLocaleString()}đ</p>
                </div>
            </div>
        `;
    });
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