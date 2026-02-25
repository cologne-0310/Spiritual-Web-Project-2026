// Admin Dashboard Logic
document.addEventListener('DOMContentLoaded', async () => {
    // Initial data load
    loadDashboardData();

    // Setup news form listener
    const newsForm = document.getElementById('news-form');
    if (newsForm) {
        newsForm.addEventListener('submit', handleNewsSubmit);
    }
});

async function loadDashboardData() {
    console.log('Fetching dashboard data...');

    try {
        // 1. Fetch Orders for the Table and Stats
        const { data: orders, error: ordersError } = await supabaseClient
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // 2. Fetch Affiliates for Stats
        const { data: affiliates, error: affError } = await supabaseClient
            .from('affiliates')
            .select('*');

        if (affError) throw affError;

        // --- Calculate Stats ---
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
        const uniqueCustomers = new Set(orders.map(o => o.customer_email)).size;

        // --- Update Stats UI ---
        document.getElementById('stat-orders').innerText = totalOrders;
        document.getElementById('stat-revenue').innerText = `NT$ ${totalRevenue.toLocaleString()}`;
        document.getElementById('stat-users').innerText = uniqueCustomers;

        // --- Render Recent Orders Table ---
        renderOrdersTable(orders.slice(0, 10)); // Only show top 10 in dashboard

    } catch (err) {
        console.error('Admin Error:', err);
        alert('載入數據失敗：' + err.message);
    }
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('recent-orders-list');

    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">目前尚無訂單</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(order => {
        const date = new Date(order.created_at).toLocaleDateString('zh-TW');

        // Parse items if it's a string/json
        let itemsSummary = '';
        if (order.items && Array.isArray(order.items)) {
            itemsSummary = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');
        } else {
            itemsSummary = '無明細';
        }

        return `
            <tr>
                <td>${date}</td>
                <td>
                    <div style="font-weight: 600;">${order.customer_name}</div>
                    <div style="font-size: 0.8rem; color: #64748b;">${order.customer_phone}</div>
                </td>
                <td><div style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${itemsSummary}">${itemsSummary}</div></td>
                <td style="font-weight: 600;">NT$ ${Number(order.total_amount).toLocaleString()}</td>
                <td><span class="status-badge" style="background: #f1f5f9; color: #475569;">${order.referral_id || '直接'}</span></td>
                <td><span class="status-badge status-${order.status || 'pending'}">${translateStatus(order.status)}</span></td>
            </tr>
        `;
    }).join('');
}

function translateStatus(status) {
    const map = {
        'pending': '處理中',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    return map[status] || '未知';
}

function switchTab(tabName) {
    // Basic tab switching logic
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const title = {
        'dashboard': '歡迎回來，管理員',
        'orders': '訂單管理面板',
        'news': '最新消息發布系統',
        'affiliates': '分潤業績查詢',
        'reports': '報表統計中心'
    };

    document.getElementById('page-title').innerText = title[tabName] || '管理頁面';

    // Toggle content sections
    const sections = ['dashboard-content', 'news-content'];
    sections.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.style.display = 'none';
    });

    const activeSection = document.getElementById(`${tabName}-content`);
    if (activeSection) {
        activeSection.style.display = 'block';
    }

    if (tabName === 'dashboard') {
        loadDashboardData();
    } else if (tabName === 'news') {
        loadNewsData();
    }
}

// --- News Management Logic ---

async function loadNewsData() {
    console.log('Fetching news for admin...');
    const tbody = document.getElementById('admin-news-list');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">載入中...</td></tr>';

    try {
        const { data: news, error } = await supabaseClient
            .from('news')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) throw error;

        if (news.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">尚未發布任何新聞</td></tr>';
            return;
        }

        tbody.innerHTML = news.map(item => {
            const date = new Date(item.published_at).toLocaleDateString('zh-TW');
            return `
                <tr>
                    <td>${date}</td>
                    <td><div style="font-weight: 600;">${item.title}</div></td>
                    <td><span class="tag">${item.tag}</span></td>
                    <td><a href="${item.url}" target="_blank" style="color: var(--admin-primary);">點此查看</a></td>
                    <td>
                        <button onclick="deleteNews(${item.id})" style="color: #ef4444; border: none; background: none; cursor: pointer; font-weight: 600;">刪除</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error('Load News Error:', err);
    }
}

async function handleNewsSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerText = '發布中...';

    const newsData = {
        title: document.getElementById('news-title').value,
        tag: document.getElementById('news-tag').value,
        summary: document.getElementById('news-summary').value,
        url: document.getElementById('news-url').value,
        published_at: new Date().toISOString()
    };

    try {
        const { error } = await supabaseClient
            .from('news')
            .insert([newsData]);

        if (error) throw error;

        alert('新聞發布成功！');
        e.target.reset();
        loadNewsData();
    } catch (err) {
        console.error('Submit News Error:', err);
        alert('發布失敗：' + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = '發布新聞';
    }
}

async function deleteNews(id) {
    if (!confirm('確定要刪除這條新聞嗎？')) return;

    try {
        const { error } = await supabaseClient
            .from('news')
            .delete()
            .eq('id', id);

        if (error) throw error;
        loadNewsData();
    } catch (err) {
        alert('刪除失敗：' + err.message);
    }
}
