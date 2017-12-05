// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import Recorder from './Recorder';

import './index.css';

let mediaElements = [];

class Root {
  div: HTMLDivElement;

  constructor(mediaElement) {
    const div = document.createElement('div');

    div.classList.add('root');
    div.classList.add('root--hidden');

    const rect = mediaElement.getBoundingClientRect();

    div.style.top = `${rect.top}px`;
    div.style.left = `${rect.left}px`;
    div.style.width = `${rect.width}px`;
    div.style.height = `${rect.height}px`;

    this.div = div;
  }

  hide = () => {
    // bail
    if (this.div.classList.contains('root--hidden')) {
      return;
    }

    this.div.classList.add('root--hidden');
  };

  show = () => {
    if (this.div.classList.contains('root--hidden')) {
      this.div.classList.remove('root--hidden');
    }
  };

  render = () => this.div;
}

function mountRecorder(mediaElement) {
  const root = new Root(mediaElement);
  const rootNode = root.render();

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
  const audioElements = document.getElementsByTagName('audio');
  const videoElements = document.getElementsByTagName('video');

  const newMediaElements = [
    ...audioElements,
    ...videoElements,
  ];

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
  mutObs.observe(document.body, {
    childList: true,
    subtree: true,
  });
}());
