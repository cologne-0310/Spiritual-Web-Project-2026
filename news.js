// news.js - Dynamic news fetching and rendering
document.addEventListener('DOMContentLoaded', async () => {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    try {
        console.log('Fetching latest news from Supabase...');
        const { data: news, error } = await supabaseClient
            .from('news')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) throw error;

        if (!news || news.length === 0) {
            newsGrid.innerHTML = '<p style="text-align: center; color: #64748b; padding: 2rem;">目前尚無新聞，請稍後再回來查看。</p>';
            return;
        }

        renderNews(news);
    } catch (err) {
        console.error('Error fetching news:', err);
        newsGrid.innerHTML = `<p style="text-align: center; color: #ef4444; padding: 2rem;">無法載入新聞資料：${err.message}</p>`;
    }
});

function renderNews(newsItems) {
    const newsGrid = document.getElementById('news-grid');

    newsGrid.innerHTML = newsItems.map(item => {
        const date = new Date(item.published_at).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <article class="course-card">
                <div class="card-body">
                    <span class="tag">${item.tag || '最新消息'}</span>
                    <h3>${item.title}</h3>
                    <p>${item.summary}</p>
                    <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                        <span class="meta-info">${date}</span>
                        <a href="${item.url}" target="_blank" class="btn-text" style="color: var(--accent-color); font-weight: 600; text-decoration: none; font-size: 0.9rem;">閱讀原文 ↗</a>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}
