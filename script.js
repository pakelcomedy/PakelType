const textDisplay = document.getElementById('text-display');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const errorsDisplay = document.getElementById('errors');
const resetButton = document.getElementById('reset-button');

const wordList = [
    "apple", "orange", "banana", "grape", "pineapple",
    "strawberry", "blueberry", "melon", "kiwi", "peach",
    "cherry", "pear", "plum", "mango", "lemon",
    "lime", "apricot", "coconut", "fig", "guava"
];

let startTime;
let totalErrors = 0;
let textToType = '';
let charIndex = 0;
let isTypingTestActive = false;
let waitingForSpace = false;

function generateRandomText(wordCount = 20) {
    const wordsPerLine = 7; // Number of words per line
    const maxLines = 3; // Maximum number of lines
    let randomText = '';
    let lineLength = 0;
    let wordsInCurrentLine = 0;
    let currentLine = 0;

    for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        const word = wordList[randomIndex];

        // Check if adding the next word exceeds line length or line word limit
        if (wordsInCurrentLine >= wordsPerLine || lineLength + word.length + 1 > 50) {
            // Add a newline if the current line exceeds limits
            randomText = randomText.trimEnd(); // Remove trailing space
            randomText += '\n'; // Add newline character
            lineLength = 0;
            wordsInCurrentLine = 0;
            currentLine++;

            // Stop adding more lines if maximum lines reached
            if (currentLine >= maxLines) {
                break;
            }
        }

        randomText += word + ' ';
        lineLength += word.length + 1; // Add space
        wordsInCurrentLine++;
    }

    // Add padding if fewer lines than maxLines
    while (currentLine < maxLines) {
        randomText += '\n'; // Add empty lines if needed
        currentLine++;
    }

    return randomText.trim(); // Remove any trailing spaces or newlines at the end
}

function startTypingTest() {
    textToType = generateRandomText();
    textDisplay.innerHTML = textToType.split('').map(char => `<span>${char}</span>`).join('');
    startTime = new Date().getTime();
    totalErrors = 0;
    charIndex = 0;
    waitingForSpace = false;
    isTypingTestActive = true;
    highlightCurrentChar();
    document.addEventListener('keydown', handleTyping);
    updateStats();
}

function handleTyping(event) {
    if (!isTypingTestActive) return;

    const typedChars = textDisplay.querySelectorAll('span');

    if (event.key === 'Backspace') {
        if (charIndex > 0) {
            charIndex--;
            const prevChar = typedChars[charIndex];
            prevChar.classList.remove('correct', 'incorrect', 'cursor');
            waitingForSpace = false;
            highlightCurrentChar();
        }
        return;
    }

    if (!waitingForSpace && event.key === textToType[charIndex]) {
        typedChars[charIndex].classList.add('correct');
        charIndex++;

        if (textToType[charIndex - 1] === ' ') {
            waitingForSpace = false;
        } else if (textToType[charIndex] === ' ') {
            waitingForSpace = true;
        }
    } else if (!waitingForSpace && event.key.length === 1) {
        typedChars[charIndex].classList.add('incorrect');
        charIndex++;
        totalErrors++;
        if (textToType[charIndex] === ' ') {
            waitingForSpace = true;
        }
    } else if (waitingForSpace && event.key === ' ') {
        waitingForSpace = false;
        charIndex++;
    }

    highlightCurrentChar();
    updateStats();
}

function highlightCurrentChar() {
    const typedChars = textDisplay.querySelectorAll('span');
    typedChars.forEach(char => char.classList.remove('cursor'));

    if (charIndex < typedChars.length) {
        typedChars[charIndex].classList.add('cursor');
    }
}

function updateStats() {
    const correctChars = document.querySelectorAll('.correct').length;
    const elapsedTime = (new Date().getTime() - startTime) / 1000 / 60;
    const wordsTyped = correctChars / 5;
    const wpm = Math.round(wordsTyped / elapsedTime);

    const accuracy = Math.max(0, Math.round((1 - totalErrors / (correctChars + totalErrors)) * 100));

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = `${accuracy}%`;
    errorsDisplay.textContent = totalErrors;
}

function resetTypingTest() {
    document.removeEventListener('keydown', handleTyping);
    isTypingTestActive = false;
    startTypingTest();
}

resetButton.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
        resetTypingTest();
    }
});

startTypingTest();
