# 快速開始指南

5 分鐘內啟動 AI 作文批改系統！

## 前置需求

- Node.js 16+ （建議使用 18 或 20）
- npm 或 yarn
- 現代瀏覽器（Chrome, Firefox, Safari, Edge）

## 安裝步驟

### 1. 安裝依賴

```bash
npm install
```

這會安裝所有必要的套件：
- React 和 React DOM
- Vite（構建工具）
- Tailwind CSS（樣式）
- Tesseract.js（OCR）
- 其他工具庫

### 2. 配置環境變數（可選）

```bash
# 複製環境變數範本
cp .env.example .env

# 編輯 .env，添加你的 DeepSeek API 金鑰
# VITE_DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxx
```

**注意**：不配置 API 金鑰也可以運行！應用會使用模擬數據進行批改。

### 3. 啟動開發伺服器

```bash
npm run dev
```

應用會在 `http://localhost:3000` 啟動。

### 4. 開始使用

1. 在瀏覽器打開 `http://localhost:3000`
2. 你會看到 iPhone 15 Pro 風格的界面
3. 點擊「上傳」標籤
4. 上傳作文照片（或使用測試圖片）
5. 點擊「開始批改」
6. 查看詳細的批改結果！

## 功能測試

### 測試拍照上傳
- 拍攝一張手寫作文照片
- 確保光線充足、文字清晰
- 支持多張照片（會自動拼接）

### 測試 AI 批改
如果沒有 API 金鑰：
- 系統會使用模擬數據
- 仍可查看完整的批改界面和功能

如果有 API 金鑰：
- 會調用真實的 DeepSeek API
- 獲得專業的 AI 批改結果

### 測試歷史記錄
- 批改完成後自動保存
- 支持搜尋和篩選
- 最多保存 40 筆記錄

### 測試 PDF 匯出
- 在結果頁面點擊下載圖標
- 生成包含完整批改結果的 PDF

## 開發模式功能

### 熱重載
修改代碼後，頁面會自動刷新，無需手動重啟。

### 開發工具
- React DevTools：查看組件狀態
- 瀏覽器 Console：查看 OCR 進度和 API 調用

### 調試技巧

**查看 localStorage**
```javascript
// 在瀏覽器 Console 中
localStorage.getItem('gradingHistory')
```

**清除歷史記錄**
```javascript
localStorage.removeItem('gradingHistory')
```

**模擬 API 錯誤**
暫時移除 `.env` 文件中的 API 金鑰，觸發 fallback 機制。

## 構建生產版本

```bash
# 構建
npm run build

# 預覽構建結果
npm run preview
```

構建產物在 `dist` 目錄，可直接部署到任何靜態托管服務。

## 常見問題

### Q: 安裝失敗？
```bash
# 清除緩存重試
rm -rf node_modules package-lock.json
npm install
```

### Q: 端口 3000 被占用？
修改 `vite.config.js`:
```javascript
server: {
  port: 3001 // 改為其他端口
}
```

### Q: OCR 無法識別中文？
- 首次使用需要下載訓練數據（約 10MB）
- 檢查網絡連接
- 等待加載完成

### Q: 批改結果不準確？
- 確保照片清晰
- 嘗試調整光線和角度
- 如使用模擬數據，配置真實 API 金鑰

## 下一步

✅ **部署到線上**
查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解如何部署到 Vercel/Netlify

✅ **自定義界面**
修改 `tailwind.config.js` 更改顏色和樣式

✅ **優化 OCR**
調整 `src/utils/imageProcessor.js` 中的圖片增強參數

✅ **擴展功能**
添加新的評分維度或自定義批改規則

## 需要幫助？

- 查看 [README.md](./README.md) 了解完整功能
- 查看 [CLAUDE.md](./CLAUDE.md) 了解架構細節
- 提交 Issue 報告問題或建議

---

**恭喜！** 你已成功啟動 AI 作文批改系統！🎉

現在開始批改你的第一篇作文吧！
