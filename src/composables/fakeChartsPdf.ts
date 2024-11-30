import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

async function createPDF() {
    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()
    const fontSize = 30
    page.drawText('Creating PDFs in JavaScript is awesome!', {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.53, 0.71),
    })

    
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

    return pdfDataUri
}

export async function useFakeChartsPdf() {

    const formUrl = '/public/PatientTestForm.pdf'
    const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(formPdfBytes)

    const form = pdfDoc.getForm()
    const nameField = form.getTextField('fullName')
    nameField.setText('Test Name')

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

    return pdfDataUri
}