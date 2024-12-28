import { MaybeRef, nextTick, Ref, unref } from "vue";




export function useDownloadPDF<T>(fileName: MaybeRef<string>, data: Ref<T>, fillPdfFunc: (t: T) => Promise<string>) {
    async function createDownload() {
        console.log('create')
        const content = await fillPdfFunc(data.value);

        // const linkSource = `data:application/pdf;base64,${content}`;
        const downloadLink = document.createElement('a');

        downloadLink.href = content;
        downloadLink.target = '_self';
        downloadLink.download = unref(fileName);
        downloadLink.click(); 
        await nextTick()
        downloadLink.remove()
    }



    return {
        createDownload
    }
}