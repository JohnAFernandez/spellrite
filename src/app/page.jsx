"use client"
import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useGlobalState } from '../GlobalStateContext';

export default function Home() {
    const { setTest } = useGlobalState();

    const handleTestSelection = (testName) => {
        setTest(testName);
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>5th Grade Spelling</h1>

                {/* <h3>Directions:</h3> */}
                <ul
                    className={styles.directionsList}
                    style={{
                        listStyleType: "none",
                        paddingLeft: 0
                    }}>
                    <li className={styles.directionItem}>
                        <div className={styles.directionsRow}>
                            {/* <Image
                                aria-hidden
                                src="/assets/lacey_no_bg.png"
                                alt="Globe icon"
                                width={45}
                                height={45}
                                className={styles.directionsImg1}
                            /> */}
                            <h3>
                                {/* Click on this week&apos;s spelling list to practice. */}
                                ✓ Click on the list you want to practice.
                            </h3>
                        </div>
                    </li>
                    <li className={styles.directionItem}>
                        <div className={styles.directionsRow}>
                            <h3>
                                ✓ You can either type or speak your answer.
                            </h3>
                            {/* <Image
                                aria-hidden
                                src="/assets/lacey_no_bg.png"
                                alt="Globe icon"
                                width={45}
                                height={45}
                                className={styles.directionsImg2}
                            /> */}
                        </div>

                    </li>
                    {/* <li className={styles.directionItem}>
                        If you are using a phone, you may need to give your browser speech recognition permissions to use the speech option.
                    </li> */}

                </ul>
                <ul
                    className={styles.testButtonList}
                    style={{
                        listStyleType: "none",
                        paddingLeft: 0
                    }}>
                    <li>
                        <Link href="/test">
                            <button onClick={() => handleTestSelection('States Test 1-10')} className={styles.testButton} >
                                States 1-10
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/test">
                            <button onClick={() => handleTestSelection('States Test 11-20')} className={styles.testButton} >
                                States 11-20
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/test">
                            <button onClick={() => handleTestSelection('States Test 21-30')} className={styles.testButton} >
                                States 21-30
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/test">
                            <button onClick={() => handleTestSelection('States Test 31-40')} className={styles.testButton} >
                                States 31-40
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/test">
                            <button onClick={() => handleTestSelection('States Test 41-50')} className={styles.testButton} >
                                States 41-50
                            </button>
                        </Link>
                    </li>
                    {/* <li>
                        <Link href="/test">
                            <button onClick={() => handleTestSelection('Spelling Test T-4')} className={styles.testButton} >
                                List T-4
                            </button>
                        </Link>
                    </li> */}
                    {/* <li>
                        <Link href="/test">
                            <button onClick={() => handleTestSelection('Spelling Test T-5')} className={styles.testButton} >
                                List T-5
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/test">
                            <button onClick={() => handleTestSelection('Spelling Test U-1')} className={styles.testButton} >
                                List U-1
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/test">
                            <button onClick={() => handleTestSelection('Spelling Test U-2')} className={styles.testButton} >
                                List U-2
                            </button>
                        </Link>
                    </li> */}
                    {/* <li>
                        <Link href="/test">
                            <button onClick={() => handleTestSelection('Spelling Test U-3')} className={styles.testButton} >
                                List U-3
                            </button>
                        </Link>
                    </li> */}
                </ul>
                {/* <button style={{ backgroundColor: "#00DFA2", outline: "none", border: "none", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "2rem" }}><Link href='/test'>GO</Link></button> */}

            </main>
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
        </div>
    );
}