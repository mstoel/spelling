document.addEventListener('DOMContentLoaded', () => {
    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Get the year and lesson from URL parameters
    const selectedYear = getUrlParameter('year');
    const selectedLesson = getUrlParameter('lesson');

    // Use these parameters to create links to various worksheets
    const games1Link = `games/practice.html?year=${selectedYear}&lesson=${selectedLesson}`;
    const games2Link = `games/test.html?year=${selectedYear}&lesson=${selectedLesson}`;
    const games3Link = `games/slideshow.html?year=${selectedYear}&lesson=${selectedLesson}`;
    // Add more worksheets as needed

    // You can now create links or buttons in the HTML that point to these worksheet pages
    // For example:
    const worksheet1Button = document.getElementById('worksheet1-button');
    worksheet1Button.href = worksheet1Link;

    // Similarly, set links for other worksheets
});

