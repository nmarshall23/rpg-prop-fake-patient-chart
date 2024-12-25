import { readonly } from "vue";


/* collect PT for reuse */
export function usePTs() {

    const ptContentFlex = readonly({
        content: { class: 'flex gap-3 mt-2' },
    })

    const ptContentFlexCol = readonly({
        content: { class: 'flex flex-col gap-3 mt-2' },
    })

    const ptContextGrid = readonly({
        content: { class: '' },
    })

    return {
        ptContentFlex,
        ptContentFlexCol,
        ptContextGrid,
    }
}


