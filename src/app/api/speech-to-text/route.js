

// // import { google } from 'googleapis';
// import { SpeechClient } from '@google-cloud/speech';

// // const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

// // const client = new google.auth.JWT({
// //     email: serviceAccount.client_email,
// //     key: serviceAccount.private_key,
// //     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
// // });

// // const authClient = new google.auth.JWT({
// //     email: serviceAccount.client_email,
// //     key: serviceAccount.private_key,
// //     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
// // });

// export async function POST(req) {
//     if (req.method !== 'POST') {
//         return new Response(JSON.stringify({ message: 'Only POST requests are allowed' }), {
//             status: 405,
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//     }



//     // await authClient.authorize();
//     // const client = new SpeechClient();

//     try {
//         // const serviceAccountJson = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString('utf-8');
//         // const serviceAccount = JSON.parse(serviceAccountJson);

//         // const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
//         // const serviceAccountJson = Buffer.from(req.env.GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString('utf-8');
//         // const serviceAccount = JSON.parse(serviceAccountJson);



//         const client_email = process.env.CLIENT_EMAIL;
//         const private_key = process.env.GOOGLE_APPLICATION_CREDENTIALS.private_key; // Handle escaped newlines
//         // const private_key = private_key_escaped.replace(/\\n/g, '\n');
//         const projectId = process.env.GOOGLE_APPLICATION_CREDENTIALS.projectId;
//         // Ensure all credentials are available
//         if (!client_email || !private_key || !projectId) {
//             throw new Error('Missing required environment variables.');
//         }


//         const client = new SpeechClient(
//             {
//                 // credentials: serviceAccount
//                 credentials: {
//                     client_email: client_email,
//                     private_key: private_key
//                 },
//                 projectId: projectId,
//             }
//         );


//         // const client = new SpeechClient();

//         const { audioData } = await req.json();
//         console.log("Received audioData:", audioData);
//         const audioBytes = Uint8Array.from(audioData).buffer;
//         console.log("Converted audioBytes to Buffer:", audioBytes);


//         const request = {
//             audio: {
//                 content: Buffer.from(audioBytes).toString('base64'), // Encode the audio data
//             },
//             config: {
//                 encoding: 'LINEAR16',
//                 // sampleRateHertz: 48000,
//                 languageCode: 'en-US',
//             },
//         };
//         console.log("Sending request to Google Speech-to-Text:", request);
//         // Process the request with Google Speech-to-Text

//         const [response] = await client.recognize(request);
//         console.log("Google Cloud Speech-to-Text response:", response);

//         if (response && response.results && response.results.length > 0) {
//             const transcription = response.results
//                 .map(result => (result.alternatives && result.alternatives.length > 0)
//                     ? result.alternatives[0].transcript
//                     : '')
//                 .join('\n');
//             console.log("Transcription received:", transcription);
//         } else {
//             console.log("No transcription found.");
//         }
//         console.log("Google Cloud Speech-to-Text response:", response);

//         const transcription = response.results
//             .map(result => result.alternatives[0].transcript)
//             .join('\n');

//         console.log("Transcription received:", transcription);

//         return new Response(JSON.stringify({ transcript: transcription }), {
//             status: 200,
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });


//     } catch (error) {
//         console.error('Error with Google Speech-to-Text:', error);
//         console.error(`here is the email: ${client_email}`);
//         return new Response(JSON.stringify({ error: 'Failed to process speech' }), {
//             status: 500,
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//     }
// }






import fs from 'fs';
import fetch from 'node-fetch';

export async function POST(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Only POST requests are allowed' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
        const { audioData } = await req.json();
        console.log("Received audioData:", audioData);

        // Convert audioData to Buffer
        const audioBuffer = Buffer.from(audioData);

        const url = "https://api.deepgram.com/v1/listen";
        const headers = {
            Accept: "application/json",
            Authorization: `Token ${deepgramApiKey}`,
            "Content-Type": "audio/wav", // Adjust mimetype based on your audio format
        };

        // Make the POST request directly using node-fetch
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: audioBuffer,
        });

        if (!response.ok) {
            throw new Error(`Failed to make request: ${response.statusText}`);
        }

        const data = await response.json();
        console.dir(data, { depth: null }); // Log the transcription data

        const transcription = data.results.channels[0].alternatives[0].transcript;

        return new Response(JSON.stringify({ transcript: transcription }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Error with Deepgram Speech-to-Text:', error);
        return new Response(JSON.stringify({ error: 'Failed to process speech' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
