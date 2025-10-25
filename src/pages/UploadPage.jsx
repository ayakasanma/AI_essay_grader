import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Upload, Image as ImageIcon, X, Loader2, Plus } from 'lucide-react'
import { processImages } from '../utils/imageProcessor'
import { gradeEssay } from '../utils/aiGrader'

const UploadPage = ({ addGradingResult }) => {
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const imageUrls = files.map(file => ({
        file,
        url: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9)
      }))
      setImages(prev => [...prev, ...imageUrls])
    }
  }

  const removeImage = (id) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id)
      // Clean up object URLs
      const removed = prev.find(img => img.id === id)
      if (removed) URL.revokeObjectURL(removed.url)
      return updated
    })
  }

  const handleSubmit = async () => {
    if (images.length === 0) {
      alert('請先上傳作文照片')
      return
    }

    setIsProcessing(true)

    try {
      // Step 1: Process images (OCR + enhancement)
      setProcessingStep('正在處理圖片...')
      const processedText = await processImages(images.map(img => img.file))

      // Step 2: Call AI grading API
      setProcessingStep('AI 批改中...')
      const gradingResult = await gradeEssay(processedText)

      // Step 3: Save result
      setProcessingStep('保存結果...')
      const resultId = addGradingResult({
        originalText: processedText,
        images: images.map(img => img.url),
        ...gradingResult
      })

      // Navigate to result page
      navigate(`/result/${resultId}`)
    } catch (error) {
      console.error('Grading error:', error)
      alert('批改過程發生錯誤：' + error.message)
    } finally {
      setIsProcessing(false)
      setProcessingStep('')
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-ios-gray">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">上傳作文</h1>
        <p className="text-sm text-gray-600 mt-1">支援單張或多張照片</p>
      </div>

      {/* Upload Options */}
      {images.length === 0 && (
        <div className="px-6 py-8 space-y-4">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="w-full ios-card bg-gradient-to-r from-ios-blue to-blue-600 text-white p-6 tap-feedback flex items-center justify-center gap-3"
          >
            <Camera size={32} />
            <div className="text-left">
              <h3 className="text-xl font-bold">拍照上傳</h3>
              <p className="text-sm text-blue-100">開啟相機拍攝作文</p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full ios-card tap-feedback flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300"
          >
            <Upload size={32} className="text-gray-600" />
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900">選擇圖片</h3>
              <p className="text-sm text-gray-600">從相簿中選擇</p>
            </div>
          </button>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              已選擇 {images.length} 張照片
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-ios-blue font-semibold tap-feedback"
            >
              <Plus size={20} />
              添加
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {images.map((image) => (
              <div key={image.id} className="relative ios-card p-2">
                <img
                  src={image.url}
                  alt="Essay"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 tap-feedback shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full ios-button text-lg font-bold py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                {processingStep}
              </span>
            ) : (
              '開始批改'
            )}
          </button>
        </div>
      )}

      {/* Tips Section */}
      <div className="px-6 pb-8">
        <div className="ios-card bg-blue-50 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">拍照小技巧</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 確保光線充足，避免陰影</li>
            <li>• 保持相機穩定，避免模糊</li>
            <li>• 將作文完整置於畫面中</li>
            <li>• 多張照片會自動拼接處理</li>
          </ul>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

export default UploadPage
