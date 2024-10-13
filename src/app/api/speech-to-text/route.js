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
