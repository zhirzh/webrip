// @flow

declare function captureStream(): MediaStream;

declare class MediaRecorder {
  constructor(MediaStream, ?Object): MediaRecorder,

  state: string,
  ondataavailable: Function,

  start: Function,
  stop: Function,
}

declare class ClassList extends Array<string> {
  contains(string): boolean,
  add(string): void,
  remove(string): void,
}

export { ClassList, MediaRecorder };
