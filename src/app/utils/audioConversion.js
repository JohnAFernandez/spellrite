export const convertTo16kHz = async (audioBlob) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Convert the Blob into an AudioBuffer
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Create an OfflineAudioContext to perform the resampling
    const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.duration * 16000, // Set the length of the buffer
        16000 // The target sample rate (16 kHz)
    );

    // Create a buffer source for the audio data
    const bufferSource = offlineContext.createBufferSource();
    bufferSource.buffer = audioBuffer;

    // Connect the source to the offline context's destination and start the buffer
    bufferSource.connect(offlineContext.destination);
    bufferSource.start(0);

    // Start rendering the audio
    const renderedBuffer = await offlineContext.startRendering();

    // Convert the resampled buffer to a Blob (WAV format)
    const resampledBlob = audioBufferToWav(renderedBuffer);

    return resampledBlob;
};

// Helper function to convert AudioBuffer to WAV format
const audioBufferToWav = (buffer) => {
    const numOfChan = buffer.numberOfChannels,
        length = buffer.length * numOfChan * 2 + 44,
        bufferView = new DataView(new ArrayBuffer(length)),
        channels = [],
        sampleRate = buffer.sampleRate,
        bytesPerSample = 2;
    let offset = 0;

    const setUint16 = (data) => {
        bufferView.setUint16(offset, data, true);
        offset += 2;
    };

    const setUint32 = (data) => {
        bufferView.setUint32(offset, data, true);
        offset += 4;
    };

    // Write WAV header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * bytesPerSample * numOfChan);
    setUint16(bytesPerSample * numOfChan);
    setUint16(8 * bytesPerSample);

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - offset - 4); // data length

    // Write interleaved data
    for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < numOfChan; channel++) {
            let sample = buffer.getChannelData(channel)[i] * 0x7fff; // Convert to PCM
            if (sample < -32768) sample = -32768;
            if (sample > 32767) sample = 32767;
            bufferView.setInt16(offset, sample, true);
            offset += 2;
        }
    }
    return new Blob([bufferView], { type: 'audio/wav' });
};
