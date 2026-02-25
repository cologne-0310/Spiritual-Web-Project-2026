// AI Lab Interaction Logic
// Using window.drawCard to be accessible from global scope

async function drawCard(category) {
    const cardOverlay = document.getElementById('card-overlay');
    const cardContainer = document.getElementById('card-container');
    const cardIcon = document.getElementById('card-icon');
    const cardTitle = document.getElementById('card-title');
    const cardContent = document.getElementById('card-content');
    const chatMessages = document.getElementById('chat-messages');

    // Messages database (Simplified for demonstration)
    const library = {
        'love': {
            icon: '💖',
            title: '愛之永恆',
            message: '愛就在你的核心。當你學會愛自己，全世界都會被你的光芒吸引。關係的修復始於內在的平衡。'
        },
        'career': {
            icon: '🌟',
            title: '事業豐盛',
            message: '目前的努力正在扎根。不要急於看見果實，專注於當下的每一個小步驟，成功的契機即將展現。'
        },
        'health': {
            icon: '🌿',
            title: '生命共振',
            message: '身體是靈魂的殿堂。傾聽身體的微小訊號，給予它真正需要的養分與休息。深呼吸，讓能量重新流動。'
        },
        'wealth': {
            icon: '💎',
            title: '豐盛之鑰',
            message: '匱乏感只是心智的幻象。對你已擁有的表達感恩，這股頻率將會吸引更多的資源進入你的生命。'
        }
    };

    const data = library[category] || library['love'];

    // Update UI and Show Animation
    cardIcon.textContent = data.icon;
    cardTitle.textContent = data.title;
    cardContent.textContent = data.message;
    
    cardOverlay.style.display = 'block';
    cardContainer.style.display = 'block';

    // Add to chat history
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = `請為我抽取關於「${getTitle(category)}」的神諭卡。`;
    chatMessages.appendChild(userMsg);

    // AI Response in chat
    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message ai';
        aiMsg.innerHTML = `好的。為您抽取了<strong>「${data.title}」</strong>。<br><br>${data.message}`;
        chatMessages.appendChild(aiMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
}

function getTitle(cat) {
    const map = { 'love': '感情與關係', 'career': '事業與成就', 'health': '身心靈健康', 'wealth': '豐盛與金錢' };
    return map[cat] || cat;
}

function closeCard() {
    document.getElementById('card-overlay').style.display = 'none';
    document.getElementById('card-container').style.display = 'none';
}

// Global scope access
window.drawCard = drawCard;
window.closeCard = closeCard;

// Chat Form logic
document.getElementById('chat-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const chatMessages = document.getElementById('chat-messages');
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = msg;
    chatMessages.appendChild(userMsg);
    
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Echo/Simple AI response
    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message ai';
        aiMsg.textContent = "感謝您的分享。此訊息已傳遞至靈魂意識中心。讓我們一起專注於呼吸，感受當下的力量。";
        chatMessages.appendChild(aiMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
});
