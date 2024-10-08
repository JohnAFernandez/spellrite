// // import { oct8 } from '@/lists/oct8';

// const runTest = async (list) => {
//     let score = 0;

//     for (const word of list) {
//         const askAnswer = await askUser(`Spell the word: ${word}`);
//         if (userAnswer.toLowerCase() === word.toLowerCase()) {
//             console.log('Correct!');
//         } else {
//             console.log(`Incorrect. The correct spelling is: ${word}`)
//         }
//         console.log(`Test complete. Your score: ${score} out of ${list.length}`);
//     }
// }

// const askUser = (question) => {
//     return new Promise((resolve) => {
//         const readline = require('readline').createInterface({
//             input: process.stdin,
//             output: process.stdout,
//         });

//         readline.question(question, (answer) => {
//             readline.close();
//             resolve(answer);
//         });
//     });
// };

// export { runTest };