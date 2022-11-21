import { createElementSizeWatcher } from './utils/createElementSizeWatcher';
import { createVideoFramesWatcher } from './utils/createVideoFramesWatcher';
import { onFrame } from './utils/onFrame';
import { resolveElement } from './utils/resolveElement';

export interface CinematicOptions {
  /* The source video element. */
  src: string | HTMLVideoElement;

  /* The canvas to project the dynamic background to. */
  target: string | HTMLCanvasElement;

  /* If src / target is a string this document will be used to resolve both elements. */
  document?: Document;

  /* Sensitivity. 1 is realtime and near zero smoothed. Default is 0.15. */
  sensitivity?: number;
}

export interface CinematicEffect {
  destroy(): void;
  setSource(video: string | HTMLVideoElement): void;
  setTarget(target: string | HTMLCanvasElement): void;
  setSensitivity(sensitivity: number): void;

  get source(): HTMLVideoElement;
  get target(): HTMLCanvasElement;
}

export const version = import.meta.env.VERSION;

export const createCinematicEffect = (opt: CinematicOptions): CinematicEffect => {
  const document = opt.document ?? window.document;
  let sensitivity = 0.1;
  let source = document.createElement('video');
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Configure context
  context.imageSmoothingEnabled = false;

  // Main draw loop
  let drawVideo = false;
  const loop = onFrame(() => {
    const { width, height } = canvas;

    if (drawVideo && width && height) {
      context.globalAlpha = sensitivity;
      context.drawImage(source, 0, 0);
      drawVideo = false;
    }
  });

  // Link video size to canvas
  const elementSizeWatcher = createElementSizeWatcher(() => {
    if (source.videoWidth !== canvas.width || source.videoHeight !== canvas.height) {
      canvas.width = source.videoWidth;
      canvas.height = source.videoHeight;
    }
  });

  // Watch each frame change
  const videoFramesWatcher = createVideoFramesWatcher(() => {
    drawVideo = true;
  });

  const setSource = (video: string | HTMLVideoElement): void => {
    const element = resolveElement(document, video);

    if (!(element instanceof HTMLVideoElement)) {
      throw new Error(
        `Received invalid src, expects selector to HTMLVideoElement or the element itself but got ${element?.tagName}`
      );
    }

    elementSizeWatcher.watch(element);
    videoFramesWatcher.watch(element);
    source = element;
  };

  const setTarget = (target: string | HTMLCanvasElement): void => {
    const element = resolveElement(document, target);

    if (!(element instanceof HTMLCanvasElement)) {
      throw new Error('Target element has to be a canvas.');
    }

    canvas = element;
    context = element.getContext('2d') as CanvasRenderingContext2D;
    loop.start();
  };

  const setSensitivity = (value: number): void => {
    if (!(value > 0 && value <= 1)) {
      throw new Error(`Smoothness must be an integer greater than 0 and less or equal than 1, received ${value}`);
    }

    sensitivity = value;
  };

  const destroy = () => {
    loop.stop();
    elementSizeWatcher.destroy();
    videoFramesWatcher.destroy();
  };

  setSensitivity(opt.sensitivity ?? 0.1);
  setSource(opt.src);
  setTarget(opt.target);

  return {
    destroy,

    // Update functions
    setSource,
    setTarget,
    setSensitivity,

    // Getters
    get target(): HTMLCanvasElement {
      return canvas;
    },
    get source(): HTMLVideoElement {
      return source;
    },
  };
};
