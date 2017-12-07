// @flow
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["constructDiv"] }] */

import './Root.css';

class Root {
  div: HTMLDivElement;

  constructor(mediaElement: HTMLMediaElement) {
    this.div = this.constructDiv(mediaElement);
  }

  constructDiv(mediaElement) {
    const div = document.createElement('div');

    div.classList.add('root');
    div.classList.add('root--hidden');

    const rect = mediaElement.getBoundingClientRect();

    div.style.top = `${rect.top}px`;
    div.style.left = `${rect.left}px`;
    div.style.width = `${rect.width}px`;
    div.style.height = `${rect.height}px`;

    return div;
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

export default Root;
