// AI 實驗室邏輯
document.addEventListener('DOMContentLoaded', () => {
    const drawBtn = document.getElementById('draw-btn');
    const oracleCard = document.getElementById('oracle-card');
    const oracleResult = document.getElementById('oracle-result');
    const cardName = document.getElementById('card-name');
    const cardMeaning = document.getElementById('card-meaning');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // 神諭卡池
    const cards = [
        { name: "生命之源", meaning: "回歸初心，在靜默中尋找最純粹的力量。", img: "https://raw.githubusercontent.com/cologne-0310/AG_TEST/main/assets/news-01.png" },
        { name: "流動能量", meaning: "釋放舊有的束縛，讓愛與豐盛自然流進您的生活。", img: "https://raw.githubusercontent.com/cologne-0310/AG_TEST/main/assets/news-02.jpg" },
        { name: "智慧覺醒", meaning: "傾聽內在的聲音，答案就在您的呼吸之間。", img: "https://raw.githubusercontent.com/cologne-0310/AG_TEST/main/assets/news-03.jpg" }
    ];

    if (drawBtn) {
        drawBtn.addEventListener('click', () => {
            const randomCard = cards[Math.floor(Math.random() * cards.length)];
            
            oracleCard.style.transform = 'rotateY(180deg)';
            setTimeout(() => {
                oracleResult.style.display = 'block';
                cardName.textContent = randomCard.name;
                cardMeaning.textContent = randomCard.meaning;
                
                // 更換卡面圖片 (模擬翻牌)
                const cardFrontImg = oracleCard.querySelector('.card-front img');
                if (cardFrontImg) cardFrontImg.src = randomCard.img;
            }, 300);
        });
    }

    // 簡易聊天模擬 (可介接真 AI)
    if (sendBtn) {
        sendBtn.addEventListener('click', async () => {
            const msg = userInput.value.trim();
            if (!msg) return;

            // 用戶消息
            appendMessage('user', msg);
            userInput.value = '';

            // 存儲對話到 Supabase (如果有連線)
            try {
                if (typeof supabase !== 'undefined') {
                    await supabase.from('ai_conversations').insert([
                        { user_message: msg }
                    ]);
                }
            } catch (e) {
                console.error(e);
            }

            // AI 回應
            setTimeout(() => {
                appendMessage('ai', '感謝您的分享。在源點的能量場中，我們看見了您的勇氣與覺察。請繼續保持這份覺知。');
            }, 1000);
        });
    }

    function appendMessage(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}-msg`;
        msgDiv.style.marginBottom = '1rem';
        msgDiv.style.padding = '1rem';
        msgDiv.style.borderRadius = '12px';
        msgDiv.style.maxWidth = '80%';

        if (role === 'user') {
            msgDiv.style.backgroundColor = '#ecf0f1';
            msgDiv.style.alignSelf = 'flex-end';
            msgDiv.style.marginLeft = 'auto';
        } else {
            msgDiv.style.backgroundColor = '#d5e4e1';
            msgDiv.style.color = '#2c3e50';
        }

        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
