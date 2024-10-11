// import { SpeechClient } from '@google-cloud/speech';

// export async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ message: 'Only POST requests are allowed' });
//     }

//     const client = new SpeechClient();

//     const audioBytes = Uint8Array.from(req.body.audioData).buffer;

//     const request = {
//         audio: {
//             content: Buffer.from(audioBytes).toString('base64'), // Encode the audio data
//         },
//         config: {
//             encoding: 'LINEAR16',
//             sampleRateHertz: 16000,
//             languageCode: 'en-US',
//         },
//     };

//     try {
//         const [response] = await client.recognize(request);
//         const transcription = response.results
//             .map(result => result.alternatives[0].transcript)
//             .join('\n');
//         res.status(200).json({ transcript: transcription });
//     } catch (error) {
//         console.error('Error with Google Speech-to-Text:', error);
//         res.status(500).json({ error: 'Failed to process speech' });
//     }
// }

import { SpeechClient } from '@google-cloud/speech';

// Use a named export for the POST method
export async function POST(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Only POST requests are allowed' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const client = new SpeechClient();

    try {
        const { audioData } = await req.json();

        const audioBytes = Uint8Array.from(audioData).buffer;

        const request = {
            audio: {
                content: Buffer.from(audioBytes).toString('base64'), // Encode the audio data
            },
            config: {
                encoding: 'LINEAR16',
                // sampleRateHertz: 16000,
                languageCode: 'en-US',
            },
        };

        // Process the request with Google Speech-to-Text
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        return new Response(JSON.stringify({ transcript: transcription }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Error with Google Speech-to-Text:', error);
        return new Response(JSON.stringify({ error: 'Failed to process speech' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}