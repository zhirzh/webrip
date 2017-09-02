// @flow

import polyfillAudioElement from './polyfill-audio-element';

/**
 * Capture audio stream from videoElement
 *
 * @param {HTMLVideoElement} videoElement
 * @returns MediaStream
 */
function captureAudioStream(videoElement: HTMLVideoElement) {
  polyfillAudioElement(videoElement);

  // $FlowFixMe - flow v0.53.1 doesn't support `captureStream()`
  const captureStream = videoElement.captureStream;

  // $FlowFixMe - flow v0.53.1 doesn't support `captureStream()`
  videoElement.captureStream = undefined;

  const audioStream = captureStream();

  return audioStream;
}

/**
 * Capture video stream from videoElement
 *
 * @param {HTMLVideoElement} videoElement
 * @returns MediaStream
 */
function captureVideoStream(videoElement: HTMLVideoElement) {
  const canvas = document.createElement('canvas');

  videoElement.onloadeddata = () => {
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
  };

  renderVideoFrame(canvas, videoElement);

  // $FlowFixMe - flow v0.53.1 doesn't support `captureStream()`
  return canvas.captureStream(60);
}

function polyfill(videoElement: HTMLVideoElement) {
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

/**
 * Render video frames onto canvas
 *
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLVideoElement} videoElement
 */
function renderVideoFrame(canvas: HTMLCanvasElement, videoElement: HTMLVideoElement) {
  const ctx = canvas.getContext('2d');

  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  requestAnimationFrame(() => renderVideoFrame(canvas, videoElement));
}

export default polyfillVideoElement;
