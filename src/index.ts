import {onFrame} from './utils/onFrame';
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

    /* How much the image should be smoothed. */
    smoothness?: number;
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
    let drawVideo = false;

    // Main draw loop
    const frames = onFrame(() => {
        if (drawVideo) {
            context.drawImage(src, 0, 0);
            drawVideo = false;
        }
    });

    // Link video size to canvas
    const unwatchVideoSize = watchElementSize(src, () => {
        canvas.width = src.videoWidth;
        canvas.height = src.videoHeight;
    });

    // Watch each frame change
    const unwatchVideoFrames = watchVideoFrames(src, () => {
        drawVideo = true;
    });

    frames.start();
    return () => {
        frames.stop();
        unwatchVideoSize();
        unwatchVideoFrames();
    };
};
