// @flow

import React, { Component } from 'react';

import styles from './Recorder.css';

import type { MediaState } from '../types';

import { MediaRecorder } from '../types';

type Props = {
  mediaElement: HTMLMediaElement,
};

type State = {
  mediaElement: HTMLMediaElement,
  recorder: MediaRecorder,
  mediaState: MediaState,
};

const MEDIA_STATES = {
  ended: 'ended',
  loading: 'loading',
  paused: 'paused',
  playing: 'playing',
  started: 'started',
};

class Recorder extends Component<Props, State> {
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

  componentWillUpdate(_, nextState) {
    const { mediaState, recorder } = nextState;

    switch (mediaState) {
      case MEDIA_STATES.ended:
        recorder.stop();
        clearTimeout(this.monitorId);
        this.promptDownload();
        break;

      case MEDIA_STATES.loading:
      case MEDIA_STATES.paused:
        recorder.pause();
        break;

      case MEDIA_STATES.playing:
        recorder.resume();
        break;

      case MEDIA_STATES.started:
        break;

      default:
        console.error(mediaState);
        throw Error('Impossible `mediaState`');
    }
  }

  componentWillUnmount() {
    const { mediaElement } = this.state;

    mediaElement.removeEventListener('ended', this.stopRecording);
    mediaElement.removeEventListener('pause', this.pauseRecording);
    mediaElement.removeEventListener('playing', this.resumeRecording);

    clearTimeout(this.monitorId);
  }

  blobs: Array<Blob> = [];
  monitorId: number;

  monitorMediaElement = () => {
    const { mediaState, mediaElement } = this.state;

    switch (mediaState) {
      case MEDIA_STATES.ended:
      case MEDIA_STATES.loading:
      case MEDIA_STATES.paused:
        break;

      case MEDIA_STATES.playing:
      case MEDIA_STATES.started:
        if (mediaElement.readyState < 3) {
          this.updateMediaState(MEDIA_STATES.loading);
        }
        break;

      default:
        console.error(mediaState);
        throw Error('Impossible `mediaState`');
    }

    this.monitorId = setTimeout(this.monitorMediaElement, 0);
  };

  pauseRecording = () => this.updateMediaState(MEDIA_STATES.paused);

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

  resumeRecording = () => this.updateMediaState(MEDIA_STATES.playing);

  startRecording = async () => {
    const { mediaElement, recorder } = this.state;

    this.blobs = [];

    mediaElement.pause();
    mediaElement.currentTime = 0;

    await mediaElement.play();
    recorder.start(10);

    mediaElement.addEventListener('ended', this.stopRecording);
    mediaElement.addEventListener('pause', this.pauseRecording);
    mediaElement.addEventListener('playing', this.resumeRecording);

    this.updateMediaState(MEDIA_STATES.started, this.monitorMediaElement);
  };

  stopPropagation = (e: MouseEvent) => e.stopPropagation();

  stopRecording = () => {
    const { mediaElement } = this.state;

    mediaElement.removeEventListener('ended', this.stopRecording);
    mediaElement.removeEventListener('pause', this.pauseRecording);
    mediaElement.removeEventListener('playing', this.resumeRecording);

    mediaElement.pause();

    this.updateMediaState(MEDIA_STATES.ended);
  };

  updateMediaState = (mediaState, cb = null) => {
    this.setState({ mediaState }, cb);
  };

  renderDownloadButton() {
    if (this.state.mediaState === MEDIA_STATES.ended) {
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

  renderRecordingBlinker() {
    if (this.state.recorder.state === 'recording') {
      return <span className={styles.recordingBlinker}>⏺</span>;
    }

    return null;
  }

  render() {
    return (
      <div className={styles.root} onClick={this.stopPropagation}>
        {this.renderRecorderButtons()}
        {this.renderDownloadButton()}
        {this.renderRecordingBlinker()}
      </div>
    );
  }
}

export default Recorder;
