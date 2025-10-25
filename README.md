# AI 作文批改系統

基於 React 和 DeepSeek AI 的智能作文批改應用，提供專業的作文評分與建議。

## 功能特色

### 核心功能
- **📸 拍照上傳**：支援單張/多張照片上傳，自動拼接長作文
- **🤖 AI 智能批改**：使用 DeepSeek API 提供專業評分
- **📊 詳細分析**：
  - 總分評級（零到六級分，符合台灣國中教育會考標準）
  - 四大分項評分：立意取材、結構組織、遣詞造句、錯別字與標點
  - 錯別字/病句標註與修改建議
  - 佳詞佳句點評
  - 思維導圖式結構分析
- **📚 歷史記錄**：自動保存最近 40 次批改記錄
- **📄 PDF 匯出**：支援下載批改結果為 PDF

### 輔助功能
- 按時間排序的批改記錄列表
- 關鍵字搜尋（作文內容、評分等級）
- 評分篩選功能
- 統計數據（總記錄數、平均分、最高分）

### UI/UX
- 模擬 iPhone 15 Pro 設計
- iOS 風格界面與動畫
- 響應式設計
- 流暢的頁面切換

## 技術棧

- **前端框架**：React 18
- **構建工具**：Vite
- **樣式**：Tailwind CSS
- **路由**：React Router DOM
- **圖片處理**：Tesseract.js (OCR)
- **PDF 生成**：jsPDF
- **AI API**：DeepSeek
- **圖標**：Lucide React
- **日期處理**：date-fns

## 快速開始

### 安裝依賴

```bash
npm install
```

### 配置環境變數

複製 `.env.example` 到 `.env` 並填入你的 DeepSeek API 金鑰：

```bash
cp .env.example .env
```

編輯 `.env` 文件：

```
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
```

### 開發模式

```bash
npm run dev
```

應用將在 `http://localhost:3000` 啟動。

### 生產構建

```bash
npm run build
```

構建文件將輸出到 `dist` 目錄。

### 預覽生產構建

```bash
npm run preview
```

## 部署到 Vercel

### 方法 1：透過 Vercel CLI

1. 安裝 Vercel CLI：
```bash
npm install -g vercel
```

2. 登入 Vercel：
```bash
vercel login
```

3. 部署專案：
```bash
vercel
```

4. 在 Vercel Dashboard 設定環境變數：
   - `VITE_DEEPSEEK_API_KEY`：你的 DeepSeek API 金鑰

### 方法 2：透過 GitHub（推薦）

1. 將專案推送到 GitHub
2. 在 [Vercel](https://vercel.com) 導入 GitHub 專案
3. 設定環境變數
4. 點擊部署

Vercel 會自動檢測 Vite 專案並進行配置。

## 專案結構

```
AI_essay_grader/
├── src/
│   ├── components/          # React 組件
│   │   ├── PhoneFrame.jsx   # iPhone 框架
│   │   └── TabBar.jsx       # 底部導航欄
│   ├── pages/               # 頁面組件
│   │   ├── HomePage.jsx     # 首頁
│   │   ├── UploadPage.jsx   # 上傳頁面
│   │   ├── ResultPage.jsx   # 批改結果頁面
│   │   └── HistoryPage.jsx  # 歷史記錄頁面
│   ├── utils/               # 工具函數
│   │   ├── imageProcessor.js # 圖片處理與 OCR
│   │   ├── aiGrader.js       # AI 批改引擎
│   │   └── pdfExporter.js    # PDF 匯出
│   ├── App.jsx              # 主應用組件
│   ├── main.jsx             # 應用入口
│   └── index.css            # 全局樣式
├── public/                  # 靜態資源
├── index.html               # HTML 模板
├── package.json             # 專案配置
├── vite.config.js           # Vite 配置
├── tailwind.config.js       # Tailwind 配置
├── vercel.json              # Vercel 配置
└── README.md                # 專案說明

```

## 使用說明

### 1. 上傳作文

- 點擊「上傳」標籤
- 選擇「拍照上傳」或「選擇圖片」
- 支援選擇多張照片（會自動拼接）
- 確認照片清晰後點擊「開始批改」

### 2. 查看結果

- 系統會自動進行圖片處理和 OCR
- AI 批改完成後顯示詳細結果
- 包含總分、分項評分、錯誤標註、佳句點評等

### 3. 管理歷史

- 點擊「歷史」標籤查看所有批改記錄
- 使用搜尋框搜尋關鍵字
- 使用標籤篩選不同等級的作文
- 點擊記錄查看詳情，向左滑動刪除

### 4. 匯出 PDF

- 在結果頁面點擊下載圖標
- 系統會生成包含完整批改結果的 PDF

## API 說明

### DeepSeek API

本應用使用 DeepSeek API 進行 AI 批改。如果未配置 API 金鑰，系統會自動使用模擬數據以便測試功能。

獲取 API 金鑰：
1. 訪問 [DeepSeek 官網](https://www.deepseek.com)
2. 註冊帳號並獲取 API 金鑰
3. 將金鑰配置到 `.env` 文件

## 注意事項

- 首次使用會下載 OCR 訓練數據（約 10MB），請耐心等待
- 確保上傳的照片清晰、光線充足
- 建議每張照片大小不超過 5MB
- 批改記錄保存在瀏覽器本地存儲（localStorage）
- 清除瀏覽器數據會導致歷史記錄丟失

## 開發計劃

- [ ] 支援手寫字體訓練以提高 OCR 準確度
- [ ] 新增作文題目庫
- [ ] 新增學習曲線圖表
- [ ] 支援多用戶系統
- [ ] 新增教師後台管理
- [ ] 支援更多 AI 模型選擇

## 授權

MIT License

## 聯絡方式

如有問題或建議，歡迎提出 Issue。
