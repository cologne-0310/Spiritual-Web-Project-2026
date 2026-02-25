/**
 * admin.js - 內部管理系統邏輯 (Admin System Logic)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化統計數據 (Loading Stats)
    loadStats();

    // 2. 新聞表單處理 (News Form Handling)
    const newsForm = document.getElementById('news-form');
    if (newsForm) {
        newsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const status = document.getElementById('news-status');
            status.innerText = '正在處理發佈作業...';

            const article = {
                title: document.getElementById('news-title').value,
                tag: document.getElementById('news-tag').value,
                image_url: document.getElementById('news-img').value,
                summary: document.getElementById('news-summary').value
            };

            if (window.supabaseClient) {
                try {
                    const { error } = await supabaseClient
                        .from('news_articles')
                        .insert([article]);

                    if (error) throw error;

                    status.innerText = '✅ 發佈成功！新聞已同步至首頁。';
                    newsForm.reset();
                } catch (err) {
                    status.innerText = '❌ 發佈失敗：' + err.message;
                }
            } else {
                status.innerText = '❌ 尚未偵測到數據庫連線。';
            }
        });
    }
});

// 模組切換 (Module Toggler)
function showModule(moduleId) {
    document.querySelectorAll('.admin-module').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.admin-nav li').forEach(l => l.classList.remove('active'));

    document.getElementById(`module-${moduleId}`).classList.add('active');
    event.currentTarget.classList.add('active');
    document.getElementById('page-title').innerText = event.currentTarget.innerText.split(' ')[1];

    if (moduleId === 'logs') loadAILogs();
    if (moduleId === 'orders') loadOrders();
}

async function loadStats() {
    if (!window.supabaseClient) return;

    try {
        // 取得 AI 互動人次
        const { count: aiCount } = await supabaseClient
            .from('oracle_drawings')
            .select('*', { count: 'exact', head: true });

        // 取得訂單數
        const { count: orderCount } = await supabaseClient
            .from('orders')
            .select('*', { count: 'exact', head: true });

        document.getElementById('stats-ai').innerText = aiCount || 0;
        document.getElementById('stats-orders').innerText = orderCount || 0;
        document.getElementById('stats-news').innerText = '100%';
        document.getElementById('quick-logs').innerText = `目前系統運作正常。AI 已服務 ${aiCount || 0} 人次，共有 ${orderCount || 0} 筆待處理訂單。`;
    } catch (err) {
        console.error('Stats Error:', err);
    }
}

async function loadAILogs() {
    const body = document.getElementById('ai-logs-body');
    if (!body || !window.supabaseClient) return;

    body.innerHTML = '<tr><td colspan="4" style="text-align:center;">更新中...</td></tr>';

    try {
        const { data, error } = await supabaseClient
            .from('oracle_drawings')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        body.innerHTML = data.map(log => `
            <tr>
                <td>${new Date(log.created_at).toLocaleTimeString()}</td>
                <td>${log.category}</td>
                <td>${log.card_title}</td>
                <td style="font-size:0.8rem; color:#666;">${log.card_content.substring(0, 15)}...</td>
            </tr>
        `).join('');
    } catch (err) {
        body.innerHTML = '<tr><td colspan="4">載入失敗</td></tr>';
    }
}

async function loadOrders() {
    const body = document.getElementById('orders-body');
    if (!body || !window.supabaseClient) return;

    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (data.length === 0) {
            body.innerHTML = '<tr><td colspan="5" style="text-align:center;">尚未有訂單記錄</td></tr>';
            return;
        }

        body.innerHTML = data.map(order => `
            <tr>
                <td>#${order.id.toString().substring(0, 8)}</td>
                <td>${order.customer_name}</td>
                <td>${order.customer_phone}</td>
                <td style="font-weight:700;">NT$ ${order.total_amount.toLocaleString()}</td>
                <td><span class="btn-sm">${order.status}</span></td>
            </tr>
        `).join('');
    } catch (err) {
        console.error(err);
    }
}
