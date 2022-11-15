import {createFrameScheduler} from './frameScheduler';
import {StopWatchListener} from './types';

export const watchVideoFrames = (
    el: HTMLVideoElement,
    cb: () => void
): StopWatchListener => {
    const scheduler = createFrameScheduler(cb);

    const loadeddata = () => {
        el.currentTime = 0; // Load first frame
        cb();
    };

    el.addEventListener('play', scheduler.start);
    el.addEventListener('pause', scheduler.stop);
    el.addEventListener('loadeddata', loadeddata);
    el.addEventListener('seeked', cb);

    return () => {
        scheduler.stop();
        el.removeEventListener('play', scheduler.start);
        el.removeEventListener('pause', scheduler.stop);
        el.removeEventListener('loadeddata', loadeddata);
        el.removeEventListener('seeked', cb);
    };
};
