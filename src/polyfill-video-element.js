// @flow

import polyfillAudioElement from './polyfill-audio-element';

function captureAudioStream(videoElement) {
  polyfillAudioElement(videoElement);

  // $FlowFixMe - flow v0.53.1 doesn't support `captureStream()`
  const captureStream = videoElement.captureStream;

  // $FlowFixMe - flow v0.53.1 doesn't support `captureStream()`
  videoElement.captureStream = undefined;

  const audioStream = captureStream();

  return audioStream;
}

function captureVideoStream(videoElement) {
  const canvas = document.createElement('canvas');

  videoElement.onloadedmetadata = () => {
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
  };

  const ctx = canvas.getContext('2d');

  render(ctx, videoElement);

  // $FlowFixMe - flow v0.53.1 doesn't support `captureStream()`
  return canvas.captureStream();
}

function polyfill(videoElement) {
  return () => {
    const audioTrack = captureAudioStream(videoElement).getAudioTracks()[0];

    const videoStream = captureVideoStream(videoElement);

    videoStream.addTrack(audioTrack);

    return videoStream;
  };
}

function polyfillVideoElement(videoElement: HTMLVideoElement, force: boolean = false) {
  if (force || videoElement.captureStream === undefined) {
    // $FlowFixMe - flow v0.53.1 doesn't support `captureStream()`
    videoElement.captureStream = polyfill(videoElement);
  }

  return videoElement;
}

function render(ctx, videoElement) {
  ctx.drawImage(videoElement, 0, 0);

  setTimeout(() => render(ctx, videoElement));
}

export default polyfillVideoElement;
