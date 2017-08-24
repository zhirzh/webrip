// @flow

/* eslint-disable no-unused-vars */

type BlobEvent = Event & {
  data: Blob,
};

declare class MediaStreamAudioDestinationNode extends AudioNode {
  stream: MediaStream,
}

declare class AudioContext {
  destination: AudioDestinationNode,

  createGain(): GainNode,
  createMediaElementSource(myMediaElement: HTMLMediaElement): MediaElementAudioSourceNode,

  createMediaStreamDestination(): MediaStreamAudioDestinationNode,
}

declare class MediaRecorder {
  constructor(MediaStream, ?Object): MediaRecorder,

  state: 'inactive' | 'paused' | 'recording',

  ondataavailable: (dataavailableEvent: BlobEvent) => void,

  pause(): void,
  resume(): void,
  start(timeslice?: number): void,
  stop(): void,
}

type MediaState = 'PLAYING' | 'PAUSED' | 'ENDED' | 'LOADING' | null;

export type { MediaState };

export { AudioContext, HTMLCanvasElement, MediaRecorder };
