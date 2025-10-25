# 部署指南

本文檔詳細說明如何部署 AI 作文批改系統到生產環境。

## 準備工作

### 1. 獲取 DeepSeek API 金鑰

1. 訪問 [DeepSeek 官網](https://www.deepseek.com)
2. 註冊帳號並登入
3. 前往 API 設定頁面
4. 創建並複製 API 金鑰

### 2. 準備 Git 倉庫

```bash
# 初始化 Git（如果尚未初始化）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: AI Essay Grader App"

# 推送到 GitHub
git remote add origin https://github.com/你的用戶名/ai-essay-grader.git
git branch -M main
git push -u origin main
```

## 部署到 Vercel（推薦）

### 方法 1：通過 Vercel Dashboard（最簡單）

1. **訪問 Vercel**
   - 前往 [vercel.com](https://vercel.com)
   - 使用 GitHub 帳號登入

2. **導入專案**
   - 點擊 "New Project"
   - 選擇你的 GitHub 倉庫
   - Vercel 會自動檢測為 Vite 專案

3. **配置環境變數**
   在 "Environment Variables" 區域添加：
   ```
   VITE_DEEPSEEK_API_KEY = 你的API金鑰
   VITE_DEEPSEEK_API_URL = https://api.deepseek.com/v1/chat/completions
   ```

4. **部署**
   - 點擊 "Deploy"
   - 等待構建完成（約 1-2 分鐘）
   - 獲得部署 URL，例如：`https://ai-essay-grader.vercel.app`

5. **後續更新**
   - 每次推送到 main 分支，Vercel 會自動重新部署

### 方法 2：通過 Vercel CLI

1. **安裝 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登入 Vercel**
   ```bash
   vercel login
   ```

3. **首次部署**
   ```bash
   vercel
   ```

   按照提示操作：
   - Set up and deploy? Y
   - Which scope? 選擇你的帳號
   - Link to existing project? N
   - What's your project's name? ai-essay-grader
   - In which directory is your code located? ./
   - Want to override settings? N

4. **設置環境變數**
   ```bash
   vercel env add VITE_DEEPSEEK_API_KEY
   ```
   輸入你的 API 金鑰

5. **生產部署**
   ```bash
   vercel --prod
   ```

## 部署到 Netlify

### 通過 Netlify Dashboard

1. **訪問 Netlify**
   - 前往 [netlify.com](https://netlify.com)
   - 使用 GitHub 帳號登入

2. **導入專案**
   - 點擊 "Add new site" → "Import an existing project"
   - 選擇 GitHub
   - 選擇你的倉庫

3. **構建設置**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **環境變數**
   在 Site settings → Environment variables 添加：
   ```
   VITE_DEEPSEEK_API_KEY = 你的API金鑰
   VITE_DEEPSEEK_API_URL = https://api.deepseek.com/v1/chat/completions
   ```

5. **部署**
   - 點擊 "Deploy site"
   - 獲得 URL，例如：`https://ai-essay-grader.netlify.app`

6. **添加重定向規則**
   創建 `public/_redirects` 文件：
   ```
   /*    /index.html   200
   ```

## 部署到 GitHub Pages

1. **安裝 gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **更新 vite.config.js**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/ai-essay-grader/', // 你的倉庫名稱
   })
   ```

3. **添加部署腳本到 package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **部署**
   ```bash
   npm run deploy
   ```

5. **配置 GitHub Pages**
   - 前往倉庫設置 → Pages
   - Source: gh-pages branch
   - 訪問：`https://你的用戶名.github.io/ai-essay-grader/`

**注意**：GitHub Pages 不支持環境變數，DeepSeek API 金鑰需要在構建時設置，這可能有安全風險。建議使用 Vercel 或 Netlify。

## 自定義域名（可選）

### Vercel

1. 前往 Project Settings → Domains
2. 添加你的域名
3. 按照指示配置 DNS 記錄
4. 等待 SSL 證書自動配置

### Netlify

1. 前往 Site settings → Domain management
2. 添加自定義域名
3. 配置 DNS
4. 啟用 HTTPS

## 性能優化建議

### 1. 圖片優化
- 建議用戶上傳前壓縮圖片
- 可以集成圖片壓縮庫（如 browser-image-compression）

### 2. CDN 加速
- Vercel 和 Netlify 自帶全球 CDN
- 靜態資源自動優化

### 3. 預加載 Tesseract 訓練數據
```javascript
// 在應用啟動時預加載
import Tesseract from 'tesseract.js'

Tesseract.createWorker('chi_tra').then(worker => {
  // 預熱 OCR 引擎
  worker.terminate()
})
```

### 4. API 速率限制
考慮添加請求節流：
```javascript
// 簡單的防抖
const debounce = (func, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }
}
```

## 監控與分析

### Vercel Analytics
```bash
npm install @vercel/analytics
```

在 `src/main.jsx` 添加：
```javascript
import { Analytics } from '@vercel/analytics/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
)
```

### 錯誤追蹤
考慮集成 Sentry：
```bash
npm install @sentry/react
```

## 常見問題

### Q: API 金鑰暴露風險？
A: 環境變數在構建時注入，但仍然會出現在前端代碼中。建議：
- 在 DeepSeek 設置 API 金鑰的使用限制
- 監控 API 使用量
- 考慮添加後端代理層

### Q: OCR 首次加載很慢？
A: Tesseract 需要下載訓練數據。可以：
- 顯示加載提示
- 預加載訓練數據
- 考慮使用雲端 OCR 服務（Google Vision API, Azure Computer Vision）

### Q: 歷史記錄丟失？
A: localStorage 數據綁定瀏覽器。未來版本可以：
- 添加雲端同步
- 支援數據匯出/匯入
- 使用 IndexedDB 替代 localStorage

## 後續維護

### 自動部署
- 推送到 `main` 分支自動部署生產環境
- 推送到 `develop` 分支部署預覽環境（Vercel Preview Deployments）

### 回滾
Vercel/Netlify 支持一鍵回滾到之前的部署版本

### 日誌查看
- Vercel: Deployments → Function Logs
- Netlify: Deploys → Deploy log

---

部署成功後，記得測試所有功能：
- ✅ 拍照上傳
- ✅ OCR 識別
- ✅ AI 批改
- ✅ 歷史記錄
- ✅ PDF 匯出
- ✅ 搜尋與篩選

祝部署順利！🚀
