import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PhoneFrame from './components/PhoneFrame'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import ResultPage from './pages/ResultPage'
import HistoryPage from './pages/HistoryPage'
import TabBar from './components/TabBar'

function App() {
  const [gradingHistory, setGradingHistory] = useState([])

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('gradingHistory')
    if (savedHistory) {
      setGradingHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gradingHistory', JSON.stringify(gradingHistory))
  }, [gradingHistory])

  const addGradingResult = (result) => {
    const newResult = {
      ...result,
      id: Date.now(),
      timestamp: new Date().toISOString()
    }

    setGradingHistory(prev => {
      const updated = [newResult, ...prev]
      // Keep only the latest 40 records
      return updated.slice(0, 40)
    })

    return newResult.id
  }

  const deleteGradingResult = (id) => {
    setGradingHistory(prev => prev.filter(item => item.id !== id))
  }

  return (
    <Router>
      <PhoneFrame>
        <div className="flex flex-col h-full bg-ios-gray">
          <div className="flex-1 overflow-y-auto pb-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/upload"
                element={<UploadPage addGradingResult={addGradingResult} />}
              />
              <Route path="/result/:id" element={<ResultPage history={gradingHistory} />} />
              <Route
                path="/history"
                element={
                  <HistoryPage
                    history={gradingHistory}
                    deleteResult={deleteGradingResult}
                  />
                }
              />
            </Routes>
          </div>
          <TabBar />
        </div>
      </PhoneFrame>
    </Router>
  )
}

export default App
