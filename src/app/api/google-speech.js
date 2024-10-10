import { SpeechClient } from '@google-cloud/speech';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const client = new SpeechClient();

  const audioData = req.body.audioData;

  const request = {
    audio: {
      content: audioData,
    },
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    },
  };

  try {
    const [response] = await client.recognize(request);
    const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
    res.status(200).json({ transcript: transcription });
  } catch (error) {
    console.error('Error with Google Speech-to-Text:', error);
    res.status(500).json({ error: 'Failed to process speech' });
  }
}