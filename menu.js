document.addEventListener('DOMContentLoaded', () => {
    // Get the HTML elements for the year dropdown, lesson dropdown, start button, and iframe
    const yearDropdown = document.getElementById('yearSelect');
    const lessonDropdown = document.getElementById('lessonSelect');
    const startButton = document.getElementById('startButton');
    const lessonIframe = document.getElementById('lessonIframe');
    
    let lessonsData; // Declare lessonsData variable

    // Add event listeners to handle changes in the selected year and lesson
    yearDropdown.addEventListener('change', populateLessonOptions);
    startButton.addEventListener('click', loadSelectedLesson);

    // Fetch JSON data
    fetch('Lessons.json')
        .then(response => response.json())
        .then(data => {
            // Store the JSON data in the lessonsData variable
            lessonsData = data;

            // Populate the year dropdown based on the JSON data
            populateYearOptions(lessonsData);

            // Initially, populate the lesson options when the page loads
            populateLessonOptions();
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });

    // Define the populateYearOptions function to dynamically generate year options
    function populateYearOptions(data) {
        yearDropdown.innerHTML = '';
        for (const year in data) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearDropdown.appendChild(option);
        }
    }

    // Define the populateLessonOptions function to dynamically generate lesson options
    function populateLessonOptions() {
        // Get the selected year value
        const selectedYear = yearDropdown.value;
        const lessonsForYear = lessonsData[selectedYear];

        // Populate lesson options for the selected year
        lessonDropdown.innerHTML = '';
        for (const lesson in lessonsForYear) {
            const option = document.createElement('option');
            option.value = lesson;
            option.textContent = lesson;
            lessonDropdown.appendChild(option);
        }
    }

// Define the loadSelectedLesson function to load the selected lesson in the iframe
function loadSelectedLesson() {
    // Get the selected year and lesson values
    const selectedYear = yearDropdown.value;
    const selectedLesson = lessonDropdown.value;

    // Determine whether to load practice or test
    let lessonType;

    // Loop through radio buttons to find the selected one
    if (document.getElementById('practiceRadio').checked) {
        lessonType = 'practice';
    } else if (document.getElementById('testRadio').checked) {
        lessonType = 'test';
    } else if (document.getElementById('worksheetsRadio').checked) {
        lessonType = 'worksheets';
    }

    // Provide a default lesson type (e.g., practice) if none is selected
    if (!lessonType) {
        lessonType = 'practice'; // You can change this to your preferred default
    }

    // Construct the URL for the selected lesson page
    const lessonPage = `${lessonType}.html?year=${selectedYear}&lesson=${selectedLesson}`;
    

    // Set the src attribute of the iframe to load the lesson
    lessonIframe.src = lessonPage;
}


});
