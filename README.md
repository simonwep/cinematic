<br>

<h3 align="center">
    <img alt="Logo" src="https://user-images.githubusercontent.com/30767528/202903379-3c15d3ea-7be3-4159-8871-fa4ac5a78829.png" width="250"/>
</h3>

<br>

<h3 align="center">
    <a href="https://simonwep.github.io/cinematic"> Cinematic </a> - Add cinematic effects to your videos!
</h3>

<p align="center">
    <a href="https://choosealicense.com/licenses/mit/"><img
        alt="License MIT"
        src="https://img.shields.io/badge/license-MIT-ae15cc.svg"></a>
    <img alt="No dependencies"
        src="https://img.shields.io/badge/dependencies-none-8115cc.svg">
    <a href="https://github.com/sponsors/Simonwep"><img
        alt="Support me"
        src="https://img.shields.io/badge/github-support-6a15cc.svg"></a>
    <img alt="version" src="https://img.shields.io/npm/v/cinematic-effect?color=%233d24c9&label=version">
    <a href="https://www.buymeacoffee.com/aVc3krbXQ"><img
        alt="Buy me a coffee"
        src="https://img.shields.io/badge/%F0%9F%8D%BA-buy%20me%20a%20beer-%23FFDD00"></a>
    <a href="https://github.com/Simonwep/cinematic/actions?query=workflow%3ACI"><img
        alt="Build Status"
        src="https://github.com/Simonwep/cinematic/workflows/CI/badge.svg"></a>
    <img alt="gzip size" src="https://img.badgesize.io/https://cdn.jsdelivr.net/npm/cinematic-effect?compression=gzip">
    <img alt="brotli size" src="https://img.badgesize.io/https://cdn.jsdelivr.net/npm/cinematic-effect?compression=brotli">
</p>

### Features 🤘

* 🌟 Modern bundle.
* 🔩 Ultra tiny (~1kb compressed)
* 👌 Minimalistic and straight-forward API.
* ⚡ Performant - uses only native browser features to achieve the affect!
* 0️⃣ Zero dependencies.
* 🌅 Video-to-video transitions.

### Usage

Install it using your preferred package manager (taking npm as example):

```shell
npm install cinematic-effect
```

Your HTML:
```html
<div id="container">
  <canvas id="background"></canvas>
  <video id="video" src="..."></video>
</div>
```

Your TypeScript (check out [options](#options) and the [effect api](#api)):

```ts
import { createCinematicEffect } from 'cinematic-effect';

const effect = createCinematicEffect({
  target: '#background', // Canvas to project effect onto
  src: '#video' // Source video element or selector
});
```

Your CSS:

> This library is mainly taking care of creating a smooth effect and syncing the frames,
> the final effect is applied by you using css properties!


```css
#container {
    display: flex;
    position: relative;
}

#background {
    position: absolute;
    z-index: -1;
    opacity: 0.75;
    transform: scale(1.05);
    filter: blur(45px);
    width: 100%;
    height: 100%;
}
```

Check out the [demo](demo) for a full-fledged demo!

### Options

The following options are available when creating a new instance:

```ts
import { createCinematicEffect } from 'cinematic-effect';

const effect = createCinematicEffect({
  
  // Target element the effect is rendered to.
  // Can be a selector or the element itself.
  target: '#background',
  
  // Video source, can be a selector or the video element itself.
  src: '#video',

  // Transition speed, default is 0.01, realtime is 1.
  sensitivity: 0.01
});
```

### API

Each cinematic effect comes with the following API.
It is **highly recommended** to use the API when changing the video instead of destroying / re-instantiating an effect,
this way you will get a video-to-video transition and it's more performant.

```ts
interface CinematicEffect {

  // Destroy instance.
  destroy(): void;

  // Change source, target or sensitivity.
  setSource(video: string | HTMLVideoElement): void;
  setTarget(target: string | HTMLCanvasElement): void;
  setSensitivity(sensitivity: number): void;

  // Get current source and target elements.
  get source(): HTMLVideoElement;
  get target(): HTMLCanvasElement;
}
```
