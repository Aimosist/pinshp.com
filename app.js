// =====================================================
// 1. CẤU HÌNH & TỰ ĐỘNG TÍNH SỐ SẢN PHẨM THEO MÀN HÌNH
// =====================================================
const API_URL = 'https://script.google.com/macros/s/AKfycbwE0BZUEOwuFfuyUiUCToKUmfN0lYyzUlp1_A0z74QSUOKY9NbmqAcA7YsWuW2pgU9Srw/exec';
let liveProducts = []; 
let displayedProducts = []; 
let currentPage = 1;

let productsPerPage = getProductsPerPage();

function getProductsPerPage() {
    const width = window.innerWidth;
    if (width <= 768) return 6;        // Mobile (Dưới 768px): 2 cột x 3 hàng = 6 sản phẩm
    else if (width <= 1150) return 9;  // Tablet/Laptop (769px đến 1150px): 3 cột x 3 hàng = 9 sản phẩm
    else return 15;                    // PC màn hình lớn (Trên 1150px): 5 cột x 3 hàng = 15 sản phẩm
}

// =====================================================
// 2. HÀM PHÂN TRANG (CHUẨN SHOPEE: MŨI TÊN + Ô GÕ TRANG)
// =====================================================
function renderPagination(list) {
    const totalPages = Math.ceil(list.length / productsPerPage);
    const container = document.getElementById("paginationContainer");
    if (!container) return;
    
    // Nếu chỉ có 1 trang hoặc không có sản phẩm thì ẩn phân trang
    if (totalPages <= 1) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = "";

    // 1. Nút Mũi tên Lùi (Prev ❮)
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = "❮";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage(currentPage - 1, list);
    container.appendChild(prevBtn);

    // 2. Tính toán dải trang hiển thị xung quanh trang hiện tại (Tránh bị dài quá tải)
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage === 1) endPage = Math.min(totalPages, 3);
    if (currentPage === totalPages) startPage = Math.max(1, totalPages - 2);

    // Hiển thị trang 1 và dấu ...
    if (startPage > 1) {
        container.appendChild(createPageBtn(1, list));
        if (startPage > 2) {
            const dots = document.createElement("span");
            dots.innerText = "...";
            dots.className = "page-dots";
            container.appendChild(dots);
        }
    }

    // Hiển thị các trang ở giữa
    for (let i = startPage; i <= endPage; i++) {
        container.appendChild(createPageBtn(i, list));
    }

    // Hiển thị dấu ... và trang cuối cùng
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement("span");
            dots.innerText = "...";
            dots.className = "page-dots";
            container.appendChild(dots);
        }
        container.appendChild(createPageBtn(totalPages, list));
    }

    // 3. Nút Mũi tên Tiến (Next ❯)
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = "❯";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => changePage(currentPage + 1, list);
    container.appendChild(nextBtn);

    // 4. Ô gõ số trang để nhảy nhanh (Jump to page)
    const jumpContainer = document.createElement("div");
    jumpContainer.className = "pagination-jump";
    jumpContainer.innerHTML = `
        <span>Đến trang:</span>
        <input type="number" id="jumpInput" min="1" max="${totalPages}" value="${currentPage}">
        <button id="jumpBtn">Đi</button>
    `;
    container.appendChild(jumpContainer);

    // Bắt sự kiện khi bấm nút "Đi" hoặc nhấn Enter ở ô gõ trang
    setTimeout(() => {
        const jumpInput = document.getElementById("jumpInput");
        const jumpBtn = document.getElementById("jumpBtn");
        if (!jumpInput || !jumpBtn) return;
        
        const goJump = () => {
            let targetPage = parseInt(jumpInput.value);
            if (isNaN(targetPage) || targetPage < 1) targetPage = 1;
            if (targetPage > totalPages) targetPage = totalPages;
            changePage(targetPage, list);
        };
        jumpBtn.onclick = goJump;
        jumpInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") goJump();
        });
    }, 0);
}

// Hàm phụ trợ cho Phân trang: Tạo nút số trang
function createPageBtn(pageNumber, list) {
    const btn = document.createElement("button");
    btn.innerText = pageNumber;
    if (pageNumber === currentPage) btn.classList.add("active");
    btn.onclick = () => changePage(pageNumber, list);
    return btn;
}

