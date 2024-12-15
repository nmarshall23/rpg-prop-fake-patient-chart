import { PDFDocument, StandardFonts, rgb, PDFName, PDFArray, PDFForm, PDFTextField, PDFFont, PDFObject } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'


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

function logFormFields(form: PDFForm) {
    const fields = form.getFields()

    console.group(`Get Form Fields count ${fields.length}`)
    fields.forEach(field => {
        const type = field.constructor.name
        const name = field.getName()
        console.log(`${type}: ${name}`)
    })
    console.groupEnd()
}

async function getFont(pdfDoc: PDFDocument, fontUrl: string) {
    const font1Bytes = await fetch(fontUrl).then(res => res.arrayBuffer())
    const font = await pdfDoc.embedFont(font1Bytes)
    return font
}

function isPDFArray(obj: PDFObject | undefined): obj is PDFArray {
    return obj !== undefined && (obj as PDFArray).asRectangle !== undefined

}

function fillInSectionWithFont(pdfDoc: PDFDocument, font: PDFFont, fontSize: number, inputField: PDFTextField, text: string) {
    const rect = inputField.acroField.dict.get(PDFName.of("Rect"))

    if (isPDFArray(rect)) {
        const r = rect.asRectangle()

        const page = pdfDoc.getPage(0)

        const w = font.widthOfTextAtSize(text, fontSize / 1.5)

        console.log(`text width ${w}, rect.width ${r.width}, rect.x ${r.x}`)


        page.drawText(text, {
            x: r.x + 1 + (Math.random() * 6),
            y: (r.y + r.height) - (fontSize / 1.3) - (Math.random() * 6),
            size: fontSize,
            font,
        })
    }


}

export async function useFakeChartsPdf() {

    const formUrl = '/PatientTestForm.pdf'
    const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(formPdfBytes)
    pdfDoc.registerFontkit(fontkit)

    const form = pdfDoc.getForm()

    logFormFields(form)

    const nameField = form.getTextField('fullName')
    nameField.setText('Test Name')

    const notesField = form.getTextField('notes')


    const handWrittenFont = await getFont(pdfDoc, '/Zeyada-Regular.ttf')


    fillInSectionWithFont(pdfDoc, handWrittenFont, 32, notesField, "Creating PDFs in JavaScript \nis awesome!")


    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

    return pdfDataUri
}