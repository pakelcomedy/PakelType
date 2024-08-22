const textDisplay = document.getElementById('text-display');
const userInput = document.getElementById('user-input');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const errorsDisplay = document.getElementById('errors');
const themeToggle = document.getElementById('theme-toggle');

const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question."
];

let startTime;
let totalErrors = 0;

function startTypingTest() {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    textDisplay.textContent = sampleTexts[randomIndex];
    startTime = new Date().getTime();
    totalErrors = 0;
    userInput.value = '';
    updateStats();
}

function updateStats() {
    const textEntered = userInput.value;
    const textArray = textDisplay.textContent.split('');
    const typedArray = textEntered.split('');

    let errors = 0;
    typedArray.forEach((char, index) => {
        if (char !== textArray[index]) {
            errors++;
        }
    });

    const elapsedTime = (new Date().getTime() - startTime) / 1000 / 60; // minutes
    const wordsTyped = textEntered.split(' ').length;
    const wpm = Math.round(wordsTyped / elapsedTime);

    const accuracy = Math.max(0, Math.round((1 - errors / typedArray.length) * 100));

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = `${accuracy}%`;
    errorsDisplay.textContent = errors;

    totalErrors = errors;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

userInput.addEventListener('input', updateStats);
themeToggle.addEventListener('click', toggleTheme);

// Start the test on load
startTypingTest();
