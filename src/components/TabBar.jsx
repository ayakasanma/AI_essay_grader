import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Upload, History, FileText } from 'lucide-react'

const TabBar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { path: '/', icon: Home, label: '首頁' },
    { path: '/upload', icon: Upload, label: '上傳' },
    { path: '/history', icon: History, label: '歷史' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 safe-area-bottom">
      <div className="flex justify-around items-center h-20 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = isActive(tab.path)

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                active ? 'text-ios-blue' : 'text-gray-500'
              }`}
            >
              <Icon
                size={24}
                className={`mb-1 transition-transform duration-200 ${
                  active ? 'scale-110' : 'scale-100'
                }`}
              />
              <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TabBar
