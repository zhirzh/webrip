// @flow

import React, { Component } from 'react';

import MediaRecorder from './types/MediaRecorder';

import './Recorder.css';

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

    const { mediaElement } = props;

    const mediaStream = mediaElement.captureStream();
    const recorder = new MediaRecorder(mediaStream);
    recorder.ondataavailable = ({ data }) => {
      this.blobs.push(data);
    };

    this.state = {
      mediaState: MEDIA_STATES.idle,
    };

    this.mediaElement = mediaElement;
    this.recorder = recorder;
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
          className="button download-button"
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

    switch (recorder.state) {
      case 'inactive':
        return (
          <button
            className="button start-button"
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
            className="button stop-button"
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
    if (this.recorder.state === 'recording') {
      return <span className="recording-indicator">⏺</span>;
    }

    return null;
  }

  render() {
    return (
      <div className="recorder" onClick={this.stopPropagation}>
        {this.renderRecorderButtons()}
        {this.renderDownloadButton()}
        {this.renderRecordingIndicator()}
      </div>
    );
  }
}

export default Recorder;