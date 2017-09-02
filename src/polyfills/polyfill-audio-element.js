// @flow

import { AudioContext } from '../types';

function polyfill(audioElement: HTMLMediaElement) {
  // `audioElement` must NOT be muted

  return () => {
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaElementSource(audioElement);
    const destination = audioCtx.createMediaStreamDestination();
    const gainNode = audioCtx.createGain();

    source.connect(gainNode);
    gainNode.connect(destination);

    source.connect(audioCtx.destination);

    return destination.stream;
  };
}

function polyfillAudioElement(audioElement: HTMLMediaElement, force: boolean = false) {
  if (force || audioElement.captureStream === undefined) {
    // $FlowFixMe - flow v0.53.1 doesn't support `captureStream()`
    audioElement.captureStream = polyfill(audioElement);
  }

  return audioElement;
}

export default polyfillAudioElement;
