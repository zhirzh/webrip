function polyfill(audioElement) {
  // `audioElement` must NOT be muted

  return () => {
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaElementSource(audioElement);
    const destination = audioCtx.createMediaStreamDestination();
    const gainNode = audioCtx.createGain();

    source.connect(gainNode);
    gainNode.connect(destination);

    source.connect(audioCtx.destination);

    return destination.stream;
  };
}

function polyfillAudioElement(audioElement, force = false) {
  if (force || audioElement.captureStream === undefined) {
    audioElement.captureStream = polyfill(audioElement);
  }

  return audioElement;
}

export default polyfillAudioElement;
