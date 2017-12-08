// @flow

function captureVideo(videoElement: HTMLVideoElement): MediaStream {
  const canvas = document.createElement('canvas');

  videoElement.addEventListener('loadeddata', () => {
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
  });

  renderVideoFrame(canvas, videoElement);

  return canvas.captureStream(30);
}

function renderVideoFrame(canvas: HTMLCanvasElement, videoElement: HTMLVideoElement) {
  const ctx = canvas.getContext('2d');

  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  requestAnimationFrame(() => renderVideoFrame(canvas, videoElement));
}

export default captureVideo;
