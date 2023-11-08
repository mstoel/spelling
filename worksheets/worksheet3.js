document.addEventListener('DOMContentLoaded', () => {
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    const selectedYear = getUrlParameter('year');
    const selectedLesson = getUrlParameter('lesson');

    fetch('../lessons.json')
        .then(response => response.json())
        .then(data => {
            if (data && data[selectedYear] && data[selectedYear][selectedLesson]) {
                const doc = new jsPDF();
                const exercises = data[selectedYear][selectedLesson];

                const margin = 55; // Top margin
                const verticalSpacing = 15; // Line spacing for students to copy

                const backgroundImage = new Image();
                backgroundImage.crossOrigin = ''; // If applicable
                backgroundImage.src = 'images/worksheet2.jpg'; // Replace with the path to your image
                backgroundImage.onload = function () {
                    doc.addImage(backgroundImage, 'JPEG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);

                    if (exercises) {
                        const scrambledWords = exercises.map(exercise => exercise.targetWord);
                        const scrambledSentences = exercises.map(exercise => exercise.sentence);

                        generateUnscrambleWordsSection(doc, margin, verticalSpacing, scrambledWords);
                        generateUnscrambleSentencesSection(doc, margin, verticalSpacing, scrambledSentences);

                        addTextElements(
                            doc,
                            'Spelling Worksheet',
                            'Unscramble the Words and Sentences',
                            'Your Name',
                            'Your Class',
                            'Instruction: First unscramble the words and then unscramble the sentences.'
                        );

                        const pdfDataUri = doc.output('datauristring');
                        const pdfIframe = document.getElementById('pdfIframe');
                        pdfIframe.src = pdfDataUri;
                    } else {
                        console.error('Data for the selected year and lesson is invalid or missing required information.');
                    }
                };
            } else {
                console.error('Data for the selected year and lesson not found.');
            }
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });


        function generateUnscrambleWordsSection(doc, margin, verticalSpacing, scrambledWords) {
            let y = margin;
            const columnWidth = 60; // Adjust column width as needed
            const numWordsPerColumn = Math.ceil(Math.min(scrambledWords.length, 10) / 2);
            const wordsToDisplay = scrambledWords.slice(0, 10); // Ensure only the first 10 words are taken
            
            shuffleArray(wordsToDisplay); // Shuffle the limited words array
            
            for (let i = 0; i < numWordsPerColumn; i++) {
                const index = i;
                const scrambledWord1 = scrambleWord(wordsToDisplay[i]);
                doc.text(`${index + 1}. ${scrambledWord1}`, 20, y);
                doc.text('_'.repeat(16), 20 + 32, y); // Lines for unscrambling
        
                if (i + numWordsPerColumn < wordsToDisplay.length) {
                    const index2 = i + numWordsPerColumn;
                    const scrambledWord2 = scrambleWord(wordsToDisplay[i + numWordsPerColumn]);
                    doc.text(`${index2 + 1}. ${scrambledWord2}`, 110, y);
                    doc.text('_'.repeat(16), 110 + 32, y); // Lines for unscrambling
                }
                y += verticalSpacing;
            }
        }
        
        function scrambleWord(word) {
            const wordChars = word.split('');
            shuffleArray(wordChars);
            return wordChars.join('');
        }
        
        

        function generateUnscrambleSentencesSection(doc, margin, verticalSpacing, scrambledSentences) {
            shuffleArray(scrambledSentences); // Shuffle the sentences array
            const selectedSentences = scrambledSentences.slice(0, 6); // Select the first 6 sentences
        
            let y = margin + 80; // Adding more space between sections
            for (let i = 0; i < selectedSentences.length; i++) {
                doc.text(`${i + 1}. ${scrambleSentence(selectedSentences[i])}`, 20, y);
                doc.text('_'.repeat(55), 20, y + 11); // Increase the space for unscrambling sentences
                y += verticalSpacing + 10; // Increase the vertical spacing
            }
        }
        
        function scrambleSentence(sentence) {
            const words = sentence.split(' ');
            shuffleArray(words);
            return words.join(' ');
        }
        
        
        function scrambleWord(word) {
            const wordChars = word.split('');
            shuffleArray(wordChars);
            return wordChars.join('');
        }
        
        
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

    function addTextElements(doc, header, subHeader, name, className, instruction) {
        // Function to add header, sub-header, name, class, and instructions
        doc.setFontSize(21);
        doc.setFontStyle('bold');
        doc.text(header, 75, 13, { align: 'left' });

        doc.setFontSize(14);
        doc.setFontStyle('normal');
        doc.text(subHeader, 65, 19, { align: 'left' });

        doc.setFontSize(15);
        doc.setFontStyle('normal');

        doc.text(`Name: \t\t\t\t\t\t Class: \t\t\t ${selectedYear} / ${selectedLesson}`, 10, 30);
        doc.text(instruction, 10, 38);
    }
});








