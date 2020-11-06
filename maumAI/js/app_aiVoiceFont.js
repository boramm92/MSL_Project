'use strict'
// fetch('audio/rock-48000hz-trim.wav') // Localhost testing requires CORS config to obtain Content-Length
// fetch('https://fetch-stream-audio.anthum.com/nolimit/house-41000hz-trim.wav')
//     .then(response => playResponseAsStream(response, 16*1024))
// .then(_ => console.log('all stream bytes queued for decoding'))
// .catch(e => UI.error(e))


/* Chunks read must be buffered before sending to decoder.
 * Otherwise, decoder returns white noise for odd (not even) chunk size).
 * Skipping/hissing occurs if buffer is too small or if network isn't fast enough.
 * Users must wait too long to hear audio if buffer is too large.
 *
 * Returns Promise that resolves when entire stream is read and bytes queued for decoding
 */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playResponseAsStream(response, readBufferSize) {
  if (!response.ok) throw Error(response.status+' '+response.statusText)
  if (!response.body) throw Error('ReadableStream not yet supported in this browser - <a href="https://developer.mozilla.org/en-US/docs/Web/API/Body/body#Browser_Compatibility">browser compatibility</a>')

  const reader = response.body.getReader(),
      readBuffer = new ArrayBuffer(readBufferSize),
      readBufferView = new Uint8Array(readBuffer);

  let byte, readBufferPos = 0;


  // TODO errors in underlying Worker must be dealt with here.
  function flushReadBuffer() {
    AudioStreamPlayer.enqueueForDecoding(readBuffer.slice(0, readBufferPos));
    readBufferPos = 0;
  }

  // Fill readBuffer and flush when readBufferSize is reached
  function read() {
    return reader.read().then(({value, done}) => {
      console.log("value-buffer: " ,value);
      if (done) {
        flushReadBuffer();
        return;
      } else {
        // bytesRead+= value.byteLength;

        for (byte of value) {
          readBufferView[readBufferPos++] = byte;
          if (readBufferPos === readBufferSize) {
            flushReadBuffer();
          }
        }
        return read();
      }
    })
  }
  return read()
}



// Main controller for playing chunks enqueued for decoding.
const AudioStreamPlayer = (function() {
  const worker = new Worker('/aiaas/kr/js/tts/worker-decoder.js'),
      // audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
      audioSrcNodes = []; // Used to fix Safari Bug https://github.com/AnthumChris/fetch-stream-audio/issues/1

  let totalTimeScheduled = 0,   // time scheduled of all AudioBuffers
      playStartedAt = 0,        // audioContext.currentTime of first scheduled play buffer
      abCreated = 0,            // AudioBuffers created
      abEnded = 0;              // AudioBuffers played/ended

  // TODO errors should be signaled to caller
  worker.onerror = event => {};

  worker.onmessage = event => {
    if (event.data.channelData) {
      const decoded = event.data;

      // convert Transferrable ArrayBuffer to Float32Array
      decoded.channelData = decoded.channelData.map(arrayBuffer => new Float32Array(arrayBuffer));

      schedulePlayback(decoded);
    }
  }

  function onAudioNodeEnded() {
    audioSrcNodes.shift();
    abEnded++;
    if (abEnded == abCreated) {
      $('.input_txt').show();
      $('.recording').hide();
      totalTimeScheduled = 0;
      playStartedAt = 0;
      abCreated = 0;
      abEnded = 0;
    }
  }

  // arrayBuffer will be inaccessible to caller after performant Transferable postMessage()
  function enqueueForDecoding(arrayBuffer) {
    worker.postMessage({decode: arrayBuffer}, [arrayBuffer]);
  }

  function schedulePlayback({channelData, length, numberOfChannels, sampleRate}) {
    const audioSrc = audioCtx.createBufferSource(),
        audioBuffer = audioCtx.createBuffer(numberOfChannels,length, sampleRate);

    audioSrc.onended = onAudioNodeEnded;
    abCreated++;

    // ensures onended callback is fired in Safari
    if (window.webkitAudioContext) {
      audioSrcNodes.push(audioSrc);
    }

    // Use performant copyToChannel() if browser supports it
    for (let c=0; c<numberOfChannels; c++) {
      if (audioBuffer.copyToChannel) {
        audioBuffer.copyToChannel(channelData[c], c)
      } else {
        let toChannel = audioBuffer.getChannelData(c);
        for (let i=0; i<channelData[c].byteLength; i++) {
          toChannel[i] = channelData[c][i];
        }
      }
    }

    // initialize first play position.  initial clipping/choppiness sometimes occurs and intentional start latency needed
    // read more: https://github.com/WebAudio/web-audio-api/issues/296#issuecomment-257100626
    if (!playStartedAt) {
      const startDelay = audioBuffer.duration + (audioCtx.baseLatency || 128 / audioCtx.sampleRate);
      playStartedAt = audioCtx.currentTime + startDelay;
    }

    audioSrc.buffer = audioBuffer;
    audioSrc.connect(audioCtx.destination);
    audioSrc.start(playStartedAt+totalTimeScheduled);

    if(abEnded==0){
      $('.btnBox').hide();
      $('.recording').show();
    }
    totalTimeScheduled += audioBuffer.duration;
  }

  return {
    enqueueForDecoding
  }


})()


