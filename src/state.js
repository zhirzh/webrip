// @flow

const defaultState = {
  shouldPolyfillAudio: false,
  shouldPolyfillVideo: false,
};

chrome.storage.sync.get('state', ({ state }) => {
  chrome.storage.sync.set({
    state: {
      ...defaultState,
      ...state,
    },
  });
});
