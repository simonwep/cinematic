import {createDynamicBackground} from '../src';
import './index.css';

const video = document.querySelector('.video-container > .video') as HTMLVideoElement;
const videos = ['forest-with-river', 'close-up-breaking-waves', 'cliffs-morning-sea.mp4'];

const dynamicBackground = createDynamicBackground({
    target: '.video-container > .video-background',
    src: video
});

console.log(dynamicBackground, videos);
