// Latest News Dynamic Curation Logic

async function fetchAndRenderNews() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    try {
        // Fallback static data if Supabase integration is not fully active
        const fallbackNews = [
            {
                id: 1,
                category: '最新動態',
                title: '源點春季身心優化課程開始報名',
                description: '結合傳統理療與現代能量技術，幫助您排除冬季累積的沉重感。',
                image: 'https://raw.githubusercontent.com/cologne-0310/AG_TEST/main/assets/%E7%B8%BD%E8%AA%B2%E7%A8%8B%E8%A1%A8.jpg'
            },
            {
                id: 2,
                category: '靈性訊息',
                title: '三月份滿月冥想指引',
                description: '在這個釋放的季節，我們將透過集體音療幫助內在平衡。',
                image: 'https://raw.githubusercontent.com/cologne-0310/AG_TEST/main/assets/course-05.png'
            }
        ];

        // 渲染 HTML
        newsGrid.innerHTML = fallbackNews.map(item => `
            <article class="course-card">
                <img src="${item.image}" alt="${item.title}" class="course-img">
                <div class="card-body">
                    <span class="tag">${item.category}</span>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <a href="#" class="btn btn-secondary" style="width: 100%; text-align: center;">閱讀詳情</a>
                </div>
            </article>
        `).join('');

    } catch (error) {
        console.error('News Fetch Error:', error);
        newsGrid.innerHTML = '<p style="text-align: center; color: #999;">暫時無法載入最新消息，請稍後再試。</p>';
    }
}

document.addEventListener('DOMContentLoaded', fetchAndRenderNews);
