import { createCinematicEffect, version } from '../src';
import './index.css';

const buttons = Array.from(document.querySelectorAll('.controls > button')) as HTMLButtonElement[];
const effect = createCinematicEffect({
  target: '.video-container > .video-background',
  src: '.video-container > .video',
});

const loadVideo = async (button: HTMLButtonElement) => {
  buttons.forEach((btn) => btn.setAttribute('disabled', 'true'));

  const newVideo = document.createElement('video');
  newVideo.classList.add('video');
  newVideo.autoplay = true;
  newVideo.muted = true;

  newVideo.addEventListener('canplay', () => {
    buttons.forEach((btn) => btn.removeAttribute('disabled'));
    buttons.forEach((btn) => btn.classList[btn === button ? 'add' : 'remove']('active'));

    effect.source.replaceWith(newVideo);
    effect.setSource(newVideo);
  });

  newVideo.src = `./videos/${button.getAttribute('name')}.mp4`;
};

for (const button of buttons) {
  button.addEventListener('click', () => void loadVideo(button));
}

/* eslint-disable no-console */
console.log(`Using cinematic v${version}`);
