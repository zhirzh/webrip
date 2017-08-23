// @flow

// eslint-disable-next-line no-unused-vars
type BlobEvent = Event & {
  data: Blob,
};

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

export { MediaRecorder };
