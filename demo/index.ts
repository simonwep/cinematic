import { createCinematic } from '../src';
import './index.css';

const buttons = Array.from(document.querySelectorAll('.controls > button'));
const video = document.querySelector('.video-container > .video') as HTMLVideoElement;

createCinematic({
  target: '.video-container > .video-background',
  src: video,
});

for (const button of buttons) {
  button.addEventListener('click', () => {
    video.src = `/videos/${button.getAttribute('name')}.mp4`;
    buttons.forEach((btn) => btn.classList[btn === button ? 'add' : 'remove']('active'));
  });
}
