import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Share2, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { exportToPDF } from '../utils/pdfExporter'

const ResultPage = ({ history }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const result = history.find(item => item.id === parseInt(id))

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center bg-ios-gray">
        <div className="text-center px-6">
          <AlertCircle className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">找不到批改結果</h2>
          <button
            onClick={() => navigate('/history')}
            className="ios-button mt-4"
          >
            返回歷史記錄
          </button>
        </div>
      </div>
    )
  }

  const handleExportPDF = async () => {
    try {
      await exportToPDF(result)
      alert('PDF 已下載')
    } catch (error) {
      alert('下載失敗：' + error.message)
    }
  }

  const getGradeLevel = (score) => {
    if (score >= 90) return { level: '六級分', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 80) return { level: '五級分', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 70) return { level: '四級分', color: 'text-purple-600', bg: 'bg-purple-100' }
    if (score >= 60) return { level: '三級分', color: 'text-orange-600', bg: 'bg-orange-100' }
    if (score >= 50) return { level: '二級分', color: 'text-red-600', bg: 'bg-red-100' }
    return { level: '一級分', color: 'text-gray-600', bg: 'bg-gray-100' }
  }

  const grade = getGradeLevel(result.totalScore)

  return (
    <div className="h-full overflow-y-auto bg-ios-gray">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-ios-blue font-semibold tap-feedback"
          >
            <ArrowLeft size={20} />
            返回
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              className="tap-feedback text-ios-blue"
            >
              <Download size={22} />
            </button>
            <button className="tap-feedback text-ios-blue">
              <Share2 size={22} />
            </button>
          </div>
        </div>
        <h1 className="text-xl font-bold text-gray-900">批改結果</h1>
        <p className="text-sm text-gray-600">
          {format(new Date(result.timestamp), 'yyyy年M月d日 HH:mm', { locale: zhTW })}
        </p>
      </div>

      {/* Overall Score */}
      <div className="px-6 py-6">
        <div className="ios-card bg-gradient-to-br from-ios-blue to-blue-600 text-white p-6">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{result.totalScore}</div>
            <div className={`inline-block px-4 py-2 rounded-full ${grade.bg} ${grade.color} font-bold text-lg`}>
              {grade.level}
            </div>
            <p className="text-blue-100 mt-4">總分評級</p>
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">分項評分</h2>
        <div className="space-y-3">
          {result.detailedScores.map((item, index) => (
            <div key={index} className="ios-card">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{item.category}</span>
                <span className="text-ios-blue font-bold text-lg">{item.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-ios-blue h-2 rounded-full transition-all duration-500"
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{item.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Errors and Suggestions */}
      {result.errors && result.errors.length > 0 && (
        <div className="px-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">錯別字與病句</h2>
          <div className="ios-card">
            {result.errors.map((error, index) => (
              <div key={index} className="border-b border-gray-200 last:border-0 py-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-red-500 mt-1 flex-shrink-0" size={18} />
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <span className="line-through text-red-600">{error.original}</span>
                      <span className="mx-2">→</span>
                      <span className="text-green-600 font-semibold">{error.correction}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{error.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Good Phrases */}
      {result.highlights && result.highlights.length > 0 && (
        <div className="px-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">佳詞佳句</h2>
          <div className="ios-card">
            {result.highlights.map((highlight, index) => (
              <div key={index} className="border-b border-gray-200 last:border-0 py-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium bg-yellow-100 px-2 py-1 rounded inline">
                      {highlight.text}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{highlight.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structure Analysis */}
      {result.structure && (
        <div className="px-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">結構分析</h2>
          <div className="ios-card">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <h3 className="font-semibold text-gray-900">開頭</h3>
                </div>
                <p className="text-sm text-gray-700 ml-5">{result.structure.opening}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <h3 className="font-semibold text-gray-900">發展</h3>
                </div>
                <p className="text-sm text-gray-700 ml-5">{result.structure.development}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <h3 className="font-semibold text-gray-900">結尾</h3>
                </div>
                <p className="text-sm text-gray-700 ml-5">{result.structure.conclusion}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overall Comment */}
      {result.overallComment && (
        <div className="px-6 pb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">總評</h2>
          <div className="ios-card bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
            <p className="text-gray-800 leading-relaxed">{result.overallComment}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultPage
