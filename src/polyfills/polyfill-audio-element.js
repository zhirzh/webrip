// @flow

function polyfill(audioElement) {
  return () => {
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaElementSource(audioElement);
    const destination = audioCtx.createMediaStreamDestination();

    source.connect(destination);
    source.connect(audioCtx.destination);

    const audioStream = destination.stream;

    return audioStream;
  };
}

function polyfillAudioElement(audioElement: HTMLMediaElement, force?: boolean = false) {
  if (force || audioElement.captureStream === undefined) {
    // $FlowFixMe
    audioElement.captureStream = polyfill(audioElement); // eslint-disable-line no-param-reassign
  }

  return audioElement;
}

export default polyfillAudioElement;
