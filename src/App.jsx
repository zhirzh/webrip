// @flow

import React, { Component } from 'react';

import styles from './App.css';

import type { MediaState } from './types';

import { MediaRecorder } from './types';

type Props = {
  mediaElement: HTMLMediaElement,
};

type State = {
  mediaElement: HTMLMediaElement,
  recorder: MediaRecorder,
  mediaState: MediaState,
};

class App extends Component<Props, State> {
  blobs: Array<Blob> = [];
  monitorId: number;

  constructor(props: Props) {
    super();

    const { mediaElement } = props;

    // $FlowFixMe - flow v0.53.1 doesn't support `captureStream()`
    const mediaStream = mediaElement.captureStream();
    const recorder = new MediaRecorder(mediaStream);

    this.state = {
      mediaElement,
      recorder,
      mediaState: null,
    };
  }

  componentDidMount() {
    this.state.recorder.ondataavailable = ({ data }) => {
      this.blobs.push(data);
    };
  }

  componentWillUnmount() {
    const { mediaElement } = this.state;

    mediaElement.removeEventListener('ended', this.stopRecording);
    mediaElement.removeEventListener('pause', this.pauseRecording);
    mediaElement.removeEventListener('play', this.resumeRecording);

    clearTimeout(this.monitorId);
  }

  monitorMediaElement = () => {
    const { mediaState, mediaElement } = this.state;

    switch (mediaState) {
      case 'ENDED':
      case 'PAUSED':
        break;

      case 'LOADING':
        if (mediaElement.readyState >= 3) {
          this.setState({ mediaState: 'PLAYING' });
        }
        break;

      case 'PLAYING':
        if (mediaElement.readyState < 3) {
          this.setState({ mediaState: 'LOADING' });
        }
        break;

      default:
        console.error(mediaState);
        throw Error('Impossible `mediaState`');
    }

    this.monitorId = setTimeout(this.monitorMediaElement, 0);
  };

  pauseRecording = () => {
    this.state.recorder.pause();

    this.setState({ mediaState: 'PAUSED' });
  };

  promptDownload = () => {
    const blob = new Blob(this.blobs);

    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = downloadUrl;
    link.download = '*.webm';

    if (document.body) {
      document.body.appendChild(link);
    }

    link.click();

    setTimeout(() => link.remove(), 1000);
  };

  resumeRecording = () => {
    this.state.recorder.resume();

    this.setState({ mediaState: 'PLAYING' });
  };

  startRecording = async () => {
    const { mediaElement, recorder } = this.state;

    this.blobs = [];

    mediaElement.pause();
    mediaElement.currentTime = 0;

    await mediaElement.play();
    recorder.start(10);

    mediaElement.addEventListener('ended', this.stopRecording);
    mediaElement.addEventListener('pause', this.pauseRecording);
    mediaElement.addEventListener('play', this.resumeRecording);

    this.setState({ mediaState: 'PLAYING' }, this.monitorMediaElement);
  };

  stopRecording = () => {
    const { mediaElement, recorder } = this.state;

    mediaElement.removeEventListener('ended', this.stopRecording);
    mediaElement.removeEventListener('pause', this.pauseRecording);
    mediaElement.removeEventListener('play', this.resumeRecording);

    recorder.stop();
    mediaElement.pause();

    this.setState({ mediaState: 'ENDED' });
  };

  renderRecordingBlinker() {
    if (this.state.recorder.state === 'recording') {
      return <span className={styles.recordingBlinker}>⏺</span>;
    }

    return null;
  }

  renderRecorderButtons() {
    const { recorder } = this.state;

    switch (recorder.state) {
      case 'inactive':
        return (
          <button
            className={styles.startRecordingButton}
            onClick={this.startRecording}
            title="Start recording"
          >
            ⏺
          </button>
        );

      case 'paused':
      case 'recording':
        return (
          <button
            className={styles.stopRecordingButton}
            onClick={this.stopRecording}
            title="Stop recording"
          >
            ⏹
          </button>
        );

      default:
        console.error(recorder.state);
        throw Error('Impossible `MediaRecorder().state`');
    }
  }

  renderDownloadButton() {
    if (this.state.mediaState === 'ENDED') {
      return (
        <button
          className={styles.downloadButton}
          onClick={this.promptDownload}
          title="Download recorded media"
        >
          ⬇
        </button>
      );
    }

    return null;
  }

  render() {
    console.log(this.state.mediaState);
    return (
      <div className={styles.root}>
        {this.renderRecorderButtons()}
        {this.renderDownloadButton()}
        {this.renderRecordingBlinker()}
      </div>
    );
  }
}

export default App;
