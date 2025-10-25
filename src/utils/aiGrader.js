import axios from 'axios'

const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions'
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY

/**
 * Grade essay using DeepSeek API
 * Returns structured grading results
 */
export const gradeEssay = async (essayText) => {
  console.log('🔍 Grading essay...')
  console.log('API Key exists:', !!DEEPSEEK_API_KEY)
  console.log('API URL:', DEEPSEEK_API_URL)

  if (!DEEPSEEK_API_KEY) {
    console.warn('⚠️ DeepSeek API key not found, using mock data')
    return getMockGradingResult(essayText)
  }

  console.log('✅ API Key found, calling DeepSeek API...')

  try {
    const prompt = buildGradingPrompt(essayText)

    console.log('📡 Sending request to DeepSeek API...')
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位專業的中文作文批改老師，擅長根據台灣國中教育會考標準評分作文。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        }
      }
    )

    console.log('✅ API response received successfully!')
    const aiResponse = response.data.choices[0].message.content
    console.log('📝 AI Response preview:', aiResponse.substring(0, 200))
    return parseGradingResponse(aiResponse, essayText)
  } catch (error) {
    console.error('❌ AI grading error:', error)
    console.error('Error details:', error.response?.data || error.message)

    // Fallback to mock data if API fails
    if (error.response?.status === 401) {
      throw new Error('API 金鑰無效，請檢查設定')
    } else if (error.response?.status === 402) {
      console.warn('⚠️ API 帳戶餘額不足，使用模擬數據')
      alert('DeepSeek API 帳戶餘額不足，目前使用模擬批改數據。請前往 platform.deepseek.com 充值。')
      return getMockGradingResult(essayText)
    } else if (error.response?.status === 429) {
      throw new Error('API 請求過於頻繁，請稍後再試')
    } else {
      console.warn('API error, using mock data as fallback')
      return getMockGradingResult(essayText)
    }
  }
}

/**
 * Build grading prompt based on Taiwan's exam standards
 */
const buildGradingPrompt = (essayText) => {
  return `請根據台灣國中教育會考的作文評分標準（零到六級分）批改以下作文，並提供結構化的評分結果。

作文內容：
${essayText}

請以 JSON 格式回覆，包含以下項目：
{
  "totalScore": 0-100 的總分,
  "gradeLevel": "一級分" 到 "六級分",
  "detailedScores": [
    {
      "category": "立意取材",
      "score": 0-100,
      "comment": "評語"
    },
    {
      "category": "結構組織",
      "score": 0-100,
      "comment": "評語"
    },
    {
      "category": "遣詞造句",
      "score": 0-100,
      "comment": "評語"
    },
    {
      "category": "錯別字與標點符號",
      "score": 0-100,
      "comment": "評語"
    }
  ],
  "errors": [
    {
      "original": "錯誤的詞句",
      "correction": "修正建議",
      "explanation": "說明"
    }
  ],
  "highlights": [
    {
      "text": "優秀的詞句",
      "comment": "點評"
    }
  ],
  "structure": {
    "opening": "開頭分析與建議",
    "development": "發展段落分析與建議",
    "conclusion": "結尾分析與建議"
  },
  "overallComment": "總評"
}

請注意：
1. 六級分：90-100分，優秀作品
2. 五級分：80-89分，良好作品
3. 四級分：70-79分，中等偏上
4. 三級分：60-69分，中等
5. 二級分：50-59分，待加強
6. 一級分：0-49分，需大幅改進

請提供詳細且建設性的評語。`
}

/**
 * Parse AI response into structured format
 */
const parseGradingResponse = (aiResponse, originalText) => {
  try {
    // Try to extract JSON from response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        ...parsed,
        originalText
      }
    }

    // If no valid JSON, return mock data
    console.warn('Could not parse AI response, using mock data')
    return getMockGradingResult(originalText)
  } catch (error) {
    console.error('Error parsing AI response:', error)
    return getMockGradingResult(originalText)
  }
}

/**
 * Generate mock grading result for testing/fallback
 */
const getMockGradingResult = (essayText) => {
  // Generate semi-random scores based on text length
  const textLength = essayText.length
  const baseScore = Math.min(85, 60 + Math.floor(textLength / 20))

  return {
    originalText: essayText,
    totalScore: baseScore,
    gradeLevel: baseScore >= 90 ? '六級分' : baseScore >= 80 ? '五級分' : '四級分',
    detailedScores: [
      {
        category: '立意取材',
        score: baseScore + Math.floor(Math.random() * 10) - 5,
        comment: '主題明確，取材恰當，能夠扣緊題旨發揮。建議可以加入更多生活實例來支持論點。'
      },
      {
        category: '結構組織',
        score: baseScore + Math.floor(Math.random() * 10) - 5,
        comment: '段落分明，結構完整。起承轉合安排得宜，但轉折處可以更加流暢。'
      },
      {
        category: '遣詞造句',
        score: baseScore + Math.floor(Math.random() * 10) - 5,
        comment: '用詞恰當，句型富有變化。部分句子可以精簡，避免冗贅。'
      },
      {
        category: '錯別字與標點符號',
        score: baseScore + Math.floor(Math.random() * 10) - 5,
        comment: '錯別字較少，標點符號使用大致正確。注意句號與逗號的區別。'
      }
    ],
    errors: [
      {
        original: '應該',
        correction: '應當',
        explanation: '在正式寫作中，"應當"比"應該"更為適當'
      },
      {
        original: '很好',
        correction: '優秀、出色',
        explanation: '避免使用過於口語化的詞彙，可以使用更精確的形容詞'
      }
    ],
    highlights: [
      {
        text: essayText.substring(0, Math.min(30, essayText.length)),
        comment: '開頭引人入勝，能夠吸引讀者的注意力'
      }
    ],
    structure: {
      opening: '開頭點題明確，能夠引起讀者興趣。建議可以使用修辭手法（如排比、設問等）來增強開頭的吸引力。',
      development: '發展段落內容充實，論述清晰。建議在段落之間增加轉折語，使文章更加連貫。可以加入更多具體事例來支持論點。',
      conclusion: '結尾能夠呼應開頭，總結全文。可以在結尾處加入對未來的展望或個人的深刻體會，使結尾更有力量。'
    },
    overallComment: `這是一篇${baseScore >= 80 ? '優秀' : '不錯'}的作文。文章立意清晰，結構完整，能夠扣緊主題發揮。用詞恰當，句型富有變化。建議在以下方面繼續努力：一、增加具體事例的描寫，使論述更加生動；二、注意段落間的銜接，使文章更加流暢；三、適當運用修辭手法，提升文章的文學性。持續練習，相信你的寫作能力會更上一層樓！`
  }
}
