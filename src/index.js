// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import styles from './index.css';

let allMediaElements: Array<HTMLMediaElement> = [];

class Root {
  div: HTMLDivElement;

  constructor(mediaElement: HTMLMediaElement) {
    const div = (document.createElement('div'): any);

    div.classList.add(styles.root);
    div.classList.add(styles.hidden);

    div.style.top = `${mediaElement.offsetTop}px`;
    div.style.left = `${mediaElement.offsetLeft}px`;

    div.style.width = `${mediaElement.offsetWidth}px`;
    div.style.height = `${mediaElement.offsetHeight}px`;

    this.div = div;
  }

  hide() {
    if (this.div.classList.contains(styles.hidden)) {
      return;
    }

    this.div.classList.add(styles.hidden);
  }

  show() {
    if (this.div.classList.contains(styles.hidden)) {
      this.div.classList.remove(styles.hidden);
    }
  }

  render() {
    return this.div;
  }
}

window.Root = Root;

function insertAfter(newNode: Node, referenceNode: Node) {
  if (!referenceNode.parentNode) {
    throw Error('`referenceNode.parentNode` is null or undefined');
  }

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
    const rootNode = root.render();

    insertAfter(rootNode, mediaElement);
    ReactDOM.render(<App mediaElement={mediaElement} />, rootNode);

    mediaElement.onmouseenter = () => {
      root.show();
    };

    mediaElement.onmouseleave = rootNode.onmouseleave = e => {
      // hide `rootNode` if `toElement` is not a decendent of `rootNode`

      if (rootNode.contains(e.toElement)) {
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
