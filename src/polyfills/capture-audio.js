// @flow

function captureAudio(mediaElement: HTMLMediaElement): MediaStream {
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(mediaElement);
  const destination = audioCtx.createMediaStreamDestination();

  source.connect(destination);
  source.connect(audioCtx.destination);

  const audioStream = destination.stream;

  return audioStream;
}

export default captureAudio;
