/**
 * news.js - 最新消息動態載入 (Dynamic News Loader)
 */

document.addEventListener('DOMContentLoaded', async () => {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    // 從 Supabase 讀取新聞數據
    if (window.supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('news_articles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                renderNews(data);
            } else {
                renderPlaceholder();
            }
        } catch (err) {
            console.error('Supabase Error:', err);
            renderPlaceholder();
        }
    } else {
        renderPlaceholder();
    }
});

function renderNews(articles) {
    const grid = document.getElementById('news-grid');
    grid.innerHTML = '';

    articles.forEach(article => {
        const date = new Date(article.created_at).toLocaleDateString('zh-TW');
        const card = `
            <article class="course-card">
                <img src="${article.image_url || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800'}" 
                     alt="News Image" class="course-img">
                <div class="card-body">
                    <span class="tag">${article.tag || '最新消息'}</span>
                    <h3>${article.title}</h3>
                    <p>${article.summary}</p>
                    <div class="meta-info">${date}</div>
                </div>
            </article>
        `;
        grid.innerHTML += card;
    });
}

function renderPlaceholder() {
    const grid = document.getElementById('news-grid');
    const defaultData = [
        {
            title: "2025 春季：能量理療與頌缽初探",
            summary: "邀請您在這場全新的春季工作坊中，體驗頌缽的頻率如何清理冬天累積的沈重感，重新對齊靈魂的震動。",
            tag: "最新消息",
            created_at: new Date()
        },
        {
            title: "源點身心靈官方網站：正式改版上線",
            summary: "感謝各位夥伴的支持，我們的官方網站今日全新上線，新增了 AI 實驗室與即時課程預約功能。",
            tag: "重要公告",
            created_at: new Date()
        }
    ];
    renderNews(defaultData);
}
