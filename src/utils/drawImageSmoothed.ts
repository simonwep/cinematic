export const drawImageSmoothed = (
    source: CanvasRenderingContext2D,
    sourceCanvas: HTMLCanvasElement,
    target: CanvasRenderingContext2D,
    targetCanvas: HTMLCanvasElement,
    smoothing: number
) => {
    const {width, height} = sourceCanvas;

    if (width !== targetCanvas.width || height !== targetCanvas.height) {
        throw new Error('Source and target have to have the same size.');
    }

    const src = source.getImageData(0, 0, width, height);
    const des = target.getImageData(0, 0, width, height);
    const res = new ImageData(width, height);

    for (let i = 0; i < res.data.length; i++) {
        const a = src.data[i]; // 123
        const b = des.data[i]; // 50
        res.data[i] = des.data[i] + (a - b) * smoothing;
    }

    target.putImageData(res, 0, 0);
};
