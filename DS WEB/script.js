// ========== BIẾN TOÀN CỤC ==========
let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
let currentFilter = 'all';
let currentSort = 'newest';
let darkMode = localStorage.getItem('darkMode') === 'true';

// ========== HÀM KHỞI TẠO ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Đang khởi tạo trang chủ...');
    
    // Khởi tạo Dark Mode
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // Khởi tạo dữ liệu mẫu nếu chưa có
    if (invoices.length === 0) {
        console.log('Không có dữ liệu, đang tải dữ liệu mẫu...');
        initializeSampleData();
    }
    
    console.log('Tổng số hóa đơn:', invoices.length);
    
    // Khởi tạo giao diện
    initUI();
    
    // Thêm sự kiện
    setupEventListeners();
    
    // Hiển thị hóa đơn
    displayInvoices();
});

// ========== KHỞI TẠO DỮ LIỆU MẪU ==========
function initializeSampleData() {
    console.log('Khởi tạo dữ liệu mẫu...');
    
    const sampleInvoices = [
        {
            id: 1,
            category: 'BIGC',
            date: '2024-10-24',
            store: 'WinMart+',
            products: [
                { name: 'Thịt heo', quantity: 2, price: 75000, total: 150000 },
                { name: 'Rau củ', quantity: 3, price: 15000, total: 45000 },
                { name: 'Trứng gà', quantity: 10, price: 3000, total: 30000 }
            ],
            total: 225000,
            notes: 'Mua thực phẩm tuần',
            starred: false,
            createdAt: '2024-10-24T08:30:00'
        },
        {
            id: 2,
            category: 'SP/LZD',
            date: '2024-10-24',
            store: 'Shopee',
            products: [
                { name: 'Áo thun', quantity: 1, price: 120000, total: 120000 },
                { name: 'Quần jeans', quantity: 1, price: 250000, total: 250000 }
            ],
            total: 370000,
            notes: 'Mua quần áo online',
            starred: true,
            createdAt: '2024-10-24T14:20:00'
        },
        {
            id: 3,
            category: 'Khác',
            date: '2024-10-23',
            store: 'Starbucks Coffee',
            products: [
                { name: 'Cà phê sữa đá', quantity: 1, price: 55000, total: 55000 }
            ],
            total: 55000,
            notes: 'Cà phê sáng',
            starred: false,
            createdAt: '2024-10-23T08:30:00'
        },
        {
            id: 4,
            category: 'BIGC',
            date: '2024-10-22',
            store: 'Big C Supermarket',
            products: [
                { name: 'Sữa tươi', quantity: 2, price: 35000, total: 70000 },
                { name: 'Bánh mì', quantity: 1, price: 20000, total: 20000 },
                { name: 'Trái cây', quantity: 2, price: 40000, total: 80000 }
            ],
            total: 170000,
            notes: 'Đồ ăn sáng',
            starred: true,
            createdAt: '2024-10-22T09:15:00'
        }
    ];
    
    invoices = sampleInvoices;
    saveInvoices();
    console.log('Đã tạo', sampleInvoices.length, 'hóa đơn mẫu');
}

// ========== KHỞI TẠO GIAO DIỆN ==========
function initUI() {
    console.log('Đang khởi tạo giao diện...');
    
    // Đặt giá trị mặc định cho các filter
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) categoryFilter.value = 'all';
    if (sortFilter) sortFilter.value = 'newest';
    
    // Cập nhật tổng quan
    updateSummary();
    console.log('Giao diện đã được khởi tạo');
}

// ========== THIẾT LẬP SỰ KIỆN ==========
function setupEventListeners() {
    console.log('Đang thiết lập sự kiện...');
    
    // Sự kiện tìm kiếm
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            console.log('Đang tìm kiếm:', e.target.value);
            displayInvoices();
        }, 300));
    }
    
    // Sự kiện filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function(e) {
            currentFilter = e.target.value;
            console.log('Đã thay đổi filter:', currentFilter);
            displayInvoices();
        });
    }
    
    // Sự kiện sort
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function(e) {
            currentSort = e.target.value;
            console.log('Đã thay đổi sort:', currentSort);
            displayInvoices();
        });
    }
    
    // Sự kiện filter tháng
    const monthFilter = document.getElementById('monthFilter');
    if (monthFilter) {
        monthFilter.addEventListener('change', function(e) {
            console.log('Đã thay đổi tháng:', e.target.value);
            displayInvoices();
        });
    }
}

