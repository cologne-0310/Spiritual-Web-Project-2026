// Supabase 整合配置 (Supabase Integration Configuration)
// 請將您的 Project URL 與 Anon Key 填入下方的變數中

const SUPABASE_URL = 'https://tbhxanustlbigwzqgdul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiaHhhbnVzdGxiaWd3enFnZHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4Mjk1ODEsImV4cCI6MjA4NzQwNTU4MX0.bsCcWf_qi8sozqZ1otW26x-_qi87QRDrjH4MCcDjBA4';

// 初始化 Supabase Client
// 初始化 Supabase Client
// 假設頁面已引入 https://cdn.jsdelivr.net/npm/@supabase/supabase-js
if (typeof supabase === 'undefined') {
    console.error('Supabase SDK 未載入，請確保 HTML 中包含 SDK 腳本。');
}
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabaseClient = supabaseClient; // Expose for debugging


console.log('Supabase 橋樑已就緒...');

// 預計功能：產品同步、分潤追蹤、會員登入
