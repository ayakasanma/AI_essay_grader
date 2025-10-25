import { useEffect, useState } from 'react'

const PhoneFrame = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center p-4">
      {/* iPhone 15 Pro Frame */}
      <div className="relative" style={{ width: '393px', height: '852px' }}>
        {/* Phone outer frame */}
        <div className="absolute inset-0 bg-gray-900 rounded-[60px] shadow-2xl overflow-hidden border-8 border-gray-800">
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-9 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>

          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-lg z-40 flex items-end pb-2 px-8">
            <div className="flex justify-between items-center w-full text-sm font-semibold">
              <span className="text-black">{formatTime(currentTime)}</span>
              <div className="flex items-center gap-1">
                {/* Signal Icon */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 18h3v2H2v-2zm5-4h3v6H7v-6zm5-4h3v10h-3V10zm5-4h3v14h-3V6z" />
                </svg>
                {/* WiFi Icon */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                </svg>
                {/* Battery Icon */}
                <svg className="w-6 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="7" width="18" height="10" rx="2" fill="currentColor" />
                  <rect x="4" y="9" width="14" height="6" fill="white" />
                  <rect x="4" y="9" width="10" height="6" fill="currentColor" />
                  <rect x="20" y="10" width="2" height="4" rx="1" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>

          {/* App Content */}
          <div className="relative h-full w-full pt-14">
            {children}
          </div>
        </div>

        {/* Side buttons */}
        <div className="absolute -left-1 top-28 w-1 h-12 bg-gray-700 rounded-l"></div>
        <div className="absolute -left-1 top-44 w-1 h-16 bg-gray-700 rounded-l"></div>
        <div className="absolute -left-1 top-64 w-1 h-16 bg-gray-700 rounded-l"></div>
        <div className="absolute -right-1 top-52 w-1 h-20 bg-gray-700 rounded-r"></div>
      </div>
    </div>
  )
}

export default PhoneFrame
