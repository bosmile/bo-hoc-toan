// ========== BIẾN TOÀN CỤC ==========
let productCount = 1;

// ========== KHỞI TẠO ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Đang khởi tạo trang thêm hóa đơn...');
    
    // Đặt ngày mặc định là hôm nay
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.value = today;
        dateInput.max = today; // Không cho chọn ngày trong tương lai
        console.log('Đã đặt ngày mặc định:', today);
    }
    
    // Thiết lập upload ảnh
    setupImageUpload();
    
    // Khởi tạo sự kiện cho sản phẩm đầu tiên
    calculateProductTotal(0);
    
    // Thiết lập sự kiện cho form
    setupFormEvents();
    
    console.log('Trang thêm hóa đơn đã sẵn sàng');
});

// ========== THIẾT LẬP SỰ KIỆN FORM ==========
function setupFormEvents() {
    console.log('Đang thiết lập sự kiện form...');
    
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Nút lưu được click');
            saveInvoice();
        });
    }
    
    // Sự kiện nhấn Enter trong form
    const form = document.querySelector('.invoice-form');
    if (form) {
        form.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (e.target.tagName !== 'TEXTAREA') {
                    saveInvoice();
                }
            }
        });
    }
}

// ========== QUẢN LÝ SẢN PHẨM ==========
function addProductRow() {
    console.log('Đang thêm sản phẩm mới...');
    
    const container = document.getElementById('productsContainer');
    const newIndex = productCount;
    
    const productHTML = `
        <div class="product-item" data-index="${newIndex}">
            <div class="product-row">
                <div class="form-group">
                    <label>Tên hàng hóa *</label>
                    <input type="text" class="product-name" placeholder="Ví dụ: Cà phê sữa đá" required>
                </div>
                
                <div class="form-group">
                    <label>Số lượng *</label>
                    <input type="number" class="product-quantity" value="1" min="1" required oninput="calculateProductTotal(${newIndex})">
                </div>
                
                <div class="form-group">
                    <label>Đơn giá (₫) *</label>
                    <input type="number" class="product-price" placeholder="0" min="0" required oninput="calculateProductTotal(${newIndex})">
                </div>
                
                <div class="form-group">
                    <label>Thành tiền (₫)</label>
                    <input type="text" class="product-total" value="0 ₫" readonly>
                </div>
                
                <button type="button" class="remove-product-btn" onclick="removeProduct(${newIndex})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', productHTML);
    productCount++;
    
    // Hiển thị nút xóa cho tất cả sản phẩm
    document.querySelectorAll('.remove-product-btn').forEach(btn => {
        btn.style.display = 'flex';
    });
    
    console.log('Đã thêm sản phẩm, tổng số:', productCount);
}

function removeProduct(index) {
    console.log('Đang xóa sản phẩm:', index);
    
    const productItem = document.querySelector(`.product-item[data-index="${index}"]`);
    if (productItem) {
        productItem.remove();
        calculateGrandTotal();
        
        // Ẩn nút xóa nếu chỉ còn 1 sản phẩm
        const productItems = document.querySelectorAll('.product-item');
        if (productItems.length === 1) {
            const firstBtn = productItems[0].querySelector('.remove-product-btn');
            if (firstBtn) {
                firstBtn.style.display = 'none';
            }
        }
        
        console.log('Đã xóa sản phẩm, còn lại:', productItems.length - 1);
    }
}

function calculateProductTotal(index) {
    const productItem = document.querySelector(`.product-item[data-index="${index}"]`);
    if (!productItem) return;
    
    const quantityInput = productItem.querySelector('.product-quantity');
    const priceInput = productItem.querySelector('.product-price');
    const totalInput = productItem.querySelector('.product-total');
    
    if (!quantityInput || !priceInput || !totalInput) return;
    
    const quantity = parseInt(quantityInput.value) || 0;
    const price = parseInt(priceInput.value) || 0;
    const total = quantity * price;
    
    totalInput.value = formatCurrency(total);
    calculateGrandTotal();
    
    console.log(`Tính toán sản phẩm ${index}:`, { quantity, price, total });
}

function calculateGrandTotal() {
    const productItems = document.querySelectorAll('.product-item');
    let grandTotal = 0;
    
    productItems.forEach(item => {
        const totalInput = item.querySelector('.product-total');
        if (totalInput && totalInput.value) {
            const totalValue = totalInput.value.replace(/[^\d]/g, '');
            grandTotal += parseInt(totalValue) || 0;
        }
    });
    
    const grandTotalElement = document.getElementById('grandTotal');
    if (grandTotalElement) {
        grandTotalElement.textContent = formatCurrency(grandTotal);
    }
    
    console.log('Tổng cộng:', grandTotal);
}

// ========== UPLOAD ẢNH ==========
function setupImageUpload() {
    console.log('Đang thiết lập upload ảnh...');
    
    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');
    
    if (!uploadArea || !imageUpload) return;
    
    uploadArea.addEventListener('click', () => {
        console.log('Click vào vùng upload');
        imageUpload.click();
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
        uploadArea.style.background = '#e9ecef';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#dee2e6';
        uploadArea.style.background = '#f8f9fa';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#dee2e6';
        uploadArea.style.background = '#f8f9fa';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            console.log('Đã kéo thả file ảnh:', file.name);
            handleImageUpload(file);
        }
    });
    
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Đã chọn file ảnh:', file.name);
            handleImageUpload(file);
        }
    });
    
    console.log('Upload ảnh đã sẵn sàng');
}

function handleImageUpload(file) {
    const reader = new FileReader();
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    
    if (!imagePreview || !previewImage) return;
    
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        imagePreview.style.display = 'block';
        console.log('Đã tải ảnh xong, kích thước:', Math.round(e.target.result.length / 1024), 'KB');
    };
    
    reader.readAsDataURL(file);
}

function removeImage() {
    const imagePreview = document.getElementById('imagePreview');
    const imageUpload = document.getElementById('imageUpload');
    
    if (imagePreview) {
        imagePreview.style.display = 'none';
    }
    
    if (document.getElementById('previewImage')) {
        document.getElementById('previewImage').src = '';
    }
    
    if (imageUpload) {
        imageUpload.value = '';
    }
    
    console.log('Đã xóa ảnh');
}

// ========== LƯU HÓA ĐƠN ==========
function saveInvoice() {
    console.log('====== BẮT ĐẦU LƯU HÓA ĐƠN ======');
    
    // Lấy thông tin chung
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const storeInput = document.getElementById('store');
    const store = storeInput ? storeInput.value.trim() : '';
    
    console.log('Thông tin cơ bản:', { category, date, store });
    
    // Validate thông tin cơ bản
    if (!category) {
        showError('❌ Vui lòng chọn phân loại');
        return false;
    }
    
    if (!date) {
        showError('❌ Vui lòng chọn ngày mua');
        return false;
    }
    
    // Lấy danh sách sản phẩm
    const productItems = document.querySelectorAll('.product-item');
    const products = [];
    
    if (productItems.length === 0) {
        showError('❌ Vui lòng thêm ít nhất một sản phẩm');
        return false;
    }
    
    let hasError = false;
    let grandTotal = 0;
    
    productItems.forEach((item, index) => {
        const nameInput = item.querySelector('.product-name');
        const quantityInput = item.querySelector('.product-quantity');
        const priceInput = item.querySelector('.product-price');
        
        if (!nameInput || !quantityInput || !priceInput) {
            hasError = true;
            return;
        }
        
        const name = nameInput.value.trim();
        const quantity = quantityInput.value;
        const price = priceInput.value;
        
        console.log(`Sản phẩm ${index + 1}:`, { name, quantity, price });
        
        // Validate từng sản phẩm
        if (!name) {
            showError(`❌ Vui lòng nhập tên cho sản phẩm thứ ${index + 1}`);
            hasError = true;
            return;
        }
        
        const quantityNum = parseInt(quantity);
        if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
            showError(`❌ Số lượng không hợp lệ cho sản phẩm: "${name}"`);
            hasError = true;
            return;
        }
        
        const priceNum = parseInt(price);
        if (!price || isNaN(priceNum) || priceNum < 0) {
            showError(`❌ Đơn giá không hợp lệ cho sản phẩm: "${name}"`);
            hasError = true;
            return;
        }
        
        const productTotal = quantityNum * priceNum;
        
        products.push({
            name,
            quantity: quantityNum,
            price: priceNum,
            total: productTotal
        });
        
        grandTotal += productTotal;
    });
    
    if (hasError) {
        return false;
    }
    
    console.log('Tổng số sản phẩm:', products.length);
    console.log('Tổng tiền:', grandTotal);
    console.log('Danh sách sản phẩm:', products);
    
    // Lấy dữ liệu ảnh (nếu có)
    const imageUpload = document.getElementById('imageUpload');
    let imageData = null;
    
    if (imageUpload && imageUpload.files && imageUpload.files[0]) {
        console.log('Có ảnh đính kèm, đang xử lý...');
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            console.log('Đã đọc ảnh xong');
            completeSave(category, date, store, products, grandTotal, imageData);
        };
        reader.onerror = function(error) {
            console.error('Lỗi khi đọc ảnh:', error);
            completeSave(category, date, store, products, grandTotal, null);
        };
        reader.readAsDataURL(imageUpload.files[0]);
    } else {
        console.log('Không có ảnh đính kèm');
        completeSave(category, date, store, products, grandTotal, null);
    }
    
    return false;
}

function completeSave(category, date, store, products, total, imageData) {
    console.log('====== HOÀN THÀNH LƯU HÓA ĐƠN ======');
    
    // Tạo ID duy nhất
    const invoiceId = Date.now();
    
    // Tạo đối tượng hóa đơn với đầy đủ thông tin
    const newInvoice = {
        id: invoiceId,
        category: category,
        date: date,
        store: store || 'Không xác định',
        products: products,
        total: total,
        notes: '', // Có thể thêm field notes nếu cần
        image: imageData,
        starred: false,
        createdAt: new Date().toISOString() // Thêm thời gian tạo
    };
    
    console.log('Hóa đơn mới:', newInvoice);
    
    // Lấy danh sách hóa đơn hiện tại từ localStorage
    let invoices = [];
    try {
        const storedInvoices = localStorage.getItem('invoices');
        if (storedInvoices) {
            invoices = JSON.parse(storedInvoices);
            console.log('Đã đọc', invoices.length, 'hóa đơn từ localStorage');
        } else {
            console.log('Không có hóa đơn trong localStorage, tạo mới');
        }
        
        // Kiểm tra nếu invoices không phải là mảng
        if (!Array.isArray(invoices)) {
            console.warn('Dữ liệu invoices không hợp lệ, khởi tạo mảng mới');
            invoices = [];
        }
    } catch (error) {
        console.error('Lỗi khi đọc dữ liệu từ localStorage:', error);
        invoices = [];
    }
    
    // Thêm hóa đơn mới
    invoices.push(newInvoice);
    
    // Lưu vào localStorage
    try {
        localStorage.setItem('invoices', JSON.stringify(invoices));
        console.log('✅ Đã lưu thành công vào localStorage');
        console.log('Tổng số hóa đơn:', invoices.length);
        
        // Hiển thị thông báo thành công
        showSuccess('✅ Lưu hóa đơn thành công! Đang chuyển về trang chủ...');
        
        // Đợi 1.5 giây để người dùng thấy thông báo
        setTimeout(() => {
            console.log('Chuyển về trang chủ...');
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        console.error('❌ Lỗi khi lưu vào localStorage:', error);
        showError('❌ Lỗi khi lưu hóa đơn. Vui lòng thử lại.');
        
        // Kiểm tra xem localStorage có đầy không
        if (error.name === 'QuotaExceededError') {
            showError('❌ Bộ nhớ localStorage đã đầy. Vui lòng xóa bớt dữ liệu cũ.');
        }
    }
}

// ========== HÀM HỖ TRỢ ==========
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + ' ₫';
}

function showError(message) {
    alert(message);
    console.error(message);
}

function showSuccess(message) {
    alert(message);
    console.log(message);
}

function goBack() {
    const confirmLeave = confirm('Bạn có chắc muốn rời đi? Dữ liệu chưa lưu sẽ bị mất.');
    if (confirmLeave) {
        window.history.back();
    }
}

// ========== KIỂM TRA LOCALSTORAGE ==========
function checkLocalStorage() {
    console.log('====== KIỂM TRA LOCALSTORAGE ======');
    
    // Kiểm tra dung lượng localStorage còn trống
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length * 2; // UTF-16
        }
    }
    
    const usedKB = (total / 1024).toFixed(2);
    const limitKB = (5 * 1024); // 5MB limit
    
    console.log(`Đã sử dụng: ${usedKB} KB / ${limitKB} KB`);
    console.log(`Còn trống: ${((limitKB - usedKB) / 1024).toFixed(2)} MB`);
    
    if (usedKB > limitKB * 0.9) {
        console.warn('⚠️ localStorage sắp đầy!');
    }
    
    // Kiểm tra cấu trúc dữ liệu
    const invoicesData = localStorage.getItem('invoices');
    if (invoicesData) {
        try {
            const parsed = JSON.parse(invoicesData);
            console.log('Cấu trúc dữ liệu invoices:', Array.isArray(parsed) ? 'Mảng' : 'Không phải mảng');
            console.log('Số lượng hóa đơn:', Array.isArray(parsed) ? parsed.length : 'N/A');
        } catch (e) {
            console.error('Dữ liệu invoices bị lỗi:', e);
        }
    } else {
        console.log('Không có dữ liệu invoices trong localStorage');
    }
}

// Kiểm tra localStorage khi trang được tải
window.addEventListener('load', checkLocalStorage);