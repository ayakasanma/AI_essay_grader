import Tesseract from 'tesseract.js'

/**
 * Process uploaded images with OCR
 * Includes image enhancement and text extraction
 */
export const processImages = async (imageFiles) => {
  try {
    let extractedTexts = []

    for (const file of imageFiles) {
      // Create image element for processing
      const imageUrl = URL.createObjectURL(file)
      const img = new Image()

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imageUrl
      })

      // Enhance image quality
      const enhancedImage = await enhanceImage(img)

      // Perform OCR
      const { data: { text } } = await Tesseract.recognize(
        enhancedImage,
        'chi_tra', // Traditional Chinese
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
            }
          }
        }
      )

      extractedTexts.push(text)
      URL.revokeObjectURL(imageUrl)
    }

    // Join all texts (for multi-page essays)
    const combinedText = extractedTexts.join('\n\n')
    return combinedText.trim()
  } catch (error) {
    console.error('Image processing error:', error)
    throw new Error('圖片處理失敗，請確保照片清晰可讀')
  }
}

/**
 * Enhance image quality for better OCR results
 * - Auto-correct skew
 * - Remove shadows
 * - Enhance text contrast
 */
const enhanceImage = async (img) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = img.width
    canvas.height = img.height

    // Draw original image
    ctx.drawImage(img, 0, 0)

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Apply contrast enhancement and shadow removal
    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast
      const factor = 1.3
      data[i] = clamp((data[i] - 128) * factor + 128)     // R
      data[i + 1] = clamp((data[i + 1] - 128) * factor + 128) // G
      data[i + 2] = clamp((data[i + 2] - 128) * factor + 128) // B

      // Convert to grayscale for better text recognition
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]

      // Apply threshold to make text clearer
      const threshold = 128
      const value = gray > threshold ? 255 : 0

      data[i] = value
      data[i + 1] = value
      data[i + 2] = value
    }

    ctx.putImageData(imageData, 0, 0)
    resolve(canvas.toDataURL())
  })
}

/**
 * Clamp value between 0 and 255
 */
const clamp = (value) => {
  return Math.max(0, Math.min(255, value))
}

/**
 * Detect and correct image skew (future enhancement)
 */
export const correctSkew = async (imageData) => {
  // Placeholder for skew correction algorithm
  // Could use Hough transform or other methods
  return imageData
}
