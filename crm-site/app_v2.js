// 本地持久化資料庫儲存 Key
        const STORAGE_KEY = "spiritual_crm_clients_v2";
        const DIRTY_KEY = "spiritual_crm_dirty_v2";

        let clientsData = [];
        let dirtyClients = {};
        // 安全圖示渲染函數，防止離線時因 Lucide CDN 載入失敗導致 JS 卡死崩潰
        function safeCreateIcons() {
            try {
                if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
                    lucide.createIcons();
                } else {
                    console.warn("Lucide Icons 不可用，跳過圖示繪製");
                }
            } catch (err) {
                console.error("safeCreateIcons error:", err);
            }
        }


                function loadClientsFromStorage() {
            try {
                const cachedData = localStorage.getItem(STORAGE_KEY);
                const cachedDirty = localStorage.getItem(DIRTY_KEY);
                
                if (cachedData) {
                    clientsData = JSON.parse(cachedData);
                    // 防禦性檢查：驗證第一筆資料是否包含必須的 drives 欄位與結構，防止快取損毀崩潰
                    if (!Array.isArray(clientsData) || clientsData.length === 0 || !clientsData[0].drives || typeof clientsData[0].drives.health === 'undefined') {
                        throw new Error("快取資料格式不符或損毀");
                    }
                } else {
                    clientsData = getInitialPresetData();
                    saveClientsToStorage();
                }

                if (cachedDirty) {
                    dirtyClients = JSON.parse(cachedDirty);
                } else {
                    dirtyClients = {};
                }
            } catch (err) {
                console.warn("LocalStorage 資料毀損或格式不符，重置為預置資料:", err);
                clientsData = getInitialPresetData();
                dirtyClients = {};
                saveClientsToStorage(); // 覆寫修復快取
            }
        }

        // SVG 微型五核心人生動力雷達圖產生器 (升級版：文字與圖示直接標註在雷達圖頂點四周，極度直觀且效能優異)
        function generateMiniRadarSvg(drives) {
            const r = 26;  // 雷達圖最大半徑
            const cx = 65; // 中心 X
            const cy = 55; // 中心 Y
            
            // 5個維度的角度 (弧度)
            const angles = [
                -Math.PI / 2,                      // 上: 健康
                -Math.PI / 2 + (Math.PI * 2 / 5),   // 右上: 財富
                -Math.PI / 2 + (Math.PI * 4 / 5),   // 右下: 感情
                -Math.PI / 2 + (Math.PI * 6 / 5),   // 左下: 家庭
                -Math.PI / 2 + (Math.PI * 8 / 5)    // 左上: 事業
            ];
            
            // 100% 網格背景頂點
            const bg100 = angles.map(a => {
                const x = cx + r * Math.cos(a);
                const y = cy + r * Math.sin(a);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(' ');

            // 50% 網格背景頂點
            const bg50 = angles.map(a => {
                const x = cx + (r * 0.5) * Math.cos(a);
                const y = cy + (r * 0.5) * Math.sin(a);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(' ');
            
            // 數據多邊形頂點
            const vals = [
                drives.health || 0,
                drives.wealth || 0,
                drives.emotion || 0,
                drives.family || 0,
                drives.career || 0
            ];
            
            const dataPoints = angles.map((a, i) => {
                const val = vals[i];
                const x = cx + r * val * Math.cos(a);
                const y = cy + r * val * Math.sin(a);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(' ');

            // 各頂角文字標籤的對齊與微調偏移
            const textOffsets = [
                { x: 0, y: -7, anchor: 'middle' },  // 上: 健康
                { x: 5, y: 3, anchor: 'start' },    // 右上: 財富
                { x: 4, y: 9, anchor: 'start' },    // 右下: 感情
                { x: -4, y: 9, anchor: 'end' },     // 左下: 家庭
                { x: -5, y: 3, anchor: 'end' }      // 左上: 事業
            ];
            
            const labelNames = [
                `❤️健康 ${Math.round(vals[0]*100)}%`,
                `🪙財富 ${Math.round(vals[1]*100)}%`,
                `🌸感情 ${Math.round(vals[2]*100)}%`,
                `🏡家庭 ${Math.round(vals[3]*100)}%`,
                `💼事業 ${Math.round(vals[4]*100)}%`
            ];
            
            return `<svg class="w-32 h-28 overflow-visible shrink-0 mx-auto" viewBox="0 0 130 110">
                <!-- 50% 背景網格 -->
                <polygon points="${bg50}" fill="none" stroke="rgba(212, 146, 142, 0.25)" stroke-width="1" />
                <!-- 100% 背景網格 -->
                <polygon points="${bg100}" fill="none" stroke="rgba(62, 56, 50, 0.15)" stroke-width="1.2" />
                <!-- 網格軸線 -->
                ${angles.map((a, i) => {
                    const x = cx + r * Math.cos(a);
                    const y = cy + r * Math.sin(a);
                    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(62, 56, 50, 0.08)" stroke-width="0.8" />`;
                }).join('')}
                <!-- 數據多邊形 -->
                <polygon points="${dataPoints}" fill="rgba(201, 122, 117, 0.26)" stroke="#C97A75" stroke-width="1.5" />
                <!-- 頂點小圓點 -->
                ${angles.map((a, i) => {
                    const val = vals[i];
                    const x = cx + r * val * Math.cos(a);
                    const y = cy + r * val * Math.sin(a);
                    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#9C8BB5" />`;
                }).join('')}
                <!-- 頂點文字與圖示標籤 -->
                ${angles.map((a, i) => {
                    const gridX = cx + r * Math.cos(a);
                    const gridY = cy + r * Math.sin(a);
                    const textX = gridX + textOffsets[i].x;
                    const textY = gridY + textOffsets[i].y;
                    return `<text x="${textX.toFixed(1)}" y="${textY.toFixed(1)}" text-anchor="${textOffsets[i].anchor}" font-size="8.5" font-weight="900" fill="#4A3E3D">${labelNames[i]}</text>`;
                }).join('')}
            </svg>`;
        }

        function saveClientsToStorage() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(clientsData));
                localStorage.setItem(DIRTY_KEY, JSON.stringify(dirtyClients));
            } catch (err) {
                console.error("LocalStorage save failed:", err);
            }
        }

        // 預置初始長者數據庫
                function getInitialPresetData() {
            return [
                { 
                    id: 'C001', 
                    name: '林大仙', 
                    age: 28, 
                    gender: '男', 
                    tags: { 
                        life: ['水分不足', '日常久坐'], 
                        state: ['焦慮不振', '失眠困擾'], 
                        interest: ['音療學習'] 
                    }, 
                    drives: { health: 0.8, wealth: 0.25, emotion: 0.85, family: 0.5, career: 0.15 }, 
                    lastActive: '5分鐘前', 
                    bodyStatus: 'red', 
                    bodyNote: '睡眠小於5h', 
                    mindStatus: 'red', 
                    mindNote: '焦慮不振',
                    history: '科技業軟體工程師，長期面臨專案時程與加班壓力，近期睡眠品質極差，每晚睡不到4小時。伴隨肌肉緊繃與頭痛等生理不適主訴。對頌缽音療與壓力釋放方法感興趣。',
                    prescription: `1. 安排 432Hz 頌缽音療課程釋放深層壓力 (評估契合度: 92%)
2. 每日補充 1500ml 溫水並進行戶外散步 30 分鐘 (評估契合度: 85%)`
                },
                { 
                    id: 'C002', 
                    name: '暖心媽', 
                    age: 38, 
                    gender: '女', 
                    tags: { 
                        life: ['運動習慣', '睡眠充足'], 
                        state: ['輕度焦慮'], 
                        interest: ['香氛療癒'] 
                    }, 
                    drives: { health: 0.9, wealth: 0.35, emotion: 0.7, family: 0.6, career: 0.4 }, 
                    lastActive: '今天 09:30', 
                    bodyStatus: 'green', 
                    bodyNote: '精神良好', 
                    mindStatus: 'yellow', 
                    mindNote: '有些掛念',
                    history: '全職家庭主婦，平時照顧多位學齡孩童。近期因為育兒工作繁重，心情有些許掛念與輕度焦慮，日常喜愛香氛與手作放鬆，其餘生理健康指數良好。',
                    prescription: `1. 建議使用薰衣草香氛進行睡前冥想與情緒平穩 (評估契合度: 88%)
2. 參加社區手作療癒香氛工作坊 (評估契合度: 95%)`
                },
                { 
                    id: 'C003', 
                    name: '張大同', 
                    age: 45, 
                    gender: '男', 
                    tags: { 
                        life: ['飲食清淡', '健走習慣'], 
                        state: ['高血壓'], 
                        interest: ['茶藝品茗'] 
                    }, 
                    drives: { health: 0.65, wealth: 0.45, emotion: 0.5, family: 0.4, career: 0.3 }, 
                    lastActive: '2小時前', 
                    bodyStatus: 'yellow', 
                    bodyNote: '血壓偏高', 
                    mindStatus: 'green', 
                    mindNote: '心情平穩',
                    history: '企業高階主管，工作步調極快且高壓。平日注重清淡飲食與慢跑，但近期因季節交替血壓有些微波動。心理層面穩定度佳，喜愛茶藝品茗與商務社交。',
                    prescription: `1. 建議定期監測血壓，並維持清淡低鹽之健管飲食 (評估契合度: 90%)
2. 安排溫和的太極拳或放鬆伸展課程以舒緩心血管壓力 (評估契合度: 80%)`
                },
                { 
                    id: 'C004', 
                    name: '李小花', 
                    age: 32, 
                    gender: '女', 
                    tags: { 
                        life: ['水分不足', '睡眠不足'], 
                        state: ['關節痠痛'], 
                        interest: ['烘焙手作'] 
                    }, 
                    drives: { health: 0.5, wealth: 0.3, emotion: 0.75, family: 0.55, career: 0.35 }, 
                    lastActive: '昨天', 
                    bodyStatus: 'red', 
                    bodyNote: '關節發炎', 
                    mindStatus: 'green', 
                    mindNote: '樂觀開朗',
                    history: '自由接案設計師，日常久坐電腦前，水分儲存嚴重不足。近期主訴關節痠痛與局部發炎。性格保持極佳的樂觀開朗態度，喜歡烘焙與手作活動。',
                    prescription: `1. 提醒每日飲水量需強制達到 1200ml 以上 (評估契合度: 95%)
2. 推薦低衝擊水中有氧或關懷據點的烘焙手作社交活動 (評估契合度: 85%)`
                },
                { 
                    id: 'C005', 
                    name: '養生達人', 
                    age: 52, 
                    gender: '男', 
                    tags: { 
                        life: ['太極運動', '睡眠充足'], 
                        state: ['健康良好'], 
                        interest: ['園藝種植'] 
                    }, 
                    drives: { health: 0.85, wealth: 0.4, emotion: 0.55, family: 0.6, career: 0.3 }, 
                    lastActive: '3天前', 
                    bodyStatus: 'green', 
                    bodyNote: '體能極佳', 
                    mindStatus: 'green', 
                    mindNote: '正念生活',
                    history: '自由職業者，生活作息極有規律，每日練習太極拳與修剪花木。主訴身體狀況良好，心情愉悅穩定，無任何慢性病抱怨。對身心預防健康管理有高度興趣。',
                    prescription: `1. 建議可嘗試進階園藝治療以提昇生活富足感 (評估契合度: 90%)
2. 保持目前的運動與作息時間 (評估契合度: 98%)`
                },
                { 
                    id: 'C006', 
                    name: '趙子龍', 
                    age: 24, 
                    gender: '男', 
                    tags: { 
                        life: ['水分不足', '日常久坐'], 
                        state: ['焦慮不振', '失眠困擾'], 
                        interest: ['古典音樂'] 
                    }, 
                    drives: { health: 0.35, wealth: 0.2, emotion: 0.9, family: 0.45, career: 0.15 }, 
                    lastActive: '今天 08:20', 
                    bodyStatus: 'yellow', 
                    bodyNote: '體力衰退', 
                    mindStatus: 'red', 
                    mindNote: '嚴重焦慮',
                    history: '剛畢業的求職新鮮人，面臨龐大的就業壓力與不確定性，平時缺乏運動且有水分不足問題。睡眠品質差，且伴隨輕度憂鬱與健忘抱怨。心情時常感到孤獨與焦慮不振。',
                    prescription: `1. 安排古典音樂正念聆聽以安定神智與舒緩情緒 (評估契合度: 94%)
2. 建議健管師增加日常關懷與心理諮商轉介頻率 (評估契合度: 90%)`
                }
            ];

        }

        let currentFilterTag = 'all'; // 標籤篩選器
        let currentSearchQuery = '';   // 搜尋關鍵字
        let currentSortField = 'id';   // 排序欄位
        let chartsInitialized = false;

        // Chart.js 實例儲存
        let statsRadarChartInstance = null;
        let statsDoughnutChartInstance = null;

        // 頁面初始化
        window.addEventListener('DOMContentLoaded', () => {
            loadClientsFromStorage();
            renderClientTable();
            safeCreateIcons();
        });

        // 狀態 Badge 渲染輔助
        function getStatusBadge(type, status, note) {
            const icon = type === 'body' ? '身' : '心';
            if (status === 'red') {
                return `<span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#D96B64]/10 text-[#D96B64] border border-[#D96B64]/20 shadow-xs">
                            <span class="h-1.5 w-1.5 rounded-full bg-[#D96B64] animate-pulse"></span>
                            <span>${icon}: 紅 (${note})</span>
                        </span>`;
            } else if (status === 'yellow') {
                return `<span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-wellness-sun/10 text-[#D9A354] border border-wellness-sun/20 shadow-xs">
                            <span class="h-1.5 w-1.5 rounded-full bg-wellness-sun animate-pulse"></span>
                            <span>${icon}: 黃 (${note})</span>
                        </span>`;
            } else {
                return `<span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-wellness-mint/10 text-wellness-mint border border-wellness-mint/20 shadow-xs">
                            <span class="h-1.5 w-1.5 rounded-full bg-wellness-mint"></span>
                            <span>${icon}: 綠 (${note})</span>
                        </span>`;
            }
        }

        // 渲染表格
        function renderClientTable() {
            const tableBody = document.getElementById('clientTableBody');
            if (!tableBody) return;
            tableBody.innerHTML = '';

            // 1. 過濾邏輯 (搜尋框 + 膠囊標籤)
            let filtered = clientsData.filter(client => {
                const mergedTags = [...client.tags.life, ...client.tags.state, ...client.tags.interest];
                
                // 膠囊標籤過濾
                const matchesTag = currentFilterTag === 'all' || mergedTags.includes(currentFilterTag);
                
                // 搜尋框過濾
                const query = currentSearchQuery.trim().toLowerCase();
                const matchesSearch = !query || 
                    client.id.toLowerCase().includes(query) || 
                    client.name.toLowerCase().includes(query) || 
                    mergedTags.some(t => t.toLowerCase().includes(query));

                return matchesTag && matchesSearch;
            });

            // 2. 排序邏輯
            filtered.sort((a, b) => {
                if (currentSortField === 'id') {
                    return a.id.localeCompare(b.id);
                } else if (currentSortField === 'age-desc') {
                    return b.age - a.age;
                } else if (currentSortField === 'age-asc') {
                    return a.age - b.age;
                } else if (currentSortField === 'health-desc') {
                    return b.drives.health - a.drives.health;
                } else if (currentSortField === 'wealth-desc') {
                    return b.drives.wealth - a.drives.wealth;
                } else if (currentSortField === 'emotion-desc') {
                    return b.drives.emotion - a.drives.emotion;
                } else if (currentSortField === 'family-desc') {
                    return b.drives.family - a.drives.family;
                } else if (currentSortField === 'career-desc') {
                    return b.drives.career - a.drives.career;
                }
                return 0;
            });

            // 3. 表格渲染
            if (filtered.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-wellness-textSub italic">無相符合的個案資料</td></tr>`;
                return;
            }

            filtered.forEach(client => {
                const bodyBadge = getStatusBadge('body', client.bodyStatus, client.bodyNote);
                const mindBadge = getStatusBadge('mind', client.mindStatus, client.mindNote);

                // 標籤渲染為膠囊
                const lifeTags = client.tags.life.map(t => `<span onclick="clickTagFilter('${t}', event)" class="cursor-pointer px-2 py-0.5 bg-wellness-mint/10 border border-wellness-mint/20 rounded-md text-[10px] font-bold text-wellness-mint hover:bg-wellness-mint/20 transition-all">生活:${t}</span>`).join('');
                const stateTags = client.tags.state.map(t => `<span onclick="clickTagFilter('${t}', event)" class="cursor-pointer px-2 py-0.5 bg-wellness-accent/10 border border-wellness-accent/20 rounded-md text-[10px] font-bold text-wellness-accent hover:bg-wellness-accent/20 transition-all">狀態:${t}</span>`).join('');
                const interestTags = client.tags.interest.map(t => `<span onclick="clickTagFilter('${t}', event)" class="cursor-pointer px-2 py-0.5 bg-wellness-lavender/10 border border-wellness-lavender/20 rounded-md text-[10px] font-bold text-wellness-lavender hover:bg-wellness-lavender/20 transition-all">興趣:${t}</span>`).join('');
                const tagsHtml = `<div class="flex flex-wrap gap-1">${lifeTags}${stateTags}${interestTags}</div>`;

                // 換成直接將文字、圖示與百分比標記在雷達圖端點上的超直觀大雷達圖 (極省空間且效能最優)
                const driveHtml = `
                    <div class="flex justify-center items-center py-1 select-none">
                        ${generateMiniRadarSvg(client.drives)}
                    </div>
                `;

                // 組合 Table Rows，並支援整列點擊跳出 Modal
                const tr = document.createElement('tr');
                tr.className = "hover:bg-wellness-bg/40 border-b border-wellness-border/30 cursor-pointer transition-all last:border-0";
                tr.onclick = () => openClientDetailModal(client.id);
                
                tr.innerHTML = `
                    <td class="px-4 py-3 font-bold text-wellness-textMain font-mono whitespace-nowrap">${client.id}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <span class="font-bold text-sm text-wellness-textMain">${client.name}</span>
                        <span class="text-[10px] text-wellness-textSub ml-1.5 font-bold">(${client.gender}, ${client.age}歲)</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <div class="flex items-center space-x-1.5">${bodyBadge}${mindBadge}</div>
                    </td>
                    <td class="px-4 py-3">${driveHtml}</td>
                    <td class="px-4 py-3">${tagsHtml || '<span class="text-wellness-textSub/50 italic whitespace-nowrap">無</span>'}</td>
                    <td class="px-4 py-3 text-[10px] text-wellness-textSub font-semibold whitespace-nowrap">${client.lastActive}</td>
                    <td class="px-4 py-3 text-center whitespace-nowrap" onclick="event.stopPropagation()">
                        <button onclick="openClientDetailModal('${client.id}')" class="px-3 py-1.5 bg-wellness-bg hover:bg-wellness-border text-wellness-accent font-bold text-[10px] rounded-lg transition-all border border-wellness-border shadow-xs whitespace-nowrap">
                            <i data-lucide="eye" class="w-3.5 h-3.5 inline mr-1"></i>查看
                        </button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
            safeCreateIcons();
        }

        // 搜尋與排序欄位處理
        function handleSearchSort() {
            currentSearchQuery = document.getElementById('crmSearchInput').value;
            currentSortField = document.getElementById('crmSortSelect').value;
            renderClientTable();
        }

        // 點擊標籤進行篩選
        function clickTagFilter(tag, event) {
            if (event) event.stopPropagation(); // 阻止整列點擊 Modal 的冒泡
            document.getElementById('crmSearchInput').value = tag;
            currentSearchQuery = tag;
            currentFilterTag = 'all'; // 清除分類按鈕過濾，直接以搜尋欄搜尋標籤
            renderClientTable();
        }

        // 分類過濾按鈕
        function filterTag(tag) {
            currentFilterTag = tag;
            renderClientTable();
        }

        // 系統分頁切換
        function switchTab(tabId) {
            ['crm', 'nlp', 'matching', 'incentive', 'analytics', 'voice', 'stats'].forEach(t => {
                const view = document.getElementById(`view-${t}`);
                if (view) view.classList.add('hidden');
                const btn = document.getElementById(`tab-${t}`);
                if (btn) btn.className = "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all font-medium text-sm text-wellness-textSub hover:bg-wellness-bg hover:text-wellness-textMain";
            });

            const targetView = document.getElementById(`view-${tabId}`);
            if (targetView) targetView.classList.remove('hidden');
            
            const activeBtn = document.getElementById(`tab-${tabId}`);
            if (activeBtn) {
                if (['crm', 'nlp', 'voice', 'stats'].includes(tabId)) {
                    activeBtn.className = "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all font-medium text-sm bg-gradient-to-r from-wellness-accent via-[#DB9DB8] to-wellness-lavender text-white shadow-md shadow-wellness-accent/20 font-semibold";
                } else if (tabId === 'matching') {
                    activeBtn.className = "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all font-medium text-sm bg-gradient-to-r from-wellness-sun via-[#E3A39A] to-wellness-accent text-white shadow-md shadow-wellness-sun/20 font-semibold";
                } else {
                    activeBtn.className = "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all font-medium text-sm bg-gradient-to-r from-wellness-textSub/20 to-wellness-textSub/10 text-wellness-textMain border border-wellness-border shadow-sm font-semibold";
                }
            }

            if (tabId === 'stats') {
                updateStatsDashboard();
            }
            if (tabId === 'voice') {
                populateVoiceClientSelect();
            }
            if (tabId === 'nlp') {
                populateNlpClientSelect();
            }
            if (tabId === 'analytics') {
                setTimeout(initCharts, 50);
            }
            if (tabId === 'incentive') {
                initQValueCalculator();
            }
        }

        // 租戶系統選擇器切換
        function switchSystemMode(val) {
            const title = document.getElementById('sysTitle');
            const subTitle = document.getElementById('sysSubTitle');
            const menuSaaS = document.getElementById('menuSaaS');
            const menuPlatform = document.getElementById('menuPlatform');

            const tenantTitle = document.getElementById('tenantTitle');
            const tenantBadge = document.getElementById('tenantBadge');
            const tenantTypeLabel = document.getElementById('tenantTypeLabel');
            const statLabel1 = document.getElementById('statLabel1');
            const statLabel2 = document.getElementById('statLabel2');
            const clientCount = document.getElementById('clientCount');
            const refCount = document.getElementById('referralCount');

            if (val === 'PLATFORM') {
                title.innerText = "健管師跨店媒合平台";
                subTitle.innerText = "大盤統計端 / 跨 B 端連線管理";
                menuSaaS.classList.add('hidden');
                menuPlatform.classList.remove('hidden');
                menuPlatform.classList.add('flex');

                tenantTypeLabel.innerText = "大盤系統統計租戶";
                tenantBadge.innerText = "統計中心";
                tenantTitle.innerText = "全台健管媒合與 BI 統計";
                statLabel1.innerHTML = `<i data-lucide="network" class="w-3.5 h-3.5"></i><span>連線 B 端總數</span>`; 
                clientCount.innerText = "1,428";
                statLabel2.innerHTML = `<i data-lucide="award" class="w-3.5 h-3.5 text-wellness-accent"></i><span>總媒合成功</span>`; 
                refCount.innerText = "8.5k";

                switchTab('matching');
            } else {
                title.innerText = "AI CRM 健管師個案中心";
                subTitle.innerText = "B1源點身心靈 / B2暖光苑 / B3綠野健管 連接埠";
                menuPlatform.classList.add('hidden');
                menuSaaS.classList.remove('hidden');
                menuSaaS.classList.add('flex');

                tenantTypeLabel.innerText = "個案系統所屬租戶";
                statLabel1.innerHTML = `<i data-lucide="users" class="w-3.5 h-3.5"></i><span>個案總人數</span>`;
                statLabel2.innerHTML = `<i data-lucide="sparkles" class="w-3.5 h-3.5 text-wellness-accent"></i><span>今日轉介數</span>`;

                if (val === 'B1') {
                    tenantTitle.innerText = "源點身心靈管理中心"; 
                    tenantBadge.innerText = "B1 源點身心靈"; 
                    clientCount.innerText = clientsData.length.toString(); 
                    refCount.innerText = "1";
                } else if (val === 'B2') {
                    tenantTitle.innerText = "暖光苑身心管理據點"; 
                    tenantBadge.innerText = "B2 暖光苑"; 
                    clientCount.innerText = "45"; 
                    refCount.innerText = "8";
                } else if (val === 'B3') {
                    tenantTitle.innerText = "綠野健管個人工作室"; 
                    tenantBadge.innerText = "B3 綠野工作室"; 
                    clientCount.innerText = "12"; 
                    refCount.innerText = "3";
                }

                switchTab('crm');
                renderClientTable();
            }
            safeCreateIcons();
        }

        // 個案詳情彈窗 Modal 控制
        function openClientDetailModal(clientId) {
            const client = clientsData.find(c => c.id === clientId);
            if (!client) return;

            document.getElementById('modalClientAvatar').innerText = client.name.charAt(0);
            document.getElementById('modalClientName').innerHTML = `${client.name} <span class="text-xs text-wellness-textSub">(${client.gender}, ${client.age}歲)</span>`;
            document.getElementById('modalClientId').innerText = `個案 ID: ${client.id} | 最近活動: ${client.lastActive}`;
            
            // 燈號渲染
            const bodyLight = getStatusBadge('body', client.bodyStatus, client.bodyNote);
            const mindLight = getStatusBadge('mind', client.mindStatus, client.mindNote);
            document.getElementById('modalBodyStatus').innerHTML = bodyLight;
            document.getElementById('modalMindStatus').innerHTML = mindLight;

            // 動力進度條
            const drivesContainer = document.getElementById('modalDrivesContainer');
            drivesContainer.innerHTML = `
                <div class="flex items-center justify-between space-x-2">
                    <span class="w-16 font-bold text-wellness-textSub">❤️ 健康動力</span>
                    <div class="flex-1 bg-wellness-bg rounded-full h-2"><div class="bg-wellness-accent h-2 rounded-full" style="width: ${client.drives.health * 100}%"></div></div>
                    <span class="w-8 text-right font-extrabold text-wellness-textSub">${Math.round(client.drives.health * 100)}%</span>
                </div>
                <div class="flex items-center justify-between space-x-2">
                    <span class="w-16 font-bold text-wellness-textSub">🪙 財富動力</span>
                    <div class="flex-1 bg-wellness-bg rounded-full h-2"><div class="bg-wellness-sun h-2 rounded-full" style="width: ${client.drives.wealth * 100}%"></div></div>
                    <span class="w-8 text-right font-extrabold text-wellness-textSub">${Math.round(client.drives.wealth * 100)}%</span>
                </div>
                <div class="flex items-center justify-between space-x-2">
                    <span class="w-16 font-bold text-wellness-textSub">🌸 感情動力</span>
                    <div class="flex-1 bg-wellness-bg rounded-full h-2"><div class="bg-wellness-lavender h-2 rounded-full" style="width: ${client.drives.emotion * 100}%"></div></div>
                    <span class="w-8 text-right font-extrabold text-wellness-textSub">${Math.round(client.drives.emotion * 100)}%</span>
                </div>
                <div class="flex items-center justify-between space-x-2">
                    <span class="w-16 font-bold text-wellness-textSub">🏡 家庭動力</span>
                    <div class="flex-1 bg-wellness-bg rounded-full h-2"><div class="bg-[#79A0C1] h-2 rounded-full" style="width: ${client.drives.family * 100}%"></div></div>
                    <span class="w-8 text-right font-extrabold text-wellness-textSub">${Math.round(client.drives.family * 100)}%</span>
                </div>
                <div class="flex items-center justify-between space-x-2">
                    <span class="w-16 font-bold text-wellness-textSub">💼 事業動力</span>
                    <div class="flex-1 bg-wellness-bg rounded-full h-2"><div class="bg-wellness-mint h-2 rounded-full" style="width: ${client.drives.career * 100}%"></div></div>
                    <span class="w-8 text-right font-extrabold text-wellness-textSub">${Math.round(client.drives.career * 100)}%</span>
                </div>
            `;

            // 標籤
            const tagsContainer = document.getElementById('modalTagsContainer');
            tagsContainer.innerHTML = '';
            client.tags.life.forEach(t => {
                tagsContainer.innerHTML += `<span class="px-2.5 py-1 bg-wellness-mint/10 text-wellness-mint border border-wellness-mint/20 rounded-xl text-[11px] font-bold shadow-xs">生活:${t}</span>`;
            });
            client.tags.state.forEach(t => {
                tagsContainer.innerHTML += `<span class="px-2.5 py-1 bg-wellness-accent/10 text-wellness-accent border border-wellness-accent/20 rounded-xl text-[11px] font-bold shadow-xs">狀態:${t}</span>`;
            });
            client.tags.interest.forEach(t => {
                tagsContainer.innerHTML += `<span class="px-2.5 py-1 bg-wellness-lavender/10 text-wellness-lavender border border-wellness-lavender/20 rounded-xl text-[11px] font-bold shadow-xs">興趣:${t}</span>`;
            });

                        // 結合 WellnessDiagnosisDB 模組，動態生成與更新處方
            if (window.WellnessDiagnosisDB) {
                client.prescription = window.WellnessDiagnosisDB.generatePrescription(client.drives, client.bodyStatus, client.mindStatus);
            }
            
                        // 結合 WellnessDiagnosisDB 模組，動態生成與更新處方
            if (window.WellnessDiagnosisDB) {
                client.prescription = window.WellnessDiagnosisDB.generatePrescription(client.drives, client.bodyStatus, client.mindStatus);
            }
            
            // 主訴與處方
            document.getElementById('modalHistoryContent').innerText = client.history || '尚無主訴備註。';
            document.getElementById('modalPrescriptionContent').innerText = client.prescription || '尚無健康處方。';

            // 存儲目前 Modal 所屬的 ClientName，用於推送通知
            window.currentModalClientName = client.name;

            const modal = document.getElementById('clientDetailModal');
            modal.classList.remove('hidden');
            safeCreateIcons();
        }

        function closeClientDetailModal() {
            document.getElementById('clientDetailModal').classList.add('hidden');
        }

        function triggerPushFromModal() {
            const name = window.currentModalClientName || '此個案';
            alert(`已成功將 AI 招生處方與健康改善建議推送至 ${name} 的 LINE OA！`);
            closeClientDetailModal();
        }

        // LINE OA 模擬傳送對話
        function sendLineMessage() {
            const input = document.getElementById('lineInput');
            const history = document.getElementById('chatHistory');
            if (!input.value.trim()) return;

            // 顯示使用者對話
            history.innerHTML += `
                <div class="flex items-start justify-end space-x-2">
                    <div class="bg-gradient-to-r from-wellness-accent via-[#DC91B6] to-wellness-lavender text-white p-3.5 rounded-2xl rounded-tr-none max-w-[80%] text-xs leading-relaxed shadow-md font-medium">${input.value}</div>
                    <div class="w-8 h-8 rounded-full bg-wellness-textSub flex items-center justify-center text-xs font-bold text-white shadow shrink-0">個案</div>
                </div>
            `;
            
            const userText = input.value;
            document.getElementById('nlpSourceText').innerText = `"${userText}"`;
            
            // 進行快速意圖分析與標籤提取
            let isInsomnia = userText.includes('睡') || userText.includes('驚醒');
            let isFatigue = userText.includes('疲勞') || userText.includes('體力');
            
            if (isInsomnia && isFatigue) {
                document.getElementById('nlpIntention').innerText = "身體：紅燈 (睡眠與精神損耗)";
                document.getElementById('nlpStress').innerText = "心理：黃燈 (驚醒焦慮)";
                document.getElementById('nlpPhysical').innerText = "睡眠不足, 疲勞";
            } else if (isInsomnia) {
                document.getElementById('nlpIntention').innerText = "身體：黃燈 (輕度失眠)";
                document.getElementById('nlpStress').innerText = "心理：黃燈 (情緒緊繃)";
                document.getElementById('nlpPhysical').innerText = "睡眠不足";
            } else {
                document.getElementById('nlpIntention').innerText = "身體：黃燈 (體力衰退)";
                document.getElementById('nlpStress').innerText = "心理：綠燈 (平穩)";
                document.getElementById('nlpPhysical').innerText = "疲勞";
            }

            input.value = '';
            history.scrollTop = history.scrollHeight;
        }

                // LINE OA NLP 模擬對話分析結果暫存
        let lastNlpResult = {
            bodyStatus: 'red',
            bodyNote: '睡眠障礙',
            mindStatus: 'yellow',
            mindNote: '焦慮驚醒',
            tags: ['睡眠不足', '疲勞']
        };

        function populateNlpClientSelect() {
            const select = document.getElementById('nlpClientSelect');
            if (!select) return;
            select.innerHTML = '';
            clientsData.forEach(c => {
                select.innerHTML += `<option value="${c.id}">${c.id} - ${c.name} (${c.age}歲)</option>`;
            });
        }

        function saveNlpTags() {
            const select = document.getElementById('nlpClientSelect');
            if (!select) return;
            const clientId = select.value;
            const client = clientsData.find(c => c.id === clientId);
            if (!client) {
                alert("找不到對應的個案！");
                return;
            }

            // 更新身心風險燈號與備註
            client.bodyStatus = lastNlpResult.bodyStatus;
            client.bodyNote = lastNlpResult.bodyNote;
            client.mindStatus = lastNlpResult.mindStatus;
            client.mindNote = lastNlpResult.mindNote;
            client.lastActive = '剛同步 LINE 對話';

            // 將解析標籤分類歸檔
            lastNlpResult.tags.forEach(t => {
                if (t === '睡眠不足' || t === '水分不足' || t === '日常久坐' || t === '飲食清淡' || t === '運動習慣' || t === '睡眠充足' || t === '太極運動' || t === '健走習慣') {
                    if (!client.tags.life.includes(t)) client.tags.life.push(t);
                } else if (t === '焦慮不振' || t === '失眠困擾' || t === '輕度焦慮' || t === '高血壓' || t === '健康良好' || t === '關節痠痛') {
                    if (!client.tags.state.includes(t)) client.tags.state.push(t);
                } else {
                    if (!client.tags.interest.includes(t)) client.tags.interest.push(t);
                }
            });

            // 動態更新該個案之招生處方 (調用 WellnessDiagnosisDB 模組)
            if (window.WellnessDiagnosisDB) {
                client.prescription = window.WellnessDiagnosisDB.generatePrescription(client.drives, client.bodyStatus, client.mindStatus);
            }

            // 標記為待同步
            dirtyClients[clientId] = true;

            // 重新渲染表格與更新 Dashboard
            renderClientTable();
            updateStatsDashboard();

            alert(`同步成功！已將 LINE OA 對話分析結果（${lastNlpResult.bodyNote}、標籤：${lastNlpResult.tags.join(', ')}）同步至個案 ${client.name} (${clientId}) 之 CRM 檔案中。`);
            switchTab('crm');
        }

        // --- ASR 雙軌錄音與診斷邏輯 ---
        let isRecording = false;
        let mediaRecorder = null;
        let audioChunks = [];
        let recordedAudioBlob = null;
        let recognition = null;
        let recordingTimerInterval = null;
        let recordDuration = 0;

        let lastAnalyzedLight = 'green';
        let lastAnalyzedNote = '良好';
        let lastAnalyzedDrives = { health: 0.5, wealth: 0.5, emotion: 0.5, family: 0.5, career: 0.5 };
        let analyzedLifeTags = [];
        let analyzedStateTags = [];
        let analyzedInterestTags = [];

        function populateVoiceClientSelect() {
            const select = document.getElementById('voiceClientSelect');
            if (!select) return;
            select.innerHTML = '';
            clientsData.forEach(c => {
                select.innerHTML += `<option value="${c.id}">${c.id} - ${c.name} (${c.age}歲)</option>`;
            });
        }

        function copyVoiceDemoText() {
            const demoText = "個案 C001 近期睡眠品質極差，每晚睡眠少於4小時。同時伴隨關節痠痛、頭暈等不適主訴。患者常擔心退休積蓄不敷使用，心理壓力指數高，出現情緒焦慮。建議進行432Hz音療冥想...";
            document.getElementById('voiceInput').value = demoText;
            document.getElementById('asrMethodLabel').innerHTML = `<i data-lucide="cpu" class="w-3.5 h-3.5 text-wellness-mint"></i><span>目前狀態：已複製範例文字</span>`;
            safeCreateIcons();
        }

        function toggleRecording() {
            if (!isRecording) {
                startRecording();
            } else {
                stopRecording();
            }
        }

        function startRecording() {
            audioChunks = [];
            recordedAudioBlob = null;
            recordDuration = 0;

            const recordingWave = document.getElementById('recordingWave');
            if (recordingWave) recordingWave.classList.remove('hidden');

            const recordBtn = document.getElementById('recordBtn');
            const recordIcon = document.getElementById('recordIcon');
            const recordStatus = document.getElementById('recordStatus');
            const recordTimer = document.getElementById('recordTimer');

            recordBtn.className = "w-16 h-16 rounded-full bg-gradient-to-tr from-[#D96B64] to-[#DB9DB8] hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-lg shadow-[#D96B64]/30 transition-all z-10 relative animate-pulse";
            recordIcon.setAttribute('data-lucide', 'square');
            recordStatus.innerText = "錄音中，請健管師口述...";
            recordTimer.classList.remove('hidden');
            recordTimer.innerText = "錄音時間: 00:00 / 00:15";
            safeCreateIcons();

            // 計時器 (最大 15 秒限制)
            recordingTimerInterval = setInterval(() => {
                recordDuration++;
                const secStr = recordDuration.toString().padStart(2, '0');
                recordTimer.innerText = `錄音時間: 00:${secStr} / 00:15`;
                if (recordDuration >= 15) {
                    stopRecording();
                }
            }, 1000);

            // 軌道 1：HTML5 原生隨說隨顯 Web Speech API (不需後端)
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'zh-TW';
                
                document.getElementById('voiceInput').value = '';

                recognition.onresult = (event) => {
                    let resultText = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        resultText += event.results[i][0].transcript;
                    }
                    document.getElementById('voiceInput').value = resultText;
                    document.getElementById('asrMethodLabel').innerHTML = `<i data-lucide="cpu" class="w-3.5 h-3.5 text-wellness-mint animate-pulse"></i><span>辨識模式：原生隨說隨顯 ASR</span>`;
                    safeCreateIcons();
                };

                recognition.onerror = (e) => {
                    console.warn("Speech recognition error", e.error);
                };

                recognition.start();
            } else {
                console.warn("本瀏覽器不支援 Web Speech API，將僅進行音訊錄製並仰賴 Whisper API 辨識");
                document.getElementById('asrMethodLabel').innerHTML = `<i data-lucide="cpu" class="w-3.5 h-3.5 text-wellness-sun"></i><span>辨識模式：僅錄音，等待 API 轉寫</span>`;
                safeCreateIcons();
            }

            // 軌道 2：錄製 WAV 音訊 Blob 以供後端 Whisper API 解析
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = (e) => {
                        if (e.data.size > 0) {
                            audioChunks.push(e.data);
                        }
                    };

                    mediaRecorder.onstop = () => {
                        recordedAudioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        // 啟用 Whisper 備援按鈕
                        const fallbackBtn = document.getElementById('whisperFallbackBtn');
                        fallbackBtn.disabled = false;
                        fallbackBtn.className = "px-3 py-1.5 rounded-lg bg-wellness-bg hover:bg-wellness-border text-wellness-textSub border border-wellness-border transition-all flex items-center space-x-1 cursor-pointer";
                        
                        // 釋放麥克風
                        stream.getTracks().forEach(track => track.stop());
                    };

                    mediaRecorder.start();
                    isRecording = true;
                })
                .catch(err => {
                    console.error("無法存取麥克風", err);
                    alert("無法存取麥克風，請檢查權限設定！");
                    stopRecordingUI();
                });
        }

        function stopRecording() {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
            }
            if (recognition) {
                recognition.stop();
            }
            stopRecordingUI();
        }

        function stopRecordingUI() {
            clearInterval(recordingTimerInterval);
            const recordingWave = document.getElementById('recordingWave');
            if (recordingWave) recordingWave.classList.add('hidden');

            const recordBtn = document.getElementById('recordBtn');
            const recordIcon = document.getElementById('recordIcon');
            const recordStatus = document.getElementById('recordStatus');
            const recordTimer = document.getElementById('recordTimer');

            recordBtn.className = "w-16 h-16 rounded-full bg-gradient-to-tr from-wellness-accent to-wellness-lavender hover:scale-105 active:scale-95 flex items-center justify-center text-white shadow-lg shadow-wellness-accent/30 transition-all z-10 relative";
            recordIcon.setAttribute('data-lucide', 'mic');
            recordStatus.innerText = "錄音完成！可點擊 Whisper 進行二次辨識，或直接點擊啟動診斷";
            recordTimer.classList.add('hidden');
            isRecording = false;
            safeCreateIcons();
        }

        // 呼叫後端 /api/whisper-asr 進行高精度轉寫
        async function triggerWhisperFallback() {
            if (!recordedAudioBlob) {
                alert("無錄音檔案！");
                return;
            }

            const fallbackBtn = document.getElementById('whisperFallbackBtn');
            const originalHtml = fallbackBtn.innerHTML;
            fallbackBtn.disabled = true;
            fallbackBtn.innerHTML = `<i data-lucide="refresh-cw" class="w-3 h-3 animate-spin"></i><span>轉寫中...</span>`;
            safeCreateIcons();

            const formData = new FormData();
            formData.append('file', recordedAudioBlob, 'voice_record.wav');

            const apiBase = (window.location.protocol.startsWith('http')) ? '' : 'http://127.0.0.1:7860';
            const apiUrl = `${apiBase}/api/whisper-asr`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error(`HTTP 錯誤狀態: ${response.status}`);

                const resData = await response.json();
                if (resData.status === 'success') {
                    document.getElementById('voiceInput').value = resData.text;
                    document.getElementById('asrMethodLabel').innerHTML = `<i data-lucide="cpu" class="w-3.5 h-3.5 text-wellness-mint"></i><span>辨識模式：Whisper API 轉寫完成</span>`;
                    safeCreateIcons();
                    alert("高精準度 Whisper 轉寫成功！");
                } else {
                    throw new Error(resData.message || '轉寫失敗');
                }
            } catch (err) {
                console.error("Whisper API 轉寫失敗:", err);
                alert("Whisper API 轉寫失敗，已保留原有 Web Speech ASR 結果！");
            } finally {
                fallbackBtn.disabled = false;
                fallbackBtn.innerHTML = originalHtml;
                safeCreateIcons();
            }
        }

        // 呼叫後端 /api/consult 進行 AI 類神經分析診斷
        async function analyzeVoiceText() {
            const text = document.getElementById('voiceInput').value.trim();
            if (!text) {
                alert("請先輸入或口述個案主訴！");
                return;
            }

            const analyzeBtn = document.getElementById('analyzeBtn');
            const originalHtml = analyzeBtn.innerHTML;
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = `<i data-lucide="refresh-cw" class="w-5 h-5 animate-spin"></i><span>類神經分析中...</span>`;
            safeCreateIcons();

            const apiBase = (window.location.protocol.startsWith('http')) ? '' : 'http://127.0.0.1:7860';
            const apiUrl = `${apiBase}/api/consult`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: text })
                });

                if (!response.ok) throw new Error(`HTTP 錯誤狀態: ${response.status}`);

                const resData = await response.json();
                if (resData.status === 'success') {
                    parseConsultResult(resData.result, resData.drives);
                } else {
                    throw new Error(resData.message || '診斷失敗');
                }
            } catch (err) {
                console.warn("後端 API 連線失敗，啟動本地類神經權重降級模擬器！", err);
                simulateLocalConsult(text);
            } finally {
                analyzeBtn.disabled = false;
                analyzeBtn.innerHTML = originalHtml;
                safeCreateIcons();
            }
        }

        // 解析並渲染診斷結果 (支持優先對齊 API 傳回的 drives 權重)
        function parseConsultResult(resultText, apiDrives) {
            const lines = resultText.split('\n');

            // 1. 解析燈號與診斷結論
            let diagLightText = '綠燈 - 良好';
            let diagAdviceText = '身心無明顯異常主訴，保持目前的日常作息與運動即可。';
            
            for (let line of lines) {
                if (line.includes('診斷結論：') || line.includes('診斷結論:')) {
                    diagLightText = line.split(/：|:/)[1].trim();
                }
                if (line.includes('建議：') || line.includes('建議:') || line.includes('健康建議:')) {
                    diagAdviceText = line.split(/：|:/)[1].trim();
                }
            }

            // 更新 UI 顯示
            lastAnalyzedLight = diagLightText.includes('紅') ? 'red' : (diagLightText.includes('黃') ? 'yellow' : 'green');
            lastAnalyzedNote = diagLightText.replace(/紅燈|黃燈|綠燈|\s|-/g, '');

            const lightBadge = getStatusBadge('mind', lastAnalyzedLight, lastAnalyzedNote);
            document.getElementById('voiceDiagLight').innerHTML = `AI 分析結論：${lightBadge}`;
            document.getElementById('voiceDiagAdvice').innerText = diagAdviceText;

            // 2. 標籤分析
            analyzedLifeTags = [];
            analyzedStateTags = [];
            analyzedInterestTags = [];

            const textLower = resultText.toLowerCase();
            if (textLower.includes('睡眠不足') || textLower.includes('少於') || textLower.includes('睡不好')) {
                analyzedLifeTags.push('睡眠不足');
            }
            if (textLower.includes('水分') || textLower.includes('溫水') || textLower.includes('飲水')) {
                analyzedLifeTags.push('水分不足');
            }
            if (textLower.includes('運動') || textLower.includes('散步') || textLower.includes('快走')) {
                analyzedLifeTags.push('運動習慣');
            }
            if (textLower.includes('焦慮') || textLower.includes('煩躁') || textLower.includes('心理壓力')) {
                analyzedStateTags.push('焦慮不振');
            }
            if (textLower.includes('關節') || textLower.includes('痠痛') || textLower.includes('胸口悶')) {
                analyzedStateTags.push('生理不適');
            }
            if (textLower.includes('音療') || textLower.includes('頌缽')) {
                analyzedInterestTags.push('音療學習');
            }

            // 3. 人生動力分數 (優先對齊 API 傳回的 drives)
            let drives = { health: 0.5, wealth: 0.5, emotion: 0.5, family: 0.5, career: 0.5 };
            if (apiDrives && typeof apiDrives === 'object') {
                drives = { ...apiDrives };
            } else {
                // 備援：若無 API drives，則從 Markdown 報告中 regex 提取
                try {
                    let h_match = resultText.match(/健康動力 \(health\):\s*(\d+)%/);
                    let w_match = resultText.match(/財富動力 \(wealth\):\s*(\d+)%/);
                    let e_match = resultText.match(/感情動力 \(emotion\):\s*(\d+)%/);
                    let f_match = resultText.match(/家庭動力 \(family\):\s*(\d+)%/);
                    let c_match = resultText.match(/事業動力 \(career\):\s*(\d+)%/);
                    if (h_match) drives.health = parseFloat(h_match.group(1)) / 100.0;
                    if (w_match) drives.wealth = parseFloat(w_match.group(1)) / 100.0;
                    if (e_match) drives.emotion = parseFloat(e_match.group(1)) / 100.0;
                    if (f_match) drives.family = parseFloat(f_match.group(1)) / 100.0;
                    if (c_match) drives.career = parseFloat(c_match.group(1)) / 100.0;
                } catch (parseErr) {
                    console.error("Regex parsing drives failed:", parseErr);
                }
            }

            lastAnalyzedDrives = drives;

            // 更新動力 Bar UI
            ['health', 'wealth', 'emotion', 'family', 'career'].forEach(d => {
                const bar = document.getElementById(`driveBar-${d}`);
                const val = document.getElementById(`driveVal-${d}`);
                if (bar && val) {
                    const pct = Math.round(drives[d] * 100);
                    bar.style.width = `${pct}%`;
                    val.innerText = `${pct}%`;
                }
            });

            // 4. 渲染提取之標籤
            const tagsContainer = document.getElementById('voiceDiagTags');
            tagsContainer.innerHTML = '';
            
            analyzedLifeTags.forEach(t => tagsContainer.innerHTML += `<span class="px-2 py-0.5 bg-wellness-mint/10 border border-wellness-mint/20 text-wellness-mint rounded-lg text-[10px] font-bold">生活:${t}</span>`);
            analyzedStateTags.forEach(t => tagsContainer.innerHTML += `<span class="px-2 py-0.5 bg-wellness-accent/10 border border-wellness-accent/20 text-wellness-accent rounded-lg text-[10px] font-bold">狀態:${t}</span>`);
            analyzedInterestTags.forEach(t => tagsContainer.innerHTML += `<span class="px-2 py-0.5 bg-wellness-lavender/10 border border-wellness-lavender/20 text-wellness-lavender rounded-lg text-[10px] font-bold">興趣:${t}</span>`);
            
            if (tagsContainer.innerHTML === '') {
                tagsContainer.innerHTML = '<span class="text-xs text-wellness-textSub/50 italic">無</span>';
            }

            // 5. 渲染招生處方
            let inPrescriptionSection = false;
            let prescriptions = [];
            for (let line of lines) {
                if (line.includes('=== 【3】') || line.includes('招生處方')) {
                    inPrescriptionSection = true;
                    continue;
                }
                if (line.startsWith('===') && inPrescriptionSection) {
                    inPrescriptionSection = false;
                }
                if (inPrescriptionSection && line.trim() && !line.includes('===') && !line.includes('建議')) {
                    prescriptions.push(line.trim());
                }
            }

            const presContainer = document.getElementById('voiceDiagPrescription');
            if (prescriptions.length > 0) {
                presContainer.innerHTML = prescriptions.map(p => `
                    <div class="flex items-center space-x-2 py-1.5 border-b border-wellness-border/30 last:border-0">
                        <span class="h-1.5 w-1.5 rounded-full bg-wellness-lavender"></span>
                        <span>${p}</span>
                    </div>
                `).join('');
            } else {
                presContainer.innerHTML = `
                    <div class="flex items-center space-x-2 py-1.5 border-b border-wellness-border/30">
                        <span class="h-1.5 w-1.5 rounded-full bg-wellness-lavender"></span>
                        <span>1. 安排 432Hz 頌缽音療課程放鬆神經 (評估契合度: 92%)</span>
                    </div>
                    <div class="flex items-center space-x-2 py-1.5">
                        <span class="h-1.5 w-1.5 rounded-full bg-wellness-mint"></span>
                        <span>2. 每日補充 1500ml 溫水並進行戶外散步 30 分鐘 (評估契合度: 85%)</span>
                    </div>`;
            }

            // 啟用同步按鈕
            const saveBtn = document.getElementById('saveToCrmBtn');
            saveBtn.disabled = false;
            saveBtn.className = "w-full py-4 bg-gradient-to-r from-wellness-accent to-wellness-lavender text-white font-bold text-xs rounded-2xl shadow-md shadow-wellness-accent/20 hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 font-semibold cursor-pointer";
            safeCreateIcons();
        }

        // 本地降級模擬器 (對齊類神經 drives 格式與 === 【4】區段)
        function simulateLocalConsult(text) {
            let hVal = 80, wVal = 40, eVal = 60, fVal = 50, cVal = 70;

            if (text.includes('睡眠不足') || text.includes('少於') || text.includes('睡不好')) {
                hVal = 35; eVal = 40;
            }
            if (text.includes('焦慮') || text.includes('煩躁') || text.includes('壓力')) {
                eVal = 20; fVal = 30;
            }
            if (text.includes('退') || text.includes('積蓄') || text.includes('收入')) {
                wVal = 25;
            }

            const simulatedDrives = {
                health: hVal / 100.0,
                wealth: wVal / 100.0,
                emotion: eVal / 100.0,
                family: fVal / 100.0,
                career: cVal / 100.0
            };

            const simulatedMd = `
=== 【1】身心診斷與綜合分析報告 ===
診斷結論：身心燈號轉呈紅燈 - 嚴重焦慮與睡眠中斷
建議: 建議健管師增加關懷拜訪頻率，並引導個案參與社群音療活動以紓緩精神壓力。

=== 【2】28維情緒神經網路特徵映射推論 ===
焦慮指數: 85.2% | 疲憊指數: 72%

=== 【3】AI 推薦健康招生處方 ===
1. 安排 432Hz 頌缽音療課程放鬆神經 (評估契合度: 92%)
2. 每日補充 1500ml 溫水並進行戶外散步 30 分鐘 (評估契合度: 85%)

=== 【4】類神經網路全人動力解構 ===
健康動力 (health): ${hVal}%
財富動力 (wealth): ${wVal}%
感情動力 (emotion): ${eVal}%
家庭動力 (family): ${fVal}%
事業動力 (career): ${cVal}%
`;
            parseConsultResult(simulatedMd, simulatedDrives);
        }

        // 保存語音診斷結果至 CRM
        function saveVoiceToCrm() {
            const clientId = document.getElementById('voiceClientSelect').value;
            const clientIndex = clientsData.findIndex(c => c.id === clientId);
            if (clientIndex === -1) {
                alert("找不到此個案！");
                return;
            }

            // 更新身心燈號與備註
            clientsData[clientIndex].bodyStatus = lastAnalyzedLight;
            clientsData[clientIndex].bodyNote = lastAnalyzedLight === 'red' ? '睡眠與體能不適' : '良好';
            clientsData[clientIndex].mindStatus = lastAnalyzedLight;
            clientsData[clientIndex].mindNote = lastAnalyzedNote;
            
            // 合併標籤
            clientsData[clientIndex].tags.life = Array.from(new Set([...clientsData[clientIndex].tags.life, ...analyzedLifeTags]));
            clientsData[clientIndex].tags.state = Array.from(new Set([...clientsData[clientIndex].tags.state, ...analyzedStateTags]));
            clientsData[clientIndex].tags.interest = Array.from(new Set([...clientsData[clientIndex].tags.interest, ...analyzedInterestTags]));
            
            // 更新動力分數
            clientsData[clientIndex].drives = { ...lastAnalyzedDrives };
            clientsData[clientIndex].lastActive = '剛完成語音口述診斷';

            // 更新主訴備註與處方歷史
            const textVal = document.getElementById('voiceInput').value;
            clientsData[clientIndex].history = `[語音記錄] ${textVal}`;
            
                        // 動態更新該個案之招生處方 (調用 WellnessDiagnosisDB 模組)
            if (window.WellnessDiagnosisDB) {
                clientsData[clientIndex].prescription = window.WellnessDiagnosisDB.generatePrescription(clientsData[clientIndex].drives, clientsData[clientIndex].bodyStatus, clientsData[clientIndex].mindStatus);
            } else {
                const presContainer = document.getElementById('voiceDiagPrescription');
                clientsData[clientIndex].prescription = presContainer.innerText;
            }

            // 標記為待回寫至 Sheets (Dirty)
            dirtyClients[clientId] = true;
            saveClientsToStorage();

            alert(`成功！語音診斷與最新的五核心人生動力已經更新至個案 ${clientsData[clientIndex].name} 的 CRM 檔案中。`);
            
            renderClientTable();
            switchTab('crm');
        }

        // --- Google Sheets 雙向同步整合與統計編修分析 ---
        async function syncWithGoogleSheet() {
            const sheetId = document.getElementById('sheetIdInput').value.trim();
            if (!sheetId) {
                alert("請輸入有效的 Google 試算表 ID！");
                return;
            }

            const syncBtn = document.getElementById('syncBtn');
            const originalText = syncBtn.innerHTML;
            syncBtn.innerHTML = `<i data-lucide="refresh-cw" class="w-3.5 h-3.5 animate-spin"></i><span>同步中...</span>`;
            syncBtn.disabled = true;
            safeCreateIcons();

            // Google Sheet CSV 導出端點
            const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

            try {
                const response = await fetch(csvUrl);
                if (!response.ok) throw new Error("存取 Google Sheets 失敗");
                
                const csvText = await response.text();
                const parsedData = parseCsvToClientsData(csvText);
                
                if (parsedData && parsedData.length > 0) {
                    clientsData = parsedData;
                    dirtyClients = {}; // 同步成功，清除髒數據
                    saveClientsToStorage();
                    renderClientTable();
                    updateSyncIndicator(true, "已成功同步雲端試算表");
                    alert(`成功！已成功從 Google Sheets 載入並同步了 ${parsedData.length} 筆個案身心資料。`);
                } else {
                    throw new Error("CSV 解析格式不符或無有效行");
                }
            } catch (err) {
                console.warn("無法取得真實雲端試算表資料，啟用本地模擬同步機制：", err);
                
                // 本地模擬同步
                setTimeout(() => {
                    const simulatedCsv = getSimulatedSheetsCsv();
                    const parsedData = parseCsvToClientsData(simulatedCsv);
                    if (parsedData) {
                        clientsData = parsedData;
                        dirtyClients = {};
                        saveClientsToStorage();
                        renderClientTable();
                        updateSyncIndicator(true, "模擬同步完成 (離線備援)");
                        alert("已啟動離線備援！成功同步模擬試算表中的 6 筆個案身心資料。");
                    } else {
                        alert("解析 CSV 失敗！");
                    }
                    syncBtn.innerHTML = originalText;
                    syncBtn.disabled = false;
                    safeCreateIcons();
                }, 1000);
                return;
            }

            syncBtn.innerHTML = originalText;
            syncBtn.disabled = false;
            safeCreateIcons();
        }

        function updateSyncIndicator(success, text) {
            const indicator = document.getElementById('syncStatusIndicator');
            if (!indicator) return;

            if (success) {
                indicator.className = "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-wellness-mint/10 text-wellness-mint border border-wellness-mint/20 shadow-xs";
                indicator.innerHTML = `<span class="h-1.5 w-1.5 rounded-full bg-wellness-mint mr-1 animate-pulse"></span><span id="syncStatusText">${text}</span>`;
            } else {
                indicator.className = "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#D96B64]/10 text-[#D96B64] border border-[#D96B64]/20 shadow-xs";
                indicator.innerHTML = `<span class="h-1.5 w-1.5 rounded-full bg-[#D96B64] mr-1"></span><span id="syncStatusText">${text}</span>`;
            }
        }

        // CSV 解析引擎
        function parseCsvToClientsData(csvText) {
            if (!csvText) return null;
            const lines = [];
            let row = [""];
            let inQuotes = false;

            for (let i = 0; i < csvText.length; i++) {
                const c = csvText[i];
                const next = csvText[i+1];
                if (c === '"') {
                    if (inQuotes && next === '"') {
                        row[row.length - 1] += '"';
                        i++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (c === ',' && !inQuotes) {
                    row.push("");
                } else if ((c === '\r' || c === '\n') && !inQuotes) {
                    if (c === '\r' && next === '\n') {
                        i++;
                    }
                    lines.push(row);
                    row = [""];
                } else {
                    row[row.length - 1] += c;
                }
            }
            if (row.length > 1 || row[0] !== "") {
                lines.push(row);
            }

            if (lines.length < 2) return null;

            const headers = lines[0].map(h => h.trim().toLowerCase());
            
            const idxId = headers.indexOf("個案id") !== -1 ? headers.indexOf("個案id") : headers.indexOf("id");
            const idxName = headers.indexOf("姓名");
            const idxAge = headers.indexOf("年齡");
            const idxGender = headers.indexOf("性別");
            const idxLife = headers.indexOf("生活標籤");
            const idxState = headers.indexOf("狀態標籤");
            const idxInterest = headers.indexOf("興趣標籤");
            const idxHealth = headers.indexOf("健康動力");
            const idxWealth = headers.indexOf("財富動力");
            const idxEmotion = headers.indexOf("感情動力");
            const idxFamily = headers.indexOf("家庭動力");
            const idxCareer = headers.indexOf("事業動力");
            const idxBodyL = headers.indexOf("身體狀態");
            const idxBodyN = headers.indexOf("身體備註");
            const idxMindL = headers.indexOf("心理狀態");
            const idxMindN = headers.indexOf("心理備註");

            if (idxId === -1 || idxName === -1) return null;

            const data = [];
            for (let i = 1; i < lines.length; i++) {
                const r = lines[i];
                if (r.length < headers.length || !r[idxId].trim()) continue;

                const parseTags = (str) => {
                    if (!str) return [];
                    return str.split(/[;|]/).map(t => t.trim()).filter(t => t);
                };

                const client = {
                    id: r[idxId].trim(),
                    name: r[idxName].trim(),
                    age: parseInt(r[idxAge]) || 70,
                    gender: r[idxGender] ? r[idxGender].trim() : '男',
                    tags: {
                        life: idxLife !== -1 ? parseTags(r[idxLife]) : [],
                        state: idxState !== -1 ? parseTags(r[idxState]) : [],
                        interest: idxInterest !== -1 ? parseTags(r[idxInterest]) : []
                    },
                    drives: {
                        health: idxHealth !== -1 ? (parseFloat(r[idxHealth]) / 100.0 || 0.5) : 0.5,
                        wealth: idxWealth !== -1 ? (parseFloat(r[idxWealth]) / 100.0 || 0.3) : 0.3,
                        emotion: idxEmotion !== -1 ? (parseFloat(r[idxEmotion]) / 100.0 || 0.5) : 0.5,
                        family: idxFamily !== -1 ? (parseFloat(r[idxFamily]) / 100.0 || 0.5) : 0.5,
                        career: idxCareer !== -1 ? (parseFloat(r[idxCareer]) / 100.0 || 0.2) : 0.2
                    },
                    lastActive: '剛從試算表同步',
                    bodyStatus: idxBodyL !== -1 ? r[idxBodyL].trim() : 'green',
                    bodyNote: idxBodyN !== -1 ? r[idxBodyN].trim() : '正常',
                    mindStatus: idxMindL !== -1 ? r[idxMindL].trim() : 'green',
                    mindNote: idxMindN !== -1 ? r[idxMindN].trim() : '平穩',
                    history: '由試算表同步匯入的個案檔案。',
                    prescription: '建議保持規律作息與身心平衡。'
                };
                data.push(client);
            }
            return data;
        }

        // 模擬同步用 CSV
        function getSimulatedSheetsCsv() {
            return `個案ID,姓名,年齡,性別,生活標籤,狀態標籤,興趣標籤,健康動力,財富動力,感情動力,家庭動力,事業動力,身體狀態,身體備註,心理狀態,心理備註
C001,林大仙,72,男,水分不足;日常久坐,焦慮不振;失眠困擾,音療學習,80,25,85,50,15,red,睡眠小於5h,red,焦慮不振
C002,暖心媽,68,女,運動習慣;睡眠充足,輕度焦慮,香氛療癒,90,35,70,60,40,green,精神良好,yellow,有些掛念
C003,張爺爺,78,男,飲食清淡;健走習慣,高血壓,茶藝品茗,65,45,50,40,30,yellow,血壓偏高,green,心情平穩
C004,快樂阿嬤,75,女,水分不足;睡眠不足,關節痠痛,烘焙手作,50,30,75,55,35,red,關節發炎,green,樂觀開朗
C005,養生達人,71,男,太極運動;睡眠充足,健康良好,園藝種植,85,40,55,60,30,green,體能極佳,green,正念生活
C006,憂鬱伯爵,82,男,水分不足;日常久坐,焦慮不振;失眠困擾,古典音樂,35,20,90,45,15,yellow,體力衰退,red,嚴重焦慮`;
        }

        // --- 📊 BI 雲端試算表統計分析頁面渲染 ---
        function updateStatsDashboard() {
            const total = clientsData.length;
            document.getElementById('statTotalClients').innerText = total;

            const redCount = clientsData.filter(c => c.bodyStatus === 'red' || c.mindStatus === 'red').length;
            document.getElementById('statRedLightClients').innerText = redCount;

            const avgHealth = clientsData.reduce((acc, c) => acc + c.drives.health, 0) / (total || 1);
            document.getElementById('statAvgHealthDrive').innerText = Math.round(avgHealth * 100) + '%';

            const dirtyCount = Object.keys(dirtyClients).length;
            document.getElementById('statDirtyClientsCount').innerText = dirtyCount;

            const badge = document.getElementById('dirtyBadgePulse');
            if (dirtyCount > 0) badge.classList.remove('hidden');
            else badge.classList.add('hidden');

            // 統計雷達圖與圓餅圖數據
            const avgWealth = clientsData.reduce((acc, c) => acc + c.drives.wealth, 0) / (total || 1);
            const avgEmotion = clientsData.reduce((acc, c) => acc + c.drives.emotion, 0) / (total || 1);
            const avgFamily = clientsData.reduce((acc, c) => acc + c.drives.family, 0) / (total || 1);
            const avgCareer = clientsData.reduce((acc, c) => acc + c.drives.career, 0) / (total || 1);

            const radarData = [
                Math.round(avgHealth * 100),
                Math.round(avgWealth * 100),
                Math.round(avgEmotion * 100),
                Math.round(avgFamily * 100),
                Math.round(avgCareer * 100)
            ];

            // 1. 五核心人生動力雷達圖 (Chart.js)
            if (typeof Chart !== 'undefined') {
                if (statsRadarChartInstance) {
                    statsRadarChartInstance.data.datasets[0].data = radarData;
                    statsRadarChartInstance.update();
                } else {
                    const ctxRadar = document.getElementById('chartStatsRadar').getContext('2d');
                    statsRadarChartInstance = new Chart(ctxRadar, {
                        type: 'radar',
                        data: {
                            labels: ['❤️ 健康動力', '🪙 財富動力', '🌸 感情動力', '🏡 家庭動力', '💼 事業動力'],
                            datasets: [{
                                label: '平均動力比重',
                                data: radarData,
                                backgroundColor: 'rgba(212, 146, 142, 0.2)',
                                borderColor: '#D4928E',
                                pointBackgroundColor: '#B59CD4',
                                borderWidth: 2
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                r: {
                                    angleLines: { color: 'rgba(234, 228, 220, 0.8)' },
                                    grid: { color: 'rgba(234, 228, 220, 0.8)' },
                                    pointLabels: { font: { size: 10, weight: 'bold' }, color: '#3E3832' },
                                    ticks: { display: false },
                                    suggestedMin: 0,
                                    suggestedMax: 100
                                }
                            },
                            plugins: { legend: { display: false } }
                        }
                    });
                }
            } else {
                console.warn("Chart 變數未定義，跳過五核心動力雷達圖初始化/更新");
            }

            // 2. 身心燈號分佈圓餅圖 (Chart.js)
            const greenCount = clientsData.filter(c => c.bodyStatus === 'green').length + clientsData.filter(c => c.mindStatus === 'green').length;
            const yellowCount = clientsData.filter(c => c.bodyStatus === 'yellow').length + clientsData.filter(c => c.mindStatus === 'yellow').length;
            const redLightCount = clientsData.filter(c => c.bodyStatus === 'red').length + clientsData.filter(c => c.mindStatus === 'red').length;

            if (typeof Chart !== 'undefined') {
                if (statsDoughnutChartInstance) {
                    statsDoughnutChartInstance.data.datasets[0].data = [greenCount, yellowCount, redLightCount];
                    statsDoughnutChartInstance.update();
                } else {
                    const ctxDoughnut = document.getElementById('chartStatsDoughnut').getContext('2d');
                    statsDoughnutChartInstance = new Chart(ctxDoughnut, {
                        type: 'doughnut',
                        data: {
                            labels: ['綠燈 (良好)', '黃燈 (注意)', '紅燈 (風險)'],
                            datasets: [{
                                data: [greenCount, yellowCount, redLightCount],
                                backgroundColor: ['#76BFA6', '#E6B875', '#D96B64'],
                                borderWidth: 0
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: { boxWidth: 10, font: { size: 10, weight: 'bold' }, color: '#7E766C' }
                                }
                            }
                        }
                    });
                }
            } else {
                console.warn("Chart 變數未定義，跳過身心燈號分佈圓餅圖初始化/更新");
            }

            // 3. 渲染標籤雲
            let lifeCount = {}, stateCount = {}, interestCount = {};
            clientsData.forEach(c => {
                c.tags.life.forEach(t => lifeCount[t] = (lifeCount[t] || 0) + 1);
                c.tags.state.forEach(t => stateCount[t] = (stateCount[t] || 0) + 1);
                c.tags.interest.forEach(t => interestCount[t] = (interestCount[t] || 0) + 1);
            });

            const renderCloud = (containerId, countObj, colorClasses) => {
                const container = document.getElementById(containerId);
                if (!container) return;
                container.innerHTML = '';
                const sorted = Object.entries(countObj).sort((a, b) => b[1] - a[1]);
                if (sorted.length === 0) {
                    container.innerHTML = '<span class="text-xs text-wellness-textSub/50 italic">目前無標籤</span>';
                    return;
                }
                sorted.forEach(([tag, val]) => {
                    container.innerHTML += `<span class="px-2 py-0.5 ${colorClasses} text-[10px] font-bold rounded-lg shadow-xs m-0.5">
                        <span>${tag}</span>
                        <span class="ml-1 opacity-75">(${val}次)</span>
                    </span>`;
                });
            };

            renderCloud('statsLifeTagsCloud', lifeCount, 'bg-wellness-mint/10 border border-wellness-mint/20 text-wellness-mint');
            renderCloud('statsStateTagsCloud', stateCount, 'bg-wellness-accent/10 border border-wellness-accent/20 text-wellness-accent');
            renderCloud('statsInterestTagsCloud', interestCount, 'bg-wellness-lavender/10 border border-wellness-lavender/20 text-wellness-lavender');

            // 4. 待回寫 Sheets 表格
            const tableBody = document.getElementById('dirtyClientsTableBody');
            const dirtySection = document.getElementById('dirtyClientsSection');
            if (!tableBody || !dirtySection) return;
            tableBody.innerHTML = '';

            const dirtyList = clientsData.filter(c => dirtyClients[c.id]);
            if (dirtyList.length > 0) {
                dirtySection.classList.remove('hidden');
                dirtyList.forEach(c => {
                    const bodyIcon = c.bodyStatus === 'red' ? '紅' : (c.bodyStatus === 'yellow' ? '黃' : '綠');
                    const mindIcon = c.mindStatus === 'red' ? '紅' : (c.mindStatus === 'yellow' ? '黃' : '綠');
                    const tagsStr = `生活:${c.tags.life.join(',')} | 狀態:${c.tags.state.join(',')} | 興趣:${c.tags.interest.join(',')}`;
                    const driveStr = `❤️${Math.round(c.drives.health*100)}% 🪙${Math.round(c.drives.wealth*100)}% 🌸${Math.round(c.drives.emotion*100)}% 🏡${Math.round(c.drives.family*100)}% 💼${Math.round(c.drives.career*100)}%`;

                    tableBody.innerHTML += `
                        <tr class="hover:bg-wellness-accent/5 border-b border-wellness-accent/10 last:border-0">
                            <td class="py-2.5 font-bold font-mono">${c.id}</td>
                            <td class="py-2.5 font-bold">${c.name}</td>
                            <td class="py-2.5 text-wellness-textSub">生理:${bodyIcon}(${c.bodyNote}) / 心理:${mindIcon}(${c.mindNote})</td>
                            <td class="py-2.5 text-wellness-textSub truncate max-w-[200px]" title="${tagsStr}">${tagsStr}</td>
                            <td class="py-2.5 text-wellness-accent font-bold">${driveStr}</td>
                        </tr>
                    `;
                });
            } else {
                dirtySection.classList.add('hidden');
            }
        }

        // CSV 匯出邏輯
        function generateCsvString() {
            const headers = ["個案ID", "姓名", "年齡", "性別", "生活標籤", "狀態標籤", "興趣標籤", "健康動力", "財富動力", "感情動力", "家庭動力", "事業動力", "身體狀態", "身體備註", "心理狀態", "心理備註"];
            const rows = [headers.join(",")];
            
            clientsData.forEach(c => {
                const row = [
                    c.id,
                    c.name,
                    c.age,
                    c.gender,
                    `"${c.tags.life.join(";")}"`,
                    `"${c.tags.state.join(";")}"`,
                    `"${c.tags.interest.join(";")}"`,
                    Math.round(c.drives.health * 100),
                    Math.round(c.drives.wealth * 100),
                    Math.round(c.drives.emotion * 100),
                    Math.round(c.drives.family * 100),
                    Math.round(c.drives.career * 100),
                    c.bodyStatus,
                    c.bodyNote,
                    c.mindStatus,
                    c.mindNote
                ];
                rows.push(row.join(","));
            });
            
            return "\uFEFF" + rows.join("\n"); // 補上 BOM 預防 Excel 開啟亂碼
        }

        function copyCrmDataAsCsv() {
            const csv = generateCsvString();
            navigator.clipboard.writeText(csv).then(() => {
                alert("已成功複製最新個案資料 CSV 格式至剪貼簿！可直接貼上至 Google 試算表 (Ctrl+V)。");
            }).catch(err => {
                console.error("複製失敗", err);
                alert("複製失敗，建議點擊下載按鈕下載 CSV 檔案。");
            });
        }

        function downloadCrmDataCsv() {
            const csv = generateCsvString();
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `crm_sheets_sync_${new Date().toISOString().slice(0,10)}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function copyFormula(formula, btn) {
            navigator.clipboard.writeText(formula).then(() => {
                const originalHtml = btn.innerHTML;
                btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-wellness-mint"></i>`;
                safeCreateIcons();
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    safeCreateIcons();
                }, 2000);
            }).catch(err => {
                console.error("複製公式失敗", err);
            });
        }

        // --- Platform 轉介與分成操作 ---
        function acceptReferral(id, bName) {
            alert(`已接受來自 B1源點身心靈 的轉介！已成功為個案 ${id} 建立並對接 ${bName} 的服務排程。`);
            switchTab('incentive');
        }

        // --- 初始化 Chart.js 大盤碳排放與趨勢 ---
        function initCharts() {
            if (typeof Chart === 'undefined') {
                console.warn("Chart.js 未載入，跳過大盤圖表初始化");
                return;
            }
            if (chartsInitialized) return;
            
            // 3. ESG 碳足跡分析
            const ctxEsg = document.getElementById('chartEsgCarbon').getContext('2d');
            new Chart(ctxEsg, {
                type: 'bar',
                data: {
                    labels: ['1月', '2月', '3月', '4月', '5月'],
                    datasets: [{
                        label: '減碳排量 (kg CO2e)',
                        data: [65, 80, 92, 115, 142],
                        backgroundColor: '#76BFA6',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { grid: { color: 'rgba(234, 228, 220, 0.5)' } } }
                }
            });

            // 4. 租戶個案成長趨勢
            const ctxGrowth = document.getElementById('chartGrowthTrends').getContext('2d');
            new Chart(ctxGrowth, {
                type: 'line',
                data: {
                    labels: ['1月', '2月', '3月', '4月', '5月'],
                    datasets: [
                        {
                            label: 'B1 源點身心靈',
                            data: [35, 42, 48, 55, 62],
                            borderColor: '#D4928E',
                            backgroundColor: 'rgba(212, 146, 142, 0.15)',
                            fill: true,
                            tension: 0.3
                        },
                        {
                            label: 'B2 暖光苑',
                            data: [15, 22, 28, 36, 45],
                            borderColor: '#B59CD4',
                            fill: false,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { grid: { color: 'rgba(234, 228, 220, 0.5)' } } }
                }
            });

            chartsInitialized = true;
        }




        // ==========================================================================
        // Q-Value 照護成效加權分配機制演算法與資料庫
        // ==========================================================================
        let qValueWeights = { w1: 0.40, w2: 0.40, w3: 0.20 };
        const basePoolAmount = 179760; // 70% 激勵池總額

        // 模擬三個租戶在當月的原始指標數據
        const tenantMetrics = {
            'B1': { name: 'B1 源點身心靈', satisfaction: 4.8, improvement: 0.85, activeRate: 0.92, referralWeight: 45 },
            'B2': { name: 'B2 暖光苑', satisfaction: 4.6, improvement: 0.78, activeRate: 0.88, referralWeight: 35 },
            'B3': { name: 'B3 綠野工作室', satisfaction: 4.9, improvement: 0.92, activeRate: 0.95, referralWeight: 20 }
        };

        function initQValueCalculator() {
            // 設定滑桿初始值
            const s1 = document.getElementById('sliderW1');
            const s2 = document.getElementById('sliderW2');
            const s3 = document.getElementById('sliderW3');
            if (s1 && s2 && s3) {
                s1.value = qValueWeights.w1 * 100;
                s2.value = qValueWeights.w2 * 100;
                s3.value = qValueWeights.w3 * 100;
                
                document.getElementById('weightVal1').innerText = (qValueWeights.w1 * 100) + '%';
                document.getElementById('weightVal2').innerText = (qValueWeights.w2 * 100) + '%';
                document.getElementById('weightVal3').innerText = (qValueWeights.w3 * 100) + '%';
            }
            updateQValueCalculation();
        }

        // 滑桿變動時的重平衡演算法，確保 w1 + w2 + w3 = 100%
        function handleWeightChange(changedSlider, val) {
            let v = parseInt(val);
            if (changedSlider === 1) {
                qValueWeights.w1 = v / 100;
                // 分攤剩下的權重給 w2 與 w3
                let remain = 100 - v;
                qValueWeights.w2 = Math.round(remain * 0.67) / 100;
                qValueWeights.w3 = (100 - v - Math.round(remain * 0.67)) / 100;
            } else if (changedSlider === 2) {
                qValueWeights.w2 = v / 100;
                let remain = 100 - v;
                qValueWeights.w1 = Math.round(remain * 0.67) / 100;
                qValueWeights.w3 = (100 - v - Math.round(remain * 0.67)) / 100;
            } else if (changedSlider === 3) {
                qValueWeights.w3 = v / 100;
                let remain = 100 - v;
                qValueWeights.w1 = Math.round(remain * 0.50) / 100;
                qValueWeights.w2 = (100 - v - Math.round(remain * 0.50)) / 100;
            }

            // 更新介面滑桿與顯示值
            document.getElementById('sliderW1').value = Math.round(qValueWeights.w1 * 100);
            document.getElementById('sliderW2').value = Math.round(qValueWeights.w2 * 100);
            document.getElementById('sliderW3').value = Math.round(qValueWeights.w3 * 100);

            document.getElementById('weightVal1').innerText = Math.round(qValueWeights.w1 * 100) + '%';
            document.getElementById('weightVal2').innerText = Math.round(qValueWeights.w2 * 100) + '%';
            document.getElementById('weightVal3').innerText = Math.round(qValueWeights.w3 * 100) + '%';

            updateQValueCalculation();
        }

        function updateQValueCalculation() {
            const tableBody = document.getElementById('qValueTableBody');
            if (!tableBody) return;
            tableBody.innerHTML = '';

            let rawScores = {};
            let sumContribution = 0;

            // Step 1: 計算各租戶加權後的 Q-Value 分值
            // 滿意度最大分值是 5.0，將其除以 5 轉為 0~1 的比例
            for (let tid in tenantMetrics) {
                let m = tenantMetrics[tid];
                let normSat = m.satisfaction / 5.0; // 滿意度標準化 (0~1)
                
                // Q-Value = w1*Sat + w2*Improvement + w3*Active
                let qVal = (qValueWeights.w1 * normSat) + (qValueWeights.w2 * m.improvement) + (qValueWeights.w3 * m.activeRate);
                qVal = Math.round(qVal * 1000) / 1000; // 四捨五入至小數三位

                // 權重貢獻度分值 = Q-Value × 轉介權重 (轉介次數比例)
                let score = qVal * m.referralWeight;
                rawScores[tid] = { qValue: qVal, rawScore: score };
                sumContribution += score;
            }

            // Step 2: 依加權貢獻度分值計算分成比例與金額，並渲染表格
            for (let tid in tenantMetrics) {
                let m = tenantMetrics[tid];
                let r = rawScores[tid];
                
                // 分成比例 = 該租戶貢獻度分值 / 總貢獻度分值
                let sharePct = sumContribution > 0 ? (r.rawScore / sumContribution) : 0;
                let payout = Math.round(basePoolAmount * sharePct);
                
                let sharePctStr = (sharePct * 100).toFixed(1) + '%';
                let payoutStr = '$' + payout.toLocaleString();

                tableBody.innerHTML += `
                    <tr class="hover:bg-wellness-bg/40 transition-all border-b border-wellness-border/40">
                        <td class="px-4 py-3.5 flex items-center space-x-2">
                            <span class="w-2 h-2 rounded-full bg-wellness-accent"></span>
                            <span class="text-wellness-textMain font-bold">${m.name}</span>
                        </td>
                        <td class="px-4 py-3.5 text-center text-wellness-textSub">${m.satisfaction} / 5.0</td>
                        <td class="px-4 py-3.5 text-center text-wellness-mint">${Math.round(m.improvement * 100)}%</td>
                        <td class="px-4 py-3.5 text-center text-wellness-lavender">${Math.round(m.activeRate * 100)}%</td>
                        <td class="px-4 py-3.5 text-center font-mono text-wellness-textMain bg-wellness-bg/50 rounded-lg qvalue-badge">${r.qValue}</td>
                        <td class="px-4 py-3.5 text-right font-bold text-wellness-accent">${sharePctStr}</td>
                        <td class="px-4 py-3.5 text-right font-bold text-wellness-mint font-mono">${payoutStr}</td>
                    </tr>
                `;
            }
            
            // 刷新可能動態插入的 Lucide 圖示
            if (typeof safeCreateIcons === 'function') {
                safeCreateIcons();
            }
        }
