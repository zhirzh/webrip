// @flow

/* eslint-disable no-param-reassign */

import captureAudio from './capture-audio';
import captureVideo from './capture-video';

function polyfill(videoElement) {
  return () => {
    const audioStream = captureAudio(videoElement);
    const videoStream = captureVideo(videoElement);

    const audioTracks = audioStream.getAudioTracks();

    audioTracks.forEach((track) => {
      videoStream.addTrack(track);
    });

    return videoStream;
  };
}

function polyfillAudio(videoElement, captureStream) {
  return () => {
    const audioStream = captureAudio(videoElement);
    const videoStream = captureStream();

    const audioTracks = audioStream.getAudioTracks();

    audioTracks.forEach((track) => {
      // $FlowFixMe
      videoStream.addTrack(track);
    });

    return videoStream;
  };
}

function polyfillVideo(videoElement, captureStream) {
  return async () => {
    const audioStream = captureStream();
    const videoStream = captureVideo(videoElement);

    // must wait for streams to populate with data
    const audioTracks = await new Promise((res) => {
      videoElement.addEventListener('loadeddata', () => {
        // $FlowFixMe
        res(audioStream.getAudioTracks());
      });
    });

    audioTracks.forEach((track) => {
      videoStream.addTrack(track);
    });

    return videoStream;
  };
}

function polyfillVideoElement(
  videoElement: HTMLVideoElement,
  shouldPolyfillVideo?: boolean = false,
  shouldPolyfillAudio?: boolean = false,
) {
  const shouldPolyfill = shouldPolyfillAudio && shouldPolyfillVideo;

  if (shouldPolyfill || videoElement.captureStream === undefined) {
    // $FlowFixMe
    videoElement.captureStream = polyfill(videoElement);

    return videoElement;
  }

  if (shouldPolyfillVideo) {
    // $FlowFixMe
    videoElement.captureStream = polyfillVideo(
      videoElement,
      videoElement.captureStream.bind(videoElement),
    );
  }

  if (shouldPolyfillAudio) {
    // $FlowFixMe
    videoElement.captureStream = polyfillAudio(
      videoElement,
      videoElement.captureStream.bind(videoElement),
    );
  }

  return videoElement;
}

export default polyfillVideoElement;
