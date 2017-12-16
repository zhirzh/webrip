// @flow

import captureAudio from './capture-audio';

function polyfill(audioElement) {
  return () => {
    const audioStream = captureAudio(audioElement);

    return audioStream;
  };
}

function polyfillAudioElement(audioElement: HTMLMediaElement): Promise<HTMLMediaElement> {
  return new Promise((res, rej) => {
    chrome.storage.sync.get('state', ({ state }) => {
      const { shouldPolyfillAudio } = state;

      if (shouldPolyfillAudio || audioElement.captureStream === undefined) {
        // $FlowFixMe
        audioElement.captureStream = polyfill(audioElement); // eslint-disable-line no-param-reassign
      }

      res(audioElement);
    });
  });
}

export default polyfillAudioElement;
