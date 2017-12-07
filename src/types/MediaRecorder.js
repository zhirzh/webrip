// @flow

declare class BlobEvent extends Event {
  data: Blob;
}

type MediaRecorderOptions = {
  mimeType?: string,
};

declare class MediaRecorder {
  constructor(stream: MediaStream, options?: MediaRecorderOptions): MediaRecorder;

  // static methods
  static isTypeSupported(type: string): boolean;

  // data
  +state: 'inactive' | 'recording' | 'paused';

  // event listeners
  ondataavailable: (event: BlobEvent) => void;

  // methods
  pause(): void;
  resume(): void;
  start(timeslice?: number): void;
  stop(): void;
}

export default MediaRecorder;
