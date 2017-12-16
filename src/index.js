// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import Recorder from './Recorder';
import Root from './Root';

import polyfillAudioElement from './polyfills/polyfill-audio-element';
import polyfillVideoElement from './polyfills/polyfill-video-element';

import './state';

import './index.css';

const mediaElements = new Set();

function mountRecorder(mediaElement) {
  const root = new Root(mediaElement);
  const rootNode = root.render();

  // $FlowFixMe
  document.body.appendChild(rootNode);

  ReactDOM.render(<Recorder mediaElement={mediaElement} />, rootNode);

  window.addEventListener('mousemove', (e) => {
    const rect = mediaElement.getBoundingClientRect();

    const isBoundedX = e.pageX > rect.left && e.pageX < rect.left + rect.width;
    const isBoundedY = e.pageY > rect.top && e.pageY < rect.top + rect.height;

    const isBounded = isBoundedX && isBoundedY;

    if (isBounded) {
      root.show();
    } else {
      root.hide();
    }
  });
}

function setMediaElements() {
  const audioElements = Array.from(document.getElementsByTagName('audio'));
  const videoElements = Array.from(document.getElementsByTagName('video'));

  const newMediaElements = [...audioElements, ...videoElements];

  newMediaElements
    .filter(mediaElement => !mediaElements.has(mediaElement))
    .forEach(async (mediaElement) => {
      mediaElements.add(mediaElement);

      if (mediaElement instanceof HTMLAudioElement) {
        await polyfillAudioElement(mediaElement);
      }

      if (mediaElement instanceof HTMLVideoElement) {
        await polyfillVideoElement(mediaElement);
      }

      mountRecorder(mediaElement);
    });
}

(function main() {
  setMediaElements();

  const mutObs = new MutationObserver(setMediaElements);

  // $FlowFixMe
  mutObs.observe(document.body, {
    childList: true,
    subtree: true,
  });
}());
