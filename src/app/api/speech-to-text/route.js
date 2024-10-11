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
const fs = require('fs');



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
        console.log("Received audioData:", audioData);
        const audioBytes = Uint8Array.from(audioData).buffer;
        console.log("Converted audioBytes to Buffer:", audioBytes);
        // Delete below

        // const audioBuffer = Buffer.from(audioBytes);
        // fs.writeFileSync('received_audio.wav', audioBuffer, (err) => {
        //     if (err) {
        //         console.error('Error writing audio file:', err);
        //     } else {
        //         console.log('Audio file saved successfully as received_audio.wav');
        //     }
        // });


        const request = {
            audio: {
                content: Buffer.from(audioBytes).toString('base64'), // Encode the audio data
            },
            config: {
                encoding: 'LINEAR16',
                // sampleRateHertz: 48000,
                languageCode: 'en-US',
            },
        };
        console.log("Sending request to Google Speech-to-Text:", request);
        // Process the request with Google Speech-to-Text

        const [response] = await client.recognize(request);
        console.log("Google Cloud Speech-to-Text response:", response);

        if (response && response.results && response.results.length > 0) {
            const transcription = response.results
                .map(result => (result.alternatives && result.alternatives.length > 0)
                    ? result.alternatives[0].transcript
                    : '')
                .join('\n');
            console.log("Transcription received:", transcription);
        } else {
            console.log("No transcription found.");
        }
        console.log("Google Cloud Speech-to-Text response:", response);

        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        console.log("Transcription received:", transcription);

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