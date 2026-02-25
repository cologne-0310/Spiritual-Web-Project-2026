// AI Lab - Interactive Logic & Card Drawing
const soulCards = {
    love: [
        { title: "心靈契合", icon: "💞", content: "您即將與某個靈魂頻率達成共識。保持開放，愛會以最自然的方式流動。" },
        { title: "自我愛護", icon: "✨", content: "先成為自己的暖陽，他人自然會被您的光芒吸引。今日請多給自己一個擁抱。" },
        { title: "溝通之橋", icon: "🌈", content: "誠實的表達是化解誤會的良藥。試著溫柔地說出心底話。" }
    ],
    career: [
        { title: "豐盛顯化", icon: "🌟", content: "您的努力正在宇宙中醞釀。保持現在的節奏，收穫的季節即將到來。" },
        { title: "方向指引", icon: "🧭", content: "若感到迷惘，請回到初心。問問自己：什麼是讓您感到最有熱情的事？" },
        { title: "突破僵局", icon: "🔥", content: "勇於跨出舒適圈，新的機會就在轉角處。您的能量足以應對任何挑戰。" }
    ],
    health: [
        { title: "內在平靜", icon: "🧘", content: "身體是靈魂的殿堂。今日請多喝水，與大自然接觸，讓能量自然流動。" },
        { title: "釋放負重", icon: "🍃", content: "深呼吸，吐出那些不再服務於您的壓力。您是被宇宙全然守護著的。" },
        { title: "能量修復", icon: "💎", content: "睡眠是最好的療癒。今晚請放下手機，給予意識一段純淨的休息時間。" }
    ],
    wealth: [
        { title: "金錢流動", icon: "🌊", content: "金錢是能量的另一種形式。當您學會感恩已擁有的，更多的豐盛會隨之而來。" },
        { title: "格局擴張", icon: "🚀", content: "不要侷限於現有的收入管道。您的天賦正等待被更廣泛地應用。" },
        { title: "豐盛意識", icon: "🍀", content: "清除內心的匱乏感。宇宙的資源是無窮的，且您值得擁有這一切。" }
    ]
};

const oracleMessages = [
    "「靜下心來，答案就在您的呼吸之間。」",
    "「每一個結束，都是另一個靈魂覺醒的導讀。」",
    "「外界的紛擾只是倒影，心中的平靜才是真實。」",
    "「勇敢面對內心的陰影，那正是光照進來的地方。」",
    "「您所追尋的，也正在追尋著您。」",
    "「相信您的直覺，它是靈魂與宇宙的私語。」",
    "「給予自己溫柔，就像陽光對待花朵一樣。」"
];

const aiResponses = [
    {
        keywords: ["壓力", "累", "煩", "睡不著"],
        response: "我感受到了您的疲憊。有時候，讓自己停下來並不是浪費時間，而是為了更好的對齊。或許您可以試著進行 5 分鐘的深呼吸，或參考我們的「音缽療癒」課程來放鬆神經系統。",
        link: "shop.html"
    },
    {
        keywords: ["迷惘", "未來", "選擇", "方向"],
        response: "迷惘是靈魂正在擴張的訊號。當您不知道往哪走時，就先回到當下。我們的「靈魂藍圖解析」能協助您看見潛在的生命路徑，或許對您有幫助。",
        link: "academy.html"
    },
    {
        keywords: ["愛", "感情", "關係", "寂寞"],
        response: "所有的關係，最終都是我們與自己關係的鏡像。先溫柔地擁抱自己，愛自然會流向您。您可以看看我們的「心輪開啟工作坊」。",
        link: "academy.html"
    }
];

const defaultResponse = "感謝您的分享。您的每個情緒都值得被溫柔地看見。雖然我只是 AI，但我能感應到您尋求平衡的心。您可以試試下方的主題選單來抽取一張指引卡片。";

document.addEventListener('DOMContentLoaded', () => {
    const oracleBtn = document.getElementById('oracle-btn');
    const oracleMsg = document.getElementById('oracle-msg');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Exposure for HTML onclick
    window.drawCard = drawCard;
    window.closeCard = closeCard;

    // 1. Oracle Logic
    oracleBtn.addEventListener('click', () => {
        oracleMsg.style.opacity = '0';
        oracleBtn.style.transform = 'scale(0.9) rotate(15deg)';

        setTimeout(() => {
            const randomMsg = oracleMessages[Math.floor(Math.random() * oracleMessages.length)];
            oracleMsg.innerText = randomMsg;
            oracleMsg.style.opacity = '1';
            oracleBtn.style.transform = 'scale(1.1)';
        }, 500);
    });

    // 2. Chat Logic
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userText = chatInput.value.trim();
        if (!userText) return;

        appendMessage('user', userText);
        chatInput.value = '';

        setTimeout(() => {
            const botResponse = findBestResponse(userText);
            appendMessage('ai', botResponse);
        }, 800);
    });

    function appendMessage(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;
        msgDiv.innerText = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function findBestResponse(text) {
        for (const item of aiResponses) {
            if (item.keywords.some(k => text.includes(k))) {
                return item.response;
            }
        }
        return defaultResponse;
    }

    // 3. Card Drawing Logic
    function drawCard(category) {
        const overlay = document.getElementById('card-overlay');
        const container = document.getElementById('card-container');
        const cardInner = document.getElementById('card-inner');

        const categoryCards = soulCards[category];
        const randomCard = categoryCards[Math.floor(Math.random() * categoryCards.length)];

        // Prep card UI
        document.getElementById('card-icon').innerText = randomCard.icon;
        document.getElementById('card-title').innerText = randomCard.title;
        document.getElementById('card-content').innerText = randomCard.content;

        // Show with animation
        overlay.style.display = 'block';
        container.style.display = 'block';

        // Brief shuffling feel
        cardInner.style.transform = 'rotateY(720deg) scale(0.5)';
        setTimeout(() => {
            cardInner.style.transform = 'rotateY(0deg) scale(1)';
        }, 50);

        // Add to chat as history
        appendMessage('ai', `您抽取了一張「${randomCard.title}」神諭卡：${randomCard.content}`);
    }

    function closeCard() {
        document.getElementById('card-overlay').style.display = 'none';
        document.getElementById('card-container').style.display = 'none';
    }
});
