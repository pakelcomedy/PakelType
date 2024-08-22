const textDisplay = document.getElementById('text-display');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const errorsDisplay = document.getElementById('errors');

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

function generateRandomText(wordCount = 10) {
    let randomText = '';
    for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        randomText += wordList[randomIndex] + ' ';
    }
    return randomText.trim();
}

function startTypingTest() {
    textToType = generateRandomText(15); // Generate a random text with 15 words
    textDisplay.innerHTML = textToType.split('').map(char => `<span>${char}</span>`).join('');
    startTime = new Date().getTime();
    totalErrors = 0;
    charIndex = 0;
    highlightCurrentChar();
    document.addEventListener('keydown', handleTyping);
    updateStats();
}

function handleTyping(event) {
    const typedChars = textDisplay.querySelectorAll('span');

    // Check if the key is printable and part of the text
    if (event.key.length === 1 && charIndex < textToType.length) {
        const currentChar = typedChars[charIndex];
        if (event.key === textToType[charIndex]) {
            currentChar.classList.add('correct');
        } else {
            currentChar.classList.add('incorrect');
            totalErrors++;
        }
        charIndex++;
        highlightCurrentChar();
    } else if (event.key === 'Backspace') {
        if (charIndex > 0) {
            charIndex--;
            const currentChar = typedChars[charIndex];
            currentChar.classList.remove('correct', 'incorrect', 'cursor');

            // Fix: Remove the incorrect class if it was set
            if (currentChar.classList.contains('incorrect')) {
                totalErrors--;
            }

            highlightCurrentChar();
        }
    }

    updateStats();
}

function highlightCurrentChar() {
    const typedChars = textDisplay.querySelectorAll('span');
    // Remove cursor class from all characters
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

// Start the test on load
startTypingTest();
