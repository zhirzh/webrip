// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import Recorder from './Recorder';

import polyfillAudioElement from './polyfills/polyfill-audio-element';
import polyfillVideoElement from './polyfills/polyfill-video-element';

import styles from './index.css';

const allMediaElements = [];

class Root {
  div: HTMLDivElement;

  constructor(mediaElement) {
    const div = document.createElement('div');

    div.classList.add(styles.root);
    div.classList.add(styles.hidden);

    const rect = mediaElement.getBoundingClientRect();

    div.style.top = `${rect.top}px`;
    div.style.left = `${rect.left}px`;
    div.style.width = `${rect.width}px`;
    div.style.height = `${rect.height}px`;

    this.div = div;
  }

  hide = () => {
    if (this.div.classList.contains(styles.hidden)) {
      return;
    }

    this.div.classList.add(styles.hidden);
  };

  show = () => {
    if (this.div.classList.contains(styles.hidden)) {
      this.div.classList.remove(styles.hidden);
    }
  };

  render = () => this.div;
}

function setAllMediaElements() {
  const allVideoElements = document.getElementsByTagName('video');
  const allAudioElements = document.getElementsByTagName('audio');

  // TODO: better/prettier alternative to double spread iteration
  [
    ...[...allVideoElements].map(videoElement => polyfillVideoElement(videoElement)),
    ...[...allAudioElements].map(audioElement => polyfillAudioElement(audioElement)),
  ]
    .filter(mediaElement => !allMediaElements.includes(mediaElement))
    .forEach((mediaElement) => {
      mountRecorder(mediaElement);

      allMediaElements.push(mediaElement);
    });
}

function mountRecorder(mediaElement) {
  const root = new Root(mediaElement);
  const rootNode = root.render();

  // $FlowFixMe - possibly null
  document.body.appendChild(rootNode);

  // eslint-disable-next-line react/jsx-filename-extension
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

(function main() {
  setAllMediaElements();

  const obs = new MutationObserver(() => {
    setAllMediaElements();
  });

  // $FlowFixMe - possibly null
  obs.observe(document.body, {
    childList: true,
    subtree: true,
  });
}());

/* pass media element count for bringing "in focus" */

// import chrome from './chrome';

// import { BIND_HIGHLIGHTER, SET_ALL_MEDIA_ELEMENTS, SET_STATE } from './actions';

// function insertBefore(newNode: Node, referenceNode: Node) {
//   referenceNode.parentNode.insertBefore(newNode, referenceNode);
// }

// function bindHighlighter() {
//   mediaElement = null;

//   allMediaElements.forEach(mediaElement => {
//     mediaElement.onclick = setMediaElement;
//     mediaElement.onmouseenter = highlightMediaElement;
//     mediaElement.onmouseleave = unhighlightMediaElement;
//   });
// }

// function highlightMediaElement(e) {
//   const mediaElement = e.target;
//   const mediaElementIdx = allMediaElements.findIndex(
//     _mediaElement => _mediaElement === mediaElement,
//   );

//   const highlightWrapper = document.createElement('div');
//   highlightWrapper.classList.add(styles.highlight);
//   highlightWrapper.onclick = mediaElement.onclick;
//   highlightWrapper.onmouseleave = mediaElement.onmouseleave;

//   const mediaElementClone = mediaElement.cloneNode(true);
//   mediaElementClone.onmouseenter = mediaElement.onmouseenter;

//   highlightWrapper.appendChild(mediaElementClone);

//   mediaElement.replaceWith(highlightWrapper);
//   allMediaElements[mediaElementIdx] = highlightWrapper;
// }

// function mountSelector(params) {

// }

// function setMediaElement(e) {
//   const highlightWrapper = e.target;
//   const mediaElement = highlightWrapper.children[0];

//   if (mediaElement.readyState >= mediaElement.HAVE_METADATA) {
//     setState({ stop: Math.floor(mediaElement.duration) });
//   } else {
//     mediaElement.onloadmetadata = () =>
//       setState({ stop: Math.floor(mediaElement.duration) });
//   }

//   switch (true) {
//     case mediaElement instanceof HTMLMediaElement:
//       setState({ mediaElement });
//       break;

//     default:
//   }

//   unhighlightMediaElement(e);
//   unbindHighlighter();
// }

// function setState(state) {
//   chrome.runtime.sendMessage({ type: SET_STATE, payload: state });
// }

// function unbindHighlighter() {
//   allMediaElements.forEach(mediaElement => {
//     mediaElement.onclick = null;
//     mediaElement.onmouseenter = null;
//     mediaElement.onmouseleave = null;
//   });
// }

// function unhighlightMediaElement(e) {
//   const highlightWrapper = e.target;
//   const mediaElementIdx = allMediaElements.findIndex(
//     _mediaElement => _mediaElement === highlightWrapper,
//   );

//   const mediaElement = highlightWrapper.children[0];
//   mediaElement.onclick = highlightWrapper.onclick;
//   mediaElement.onmouseleave = highlightWrapper.onmouseleave;

//   highlightWrapper.replaceWith(mediaElement);
//   allMediaElements[mediaElementIdx] = mediaElement;
// }

// chrome.runtime.onMessage.addListener((action, sender, sendResponse) => {
//   switch (action.type) {
//     case BIND_HIGHLIGHTER:
//       bindHighlighter();
//       break;

//     case SET_ALL_MEDIA_ELEMENTS:
//       setAllMediaElements();
//       break;

//     default:
//   }
// });

// setAllMediaElements();
