import styles from './SpellingResults.module.scss'

const SpellingResults = ({ userWords, targetWords }) => {
    return (
        <div className={styles.resultsContainer}>
            {/* <h3 className={styles.title}>
                Test Results
            </h3> */}
            <div className={styles.resultsListDiv}>
                <ul className={styles.resultsList}>
                    {userWords.map((word, index) => {
                        const isCorrect = userWords[index].trim().toLowerCase() === targetWords[index].trim().toLowerCase();
                        return <li key={index}
                            className={isCorrect ? styles.correct : styles.incorrect}
                        >
                            {isCorrect ? `✓ ${word}` : <div><span className={styles.incorrect}>✕ {word}</span> <span className={styles.correct}>(correct: {targetWords[index]})</span></div>}
                        </li>
                    })}
                </ul>
            </div>
        </div>
    )
}

export default SpellingResults;