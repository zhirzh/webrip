// @flow

declare class MediaRecorder {
  constructor(MediaStream, ?Object): MediaRecorder,

  state: string,
  ondataavailable: Function,

  start: Function,
  stop: Function,
}

export { MediaRecorder };