// ========== QUẢN LÝ HÓA ĐƠN ==========
function saveInvoices() {
    try {
        localStorage.setItem('invoices', JSON.stringify(invoices));
        console.log('Đã lưu', invoices.length, 'hóa đơn vào localStorage');
        
        // Cập nhật UI
        updateSummary();
        displayInvoices();
        
        return true;
    } catch (error) {
        console.error('Lỗi khi lưu vào localStorage:', error);
        alert('Lỗi khi lưu dữ liệu. Vui lòng thử lại.');
        return false;
    }
}

// ========== HIỂN THỊ HÓA ĐƠN ==========
function displayInvoices() {
    console.log('Đang hiển thị hóa đơn...');
    
    // Lấy các phần tử DOM
    const invoiceListContainer = document.querySelector('.invoice-list');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const monthFilter = document.getElementById('monthFilter');
    
    if (!invoiceListContainer) {
        console.error('Không tìm thấy container hóa đơn');
        return;
    }
    
    // Lọc hóa đơn
    let filteredInvoices = [...invoices];
    
    // Lọc theo tìm kiếm
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredInvoices = filteredInvoices.filter(invoice => 
            invoice.store.toLowerCase().includes(searchTerm) ||
            (invoice.notes && invoice.notes.toLowerCase().includes(searchTerm)) ||
            invoice.products.some(product => product.name.toLowerCase().includes(searchTerm))
        );
    }
    
    // Lọc theo category
    if (categoryFilter && categoryFilter.value !== 'all') {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.category === categoryFilter.value);
    }
    
    // Lọc theo tháng
    if (monthFilter) {
        const monthValue = monthFilter.value;
        const now = new Date();
        
        if (monthValue !== 'Tất cả') {
            if (monthValue === 'Tháng này') {
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                filteredInvoices = filteredInvoices.filter(invoice => {
                    const invoiceDate = new Date(invoice.date);
                    return invoiceDate.getMonth() === currentMonth && 
                           invoiceDate.getFullYear() === currentYear;
                });
            } else if (monthValue === 'Tháng trước') {
                const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
                const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
                filteredInvoices = filteredInvoices.filter(invoice => {
                    const invoiceDate = new Date(invoice.date);
                    return invoiceDate.getMonth() === prevMonth && 
                           invoiceDate.getFullYear() === year;
                });
            }
        }
    }
    
    // Sắp xếp
    if (sortFilter) {
        switch(sortFilter.value) {
            case 'Sắp xếp: Cũ nhất':
                filteredInvoices.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'Sắp xếp: Giá cao nhất':
                filteredInvoices.sort((a, b) => b.total - a.total);
                break;
            case 'Sắp xếp: Giá thấp nhất':
                filteredInvoices.sort((a, b) => a.total - b.total);
                break;
            default: // Mới nhất
                filteredInvoices.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    }
    
    console.log('Số hóa đơn sau khi lọc:', filteredInvoices.length);
    
    // Nhóm hóa đơn theo ngày
    const groupedInvoices = groupInvoicesByDate(filteredInvoices);
    
    // Tạo HTML
    let html = '';
    
    if (filteredInvoices.length === 0) {
        html = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <h3>Không có hóa đơn nào</h3>
                <p>Hãy thêm hóa đơn mới để bắt đầu</p>
                <button class="add-btn" onclick="window.location.href='add-invoice.html'">
                    <i class="fas fa-plus"></i> Thêm hóa đơn đầu tiên
                </button>
            </div>
        `;
    } else {
        // Tạo HTML cho từng nhóm ngày
        for (const [date, invoices] of Object.entries(groupedInvoices)) {
            html += `<div class="date-group">`;
            html += `<h3 class="date-header">${formatDateHeader(date)}</h3>`;
            
            invoices.forEach(invoice => {
                // Xác định icon và màu sắc
                let iconClass, iconColor;
                
                switch(invoice.category) {
                    case 'BIGC':
                        iconClass = 'fas fa-shopping-cart';
                        iconColor = '#20c997';
                        break;
                    case 'SP/LZD':
                        iconClass = 'fas fa-shopping-bag';
                        iconColor = '#4361ee';
                        break;
                    default:
                        iconClass = 'fas fa-store';
                        iconColor = '#6c757d';
                }
                
                // Xác định loại chi tiêu (time-category)
                let timeCategory = '';
                const invoiceTime = invoice.createdAt ? 
                    new Date(invoice.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 
                    '00:00';
                
                // Xác định category hiển thị dựa trên store hoặc notes
                if (invoice.store.includes('Coffee') || invoice.store.includes('Starbucks')) {
                    timeCategory = 'Ăn uống';
                } else if (invoice.store.includes('Mart') || invoice.store.includes('Market')) {
                    timeCategory = 'Siêu thị';
                } else if (invoice.store.includes('Grab') || invoice.store.includes('Bike')) {
                    timeCategory = 'Di chuyển';
                } else if (invoice.store.includes('Clothing') || invoice.store.includes('Zara')) {
                    timeCategory = 'Thời trang';
                } else if (invoice.store.includes('Shopee') || invoice.store.includes('Lazada')) {
                    timeCategory = 'Mua sắm online';
                } else {
                    timeCategory = invoice.category;
                }
                
                html += `
                    <div class="invoice-item" data-id="${invoice.id}">
                        <div class="store-info">
                            <div class="store-icon" style="background: ${iconColor};">
                                <i class="${iconClass}"></i>
                            </div>
                            <div class="store-details">
                                <h4>${invoice.store}
                                    ${invoice.starred ? '<i class="fas fa-star" style="color: #ffd700; margin-left: 5px;"></i>' : ''}
                                </h4>
                                <p class="time-category">${invoiceTime} - ${timeCategory}</p>
                                ${invoice.notes ? `<p class="notes">${invoice.notes}</p>` : ''}
                            </div>
                        </div>
                        <div class="amount negative">-${formatCurrency(invoice.total)}</div>
                    </div>
                `;
            });
            
            html += `</div>`;
        }
    }
    
    // Cập nhật container
    invoiceListContainer.innerHTML = html;
    
    // Cập nhật tổng quan
    updateSummary();
    
    console.log('Đã hiển thị xong hóa đơn');
}

// ========== NHÓM HÓA ĐƠN THEO NGÀY ==========
function groupInvoicesByDate(invoices) {
    const groups = {};
    
    invoices.forEach(invoice => {
        const date = invoice.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(invoice);
    });
    
    // Sắp xếp các nhóm theo ngày (mới nhất trước)
    const sortedGroups = {};
    Object.keys(groups)
        .sort((a, b) => new Date(b) - new Date(a))
        .forEach(date => {
            sortedGroups[date] = groups[date];
        });
    
    return sortedGroups;
}

// ========== ĐỊNH DẠNG NGÀY HIỂN THỊ ==========
function formatDateHeader(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset time để chỉ so sánh ngày
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    
    if (compareDate.getTime() === today.getTime()) {
        return `HÔM NAY, ${date.getDate()}/${date.getMonth() + 1}`;
    } else if (compareDate.getTime() === yesterday.getTime()) {
        return `HÔM QUA, ${date.getDate()}/${date.getMonth() + 1}`;
    } else {
        const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const dayName = days[date.getDay()];
        return `${dayName.toUpperCase()}, ${date.getDate()}/${date.getMonth() + 1}`;
    }
}

// ========== CẬP NHẬT TỔNG QUAN ==========
function updateSummary() {
    console.log('Đang cập nhật tổng quan...');
    
    // Tính tổng chi tiêu tháng này
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthTotal = invoices
        .filter(invoice => {
            const invoiceDate = new Date(invoice.date);
            return invoiceDate.getMonth() === currentMonth && 
                   invoiceDate.getFullYear() === currentYear;
        })
        .reduce((total, invoice) => total + invoice.total, 0);
    
    // Cập nhật tổng hiển thị
    const monthTotalDisplay = document.getElementById('monthTotalDisplay');
    if (monthTotalDisplay) {
        monthTotalDisplay.textContent = formatCurrency(monthTotal);
    }
    
    // Tính phần trăm thay đổi so với tháng trước
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const prevMonthTotal = invoices
        .filter(invoice => {
            const invoiceDate = new Date(invoice.date);
            return invoiceDate.getMonth() === prevMonth && 
                   invoiceDate.getFullYear() === prevYear;
        })
        .reduce((total, invoice) => total + invoice.total, 0);
    
    // Cập nhật chỉ số thay đổi
    const changeIndicator = document.querySelector('.change-indicator');
    const changePercentage = document.querySelector('.change-indicator span');
    
    if (changeIndicator && changePercentage) {
        if (prevMonthTotal > 0) {
            const percentage = ((monthTotal - prevMonthTotal) / prevMonthTotal * 100).toFixed(1);
            if (percentage > 0) {
                changeIndicator.className = 'change-indicator positive';
                changePercentage.textContent = `+${percentage}%`;
            } else if (percentage < 0) {
                changeIndicator.className = 'change-indicator negative';
                changePercentage.textContent = `${percentage}%`;
            } else {
                changeIndicator.className = 'change-indicator';
                changePercentage.textContent = '0%';
            }
        } else {
            changeIndicator.className = 'change-indicator';
            changePercentage.textContent = '+0%';
        }
    }
}

// ========== XUẤT EXCEL ==========
function exportToExcel() {
    if (invoices.length === 0) {
        alert('Không có dữ liệu để xuất');
        return;
    }
    
    // Chuẩn bị dữ liệu
    const data = [
        ['STT', 'Phân loại', 'Ngày mua', 'Cửa hàng', 'Tên sản phẩm', 'Số lượng', 'Đơn giá (₫)', 'Thành tiền (₫)', 'Tổng hóa đơn (₫)', 'Ghi chú']
    ];
    
    let rowIndex = 1;
    invoices.forEach((invoice, invoiceIndex) => {
        let invoiceTotal = 0;
        
        invoice.products.forEach(product => {
            invoiceTotal += product.total || 0;
        });
        
        invoice.products.forEach((product, productIndex) => {
            const row = [
                rowIndex,
                invoice.category,
                invoice.date,
                invoice.store,
                product.name,
                product.quantity,
                product.price,
                product.total || product.quantity * product.price,
                productIndex === 0 ? invoiceTotal : '',
                productIndex === 0 ? invoice.notes || '' : ''
            ];
            data.push(row);
            rowIndex++;
        });
        
        // Thêm dòng trống giữa các hóa đơn
        if (invoiceIndex < invoices.length - 1) {
            data.push(Array(10).fill(''));
        }
    });
    
    // Tạo workbook
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hóa đơn');
    
    // Xuất file
    const fileName = `hoa_don_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    console.log('Đã xuất file Excel:', fileName);
}

// ========== HÀM HỖ TRỢ ==========
function formatCurrency(amount) {
    if (!amount && amount !== 0) return '0 ₫';
    return amount.toLocaleString('vi-VN') + ' ₫';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== KIỂM TRA VÀ ĐỒNG BỘ DỮ LIỆU ==========
function checkAndSyncData() {
    console.log('Đang kiểm tra dữ liệu...');
    
    // Đọc từ localStorage
    const storedInvoices = localStorage.getItem('invoices');
    console.log('Dữ liệu từ localStorage:', storedInvoices);
    
    // Nếu có dữ liệu trong localStorage, cập nhật biến invoices
    if (storedInvoices) {
        try {
            const parsed = JSON.parse(storedInvoices);
            if (Array.isArray(parsed) && parsed.length > 0) {
                invoices = parsed;
                console.log('Đã tải', invoices.length, 'hóa đơn từ localStorage');
                return true;
            }
        } catch (error) {
            console.error('Lỗi khi parse dữ liệu từ localStorage:', error);
        }
    }
    
    return false;
}

// Kiểm tra dữ liệu khi trang được tải
window.addEventListener('load', function() {
    console.log('Trang đã tải hoàn toàn');
    if (checkAndSyncData()) {
        displayInvoices();
    }
});