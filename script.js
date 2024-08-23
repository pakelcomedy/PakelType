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

function generateRandomText(wordCount = 22) {
    let randomText = '';
    for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        randomText += wordList[randomIndex] + ' ';
    }
    return randomText.trim();
}

function startTypingTest() {
    textToType = generateRandomText(); // Generate text with a suitable number of words
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

    // Handle Backspace
    if (event.key === 'Backspace') {
        if (charIndex > 0) {
            charIndex--;
            const prevChar = typedChars[charIndex];
            prevChar.classList.remove('correct', 'incorrect', 'cursor');
            waitingForSpace = false; // Reset space waiting state on backspace
            highlightCurrentChar();
        }
        return;
    }

    // Correct character typed
    if (!waitingForSpace && event.key === textToType[charIndex]) {
        typedChars[charIndex].classList.add('correct');
        charIndex++;
        
        // Check if at the end of a word
        if (textToType[charIndex - 1] === ' ') {
            waitingForSpace = false;
        } else if (textToType[charIndex] === ' ') {
            waitingForSpace = true;
        }

    // Incorrect character typed
    } else if (!waitingForSpace && event.key.length === 1) {
        typedChars[charIndex].classList.add('incorrect');
        charIndex++;
        totalErrors++;
        
        // If typing at the end of a word, stay in the space waiting state
        if (textToType[charIndex] === ' ') {
            waitingForSpace = true;
        }
    } else if (waitingForSpace && event.key === ' ') {
        waitingForSpace = false;
        charIndex++; // Move to the next character (which should be the next word)
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
    const elapsedTime = (new Date().getTime() - startTime) / 1000 / 60; // minutes
    const wordsTyped = correctChars / 5; // Approximation of words based on 5 chars per word
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
    if (event.button === 0) { // Only respond to left mouse button
        resetTypingTest();
    }
});

startTypingTest();
