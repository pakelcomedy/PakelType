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
let spacePressed = false;

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

        if (wordsInCurrentLine >= wordsPerLine || lineLength + word.length + 1 > 50) {
            randomText = randomText.trimEnd();
            randomText += '\n';
            lineLength = 0;
            wordsInCurrentLine = 0;
            currentLine++;

            if (currentLine >= maxLines) {
                break;
            }
        }

        randomText += word + ' ';
        lineLength += word.length + 1;
        wordsInCurrentLine++;
    }

    while (currentLine < maxLines) {
        randomText += '\n';
        currentLine++;
    }

    return randomText.trim();
}

function startTypingTest() {
    textToType = generateRandomText();
    textDisplay.innerHTML = textToType.split('').map(char => `<span>${char}</span>`).join('');
    startTime = new Date().getTime();
    totalErrors = 0;
    charIndex = 0;
    spacePressed = false;
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
            spacePressed = false;
            highlightCurrentChar();
        }
        return;
    }

    if (event.key === ' ') {
        if (!spacePressed) {
            skipToNextWord();
            spacePressed = true;
        }
        return;
    }

    // Prevent typing if the current character is a space or end of text
    if (charIndex < typedChars.length && textToType[charIndex] !== ' ') {
        if (event.key === textToType[charIndex]) {
            typedChars[charIndex].classList.add('correct');
            spacePressed = false;
            charIndex++;
        } else if (event.key.length === 1) { // Handle only single character keys
            typedChars[charIndex].classList.add('incorrect');
            totalErrors++;
            spacePressed = false;
            charIndex++;
        }
    }

    highlightCurrentChar();
    updateStats();
}

function skipToNextWord() {
    const typedChars = textDisplay.querySelectorAll('span');

    while (charIndex < typedChars.length && textToType[charIndex] !== ' ') {
        charIndex++;
    }

    if (charIndex < typedChars.length) {
        charIndex++;
    }

    highlightCurrentChar();
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
