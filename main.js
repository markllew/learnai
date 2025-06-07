document.addEventListener('DOMContentLoaded', () => {

    // --- Interactive Popout Logic ---
    // This makes the popouts work on click, which is better for accessibility.
    const popoutTriggers = document.querySelectorAll('.popout-trigger');
    
    // Hide all popouts if user clicks anywhere else on the page
    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('popout-trigger')) {
            popoutTriggers.forEach(trigger => {
                const popoutBox = trigger.querySelector('.popout-box');
                if (popoutBox) {
                    popoutBox.style.display = 'none';
                }
            });
        }
    });

    popoutTriggers.forEach(trigger => {
        // We will create the popout box dynamically from the data attribute
        const popoutText = trigger.getAttribute('data-popout-text');
        if (popoutText) {
            const popoutBox = document.createElement('span');
            popoutBox.className = 'popout-box';
            popoutBox.textContent = popoutText;
            trigger.appendChild(popoutBox);
        }

        trigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents the document-wide click from firing
            const popoutBox = trigger.querySelector('.popout-box');
            if (popoutBox) {
                // Hide other popouts before showing the new one
                document.querySelectorAll('.popout-box').forEach(box => {
                    if (box !== popoutBox) {
                        box.style.display = 'none';
                    }
                });
                // Toggle the current popout
                popoutBox.style.display = popoutBox.style.display === 'block' ? 'none' : 'block';
            }
        });
    });


    // --- Interactive Quiz Logic ---
    const quizButton = document.getElementById('submit-quiz-btn');
    if (quizButton) {
        quizButton.addEventListener('click', () => {
            const answers = {
                q1: 'b',
                q2: 'c',
                q3: 'a'
            };
            
            let score = 0;
            const wrongQuestions = [];
            const form = document.getElementById('math-quiz');
            
            for (const [question, correctAnswer] of Object.entries(answers)) {
                const selected = form.querySelector(`input[name="${question}"]:checked`);
                if (selected && selected.value === correctAnswer) {
                    score++;
                } else {
                    wrongQuestions.push(question);
                }
            }
            
            const resultsDiv = document.getElementById('quiz-results');
            let resultsHTML = `<h3>Your Score: ${score} / 3</h3>`;
            
            if (wrongQuestions.length > 0) {
                resultsHTML += `<h4>Adaptive Guidance:</h4><ul>`;
                if (wrongQuestions.includes('q1')) {
                    resultsHTML += `<li>For Question 1, review De Morgan's Laws in logic. <code>NOT (P AND Q)</code> is equivalent to <code>(NOT P) OR (NOT Q)</code>.</li>`;
                }
                if (wrongQuestions.includes('q2')) {
                    resultsHTML += `<li>For Question 2, remember that set intersection finds only the elements that are common to <strong>both</strong> sets.</li>`;
                }
                if (wrongQuestions.includes('q3')) {
                    resultsHTML += `<li>For Question 3, review how to solve a linear equation. To solve <code>4w - 3 = 17</code>, first add 3 to both sides, then divide by 4.</li>`;
                }
                resultsHTML += `</ul>`;
            } else {
                resultsHTML += `<p style="color: #28a745; font-weight: bold;">Great job! You answered all questions correctly.</p>`;
            }
            
            resultsDiv.innerHTML = resultsHTML;
            resultsDiv.style.display = 'block';
        });
    }

});