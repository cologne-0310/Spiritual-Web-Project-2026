// 最新消息自動化抓取
document.addEventListener('DOMContentLoaded', async () => {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    try {
        const { data, error } = await supabase
            .from('latest_news')
            .select('*')
            .order('publish_date', { ascending: false })
            .limit(6);

        if (error) throw error;

        if (data && data.length > 0) {
            newsGrid.innerHTML = '';
            data.forEach(news => {
                const newsCard = document.createElement('article');
                newsCard.className = 'course-card';
                
                newsCard.innerHTML = `
                    <div style="height: 200px; overflow: hidden;">
                        <img src="${news.image_url}" alt="${news.title}" class="course-img" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="card-body">
                        <span class="tag">${news.category}</span>
                        <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${news.title}</h3>
                        <p style="font-size: 0.85rem; color: #666; margin-bottom: 1rem;">${news.summary}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f0f0f0; pt: 1rem;">
                            <span style="font-size: 0.75rem; color: #999;">${new Date(news.publish_date).toLocaleDateString()}</span>
                            <a href="${news.link || '#'}" class="btn btn-secondary" style="padding: 0.4rem 1rem; font-size: 0.8rem;">閱讀更多</a>
                        </div>
                    </div>
                `;
                newsGrid.appendChild(newsCard);
            });
        } else {
            newsGrid.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 2rem;">目前尚無最新消息。</p>';
        }

    } catch (err) {
        console.error('Error fetching news:', err);
        newsGrid.innerHTML = '<p style="text-align: center; color: #e74c3c; padding: 2rem;">無法載入最新消息，請稍後再試。</p>';
    }
});
