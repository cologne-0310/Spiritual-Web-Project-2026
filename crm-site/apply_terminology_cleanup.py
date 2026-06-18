import os
import subprocess

root_dir = r"c:\Users\cologne\Downloads\AG_TEST"
crm_dir = os.path.join(root_dir, "Spiritual-Web-Project-2026", "crm-site")
proposal_dir = os.path.join(root_dir, "政府計畫案", "SITI_服務創新_社區生態系")

index_path = os.path.join(crm_dir, "index.html")
app_path = os.path.join(crm_dir, "app_v2.js")
db_path = os.path.join(crm_dir, "wellness-diagnosis-db.js")
style_path = os.path.join(crm_dir, "crm-style.css")

proposal_md_path = os.path.join(proposal_dir, "SITI_服務創新_創業補助計畫書_完整送件版.md")
ppt_md_path = os.path.join(proposal_dir, "siti_proposal_ppt_summary.md")
generator_py_path = os.path.join(proposal_dir, "generate_siti_docx.py")
briefing_md_path = os.path.join(proposal_dir, "B端據點與健管師招商簡報素材_NotebookLM專用.md")
architecture_md_path = os.path.join(proposal_dir, "AI_CRM_System_Architecture_SITI.md")
draft_md_path = os.path.join(proposal_dir, "SITI_計畫書主體草稿_v1.md")
paragraphs_txt_path = os.path.join(proposal_dir, "paragraphs_dump.txt")
mvp_index_path = os.path.join(proposal_dir, "ai_crm_mvp", "index.html")
git_exe = r"C:\Users\cologne\AppData\Local\GitHubDesktop\app-3.5.8\resources\app\git\cmd\git.exe"


# 定義替換對照表
replacements = [
    # Q-Value 生態貢獻相關替換
    ("Q-Value 照護成效加權之生態貢獻分配機制", "Q-Value 服務成效加權激勵機制"),
    ("Q-Value 照護成效加權之生態貢獻分配", "Q-Value 服務成效加權激勵機制"),
    ("Q-Value 生態貢獻度分配機制", "Q-Value 服務成效加權分配機制"),
    ("Q-Value 生態貢獻分配機制", "Q-Value 服務成效加權分配機制"),
    ("Q-Value 生態貢獻分配", "Q-Value 服務成效加權分配"),
    ("生態貢獻度分配", "服務成效加權分配"),
    ("生態貢獻分配", "服務成效加權分配"),
    ("生態貢獻度結算", "服務成效加權結算"),
    ("生態貢獻獎勵池", "服務成效激勵金池"),
    ("生態貢獻度", "服務品質成效"),
    ("生態貢獻", "服務成效"),
    ("專業轉介與生態貢獻激勵模組", "專業轉介與服務成效激勵模組"),
    ("大平台中台與生態貢獻激勵模組建置", "大平台中台與服務成效激勵模組建置"),
    ("專業轉介與生態貢獻度結算演算法", "專業轉介與服務成效結算演算法"),
    ("生態貢獻津貼", "服務成效獎勵津貼"),
    ("生態貢獻者", "健康服務提供者"),
    ("生態合作夥伴", "合作健康管理工作室"),
    ("Healthy Coin 點數生態池", "健康服務績效積點池"),
    ("Healthy Coin", "健康服務績效點數 (Healthy Point)"),
    ("健康幣", "健康服務績效點數"),
    
    # 莫蘭迪相關替換
    ("莫蘭迪身心管理系統", "AI 身心管理系統"),
    ("莫蘭迪溫柔邊框", "溫和感邊框"),
    ("莫蘭迪溫柔邊框", "優雅感邊框"),
    ("莫蘭迪高質感懸浮卡片", "高質感懸浮卡片"),
    ("莫蘭迪高質感", "高質感"),
    ("莫蘭迪", "淡雅"),
]

def apply_replacements(file_path):
    if not os.path.exists(file_path):
        print(f"檔案不存在，跳過：{file_path}")
        return
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    original_len = len(content)
    changed = False
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            changed = True
            
    if changed:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"成功更新檔案名詞：{os.path.basename(file_path)}")
    else:
        print(f"檔案無需更新名詞：{os.path.basename(file_path)}")

print("================= 1. 清理前端系統名詞 =================")
apply_replacements(index_path)
apply_replacements(app_path)
apply_replacements(db_path)
apply_replacements(style_path)

print("================= 2. 清理計畫書與簡報名詞 =================")
# 4.1 新增 V1.6 修訂版次紀錄
with open(proposal_md_path, "r", encoding="utf-8") as f:
    md_content = f.read()

old_revision = """| V1.5 | 2026-06-18 | 全文 | 昕原點有限公司 | 1. 擴大計畫定位受眾，將偏向長者/樂齡之單一描述升級為以「社會大眾與亞健康群體」為核心。<br>2. 將各章節內「長者」與「樂齡中心」更名為「社區居民與亞健康大眾」、「身心調理據點」。 |"""
new_revision = """| V1.5 | 2026-06-18 | 全文 | 昕原點有限公司 | 1. 擴大計畫定位受眾，將偏向長者/樂齡之單一描述升級為以「社會大眾與亞健康群體」為核心。<br>2. 將各章節內「長者」與「樂齡中心」更名為「社區居民與亞健康大眾」、「身心調理據點」。 |
| V1.6 | 2026-06-18 | 全文 | 昕原點有限公司 | 1. 清理冗贅與不易理解之名詞，將「生態貢獻分配」改為「服務成效加權激勵」機制。<br>2. 移除「莫蘭迪」、「Healthy Coin」等專有名詞，替換為「健康服務績效點數」、「AI身心管理系統」。 |"""

if old_revision in md_content:
    md_content = md_content.replace(old_revision, new_revision)
    with open(proposal_md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    print("已成功新增 V1.6 版修訂紀錄。")

apply_replacements(proposal_md_path)
apply_replacements(ppt_md_path)
apply_replacements(generator_py_path)
apply_replacements(briefing_md_path)
apply_replacements(architecture_md_path)
apply_replacements(draft_md_path)
apply_replacements(paragraphs_txt_path)
apply_replacements(mvp_index_path)


print("================= 3. 重新執行 generate_siti_docx.py 產生 Word 計畫書 =================")
try:
    res = subprocess.run(["python", "generate_siti_docx.py"], cwd=proposal_dir, capture_output=True, text=True, check=True)
    print("Word 計畫書重新產生成功！")
except Exception as e:
    print("執行 Word 產生時發生錯誤：", e)

print("================= 4. Git Commit 與 Push =================")
try:
    # 8.1 Git Add
    subprocess.run([git_exe, "add", "crm-site/index.html", "crm-site/app_v2.js", "crm-site/crm-style.css", "crm-site/wellness-diagnosis-db.js"], cwd=os.path.join(root_dir, "Spiritual-Web-Project-2026"), check=True)
    print("Git Add 成功")
    
    # 8.2 Git Commit
    subprocess.run([git_exe, "commit", "-m", "優化名詞：移除莫蘭迪並將生態貢獻分配改為健康成效加權激勵機制"], cwd=os.path.join(root_dir, "Spiritual-Web-Project-2026"), check=True)
    print("Git Commit 成功")
    
    # 8.3 Git Push
    subprocess.run([git_exe, "push", "origin", "main"], cwd=os.path.join(root_dir, "Spiritual-Web-Project-2026"), check=True)
    print("Git Push 成功！已順利上傳至 GitHub，Vercel 雲端將自動更新。")
except Exception as e:
    print("Git 推送失敗：", e)
