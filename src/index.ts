import {resolveElement} from './utils/resolveElement';
import {watchElementSize} from './utils/watchElementSize';
import {watchVideoFrames} from './utils/watchVideoFrames';

export type StopDynamicBackground = () => void;

export interface DynamicBackgroundOptions {

    /* The source video element. */
    src: string | HTMLVideoElement;

    /* The canvas to project the dynamic background to. */
    target: string | HTMLCanvasElement;

    /* If src / target is a string this document will be used to resolve both elements. */
    document?: Document;
}

export const createDynamicBackground = (opt: DynamicBackgroundOptions): StopDynamicBackground => {
    const document = opt.document ?? window.document;
    const canvas = resolveElement(document, opt.target);
    const src = resolveElement(document, opt.src);

    if (!(src instanceof HTMLVideoElement)) {
        throw new Error(`Received invalid src, expects selector to HTMLVideoElement or the element itself but got ${src?.tagName}`,);
    } else if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error('Target element has to be a canvas.');
    }

    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    // Link video size to canvas
    const unwatchVideoSize = watchElementSize(src, () => {
        canvas.width = src.clientWidth;
        canvas.height = src.clientHeight;
    });

    // Watch each frame change
    const unwatchVideoFrames = watchVideoFrames(src, () => {
        canvas.height = src.videoHeight;
        canvas.width = src.videoWidth;
        context.drawImage(src, 0, 0);
    });

    return () => {
        unwatchVideoSize();
        unwatchVideoFrames();
    };
};
