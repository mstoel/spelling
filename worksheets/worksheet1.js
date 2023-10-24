document.addEventListener('DOMContentLoaded', () => {
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    const selectedYear = getUrlParameter('year');
    const selectedLesson = getUrlParameter('lesson');

    console.log('Selected Year:', selectedYear);
    console.log('Selected Lesson:', selectedLesson);

    fetch('../lessons.json') // Assuming "Lessons.json" is in the main folder
        .then(response => response.json())
        .then(data => {
            console.log('JSON Data:', data);

            if (data && data[selectedYear] && data[selectedYear][selectedLesson]) {
                const exercises = data[selectedYear][selectedLesson];
                const doc = new jsPDF();
                const margin = 55; // Top margin
                const lineSpacing = 10; // Line spacing for students to copy

                const numExercises = exercises.length;
                const verticalSpacing = (doc.internal.pageSize.height - margin) / numExercises;

                // Create an Image object and wait for it to load
                const img = new Image();
                img.src = 'images/worksheet1.jpg'; // Provide the correct path to your image
                img.onload = () => {
                    // Image is fully loaded; now add it to the PDF
                    doc.addImage(img, 'JPEG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);

                    exercises.forEach((exercise, index) => {
                        const y = margin + index * verticalSpacing;
                        const sentenceText = `${index + 1}. ${exercise.targetWord}\t\t${exercise.sentence}`;
                
                        // Calculate the length of the sentence
                        const sentenceLength = exercise.sentence.length;
                
                        // Define the font size range
                        let fontSize = 16; // Default font size
                        if (sentenceLength > 40) {
                            // Reduce font size for longer sentences
                            const extraCharacters = sentenceLength - 40;
                            fontSize -= Math.floor(extraCharacters / 7) * 2; // Reduce 2px for every 10 characters
                
                            // Ensure the minimum font size is not too small
                            if (fontSize < 10) {
                                fontSize = 10;
                            }
                        }
                
                        // Overlay text on top of the image with the adjusted font size
                        doc.setFontSize(fontSize);
                        doc.text(sentenceText, 20, y);

                        // Add a line under each sentence using a rectangle
                        const lineY = y + lineSpacing;
                        const lineWidth = doc.internal.pageSize.width - 40; // Adjust as needed
                        doc.rect(20, lineY, lineWidth, 0.5, 'F');

                    });

                        // Add the year and lesson information
                        doc.text(`${selectedYear}`, 150, 29);
                        doc.text(`/  ${selectedLesson}`, 170, 29);
                        
                    const pdfDataUri = doc.output('datauristring');
                    const pdfIframe = document.getElementById('pdfIframe');
                    pdfIframe.src = pdfDataUri;
                };
            } else {
                console.error('Data for the selected year and lesson not found.');
            }
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });
});





