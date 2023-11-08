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

    fetch('../lessons.json')
        .then(response => response.json())
        .then(data => {
            console.log('JSON Data:', data);

            if (data && data[selectedYear] && data[selectedYear][selectedLesson]) {
                const exercises = data[selectedYear][selectedLesson];
                const doc = new jsPDF();
                const margin = 55; // Top margin
                const lineSpacing = 15; // Line spacing for students to copy
                const translationSpacing = 30; // Spacing for translation
                const tabLength = 12; // Length for tab alignment

                const numExercises = exercises.length;
                const verticalSpacing = (doc.internal.pageSize.height - margin) / numExercises;

                const img = new Image();
                img.src = 'images/worksheet2.jpg'; // Provide the correct path to your image
                img.onload = () => {
                    doc.addImage(img, 'JPEG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);

                    exercises.forEach((exercise, index) => {
                        const y = margin + index * verticalSpacing;
                        const targetWord = exercise.targetWord;

                        const line1 = '_'.repeat(10); // Generate line 1
                        const line2 = '_'.repeat(10); // Generate line 2

                        const numberAndWord = `${index + 1}. ${targetWord.padEnd(tabLength)}`;
                        const translation = '_'.repeat(13); // Generate translation line
                        const lineToCopy1 = '_'.repeat(9); // Generate line 1 for copying
                        const lineToCopy2 = '_'.repeat(9); // Generate line 2 for copying

                        const sentenceText = `${numberAndWord}`;

                        const sentenceLine = `\t\t\t${lineToCopy1}\t${lineToCopy2}\t\t${translation.padStart(15)}`;

                        const sentenceLength = sentenceText.length - (index + 1).toString().length - 2; // Excluding the line number

                        let fontSize = 16; // Default font size
                        if (sentenceLength > 40) {
                            const extraCharacters = sentenceLength - 40;
                            fontSize -= Math.floor(extraCharacters / 7) * 2;

                            if (fontSize < 10) {
                                fontSize = 10;
                            }
                        }

                        doc.setFontSize(fontSize);
                        doc.text(sentenceText, 20, y);
                        doc.text(sentenceLine, 20, y); // Adjust the position to your needs

                    });

                    addTextElements(
                        doc,
                        'Spelling Worksheet',
                        'Copy and Translate',
                        'Your Name',
                        'Your Class',
                        'Instruction: Copy the word twice and translate it into your own language.'
                    );

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

    function addTextElements(doc, header, subHeader, name, className, instruction) {
        doc.setFontSize(21); // Set font size for header
        doc.setFontStyle('bold'); // Set font style for header
        doc.text(header, 75, 13, { align: 'left' });

        doc.setFontSize(14); // Set font size for sub header
        doc.setFontStyle('normal'); // Set font style for sub header
        doc.text(subHeader,87, 19, { align: 'left' });

        doc.setFontSize(15); // Set font size for the other details
        doc.setFontStyle('normal'); // Set font style for other details

        // Add Name and Class details
        doc.text(`Name: \t\t\t\t\t\t Class: \t\t\t ${selectedYear} / ${selectedLesson}`, 10, 30);

        // Add Instructions
        doc.text(instruction, 10, 38);
        doc.text('Copy \t\t\t\t\t    Translate', 85, 46);
    }
});







