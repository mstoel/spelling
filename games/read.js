// Define getUrlParameter function to retrieve URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to shuffle the array using the Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Actual code begins here
document.addEventListener('DOMContentLoaded', () => {
    const displayImage = document.getElementById('displayImage');
    const displayText = document.getElementById('displayText');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    let currentWordIndex = 0;
    let words = [];
    let selectedYear, selectedLesson;

    function showWord() {
        displayText.style.display = 'block';
        displayText.innerText = words[currentWordIndex];
    }

    function showNextWord() {
        if (currentWordIndex < words.length - 1) {
            currentWordIndex++;
            showWord();
            loadImages();
        }
    }

    function showPrevWord() {
        if (currentWordIndex > 0) {
            currentWordIndex--;
            showWord();
            loadImages();
        }
    }

    function loadImages() {
        displayImage.src = `images/${selectedYear}/${selectedLesson}/${words[currentWordIndex]}.png`;
        adjustImageSize();
    }

    function adjustImageSize() {
        displayImage.onload = function() {
            const height = 300;
            const ratio = height / this.naturalHeight;
            const width = this.naturalWidth * ratio;

            this.style.height = height + 'px';
            this.style.width = width + 'px';
        };
    }

    const showWordsOnlyButton = document.getElementById('showWordsOnly');
    const showPicturesOnlyButton = document.getElementById('showPicturesOnly');
    const showWordsAndPicturesButton = document.getElementById('showWordsAndPictures');

    function showWordsOnly() {
        displayImage.style.display = 'none';
        displayText.style.display = 'block';
    }

    function showPicturesOnly() {
        displayImage.style.display = 'block';
        displayText.style.display = 'none';
    }

    function showWordsAndPictures() {
        displayImage.style.display = 'block';
        displayText.style.display = 'block';
    }

    showWordsOnlyButton.addEventListener('click', showWordsOnly);
    showPicturesOnlyButton.addEventListener('click', showPicturesOnly);
    showWordsAndPicturesButton.addEventListener('click', showWordsAndPictures);


    // Fetch the JSON data and handle it
    fetch('Lessons.json')
        .then(response => response.json())
        .then(data => {
            selectedYear = getUrlParameter('year');
            selectedLesson = getUrlParameter('lesson');
            words = data[selectedYear][selectedLesson];
            shuffleArray(words);
            showWord();
            loadImages();
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });

    // Event listeners for buttons
    prevButton.addEventListener('click', showPrevWord);
    nextButton.addEventListener('click', showNextWord);
});



