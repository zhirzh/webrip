// @flow

import React, { Component } from 'react';

import styles from './Recorder.css';

type MediaState = $Keys<typeof MEDIA_STATES>;

type State = {
  mediaState: MediaState,
};

type Props = {
  mediaElement: HTMLMediaElement,
};

const MEDIA_STATES = {
  ended: 'ended',
  idle: 'idle',
  loading: 'loading',
  paused: 'paused',
  playing: 'playing',
  started: 'started',
};

class Recorder extends Component<Props, State> {
  blobs: Array<Blob>;
  mediaElement: HTMLMediaElement;
  recorder: MediaRecorder;

  constructor(props: Props) {
    super();

    this.state = {
      mediaState: MEDIA_STATES.idle,
    };

    this.mediaElement = props.mediaElement;

    this.constructRecorder();
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    const { mediaState } = nextState;
    const { recorder } = this;

    switch (mediaState) {
      case MEDIA_STATES.ended:
        clearTimeout(this.watchId);
        recorder.stop();
        this.promptDownload();
        break;

      case MEDIA_STATES.loading:
      case MEDIA_STATES.paused:
        recorder.pause();
        break;

      case MEDIA_STATES.playing:
        recorder.resume();
        break;

      case MEDIA_STATES.idle:
      case MEDIA_STATES.started:
        break;

      default:
        throw Error(`Unknown \`mediaState\`: ${mediaState}`);
    }
  }

  componentWillUnmount() {
    const { mediaElement } = this;

    mediaElement.removeEventListener('ended', this.stopRecording);
    mediaElement.removeEventListener('pause', this.pauseRecording);
    mediaElement.removeEventListener('playing', this.resumeRecording);

    clearTimeout(this.watchId);
  }

  async constructRecorder() {
    const { mediaElement } = this;

    const mediaStream = await mediaElement.captureStream();

    const recorder = new MediaRecorder(mediaStream);
    recorder.ondataavailable = ({ data }) => {
      this.blobs.push(data);
    };

    this.recorder = recorder;

    this.forceUpdate();
  }

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
    const { mediaElement, recorder } = this;

    this.blobs = [];

    mediaElement.pause();
    mediaElement.currentTime = 0;

    await mediaElement.play();
    recorder.start(10);

    mediaElement.addEventListener('ended', this.stopRecording);
    mediaElement.addEventListener('pause', this.pauseRecording);
    mediaElement.addEventListener('playing', this.resumeRecording);

    this.updateMediaState(MEDIA_STATES.started, this.watchMediaElement);
  };

  stopPropagation = (e: MouseEvent) => e.stopPropagation();

  stopRecording = () => {
    const { mediaElement } = this;

    mediaElement.removeEventListener('ended', this.stopRecording);
    mediaElement.removeEventListener('pause', this.pauseRecording);
    mediaElement.removeEventListener('playing', this.resumeRecording);

    mediaElement.pause();

    this.updateMediaState(MEDIA_STATES.ended);
  };

  updateMediaState = (mediaState: MediaState, cb?: Function) => {
    this.setState({ mediaState }, cb);
  };

  watchId = 0;

  /**
   * Indefinitely watch `mediaElement` to check if it's "loading" content
   * after it starts playing or resumes.
   */
  watchMediaElement = () => {
    const { mediaState } = this.state;
    const { mediaElement } = this;

    switch (mediaState) {
      case MEDIA_STATES.ended:
      case MEDIA_STATES.idle:
      case MEDIA_STATES.loading:
      case MEDIA_STATES.paused:
        // nothing to do
        break;

      case MEDIA_STATES.playing:
      case MEDIA_STATES.started:
        if (mediaElement.readyState < 3) {
          this.updateMediaState(MEDIA_STATES.loading);
        }
        break;

      default:
        throw Error(`Unknown \`mediaState\`: ${mediaState}`);
    }

    // RAF maybe?
    this.watchId = setTimeout(this.watchMediaElement, 0);
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
    const { recorder } = this;

    if (recorder === undefined) {
      return null;
    }

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

  renderRecordingIndicator() {
    const { recorder } = this;

    if (recorder === undefined) {
      return null;
    }

    if (recorder.state === 'recording') {
      return <span className={styles.recordingIndicator}>⏺</span>;
    }

    return null;
  }

  render() {
    return (
      <div className={styles.recorder} onClick={this.stopPropagation}>
        {this.renderRecorderButtons()}
        {this.renderDownloadButton()}
        {this.renderRecordingIndicator()}
      </div>
    );
  }
}

export default Recorder;
