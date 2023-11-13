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
    fetch('../lessons.json')
        .then(response => response.json())
        .then(data => {
            // Get the exercises for the selected year and lesson
            const exercises = data[selectedYear][selectedLesson];

            // Get the exercise container element
            const exerciseContainer = document.getElementById('exercise-container');

            // Function to create an instance of the SpeechSynthesisUtterance
            function createUtterance() {
                const utterance = new SpeechSynthesisUtterance();
                
                // Array of available voices
                const voices = speechSynthesis.getVoices();

                // Function to get a random English-speaking voice from the array
                function getRandomEnglishVoice() {
                    const englishVoices = voices.filter(voice => voice.lang.includes('en'));
                    if (englishVoices.length > 0) {
                        const randomIndex = Math.floor(Math.random() * englishVoices.length);
                        return englishVoices[randomIndex];
                    }
                    return null;
                }

                // Function to speak and play audio
                function speak(voice, targetWord, sentence) {
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
                            utterance.voice = voice;
                            utterance.text = item.text;
                            synth.speak(utterance);
                            setTimeout(playQueue, item.delay);
                        }
                    }

                    playQueue();
                }

                // Loop through exercises and populate them
                exercises.forEach((exercise, index) => {
                    const div = document.createElement('div');
                    div.classList.add('content');

                    // Container for audio button and sentence
                    const audioContainer = document.createElement('div');
                    audioContainer.classList.add('audio-container');

                    // Audio button in front of every sentence
                    const audioButton = document.createElement('button');
                    audioButton.innerHTML = '<img src="images/audiobutton.png" alt="Listen">';
                    audioButton.classList.add('audio-button');
                    audioButton.style.width = '16px'; // Set the button width
                    audioButton.style.height = '16px'; // Set the button height
                    audioButton.addEventListener('click', () => {
                        speak(getRandomEnglishVoice(), exercise.targetWord, exercise.sentence);
                    });

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
                        speak(getRandomEnglishVoice(), exercise.targetWord, exercise.sentence);
                    });

                    // Append audio button and sentence to the container
                    audioContainer.appendChild(audioButton);
                    audioContainer.appendChild(sentence);

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

                    div.appendChild(audioContainer);
                    div.appendChild(label);
                    div.appendChild(input);
                    div.appendChild(button);
                    div.appendChild(result);
                    exerciseContainer.appendChild(div);
                });
            }

            // Ensure speechSynthesis is ready
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = createUtterance;
            } else {
                createUtterance();
            }
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });
});

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

