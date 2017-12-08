// @flow

/* eslint-disable no-param-reassign */

import polyfillAudioElement from './polyfill-audio-element';

function captureAudioStream(videoElement) {
  polyfillAudioElement(videoElement, true);

  const audioStream = videoElement.captureStream();

  return audioStream;
}

function captureVideoStream(videoElement, width, height) {
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  renderVideoFrame(canvas, videoElement);

  return canvas.captureStream(30);
}

function polyfill(videoElement) {
  return async () => {
    let width = -1;
    let height = -1;

    const audioTracks = await new Promise((res) => {
      videoElement.addEventListener('loadeddata', () => {
        width = videoElement.videoWidth;
        height = videoElement.videoHeight;

        res(captureAudioStream(videoElement).getAudioTracks());
      });
    });

    const videoStream = captureVideoStream(videoElement, width, height);

    audioTracks.forEach((track) => {
      videoStream.addTrack(track);
    });

    return videoStream;
  };
}

function polyfillVideoOnly(videoElement) {
  const captureAudioStream = videoElement.captureStream.bind(videoElement); // eslint-disable-line no-shadow

  return async () => {
    let width = -1;
    let height = -1;

    const audioTracks = await new Promise((res) => {
      videoElement.addEventListener('loadeddata', () => {
        width = videoElement.videoWidth;
        height = videoElement.videoHeight;

        res(captureAudioStream().getAudioTracks());
      });
    });

    const videoStream = captureVideoStream(videoElement, width, height);

    audioTracks.forEach((track) => {
      videoStream.addTrack(track);
    });

    return videoStream;
  };
}

function polyfillVideoElement(
  videoElement: HTMLVideoElement,
  forceVideo?: boolean = false,
  forceAudio?: boolean = false,
) {
  if (videoElement.captureStream === undefined) {
    // $FlowFixMe
    videoElement.captureStream = polyfill(videoElement);

    return videoElement;
  }

  if (forceVideo) {
    // $FlowFixMe
    videoElement.captureStream = polyfillVideoOnly(videoElement);
  }

  if (forceAudio) {
    // $FlowFixMe
    videoElement.captureStream = polyfill(videoElement);
  }

  return videoElement;
}

function renderVideoFrame(canvas: HTMLCanvasElement, videoElement: HTMLVideoElement) {
  const ctx = canvas.getContext('2d');

  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  requestAnimationFrame(() => renderVideoFrame(canvas, videoElement));
}

export default polyfillVideoElement;
