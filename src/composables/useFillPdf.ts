import { PDFDocument, PDFForm } from "pdf-lib";
import { MaybeRef, unref } from "vue";


async function fillSinglePagePdfForm<T>(docTitle: MaybeRef<string>, formUrl: string, debugFormFields: boolean, data: T, fillDataInFormFunc: (f:PDFForm, data: T) => void) {
    const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);

    const form = pdfDoc.getForm();

    if (debugFormFields) {
        logFormFields(form)
    }

    fillDataInFormFunc(form, data);

    
    pdfDoc.setTitle(unref(docTitle))
    

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

    return pdfDataUri;
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

function setFormFieldsReadonly(form: PDFForm) {
    const fields = form.getFields()

    fields.forEach(field => {
        field.enableReadOnly()
    })
}

export function useFillPdf() {

    return {
        fillSinglePagePdfForm,
        setFormFieldsReadonly,
    }
}