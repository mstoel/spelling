document.addEventListener('DOMContentLoaded', () => {
    const yearDropdown = document.getElementById('yearSelect');
    const lessonDropdown = document.getElementById('lessonSelect');
    const worksheetsButton = document.getElementById('worksheetsButton');
    const gamesButton = document.getElementById('gamesButton');
    const lessonIframe = document.getElementById('lessonIframe');

    let lessonsData;

    yearDropdown.addEventListener('change', populateLessonOptions);
    worksheetsButton.addEventListener('click', loadWorksheets);
    gamesButton.addEventListener('click', loadGames);

    fetchAndPopulate();

    function populateYearOptions(data) {
        yearDropdown.innerHTML = '';
        for (const year in data) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearDropdown.appendChild(option);
        }
    }

    function populateLessonOptions() {
        const selectedYear = yearDropdown.value;
        const lessonsForYear = lessonsData[selectedYear];

        lessonDropdown.innerHTML = '';
        for (const lesson in lessonsForYear) {
            const option = document.createElement('option');
            option.value = lesson;
            option.textContent = lesson;
            lessonDropdown.appendChild(option);
        }
    }

    function loadWorksheets() {
        const selectedYear = yearDropdown.value;
        const selectedLesson = lessonDropdown.value;

        const worksheetsPage = `worksheets.html?year=${selectedYear}&lesson=${selectedLesson}`;

        lessonIframe.src = worksheetsPage;
    }

    function loadGames() {
        const selectedYear = yearDropdown.value;
        const selectedLesson = lessonDropdown.value;

        const gamesPage = `games.html?year=${selectedYear}&lesson=${selectedLesson}`;

        lessonIframe.src = gamesPage;
    }

    function fetchAndPopulate() {
        fetch('Lessons.json')
            .then(response => response.json())
            .then(data => {
                lessonsData = data;
                populateYearOptions(lessonsData);
                populateLessonOptions();
            })
            .catch(error => {
                console.error('Error loading JSON data:', error);
            });
    }
});


