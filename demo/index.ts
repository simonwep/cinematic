import { createCinematicEffect, version } from '../src';
import './index.css';

const buttons = Array.from(document.querySelectorAll('.controls > button')) as HTMLButtonElement[];
const target = '.video-container > .video-background';

let switching = false;
let video = document.querySelector('.video-container > .video') as HTMLVideoElement;
let cleanup = createCinematicEffect({ target, src: video });

const loadVideo = async (button: HTMLButtonElement) => {
  if (switching) return;
  buttons.forEach((btn) => btn.setAttribute('disabled', 'true'));

  const newVideo = document.createElement('video');
  newVideo.classList.add('video');
  newVideo.autoplay = true;
  newVideo.muted = true;

  newVideo.addEventListener('canplay', () => {
    buttons.forEach((btn) => btn.removeAttribute('disabled'));
    buttons.forEach((btn) => btn.classList[btn === button ? 'add' : 'remove']('active'));

    cleanup();
    cleanup = createCinematicEffect({ target, src: newVideo });

    switching = false;
    video.replaceWith(newVideo);
    video = newVideo;
  });

  newVideo.src = `./videos/${button.getAttribute('name')}.mp4`;
};

for (const button of buttons) {
  button.addEventListener('click', () => void loadVideo(button));
}

/* eslint-disable no-console */
console.log(`Using cinematic v${version}`);
