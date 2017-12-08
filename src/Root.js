// @flow
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["constructDiv"] }] */

import styles from './Root.css';

class Root {
  div: HTMLDivElement;

  constructor(mediaElement: HTMLMediaElement) {
    this.div = this.constructDiv(mediaElement);
  }

  constructDiv(mediaElement: HTMLMediaElement) {
    const div = document.createElement('div');

    div.classList.add(styles.root);
    div.classList.add(styles.hidden);

    const rect = mediaElement.getBoundingClientRect();

    div.style.top = `${rect.top}px`;
    div.style.left = `${rect.left}px`;
    div.style.width = `${rect.width}px`;
    div.style.height = `${rect.height}px`;

    return div;
  }

  hide = () => {
    // bail
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

export default Root;
