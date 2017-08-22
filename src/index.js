// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import styles from './index.css';

let allMediaElements = [];

class Root {
  constructor(mediaElement) {
    const self = document.createElement('div');

    self.classList.add(styles.root);
    self.classList.add(styles.hidden);

    self.style.top = mediaElement.offsetTop;
    self.style.left = mediaElement.offsetLeft;

    self.style.width = mediaElement.offsetWidth;
    self.style.height = mediaElement.offsetHeight;

    Object.assign(self, {
      hide: this.hide.bind(self),
      show: this.show.bind(self),
    });

    return self;
  }

  hide() {
    if (this.classList.contains(styles.hidden)) {
      return;
    }

    this.classList.add(styles.hidden);
  }

  show() {
    if (this.classList.contains(styles.hidden)) {
      this.classList.remove(styles.hidden);
    }
  }
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function setAllMediaElements() {
  const allVideoElements = document.getElementsByTagName('video');
  const allAudioElements = document.getElementsByTagName('audio');

  allMediaElements = [...allVideoElements, ...allAudioElements];
}

function mountAllRecorders() {
  allMediaElements.forEach(mediaElement => {
    const root = new Root(mediaElement);

    insertAfter(root, mediaElement);
    ReactDOM.render(<App mediaElement={mediaElement} />, root);

    mediaElement.onmouseenter = () => {
      root.show();
    };

    mediaElement.onmouseleave = root.onmouseleave = e => {
      // hide `root` if `toElement` is not a decendent of `root`

      if (root.contains(e.toElement)) {
        return;
      }

      root.hide();
    };
  });
}

(function main() {
  setAllMediaElements();

  mountAllRecorders();
})();

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
