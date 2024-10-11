// import { SpeechClient } from '@google-cloud/speech';

// export async function POST(req, res) {
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
//             // sampleRateHertz: 16000,
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






// import { google } from 'googleapis';
import { SpeechClient } from '@google-cloud/speech';

// const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

// const client = new google.auth.JWT({
//     email: serviceAccount.client_email,
//     key: serviceAccount.private_key,
//     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
// });

// const authClient = new google.auth.JWT({
//     email: serviceAccount.client_email,
//     key: serviceAccount.private_key,
//     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
// });

export async function POST(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Only POST requests are allowed' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }



    // await authClient.authorize();
    // const client = new SpeechClient();

    try {
        // const serviceAccountJson = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString('utf-8');
        // const serviceAccount = JSON.parse(serviceAccountJson);

        const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
        // const serviceAccountJson = Buffer.from(req.env.GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString('utf-8');
        // const serviceAccount = JSON.parse(serviceAccountJson);
        const client_email = serviceAccount.client_email;
        const private_key = serviceAccount.private_key;
        const projectId = serviceAccount.project_id;

        const client = new SpeechClient({
            // credentials: serviceAccount
            credentials: {
                client_email: client_email,
                private_key: private_key
            },
            projectId: projectId,
        });

        // const client = new SpeechClient();

        const { audioData } = await req.json();
        console.log("Received audioData:", audioData);
        const audioBytes = Uint8Array.from(audioData).buffer;
        console.log("Converted audioBytes to Buffer:", audioBytes);


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







// import { google } from 'googleapis';
// import { Readable } from 'stream';

// export default async function handler(req, res) {
//     try {
//         const { audioData } = req.body;

//         // Load credentials from individual environment variables
//         const credentials = {
//             client_email: process.env.GOOGLE_CLIENT_EMAIL,
//             private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),  // Replace escaped newlines
//             project_id: process.env.GOOGLE_PROJECT_ID,
//         };

//         const client = await google.auth.getClient({
//             credentials,
//             scopes: ['https://www.googleapis.com/auth/cloud-platform'],
//         });

//         const speech = google.speech({ version: 'v1p1beta1', auth: client });

//         // Convert the received audio data (Array of bytes) to a buffer
//         const audioBuffer = Buffer.from(audioData);

//         // Create a request object
//         const request = {
//             config: {
//                 encoding: 'LINEAR16',
//                 sampleRateHertz: 16000,
//                 languageCode: 'en-US',
//             },
//             audio: {
//                 content: audioBuffer.toString('base64'),
//             },
//         };

//         // Call the Google Speech-to-Text API
//         const [response] = await speech.speech.recognize({
//             requestBody: request,
//         });

//         const transcript = response.results
//             .map(result => result.alternatives[0].transcript)
//             .join('\n');

//         res.status(200).json({ transcript });
//     } catch (error) {
//         console.error('Error with Google Speech-to-Text:', error);
//         res.status(500).json({ error: 'Error with Google Speech-to-Text' });
//     }
// }