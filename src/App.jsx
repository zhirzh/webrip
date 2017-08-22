// @flow

import React, { Component } from 'react';

import styles from './App.css';

import { MediaRecorder } from './types';

type Props = {
  mediaElement: HTMLMediaElement,
};

type State = {
  mediaElement: HTMLMediaElement,
  recorder: MediaRecorder | null,
};

class App extends Component<Props, State> {
  blobs: Array<Blob> = [];

  constructor(props: Props) {
    super();

    this.state = {
      mediaElement: props.mediaElement,
      recorder: null,
    };
  }

  startRecording = async () => {
    this.blobs = [];

    const { mediaElement } = this.state;

    // $FlowFixMe - flow v0.53.1 doesn't support `captureStream()`
    const mediaStream = mediaElement.captureStream();
    const recorder: MediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: 'video/webm;codecs=H264',
    });

    mediaElement.onplay = () => {
      recorder.ondataavailable = (e) => {
        this.blobs.push(e.data);

        if (mediaElement.currentTime > mediaElement.duration) {
          this.stopRecording();
        }
      };
    };

    mediaElement.pause();
    mediaElement.currentTime = 0;

    await mediaElement.play();
    recorder.start(10);

    this.setState({ recorder });
  };

  stopRecording = () => {
    if (!this.state.recorder) {
      // type check for flow
      return;
    }

    if (this.state.recorder.state === 'inactive') {
      return;
    }

    this.state.recorder.stop();
    this.state.mediaElement.pause();

    this.setState({ recorder: null });
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

  renderRecorderButtons() {
    const { recorder } = this.state;

    if (recorder === null) {
      return (
        <button key="startRecording" className={styles.record} onClick={this.startRecording}>
          ⏺
        </button>
      );
    }

    if (recorder.state === 'recording') {
      return (
        <button key="stopRecording" className={styles.stop} onClick={this.stopRecording}>
          ⏹
        </button>
      );
    }

    return null;
  }

  renderDownloadButton() {
    if (this.blobs.length === 0) {
      return null;
    }

    return (
      <button key="promptDownload" onClick={this.promptDownload}>
        ⬇
      </button>
    );
  }

  renderRecordingStatus() {
    const { recorder } = this.state;

    if (recorder === null || recorder.state !== 'recording') {
      return null;
    }

    return <span className={styles.recording}>⏺</span>;
  }

  render() {
    return (
      <div className={styles.root}>
        {this.renderRecorderButtons()}
        {this.renderDownloadButton()}
        {this.renderRecordingStatus()}
      </div>
    );
  }
}

export default App;
