"use client"
import styles from "./page.module.css";
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
                <h1>Spelling Practice</h1>

                {/* <h3>Directions:</h3> */}
                <ul
                    className={styles.directionsList}
                    style={{
                        listStyleType: "none",
                        paddingLeft: 0
                    }}>
                    <li className={styles.directionItem}>
                        Click on this week&apos;s spelling list to practice.
                    </li>
                    <li className={styles.directionItem}>
                        You can either type your answer or tap the microphone to spell verbally.
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
                            <button onClick={() => handleTestSelection('Spelling Test T-4')} className={styles.testButton} >
                                List T-4
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/test">
                            <button onClick={() => handleTestSelection('Spelling Test T-5')} className={styles.testButton} >
                                List T-5
                            </button>
                        </Link>
                    </li>
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
                    /></div>
                <div>Mrs. Hvattum&apos;s 5th Grade →</div>
                {/* </a> */}
            </footer>
        </div>
    );
}


