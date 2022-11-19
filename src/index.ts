import { createCanvas } from './utils/createCanvas';
import { drawImageSmoothed } from './utils/drawImageSmoothed';
import { onFrame } from './utils/onFrame';
import { resolveElement } from './utils/resolveElement';
import { watchElementSize } from './utils/watchElementSize';
import { watchVideoFrames } from './utils/watchVideoFrames';

export type StopDynamicBackground = () => void;

export interface CinematicOptions {
  /* The source video element. */
  src: string | HTMLVideoElement;

  /* The canvas to project the dynamic background to. */
  target: string | HTMLCanvasElement;

  /* If src / target is a string this document will be used to resolve both elements. */
  document?: Document;

  /* Sensitivity. 1 is realtime and near zero smoothed. Default is 0.075. */
  sensitivity?: number;
}

export const version = import.meta.env.VERSION;

export const createCinematic = (opt: CinematicOptions): StopDynamicBackground => {
  const document = opt.document ?? window.document;
  const canvas = resolveElement(document, opt.target);
  const src = resolveElement(document, opt.src);
  const smoothness = opt.sensitivity ?? 0.075;

  if (!(src instanceof HTMLVideoElement)) {
    throw new Error(
      `Received invalid src, expects selector to HTMLVideoElement or the element itself but got ${src?.tagName}`
    );
  } else if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('Target element has to be a canvas.');
  } else if (!(smoothness > 0 && smoothness <= 1)) {
    throw new Error(`Smoothness must be an integer greater than 0 and less or equal than 1, received ${smoothness}`);
  }

  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  const shadow = createCanvas();
  let drawVideo = false;

  // Main draw loop
  const frames = onFrame(() => {
    const { width, height } = canvas;

    if (drawVideo && width && height) {
      // Resize canvas and draw video on it
      Object.assign(shadow.canvas, { width, height });
      shadow.context.drawImage(src, 0, 0);

      // Draw smoothed video onto actual canvas
      drawImageSmoothed(shadow.context, shadow.canvas, context, canvas, smoothness);

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
