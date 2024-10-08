"use client"
import { useEffect, useState, useRef } from 'react';
import { currentList } from '../../lists/currentList.js';

import styles from './page.module.scss';
import Link from 'next/link.js';
import Image from 'next/image.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faBullhorn, faMegaphone } from '@fortawesome/free-solid-svg-icons';

const Page = () => {
    const list = currentList;
    const [nextMondayDate, setNextMondayDate] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [currentWord, setCurrentWord] = useState('');
    const [isTesting, setIsTesting] = useState(false);
    const [score, setScore] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [userWordList, setUserWordList] = useState([]);
    const [mainBtnMessage, setMainBtnMessage] = useState('Start');
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null)
    const inputRef = useRef(null);

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


    useEffect(() => {
        // Function to get the date of next Monday
        function getNextMonday() {
            const today = new Date();

            const dayOfWeek = today.getDay();

            let daysUntilNextMonday;
            if (dayOfWeek === 0) {
                // If today is Sunday, get the Monday of the upcoming week
                daysUntilNextMonday = 1;
            } else if (dayOfWeek === 1 || dayOfWeek === 2) {
                // If today is Monday or Tuesday, get the current week's Monday
                daysUntilNextMonday = 0;
            } else {
                // For other days, get the Monday of the next week
                daysUntilNextMonday = (8 - dayOfWeek) % 7;
            }

            const nextMonday = new Date(today);
            nextMonday.setDate(today.getDate() + daysUntilNextMonday);
            return nextMonday.toDateString();
        }
        setNextMondayDate(getNextMonday());
    }, []);

    const startTest = () => {
        setIsTesting(true);
        setCurrentWord(list[0]);
        setWordCount(0);
        playWord(list[0]);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleNextWord = () => {
        if (!isTesting) return;
        if (userInput.trim().length < 1) return;
        if (wordCount >= list.length - 1) {
            setIsTesting(false);
            setMainBtnMessage('Test Again')
        }

        setUserWordList((prevList) => [...prevList, userInput]);
        // console.table(userWordList);

        console.log("userword: ", userInput, "currentWord: ", currentWord);
        if (userInput.trim().toLowerCase() === currentWord.toLowerCase()) {
            setScore((prevScore) => prevScore + 1);
            console.log("userword: ", userInput, "currentWord: ", currentWord);
        }

        if (wordCount < list.length) {
            setCurrentWord(list[wordCount + 1]);
            setWordCount((prevCount) => prevCount + 1);
            playWord(list[wordCount + 1]);
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

    const playWord = (word) => {
        const speech = new SpeechSynthesisUtterance(word);
        if (selectedVoice) {
            speech.voice = selectedVoice;
        }
        window.speechSynthesis.speak(speech);
    };

    const repeatWord = () => {
        playWord(currentWord);
    }

    return (
        <main className={styles.main}>
            <h1 className={styles.title}><Link href='/'>SpellRite</Link></h1>
            {!isTesting && <h3>
                Test for the week of {nextMondayDate}
            </h3>}
            <div>Score: <span>{score}/{wordCount}</span></div>
            <div className={styles.test}>

                {!isTesting && <button className={styles.btn} onClick={
                    startTest
                }>{mainBtnMessage}</button>}

                {isTesting && <div>

                    <h4 className={styles.subtitle}>Type the word here:</h4>
                    <input
                        type="text"
                        className={styles.input}
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder=""
                        ref={inputRef}

                    /></div>}
                {isTesting && <div className={styles.buttons}>
                    <button onClick={repeatWord} className={styles.repeatBtn}>
                        <h4>Repeat Word</h4>
                        <FontAwesomeIcon icon={faVolumeUp} style={styles.icon} />
                    </button>
                    <button className={styles.nextBtn} onClick={handleNextWord}>
                        Next
                    </button>
                </div>}
                {/* <ol>
                    {oct8.map((word, index) => {
                        return (<li key={index} className='word'>{word}</li>)
                    })}
                </ol> */}
            </div>
        </main>
    )
}

export default Page;

