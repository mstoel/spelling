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

            // Shuffle the exercises randomly
            shuffleArray(exercises);

            // Get the exercise container element
            const exerciseContainer = document.getElementById('exercise-container');

            // Create an instance of the SpeechSynthesisUtterance for the female voice
            const femaleVoice = new SpeechSynthesisUtterance();
            femaleVoice.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Female');
            femaleVoice.lang = 'en-GB';

            // Initialize a counter for numbering exercises
            let exerciseNumber = 1;

            // Loop through exercises and populate them
            exercises.forEach((exercise, index) => {
                const exerciseDiv = document.createElement('div');
                exerciseDiv.classList.add('exercise-div');

                // Exercise number
                const exerciseNumberSpan = document.createElement('span');
                exerciseNumberSpan.textContent = exerciseNumber + '.';
                exerciseNumberSpan.classList.add('exercise-number');
                exerciseNumber++;

                const audioButton = document.createElement('img');
                audioButton.src = '/images/audiobutton.png';
                audioButton.alt = 'Audio Button';
                audioButton.classList.add('audio-button');

                // Click on the audio button to play audio
                audioButton.addEventListener('click', () => {
                    speak(femaleVoice, exercise.targetWord, exercise.sentence);
                });

                // Create an element for the tick image
                const tickImage = document.createElement('img');
                tickImage.src = '/images/rightbutton.png';
                tickImage.alt = 'Tick';
                tickImage.classList.add('check-image', 'tick-cross-hidden');

                // Create an element for the cross image
                const crossImage = document.createElement('img');
                crossImage.src = '/images/wrong.jpg';
                crossImage.alt = 'Cross';
                crossImage.classList.add('check-image', 'tick-cross-hidden');

                const input = document.createElement('input');
                input.type = 'text';
                input.classList.add('userWord');

                exerciseDiv.appendChild(exerciseNumberSpan);
                exerciseDiv.appendChild(audioButton);
                exerciseDiv.appendChild(input);
                exerciseDiv.appendChild(tickImage);
                exerciseDiv.appendChild(crossImage);

                exerciseContainer.appendChild(exerciseDiv);
            });

            // Add a button to check all exercises simultaneously
            const checkAllButton = document.createElement('button');
            checkAllButton.textContent = 'Check Answers';
            checkAllButton.classList.add('check-all-button');
            checkAllButton.addEventListener('click', () => {
                checkAnswers(exercises);
            });

            exerciseContainer.appendChild(checkAllButton);
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

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

function checkAnswers(exercises) {
    exercises.forEach((exercise, index) => {
        const input = document.querySelectorAll('.userWord')[index];
        const tickImage = document.querySelectorAll('.check-image')[index * 2]; // Multiply by 2 to select every other element
        const crossImage = document.querySelectorAll('.check-image')[index * 2 + 1]; // Multiply by 2 and add 1 to select the next element

        const userWord = input.value.trim();

        if (userWord.toLowerCase() === exercise.targetWord.toLowerCase()) {
            // Correct answer, show the tick image
            tickImage.style.display = 'inline';
            crossImage.style.display = 'none';
        } else {
            // Incorrect answer, show the cross image
            crossImage.style.display = 'inline';
            tickImage.style.display = 'none';
        }
    });
}





