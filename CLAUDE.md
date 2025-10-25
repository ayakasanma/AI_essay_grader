# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI 作文批改系統 - A React-based web application that uses DeepSeek AI to grade Chinese essays with professional feedback. The app features an iPhone 15 Pro styled UI, OCR text extraction from photos, and comprehensive grading analysis based on Taiwan's junior high school exam standards.

## Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS (iOS-themed)
- **Routing**: React Router DOM
- **OCR**: Tesseract.js (Traditional Chinese)
- **AI API**: DeepSeek
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **Deployment**: Vercel

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Architecture

### Core Modules

1. **Image Processing (`src/utils/imageProcessor.js`)**
   - OCR text extraction using Tesseract.js
   - Image enhancement (contrast, shadow removal, grayscale)
   - Multi-image stitching for long essays
   - Traditional Chinese (chi_tra) language support

2. **AI Grading Engine (`src/utils/aiGrader.js`)**
   - DeepSeek API integration
   - Structured prompt generation based on Taiwan exam standards
   - Six-tier grading system (一級分 to 六級分)
   - Four category scoring: 立意取材, 結構組織, 遣詞造句, 錯別字與標點
   - Mock data fallback when API unavailable

3. **PDF Export (`src/utils/pdfExporter.js`)**
   - Generate downloadable PDF reports
   - Multi-page support with automatic pagination
   - Include all grading details and comments

### Component Structure

- **PhoneFrame**: iPhone 15 Pro simulator with Dynamic Island, status bar, and hardware buttons
- **TabBar**: iOS-style bottom navigation (Home, Upload, History)
- **Pages**:
  - `HomePage`: Feature overview and grading standards
  - `UploadPage`: Photo upload with camera/gallery support
  - `ResultPage`: Detailed grading results with scores, errors, highlights, and structure analysis
  - `HistoryPage`: Record management with search and filter (stores last 40 results)

### Data Flow

1. User uploads photo(s) → `UploadPage`
2. Images processed via OCR → `imageProcessor.js`
3. Extracted text sent to AI → `aiGrader.js`
4. Results stored in localStorage → `App.jsx` state
5. Navigate to result page → `ResultPage`
6. Export PDF if needed → `pdfExporter.js`

### State Management

- Uses React hooks (useState, useEffect)
- History stored in localStorage (max 40 records)
- Results passed via route params and props
- No external state management library needed

## Environment Configuration

Create `.env` file (copy from `.env.example`):

```
VITE_DEEPSEEK_API_KEY=your_api_key_here
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
```

**Important**: All env vars must be prefixed with `VITE_` to be accessible in the app.

## Grading System Details

Based on Taiwan's 國中教育會考 standards:

- **六級分 (90-100)**: Excellent
- **五級分 (80-89)**: Good
- **四級分 (70-79)**: Above average
- **三級分 (60-69)**: Average
- **二級分 (50-59)**: Needs improvement
- **一級分 (0-49)**: Significant improvement needed

Four evaluation categories (25% each):
1. 立意取材 (Theme & Content)
2. 結構組織 (Structure & Organization)
3. 遣詞造句 (Diction & Sentence Construction)
4. 錯別字、格式與標點符號 (Errors, Format & Punctuation)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel dashboard
3. Set environment variable: `VITE_DEEPSEEK_API_KEY`
4. Deploy (auto-detected as Vite project)

Configuration in `vercel.json` handles SPA routing.

## Key Implementation Notes

### OCR Performance
- First load downloads ~10MB training data (Tesseract)
- Image enhancement improves accuracy: contrast boost + grayscale + threshold
- Supports multi-image processing for long essays

### API Integration
- DeepSeek API called with structured prompt
- Response parsed as JSON with fallback to mock data
- Error handling for 401 (invalid key) and 429 (rate limit)
- Mock grading always available for testing without API key

### UI/UX Design
- iPhone 15 Pro dimensions: 393x852px
- Dynamic Island animation with blue pulse
- iOS-style status bar with live clock
- Tab bar with active state indicators
- Smooth transitions and tap feedback animations
- Tailwind custom colors: ios-blue (#007AFF), ios-gray (#F2F2F7)

### Storage
- localStorage key: `gradingHistory`
- Automatic 40-record limit (FIFO)
- Results include: originalText, images, scores, errors, highlights, structure, overallComment
- Each record has unique ID (timestamp-based) and ISO timestamp

## Common Development Tasks

### Adding New Grading Criteria
1. Update prompt in `aiGrader.js` → `buildGradingPrompt()`
2. Modify result parsing in `parseGradingResponse()`
3. Update mock data structure in `getMockGradingResult()`
4. Add UI display in `ResultPage.jsx`

### Improving OCR Accuracy
- Adjust enhancement parameters in `imageProcessor.js` → `enhanceImage()`
- Modify contrast factor, threshold value
- Consider adding skew correction

### Customizing UI Theme
- Edit Tailwind config in `tailwind.config.js`
- Modify iOS colors and border radius
- Update PhoneFrame dimensions for different devices

### Testing Without API Key
- Remove `.env` or leave `VITE_DEEPSEEK_API_KEY` empty
- App automatically uses mock grading data
- All features functional except actual AI grading
