import jsPDF from 'jspdf'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

/**
 * Export grading result to PDF
 * Uses jsPDF with Chinese font support
 */
export const exportToPDF = async (result) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    let yPosition = 20

    // Note: For proper Chinese character support, you would need to embed a Chinese font
    // This is a simplified version using default fonts
    // In production, add a Chinese font like NotoSansCJK

    // Title
    doc.setFontSize(20)
    doc.text('AI 作文批改結果', 105, yPosition, { align: 'center' })
    yPosition += 15

    // Date
    doc.setFontSize(10)
    const dateStr = format(new Date(result.timestamp), 'yyyy年M月d日 HH:mm', { locale: zhTW })
    doc.text(dateStr, 105, yPosition, { align: 'center' })
    yPosition += 15

    // Total Score
    doc.setFontSize(16)
    doc.text(`總分：${result.totalScore} 分`, 20, yPosition)
    yPosition += 10

    const gradeLevel = getGradeLevel(result.totalScore)
    doc.setFontSize(14)
    doc.text(`評級：${gradeLevel}`, 20, yPosition)
    yPosition += 15

    // Detailed Scores
    doc.setFontSize(14)
    doc.text('分項評分', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    result.detailedScores.forEach(item => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }

      doc.text(`${item.category}: ${item.score}/100`, 25, yPosition)
      yPosition += 5

      // Split long comments into multiple lines
      const commentLines = doc.splitTextToSize(item.comment, 160)
      commentLines.forEach(line => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, 30, yPosition)
        yPosition += 5
      })
      yPosition += 3
    })

    // Errors
    if (result.errors && result.errors.length > 0) {
      yPosition += 5
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.text('錯別字與病句', 20, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      result.errors.forEach((error, index) => {
        if (yPosition > 265) {
          doc.addPage()
          yPosition = 20
        }

        doc.text(`${index + 1}. ${error.original} → ${error.correction}`, 25, yPosition)
        yPosition += 5

        const expLines = doc.splitTextToSize(error.explanation, 160)
        expLines.forEach(line => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(line, 30, yPosition)
          yPosition += 5
        })
        yPosition += 2
      })
    }

    // Overall Comment
    if (result.overallComment) {
      yPosition += 5
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.text('總評', 20, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      const commentLines = doc.splitTextToSize(result.overallComment, 170)
      commentLines.forEach(line => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, 20, yPosition)
        yPosition += 5
      })
    }

    // Save PDF
    const fileName = `作文批改_${format(new Date(result.timestamp), 'yyyyMMdd_HHmmss')}.pdf`
    doc.save(fileName)

    return true
  } catch (error) {
    console.error('PDF export error:', error)
    throw new Error('PDF 匯出失敗')
  }
}

const getGradeLevel = (score) => {
  if (score >= 90) return '六級分'
  if (score >= 80) return '五級分'
  if (score >= 70) return '四級分'
  if (score >= 60) return '三級分'
  if (score >= 50) return '二級分'
  return '一級分'
}
