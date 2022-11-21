import { onFrame } from './onFrame';

export const createVideoFramesWatcher = (cb: () => void) => {
  const frames = onFrame(cb);
  let watched: HTMLVideoElement | undefined;

  const loadeddata = () => {
    watched && (watched.currentTime = 0); // Load first frame
    cb();
  };

  const bindEvents = (el: HTMLVideoElement) => {
    el.addEventListener('play', frames.start);
    el.addEventListener('pause', frames.stop);
    el.addEventListener('loadeddata', loadeddata);
    el.addEventListener('seeked', cb);
  };

  const unBindEvents = (el: HTMLVideoElement) => {
    el.removeEventListener('play', frames.start);
    el.removeEventListener('pause', frames.stop);
    el.removeEventListener('loadeddata', loadeddata);
    el.removeEventListener('seeked', cb);
  };

  const watch = (el: HTMLVideoElement) => {
    watched && unBindEvents(watched);
    bindEvents(el);
    watched = el;
  };

  const destroy = () => {
    watched && unBindEvents(watched);
    frames.stop();
  };

  return { watch, destroy };
};
