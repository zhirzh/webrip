// @flow

declare class MediaStreamAudioDestinationNode extends AudioNode {
  stream: MediaStream,
}

declare class AudioContext {
  destination: AudioDestinationNode,

  createGain(): GainNode,
  createMediaElementSource(myMediaElement: HTMLMediaElement): MediaElementAudioSourceNode,

  createMediaStreamDestination(): MediaStreamAudioDestinationNode,
}

export default AudioContext;
