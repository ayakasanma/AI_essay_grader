import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Trash2, FileText, Calendar, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

const HistoryPage = ({ history, deleteResult }) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterGrade, setFilterGrade] = useState('all')

  const getGradeLevel = (score) => {
    if (score >= 90) return '六級分'
    if (score >= 80) return '五級分'
    if (score >= 70) return '四級分'
    if (score >= 60) return '三級分'
    if (score >= 50) return '二級分'
    return '一級分'
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-purple-600 bg-purple-100'
    if (score >= 60) return 'text-orange-600 bg-orange-100'
    if (score >= 50) return 'text-red-600 bg-red-100'
    return 'text-gray-600 bg-gray-100'
  }

  const filteredHistory = history.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.originalText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getGradeLevel(item.totalScore).includes(searchQuery)

    const matchesGrade = filterGrade === 'all' ||
      getGradeLevel(item.totalScore) === filterGrade

    return matchesSearch && matchesGrade
  })

  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (window.confirm('確定要刪除這筆記錄嗎？')) {
      deleteResult(id)
    }
  }

  const grades = ['all', '六級分', '五級分', '四級分', '三級分', '二級分', '一級分']

  return (
    <div className="h-full overflow-y-auto bg-ios-gray">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">歷史記錄</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜尋關鍵字..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-ios focus:outline-none focus:ring-2 focus:ring-ios-blue"
          />
        </div>

        {/* Grade Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {grades.map(grade => (
            <button
              key={grade}
              onClick={() => setFilterGrade(grade)}
              className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                filterGrade === grade
                  ? 'bg-ios-blue text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {grade === 'all' ? '全部' : grade}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      {history.length > 0 && (
        <div className="px-6 py-4">
          <div className="ios-card bg-gradient-to-r from-ios-blue to-blue-600 text-white p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{history.length}</div>
                <div className="text-xs text-blue-100">總記錄</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {(history.reduce((sum, item) => sum + item.totalScore, 0) / history.length).toFixed(0)}
                </div>
                <div className="text-xs text-blue-100">平均分</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.max(...history.map(item => item.totalScore))}
                </div>
                <div className="text-xs text-blue-100">最高分</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="px-6 pb-8">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {history.length === 0 ? '尚無批改記錄' : '無符合條件的記錄'}
            </h3>
            <p className="text-gray-600 mb-6">
              {history.length === 0 ? '開始上傳作文，建立你的第一筆批改記錄' : '請調整搜尋條件'}
            </p>
            {history.length === 0 && (
              <button
                onClick={() => navigate('/upload')}
                className="ios-button"
              >
                立即上傳
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/result/${item.id}`)}
                className="ios-card tap-feedback cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full font-bold text-sm ${getScoreColor(item.totalScore)}`}>
                        {item.totalScore} 分
                      </span>
                      <span className="text-xs text-gray-500">
                        {getGradeLevel(item.totalScore)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {item.originalText?.substring(0, 100)}...
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="ml-3 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {format(new Date(item.timestamp), 'M/d HH:mm', { locale: zhTW })}
                    </span>
                    {item.detailedScores && (
                      <span className="flex items-center gap-1">
                        <TrendingUp size={14} />
                        {item.detailedScores.length} 項評分
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage
