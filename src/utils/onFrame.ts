export const onFrame = (cb: (time: number) => void) => {
    let frameId = -1;
    const frame = (time: number) => {
        cb(time);
        frameId = requestAnimationFrame(frame);
    };

    const stop = () => cancelAnimationFrame(frameId);
    const start = () => {
        stop();
        frameId = requestAnimationFrame(frame);
    };

    return {start, stop};
};