// Hàm phụ trợ cho Phân trang: Chuyển trang và cuộn mượt lên đầu danh sách sản phẩm
function changePage(newPage, list) {
    currentPage = newPage;
    renderProducts(list);
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// =====================================================
// 3. HÀM HIỂN THỊ SẢN PHẨM
// =====================================================
function renderProducts(list) {
    const productContainer = document.getElementById("productContainer");
    if (!productContainer) return;

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageItems = list.slice(startIndex, endIndex);

    productContainer.innerHTML = "";
    pageItems.forEach((p) => {
        const imgUrl = Array.isArray(p.image) ? p.image[0] : p.image;
        
        // Tìm vị trí gốc của sản phẩm này trong mảng liveProducts để truyền vào Pop-up
        const globalIndex = liveProducts.indexOf(p);

        productContainer.innerHTML += `
            <div class="product" style="cursor: pointer;" onclick="openProductPopup(${globalIndex})">
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

// =====================================================
// 4. HÀM DANH MỤC
// =====================================================
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

// =====================================================
// 5. HÀM TÌM KIẾM
// =====================================================
function initSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    const performSearch = () => {
        const query = searchInput.value.toLowerCase();
        currentPage = 1;

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

    searchBtn.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") performSearch();
    });
}

// =====================================================
// 6. HÀM LẤY DỮ LIỆU TỪ GOOGLE SHEETS
// =====================================================
async function fetchProductsFromSheets() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Không thể kết nối tới Google Sheets');
        const data = await response.json();
        
        // BẢO VỆ 1: Nếu Google Sheets gửi về gói tin báo lỗi (Object)
        if (data && data.error) {
            throw new Error(`[Lỗi Google Sheets] ${data.error}`);
        }
        
        // BẢO VỆ 2: Đề phòng dữ liệu trả về bị lỗi định dạng không phải Mảng
        if (!Array.isArray(data)) {
            console.error("Dữ liệu thực tế nhận được:", data);
            throw new Error("Dữ liệu trả về sai cấu trúc tiêu chuẩn (Không phải là một danh sách).");
        }
        
        liveProducts = data; 
        displayedProducts = data; 
        
        renderProducts(displayedProducts); 
        renderCategories(liveProducts); 
        initSearch(); 
        
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        
        // Hiển thị thông báo lỗi trực quan lên giao diện thay vì để trống web
        const productContainer = document.getElementById("productContainer");
        if (productContainer) {
            productContainer.innerHTML = `
                <div style="color: #ff4d4f; text-align: center; width: 100%; padding: 30px; font-weight: bold;">
                    Không thể tải danh sách sản phẩm.<br>
                    <span style="font-size: 14px; font-weight: normal; color: #666;">Chi tiết: ${error.message}</span>
                </div>
            `;
        }
    }
}

// Khởi chạy khi tải trang
document.addEventListener('DOMContentLoaded', fetchProductsFromSheets);

// =================================================================
// 7. TỰ ĐỘNG CĂN LẠI LƯỚI VÀ PHÂN TRANG KHI KÉO CỬA SỔ (KHÔNG CẦN F5)
// =================================================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const newPerPage = getProductsPerPage();
        
        if (productsPerPage !== newPerPage) {
            productsPerPage = newPerPage; 
            currentPage = 1;              
            renderProducts(displayedProducts); 
        }
    }, 150); 
});

// =====================================================
// HÀM ĐIỀU KHIỂN POP-UP CHI TIẾT SẢN PHẨM
// =====================================================
// =====================================================
// HÀM ĐIỀU KHIỂN POP-UP CHI TIẾT SẢN PHẨM
// =====================================================
function openProductPopup(index) {
    const product = liveProducts[index];
    if (!product) return;

    console.log("Dữ liệu sản phẩm nhận được từ Sheet:", product);
    
    // 1. Đổ dữ liệu Ảnh, Tên, Giá vào Pop-up
    document.getElementById("modalImg").src = Array.isArray(product.image) ? product.image[0] : product.image;
    document.getElementById("modalName").innerText = product.name;
    document.getElementById("modalPrice").innerText = Number(product.price).toLocaleString() + "đ";
    
    // 2. NHẬN DIỆN CỘT "Data" (Chữ D viết hoa theo đúng tên cột trên Google Sheets của bạn)
    let rawDescription = product.Data || product.data || "Sản phẩm chính hãng, chất lượng cao. Vui lòng liên hệ để biết thêm chi tiết.";
    
    // Ép kiểu dữ liệu về dạng chữ để tránh lỗi nếu ô trong Sheets chỉ chứa toàn số
    rawDescription = String(rawDescription);
    
    // Tự động chuyển các dấu xuống dòng (Alt + Enter trong Sheets) thành thẻ <br> trên Web
    document.getElementById("modalDescription").innerHTML = rawDescription.replace(/\n/g, "<br>");

    // 3. ĐIỀN SỐ ĐIỆN THOẠI ZALO CỦA BẠN (Tự động soạn tin nhắn khi khách bấm)
    const zaloNumber = "0961417606"; 
    const textMessage = encodeURIComponent(`Chào shop, tôi muốn tư vấn sản phẩm: ${product.name}`);
    document.getElementById("modalZaloBtn").href = `https://zalo.me/${zaloNumber}?text=${textMessage}`;

    // 4. Hiển thị Pop-up dạng Flex để căn giữa màn hình
    document.getElementById("productModal").style.display = "flex";
}

// === DÁN THÊM ĐOẠN NÀY VÀO DƯỚI CÙNG FILE APP.JS ===

// Hàm đóng Pop-up (Sửa triệt để lỗi Uncaught ReferenceError)
function closeProductPopup() {
    document.getElementById("productModal").style.display = "none";
}

// Bắt sự kiện: Nếu khách click ra vùng nền tối phía ngoài hộp thoại thì cũng tự đóng Pop-up
window.addEventListener('click', (event) => {
    const modal = document.getElementById("productModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
