import {onFrame} from './onFrame';
import {StopWatchListener} from './types';

export const watchVideoFrames = (
    el: HTMLVideoElement,
    cb: () => void
): StopWatchListener => {
    const frames = onFrame(cb);

    const loadeddata = () => {
        el.currentTime = 0; // Load first frame
        cb();
    };

    el.addEventListener('play', frames.start);
    el.addEventListener('pause', frames.stop);
    el.addEventListener('loadeddata', loadeddata);
    el.addEventListener('seeked', cb);

    return () => {
        frames.stop();
        el.removeEventListener('play', frames.start);
        el.removeEventListener('pause', frames.stop);
        el.removeEventListener('loadeddata', loadeddata);
        el.removeEventListener('seeked', cb);
    };
};
