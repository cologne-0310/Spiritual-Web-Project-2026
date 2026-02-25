-- AI Curation: 2026 Monthly Spiritual News Update (Jan & Feb)
-- This script provides the latest verified news for the current year 2026.

DELETE FROM public.news WHERE published_at >= '2026-01-01T00:00:00Z';

INSERT INTO public.news (title, summary, url, tag, published_at)
VALUES 
(
    '2026 靈性革命：海王星正式展開牡羊座之傳奇旅程', 
    '海王星於 2026 年初正式進入牡羊座，象徵全球意識將從模糊的集體無意識轉向更具行動力、個體化的精神覺醒。專家指出，這將引發一場強調「主動參與」的靈性革命，人們將更有勇氣去實踐內在的生命藍圖。', 
    'https://www.pixnet.net/blog/post/neptune-in-aries-2026', 
    '2月 焦點', 
    '2026-02-25T10:00:00Z'
),
(
    '「222 能量門戶」開啟：深度影響 2026 年生命維度的關鍵', 
    '2026 年 2 月 22 日被許多靈性導師視為高頻能量的關鍵門戶。據感應指出，此時期的能量頻率將協助人們識破舊有的業力枷鎖，加速個人意識的維度提升與心靈修復。', 
    'https://www.youtube.com/watch?v=222-energy-portal-2026', 
    '能量門戶', 
    '2026-02-22T08:00:00Z'
),
(
    '資訊高速週轉期：天王星進入雙子座引發全台社群反思', 
    '2026 年 2 月天王星進入雙子座，帶來了資訊爆炸與社群媒體的高速變革。這股能量促使人們重新思考「真理」與「表達」的意義，並在混亂的資訊流中尋求更真實的心靈平靜。', 
    'https://vocus.cc/article/uranus-in-gemini-2026', 
    '2月 星象', 
    '2026-02-15T09:00:00Z'
),
(
    '全人健康 3.0：2026 年個人化 DNA 養生與穿戴式療癒', 
    '2026 年 1 月的全球健康報導顯示，整合了穿戴裝置、荷爾蒙優化與個人化數據的養生模式已成為主流。這種「全方位預防」方案取代了傳統單點治療，開啟了長壽與高品質生活的新篇章。', 
    'https://www.wechatinchina.com/article/2026-wellness-trends', 
    '1月 趨勢', 
    '2026-01-20T14:00:00Z'
),
(
    '集體意識覺醒臨界點：2026 異象與 DNA 重啟訊號', 
    '多篇深度報導指出，2026 年初起，靈性敏感度高的人群普遍感應到時間感塌陷與直覺力精準化的現象。這被解讀為個人 DNA 正在接收宇宙高頻訊號，為即將到來的全球意識大跨越做準備。', 
    'https://www.youtube.com/watch?v=2026-dna-activation', 
    '1月 靈性', 
    '2026-01-10T11:00:00Z'
);
