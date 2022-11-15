import {StopWatchListener} from './types';

export const watchElementSize = (
    el: HTMLElement,
    cb: (entries: ResizeObserverEntry[]) => void
): StopWatchListener => {
    const observer = new ResizeObserver(cb);
    observer.observe(el);
    return () => observer.unobserve(el);
};
