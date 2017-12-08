// @flow

import captureAudio from './capture-audio';

function polyfill(audioElement) {
  return () => {
    const audioStream = captureAudio(audioElement);

    return audioStream;
  };
}

function polyfillAudioElement(audioElement: HTMLMediaElement, shouldPolyfill?: boolean = false) {
  if (shouldPolyfill || audioElement.captureStream === undefined) {
    // $FlowFixMe
    audioElement.captureStream = polyfill(audioElement); // eslint-disable-line no-param-reassign
  }

  return audioElement;
}

export default polyfillAudioElement;
