/* global polyfillAudioButton polyfillVideoButton */

function updateState(nextState) {
  chrome.storage.sync.get('state', ({ state }) => {
    chrome.storage.sync.set({
      state: {
        ...state,
        ...nextState,
      },
    });
  });
}

polyfillAudioButton.onchange = () => {
  updateState({
    shouldPolyfillAudio: polyfillAudioButton.checked,
  });
};

polyfillVideoButton.onchange = () => {
  updateState({
    shouldPolyfillVideo: polyfillVideoButton.checked,
  });
};

chrome.storage.sync.get('state', ({ state }) => {
  const { shouldPolyfillAudio, shouldPolyfillVideo } = state;

  if (shouldPolyfillAudio) {
    polyfillAudioButton.checked = true;
  }

  if (shouldPolyfillVideo) {
    polyfillVideoButton.checked = true;
  }
});
