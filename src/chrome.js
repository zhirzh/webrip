/* global chrome */

chrome = {
  ...chrome,

  runtime: {
    ...chrome.runtime,

    onMessage: chrome.runtime.onMessage || {
      addListener() {},
    },
  },

  tabs: chrome.tabs || {
    query() {},
  },
};

export default chrome;
