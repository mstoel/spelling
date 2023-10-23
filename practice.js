document.addEventListener('DOMContentLoaded', () => {
    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Replace these variables with the ones obtained from the 'lessonData' event
    const selectedYear = getUrlParameter('year');
    const selectedLesson = getUrlParameter('lesson');

    // Fetch the JSON data
    fetch('Lessons.json')
        .then(response => response.json())
        .then(data => {
            // Get the exercises for the selected year and lesson
            const exercises = data[selectedYear][selectedLesson];

            // Get the exercise container element
            const exerciseContainer = document.getElementById('exercise-container');

            // Create an instance of the SpeechSynthesisUtterance for the female voice
            const femaleVoice = new SpeechSynthesisUtterance();
            femaleVoice.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Female');
            femaleVoice.lang = 'en-GB';

            // Loop through exercises and populate them
            exercises.forEach((exercise, index) => {
                const div = document.createElement('div');
                div.classList.add('content');

                // Sentence with text-to-speech functionality
                const sentence = document.createElement('p');
                sentence.classList.add('sentence');

                // Split the sentence into words
                const words = exercise.sentence.split(' ');

                for (const word of words) {
                    if (word.toLowerCase() === exercise.targetWord.toLowerCase()) {
                        // Wrap the target word in a span with "hidden-word" class to hide it
                        sentence.innerHTML += `<span class="hidden-word">${word}</span> `;
                    } else {
                        sentence.innerHTML += `${word} `;
                    }
                }

                // Remove the extra space at the end
                sentence.innerHTML = sentence.innerHTML.trim();

                // Click on the sentence to play audio
                sentence.addEventListener('click', () => {
                    speak(femaleVoice, exercise.targetWord, exercise.sentence);
                });

                // Label and input for the user's word
                const label = document.createElement('label');
                label.textContent = 'Write the word:';
                const input = document.createElement('input');
                input.type = 'text';
                input.classList.add('userWord');

                // Check button
                const button = document.createElement('button');
                button.textContent = 'Check';
                button.classList.add('checkButton');
                button.addEventListener('click', () => {
                    checkWord(input, exercise.targetWord);
                });

                // Result message
                const result = document.createElement('p');
                result.classList.add('result');

                div.appendChild(sentence);
                div.appendChild(label);
                div.appendChild(input);
                div.appendChild(button);
                div.appendChild(result);
                exerciseContainer.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });
});

function speak(utterance, targetWord, sentence) {
    const synth = window.speechSynthesis;
    const speakQueue = [];

    const prompt = 'Write down:';
    speakQueue.push({ text: targetWord, delay: 2000 });
    speakQueue.push({ text: sentence, delay: 2000 });
    speakQueue.push({ text: prompt, delay: 2000 });
    speakQueue.push({ text: targetWord, delay: 2000 });

    function playQueue() {
        const item = speakQueue.shift();
        if (item) {
            utterance.text = item.text;
            synth.speak(utterance);
            setTimeout(playQueue, item.delay);
        }
    }

    playQueue();
}

function checkWord(input, targetWord) {
    const userWord = input.value.trim();
    const result = input.nextElementSibling;

    if (userWord.toLowerCase() === targetWord.toLowerCase()) {
        result.textContent = 'Correct!';
        result.style.color = 'green';
        result.style.fontWeight = 'bold';
        result.style.fontSize = '16px'; // Adjust the size as needed
    } else if (result.textContent === 'Try again') {
        result.textContent = 'Try again - ' + targetWord;
        result.style.color = 'black';
        result.style.fontWeight = 'bold';
        result.style.fontSize = '16px'; // Adjust the size as needed
    } else if (result.textContent === 'Try again - ' + targetWord) {
        result.textContent = 'Try again - ' + targetWord;
        result.style.color = 'black';
        result.style.fontWeight = 'bold';
        result.style.fontSize = '16px'; // Adjust the size as needed
    } else {
        result.textContent = 'Try again';
        result.style.color = 'red';
        result.style.fontWeight = 'normal'; // Reset to normal weight
        result.style.fontSize = '14px'; // Reset to normal size
    }
}

