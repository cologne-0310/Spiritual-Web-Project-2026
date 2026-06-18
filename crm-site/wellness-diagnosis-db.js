/**
 * AI CRM 類神經分類身心靈大數據會診對照表資料庫 (WellnessDiagnosisDB)
 * 提煉自《臺北市產業發展創業補助計畫書》之三色核心燈號與五核心人生動力專家對策矩陣。
 */

const WellnessDiagnosisDB = {
    // 1. 三色核心燈號對照數據
    LightDiagnosisMap: {
        green: {
            name: "🟢 綠燈 (身心和諧)",
            statusText: "身心狀態和諧，綜合壓力指數 < 35%。",
            therapies: "維持日常保養與健康促進諮詢。建議搭配飲用一般花草茶，維持適度運動。",
            socialCare: "推送規律生活與據點社團活動，持續累積全人履歷。"
        },
        yellow: {
            name: "🟡 黃燈 (健康警訊)",
            statusText: "身心出現輕度警訊，綜合壓力指數介於 35% 至 75% 之間。",
            therapies: "匹配專家定義之【木行/水行精油】嗅吸與穴位經絡按摩；匹配【432Hz 安定心率手盤音樂】放鬆。",
            socialCare: "啟動早期電話關懷與志工探訪，提供家屬衛教支持，引導參與社區時間銀行互助換工。"
        },
        red: {
            name: "🔴 紅燈 (高危預警)",
            statusText: "身心呈現重度失衡，綜合壓力指數 >= 75%。",
            therapies: "暫停常態處方；施以【深度舒壓音療】（如 528Hz 細胞修復頌缽）與極致放鬆香氛嗅吸。",
            socialCare: "啟動【一對一健管師即時介入】。執行醫療與長照體系之行政轉介，一鍵轉介至特約合作醫療院所，由專業醫師進行診斷。"
        }
    },

    // 2. 五核心人生動力對策對照數據 (類神經分類建議)
    DriveDiagnosisMap: {
        health: {
            name: "❤️ 健康動力",
            advice: "加強生理防線與生活習慣保養。防範日常久坐，注意非醫療生活健康數據。",
            course: "【健康促進】低衝擊水中有氧與關懷太極拳",
            action: "建議每日補充 1500ml 溫水並進行戶外快走 30 分鐘。"
        },
        wealth: {
            name: "🪙 財富動力",
            advice: "針對老年養老金或退休開銷之經濟焦慮進行正念疏導，建立心靈豐盛感，減輕壓力。",
            course: "【正念減壓】心靈豐盛與正念財富主題沙龍",
            action: "鼓勵引導參與社區時間銀行互助換工，以服務折抵開支。"
        },
        emotion: {
            name: "🌸 感情動力",
            advice: "調解社交孤立與孤獨感，釋放心靈壓抑，加強自我情緒感知與情感交流。",
            course: "【音療體驗】社區 432Hz 頌缽音療舒壓心靈課",
            action: "安排芳香精油嗅吸與睡前正念呼吸放鬆法。"
        },
        family: {
            name: "🏡 家庭動力",
            advice: "補強社交支持系統。結合據點同儕或志工網絡建立熟人關懷網，排除孤立感。",
            course: "【烘焙手作】青銀共創趣味烘焙與手作下午茶",
            action: "安排社區長者樂齡共餐與生命故事分享交流座談會。"
        },
        career: {
            name: "💼 事業動力",
            advice: "提升退休後的自我價值感，建立新的生活重心與社會貢獻機會，避免生活頓失方向。",
            course: "【自我實現】據點健康照護志工大師培訓班",
            action: "引導參與療癒系綠色園藝種植與社區環境美化活動。"
        }
    },

    // 3. 根據個案數據，動態生成會診診斷與招生處方
    generatePrescription: function(drives, bodyStatus, mindStatus) {
        // 判定最強燈號 (優先級: red > yellow > green)
        let primaryLight = 'green';
        if (bodyStatus === 'red' || mindStatus === 'red') {
            primaryLight = 'red';
        } else if (bodyStatus === 'yellow' || mindStatus === 'yellow') {
            primaryLight = 'yellow';
        }

        const lightAdvice = this.LightDiagnosisMap[primaryLight];
        
        // 找出分數最低的 1-2 個核心動力 (小於 0.6 的視為需要加強)
        const driveScores = [
            { name: 'health', score: drives.health },
            { name: 'wealth', score: drives.wealth },
            { name: 'emotion', score: drives.emotion },
            { name: 'family', score: drives.family },
            { name: 'career', score: drives.career }
        ];
        
        // 排序找出最低者
        driveScores.sort((a, b) => a.score - b.score);
        
        let prescriptionText = `=== 【1】身心燈號大數據會診結論 ===\n`;
        prescriptionText += `綜合燈號判定: ${lightAdvice.name}\n`;
        prescriptionText += `身心狀態解析: ${lightAdvice.statusText}\n\n`;
        
        prescriptionText += `=== 【2】自然療法與關懷處方 ===\n`;
        prescriptionText += `自然對策: ${lightAdvice.therapies}\n`;
        prescriptionText += `行政關懷: ${lightAdvice.socialCare}\n\n`;
        
        prescriptionText += `=== 【3】類神經動力大腦弱項分析 ===\n`;
        
        // 提取需要加強的動力 (最低的前兩個)
        const weakDrives = driveScores.filter(d => d.score < 0.6).slice(0, 2);
        
        if (weakDrives.length > 0) {
            weakDrives.forEach((wd, index) => {
                const driveAdviceObj = this.DriveDiagnosisMap[wd.name];
                prescriptionText += `${index + 1}. 檢測到【${driveAdviceObj.name}】偏低 (數值: ${Math.round(wd.score * 100)}%)\n`;
                prescriptionText += `   * 專家建議: ${driveAdviceObj.advice}\n`;
                prescriptionText += `   * 調適建議: ${driveAdviceObj.action}\n`;
                prescriptionText += `   * 推薦課程: ${driveAdviceObj.course} (契合度: ${Math.round(98 - (wd.score * 20))}%)\n`;
            });
        } else {
            // 五核心全部高於 60%
            prescriptionText += `1. 五核心人生動力發展均衡。\n`;
            prescriptionText += `   * 專家建議: 保持目前的健康促進作息，維持身心和諧。\n`;
            prescriptionText += `   * 推薦課程: 【自我實現】療癒系綠色園藝種植課，作為樂活維護。\n`;
        }
        
        return prescriptionText;
    }
};

// 將模組掛載到 window，供全域對接調用
if (typeof window !== 'undefined') {
    window.WellnessDiagnosisDB = WellnessDiagnosisDB;
}
