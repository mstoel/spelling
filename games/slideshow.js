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

            // Get the slideshow wrapper element
            const slideshowWrapper = document.querySelector('.swiper-wrapper');

            // Loop through exercises and create slideshow elements
            exercises.forEach(exercise => {
                // Create a swiper-slide for each exercise
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');

                // Target word and supporting sentence
                const targetWord = document.createElement('p');
                targetWord.classList.add('target-word');
                targetWord.textContent = exercise.targetWord;

                const sentence = document.createElement('p');
                sentence.classList.add('supporting-sentence');
                sentence.textContent = exercise.sentence;

                // Append elements to the slide
                slide.appendChild(targetWord);
                slide.appendChild(sentence);

                // Append slide to the slideshow wrapper
                slideshowWrapper.appendChild(slide);
            });

            // Initialize Swiper
            const swiper = new Swiper('.swiper-container', {
                slidesPerView: 1,
                spaceBetween: 10,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });

            // Add event listeners for settings
            const showTargetWordCheckbox = document.getElementById('showTargetWord');
            const showSentenceCheckbox = document.getElementById('showSentence');
            const fontSizeRange = document.getElementById('fontSizeRange');
            const sentenceSizeRange = document.getElementById('sentenceSizeRange');

            showTargetWordCheckbox.addEventListener('change', () => {
                const targetWords = document.querySelectorAll('.target-word');
                const sentences = document.querySelectorAll('.supporting-sentence');

                targetWords.forEach(target => {
                    target.style.display = showTargetWordCheckbox.checked ? 'block' : 'none';
                });

                // If targetWord is turned off, adjust the position of the sentence
                if (!showTargetWordCheckbox.checked) {
                    sentences.forEach(sentence => {
                        sentence.style.top = '50%';
                    });
                } else {
                    // If targetWord is turned on, reset the position of the sentence
                    sentences.forEach(sentence => {
                        sentence.style.top = '70%'; // Adjust the top position as needed
                    });
                }
            });

            showSentenceCheckbox.addEventListener('change', () => {
                const sentences = document.querySelectorAll('.supporting-sentence');
                sentences.forEach(sentence => {
                    sentence.style.display = showSentenceCheckbox.checked ? 'block' : 'none';
                });
            });

            fontSizeRange.addEventListener('input', () => {
                const targetWords = document.querySelectorAll('.target-word');
                targetWords.forEach(target => {
                    target.style.fontSize = fontSizeRange.value + 'px';
                });
            });

            sentenceSizeRange.addEventListener('input', () => {
                const sentences = document.querySelectorAll('.supporting-sentence');
                sentences.forEach(sentence => {
                    sentence.style.fontSize = sentenceSizeRange.value + 'px';
                });
            });
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });
});



