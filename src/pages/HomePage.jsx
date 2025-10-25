import { useNavigate } from 'react-router-dom'
import { Upload, BookOpen, TrendingUp, Award } from 'lucide-react'

const HomePage = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: Upload,
      title: '快速上傳',
      description: '支援拍照或選擇圖片',
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      title: 'AI 智能批改',
      description: '專業的作文評分系統',
      color: 'bg-green-500'
    },
    {
      icon: TrendingUp,
      title: '詳細分析',
      description: '多維度評分與建議',
      color: 'bg-purple-500'
    },
    {
      icon: Award,
      title: '歷史記錄',
      description: '追蹤進步軌跡',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-ios-blue/10 to-ios-gray">
      {/* Hero Section */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">AI 作文批改</h1>
        <p className="text-lg text-gray-600">讓 AI 助你提升寫作能力</p>
      </div>

      {/* Quick Action Card */}
      <div className="px-6 mb-6">
        <button
          onClick={() => navigate('/upload')}
          className="w-full ios-card bg-gradient-to-r from-ios-blue to-blue-600 text-white p-8 tap-feedback"
        >
          <Upload className="mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold mb-2">開始批改</h2>
          <p className="text-blue-100">上傳作文照片，立即獲得專業評分</p>
        </button>
      </div>

      {/* Features Grid */}
      <div className="px-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">功能特色</h3>
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="ios-card tap-feedback">
                <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="text-white" size={24} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 pb-8">
        <div className="ios-card bg-gradient-to-br from-gray-50 to-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">評分標準</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">立意取材</span>
              <span className="text-ios-blue font-semibold">25%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">結構組織</span>
              <span className="text-ios-blue font-semibold">25%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">遣詞造句</span>
              <span className="text-ios-blue font-semibold">25%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">錯別字與標點</span>
              <span className="text-ios-blue font-semibold">25%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
