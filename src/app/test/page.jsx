"use client"
import { useEffect, useState, useRef } from 'react';
import { useGlobalState } from '@/GlobalStateContext.js';
import { T4 } from '@/lists/T4.js';
import { T5 } from '@/lists/T5.js';
import { U1 } from '@/lists/U1.js';
import { U2 } from '@/lists/U2.js';
import { U3 } from '@/lists/U3.js';
import { states1, states2, states3, states4, states5 } from '@/lists/States.js'

import { convertTo16kHz } from '../utils/audioConversion.js'

import styles from './page.module.scss';
import Link from 'next/link.js';
import Image from 'next/image.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faBullhorn, faMegaphone, faMicrophone, faTimesCircle, faArrowRight, faAnglesRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { getOS } from '../utils/getOS.js'
import { Tooltip } from 'react-tooltip'
import SpellingResults from '../components/SpellingResults.jsx';

const Page = () => {

    const [currentList, setCurrentList] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const { test } = useGlobalState();
    // const [nextMondayDate, setNextMondayDate] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [currentWord, setCurrentWord] = useState('');
    const [isTesting, setIsTesting] = useState(false);
    const [score, setScore] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [userWordList, setUserWordList] = useState([]);
    const [mainBtnMessage, setMainBtnMessage] = useState('Start');
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null)
    const [isListening, setIsListening] = useState(false);
    const [showScore, setShowScore] = useState(false);
    const inputRef = useRef(null);

    // Usage
    const os = getOS();
    console.log(`Operating System: ${os}`);


    useEffect(() => {
        if (test === 'Spelling Test T-4') {
            setCurrentList(T4);
            console.log('list T4!!!!');
        } else if (test === 'Spelling Test T-5') {
            setCurrentList(T5);
            console.log('list T5!!!!');
        } else if (test === 'Spelling Test U-1') {
            setCurrentList(U1);
        } else if (test === 'Spelling Test U-2') {
            setCurrentList(U2);
        } else if (test === 'Spelling Test U-3') {
            setCurrentList(U3);
        } else if (test === 'States Test 1-10') {
            setCurrentList(states1);
        } else if (test === 'States Test 11-20') {
            setCurrentList(states2);
        } else if (test === 'States Test 21-30') {
            setCurrentList(states3);
        } else if (test === 'States Test 31-40') {
            setCurrentList(states4);
        } else if (test === 'States Test 41-50') {
            setCurrentList(states5);
        } else {
            setCurrentList(states1);
        }
    }, [test]);


    useEffect(() => {
        if (isListening) {
            console.log("LISTENING!!!");
            startSpeechRecognition();
        }
    }, [isListening]);

    const handleMicrophoneClick = () => {
        setUserInput('');
        setIsListening(true); // Start listening when microphone button is clicked
    };

    const startSpeechRecognition = async () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        const listenWithDeepGram = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            let chunks = [];

            mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: 'audio/wav' });
                const resampledBlob = await convertTo16kHz(audioBlob);
                console.log("Audio Blob:", audioBlob);
                const audioData = await resampledBlob.arrayBuffer(); // Convert to binary data

                // Send audio data to the backend
                const response = await fetch('/api/speech-to-text', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ audioData: Array.from(new Uint8Array(audioData)) }),
                });

                try {
                    const { transcript, error } = await response.json();
                    if (error) {
                        console.error('Error from backend:', error);
                        return; // Handle the error appropriately
                    }

                    console.log(`received from backend::: ${transcript}`);

                    // Process the transcript and split into separate "words" (in case multiple words are spoken)
                    const recognizedLetters = (transcript || "").toUpperCase().split(/\s+/); // Split by spaces or multiple spaces
                    console.log("Recognized Letters from backend:", recognizedLetters);

                    let newInput = ''; // Initialize an empty string to build valid input

                    // Iterate through the recognized letters and filter for valid single letters only
                    recognizedLetters.forEach((letter) => {
                        // Accept only single alphabet letters (A-Z)
                        if (/^[A-Z]$/.test(letter)) {
                            newInput += letter; // Append valid letters to the new input
                        } else {
                            console.log("Ignored non-letter or multi-letter input:", letter);
                        }
                    });

                    if (newInput) {
                        // If valid letters were recognized, append them to the existing user input
                        setUserInput(prevInput => prevInput + newInput);
                        console.log(`New User Input: ${newInput}`);
                    } else {
                        console.log("No valid letters recognized from the backend.");
                    }
                } catch (error) {
                    console.error('Error fetching transcript:', error);
                }
            };

            mediaRecorder.start();

            // Listen for silence and stop recording when silence is detected for a while
            const audioContext = new AudioContext();
            const audioSource = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            audioSource.connect(analyser);
            analyser.fftSize = 512; // Smaller size for more granularity
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            let silenceStart = performance.now();
            let silenceThreshold = 2000;
            const checkForSilence = () => {
                analyser.getByteFrequencyData(dataArray);
                const sum = dataArray.reduce((a, b) => a + b, 0);
                const average = sum / bufferLength;

                if (average < 10) { // You can adjust this threshold for "silence"
                    if (performance.now() - silenceStart > silenceThreshold) {
                        mediaRecorder.stop();
                        setIsListening(false);
                        stream.getTracks().forEach(track => track.stop());
                        console.log('Stopped recording due to silence');
                    }
                } else {
                    silenceStart = performance.now(); // Reset silence timer if sound is detected
                }

                if (mediaRecorder.state !== 'inactive') {
                    requestAnimationFrame(checkForSilence);
                }
            };

            checkForSilence();

        }
        if (os === 'iOS') {
            listenWithDeepGram();
        }
        else if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang
                = 'en-US';
            recognition.interimResults = false;
            recognition.continuous = false;

            recognition.onresult = (event) => {
                // Get the spoken text from the event and trim any extra spaces
                const spokenText = event.results[0][0].transcript.trim().toUpperCase();
                console.log(`Spoken Text: "${spokenText}"`);

                // Split the spoken text by spaces (it might be more than one letter if the system misinterprets)
                const recognizedLetters = spokenText.split(/\s+/); // Split by any whitespace
                console.log("Recognized Letters:", recognizedLetters);

                let newInput = ''; // Initialize empty string for valid letters

                // Iterate over the recognized input and filter out anything that isn't a single letter
                recognizedLetters.forEach((letter) => {
                    // Ensure only single letters (A-Z) are accepted
                    if (/^[A-Z]$/.test(letter)) {
                        newInput += letter; // Append valid letters to the new input
                    } else {
                        console.log("Ignored non-letter or multi-letter input:", letter);
                    }
                });

                if (newInput) {
                    // If we recognized valid letters, append them to the current input
                    setUserInput(prevInput => prevInput + newInput);
                    console.log(`New User Input: ${newInput}`);
                } else {
                    console.log("No valid letters recognized.");
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();
        } else {
            listenWithDeepGram();
        }

    };

    useEffect(() => {
        const handleVoicesChanged = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);

            // Preselect a specific voice
            const defaultVoice = availableVoices.find(voice => voice.name === 'IBM Watson - Michael');

            setSelectedVoice(defaultVoice);
        };

        window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

        // Fetch voices on component mount
        handleVoicesChanged();

        return () => {
            window.speechSynthesis.onvoiceschanged = null; // Clean up the event listener
        };
    }, []);

    useEffect(() => {
        if (isTesting && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isTesting]);


    // useEffect(() => {

    //     function getNextMonday() {
    //         const today = new Date();

    //         const dayOfWeek = today.getDay();

    //         let daysUntilNextMonday;
    //         if (dayOfWeek === 0) {

    //             daysUntilNextMonday = 1;
    //         } else if (dayOfWeek === 1 || dayOfWeek === 2) {

    //             daysUntilNextMonday = 0;
    //         } else {

    //             daysUntilNextMonday = (8 - dayOfWeek) % 7;
    //         }

    //         const nextMonday = new Date(today);
    //         nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    //         return nextMonday.toDateString();
    //     }
    //     setNextMondayDate(getNextMonday());
    // }, []);

    const startTest = () => {
        setIsTesting(true);
        setCurrentWord(currentList[0]);
        setWordCount(0);
        setScore(0);
        playWord(currentList[0]);
        setShowScore(false);
        setUserWordList([]);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleNextWord = () => {
        if (!isTesting) return;
        if (userInput.trim().length < 1) return;
        if (wordCount >= currentList.length - 1) {
            setIsTesting(false);
            setShowScore(true);
            setMainBtnMessage('Test Again')
        }

        setUserWordList((prevList) => [...prevList, userInput]);
        console.log("userword: ", userInput, "currentWord: ", currentWord);
        if (userInput.trim().toLowerCase() === currentWord.toLowerCase()) {
            setScore((prevScore) => prevScore + 1);
            console.log("userword: ", userInput, "currentWord: ", currentWord);
        }

        if (wordCount < currentList.length) {
            setCurrentWord(currentList[wordCount + 1]);
            setWordCount((prevCount) => prevCount + 1);
            playWord(currentList[wordCount + 1]);
            setUserInput('');
            console.log(`Correct! New Score: ${score}`);
        } else {
            console.log('you finished the test! Final score: ', score);
            setIsTesting(false);
        }
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    }

    const handleClearInput = () => {
        setUserInput('');
    };

    const playWord = (word) => {
        const speech = new SpeechSynthesisUtterance(word);

        // const naturalVoice = voices.find(voice =>
        //     voice.name.includes("Google US English") ||
        //     // voice.name.includes("Google UK English") ||
        //     voice.name.includes("Microsoft Zira") || // Microsoft's natural voices
        //     voice.name.includes("Microsoft David")   // Another option
        // );
        const usVoice = voices.find(voice =>
            voice.lang === 'en-US' &&
            (voice.name.includes("Google US English") || voice.name.includes("Microsoft David") || voice.name.includes("Samantha"))
        );


        speech.voice = selectedVoice || usVoice || voices.find(voice => voice.lang === 'en-US');
        speech.rate = 0.85;
        window.speechSynthesis.speak(speech);
    };

    const repeatWord = () => {
        playWord(currentWord);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            console.log('Enter key was pressed. Value:', userInput);
            handleNextWord();
        }
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.backDiv} >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <h4 className={styles.backBtn}>
                            <Link href='/'>
                                Back to Lists
                            </Link>
                        </h4>

                    </div>
                    <h4>{test}</h4>
                </div>
                {/* {!isTesting && <h3>
                Test for the week of {nextMondayDate}
            </h3>} */}
                {showScore && <div className={styles.score}>Score: <span>{score}/{wordCount}</span></div>}
                {showScore && <SpellingResults userWords={userWordList} targetWords={currentList} />}
                {!isTesting && userWordList.length < 1 && <div className={styles.persmissionsDiv}>If you wish to use the microphone button, you may need to go into your device settings and allow <em>speech-to-text</em> and <em>microphone</em>permissions for your browser.</div>}
                {!isTesting && <button className={styles.btn} onClick={
                    startTest
                }>{mainBtnMessage}</button>}
                {isTesting && <div className={styles.test}>
                    {isTesting && <div className={styles.inputContainer}>
                        <h4 className={styles.subtitle}>Type word:</h4>
                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                value={userInput}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder=""
                                ref={inputRef}
                                spellCheck="false"
                                autoComplete="off" 
                     
                                autoCorrect="off" 
                                autoCapitalize="off" 
                            />
                            {userInput && (
                                <button className={styles.clearButton} onClick={handleClearInput}>
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </button>
                            )}
                        </div>
                        <button
                            className={styles.micButton}
                            onClick={handleMicrophoneClick}
                            style={{ backgroundColor: isListening ? "#f2f597" : "#492e87" }}>
                            <FontAwesomeIcon icon={faMicrophone} style={{ color: isListening ? "#0A1D56" : "#ffffff" }} />
                        </button>
                    </div>

                    }
                    {isTesting && <div className={styles.buttons}>
                        <button
                            onClick={repeatWord}
                            className={styles.repeatBtn}
                            data-tooltip-id="repeat-tip"
                            data-tooltip-content="Repeat Word"
                            data-tooltip-place="bottom"
                        >
                            <FontAwesomeIcon
                                className={styles.repeatIcon}
                                icon={faVolumeUp} style={styles.icon}
                            />
                            {/* <h4>Repeat</h4> */}

                        </button>
                        <Tooltip
                            id="repeat-tip"
                        />
                        <button
                            className={styles.nextBtn}
                            onClick={handleNextWord} data-tooltip-id="next-tip"
                            data-tooltip-content="Next Word"
                            data-tooltip-place="bottom"
                        >
                            <FontAwesomeIcon
                                className={styles.nextIcon}
                                icon={faAnglesRight}
                            />
                            {/* <h4>Next</h4> */}
                        </button>
                        <Tooltip
                            id="next-tip"

                        />
                    </div>}
                    {/* <ol>
                    {oct8.map((word, index) => {
                        return (<li key={index} className='word'>{word}</li>)
                    })}
                </ol> */}
                </div>}
            </main>
            {
                !isTesting && !showScore &&
                <footer className={styles.footer}>
                    <div className={styles.imageDiv} >
                        <Image
                            aria-hidden
                            src="/assets/lacey_no_bg.png"
                            alt="Globe icon"
                            width={55}
                            height={55}
                        />
                    </div>
                    <div>Mrs. Hvattum&apos;s 5th Grade →</div>
                    {/* </a> */}
                </footer>
            }
        </div>
    )
}

export default Page;


