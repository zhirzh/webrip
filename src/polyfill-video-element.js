import polyfillAudioElement from './polyfill-audio-element';

function captureAudioStream(videoElement) {
  polyfillAudioElement(videoElement);

  // eslint-disable-next-line no-underscore-dangle
  const _captureStream = videoElement.captureStream.bind(videoElement);

  videoElement.captureStream = undefined;

  const audioStream = _captureStream();

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

function polyfillVideoElement(videoElement, force = false) {
  if (force || videoElement.captureStream === undefined) {
    videoElement.captureStream = polyfill(videoElement);
  }

  return videoElement;
}

function render(ctx, videoElement) {
  ctx.drawImage(videoElement, 0, 0);

  setTimeout(() => render(ctx, videoElement));
}

export default polyfillVideoElement;
