// @flow

declare class BlobEvent extends Event {
  data: Blob,
}

type MediaRecorderOptions = {
  mimeType?: string,
};

declare class MediaRecorder {
  constructor(stream: MediaStream, options?: MediaRecorderOptions): MediaRecorder,

  static isTypeSupported(type: string): boolean,

  +state: 'inactive' | 'recording' | 'paused',

  ondataavailable: (event: BlobEvent) => void,

  pause(): void,
  resume(): void,
  start(timeslice?: number): void,
  stop(): void,
}

export default MediaRecorder;
