export const resolveElement = (
    document: Document,
    el: string | HTMLElement
): HTMLElement | undefined => el instanceof HTMLElement ? el : document.querySelector(el) as HTMLElement;
