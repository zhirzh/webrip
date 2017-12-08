// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import Recorder from './Recorder';
import Root from './Root';

import polyfillAudioElement from './polyfills/polyfill-audio-element';
import polyfillVideoElement from './polyfills/polyfill-video-element';

import './index.css';

const mediaElements = [];

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
  const audioElements = Array.from(document.getElementsByTagName('audio'), audioElement =>
    polyfillAudioElement(audioElement, true));

  const videoElements = Array.from(document.getElementsByTagName('video'), videoElement =>
    polyfillVideoElement(videoElement, true, true));

  const newMediaElements = [...audioElements, ...videoElements];

  newMediaElements
    .filter(mediaElement => !mediaElements.includes(mediaElement))
    .forEach((mediaElement) => {
      mountRecorder(mediaElement);

      mediaElements.push(mediaElement);
    });
}

(function main() {
  setMediaElements();

  const mutObs = new MutationObserver(setMediaElements);

  // $FlowFixMe - v0.60.1 does not treat `HTMLBodyElement` as `Node`
  mutObs.observe(document.body, {
    childList: true,
    subtree: true,
  });
}());
