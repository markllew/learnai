document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Active Navigation Link Styling ---
    // (Same as previous version)
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.parentElement.classList.add('active');
        }
    });

    // --- 2. "Copy to Clipboard" for Code Blocks ---
    // (Same as previous version)
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.textContent = 'Copy';
        block.appendChild(copyButton);
        copyButton.addEventListener('click', () => {
            const code = block.querySelector('code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => { copyButton.textContent = 'Copy'; }, 2000);
            });
        });
    });

    // --- 3. Interactive Popout Logic ---
    // (Same as previous version, with innerHTML fix)
    const popoutTriggers = document.querySelectorAll('.popout-trigger');
    popoutTriggers.forEach(trigger => {
        const popoutText = trigger.getAttribute('data-popout-text');
        if (popoutText) {
            const popoutBox = document.createElement('span');
            popoutBox.className = 'popout-box';
            popoutBox.innerHTML = popoutText.replace(/\n/g, '<br>');
            trigger.appendChild(popoutBox);
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.popout-box').forEach(box => {
                    if (box !== popoutBox) box.style.display = 'none';
                });
                popoutBox.style.display = popoutBox.style.display === 'block' ? 'none' : 'block';
            });
        }
    });
    document.addEventListener('click', () => {
        document.querySelectorAll('.popout-box').forEach(box => box.style.display = 'none');
    });

    // --- 4. NEW Interactive Quiz Logic (Handles multiple quizzes) ---
    const quizForm = document.querySelector('.quiz-form');
    if (quizForm) {
        const quizId = quizForm.id;
        const allQuizzes = {
            'p1-math-quiz': {
                answers: { q1: 'b', q2: 'c', q3: 'a' },
                guidance: {
                    q1: "For Question 1, review De Morgan's Laws. <code>NOT (P AND Q)</code> is equivalent to <code>(NOT P) OR (NOT Q)</code>.",
                    q2: "For Question 2, remember that set intersection finds only the elements common to <strong>both</strong> sets.",
                    q3: "For Question 3, review how to solve a linear equation. To solve <code>4w - 3 = 17</code>, first add 3 to both sides, then divide by 4."
                }
            },
            'p2-math-quiz': {
                answers: { q1: 'c', q2: 'a', q3: 'b' }, // Placeholder answers
                guidance: {
                    q1: "Guidance for Phase 2, Question 1 (Vectors).",
                    q2: "Guidance for Phase 2, Question 2 (Matrices).",
                    q3: "Guidance for Phase 2, Question 3 (Probability)."
                }
            },
            // Add more quizzes here with their unique ID
        };

        const quizData = allQuizzes[quizId];
        if (quizData) {
            const quizButton = quizForm.querySelector('.submit-quiz-btn');
            quizButton.addEventListener('click', () => {
                let score = 0;
                const wrongQuestions = [];
                const form = quizForm;
                
                for (const [question, correctAnswer] of Object.entries(quizData.answers)) {
                    const selected = form.querySelector(`input[name="${question}"]:checked`);
                    if (selected && selected.value === correctAnswer) {
                        score++;
                    } else {
                        wrongQuestions.push(question);
                    }
                }
                
                const resultsDiv = form.querySelector('.quiz-results');
                let resultsHTML = `<h3>Your Score: ${score} / ${Object.keys(quizData.answers).length}</h3>`;
                
                if (wrongQuestions.length > 0) {
                    resultsHTML += `<h4>Adaptive Guidance:</h4><ul>`;
                    wrongQuestions.forEach(qId => {
                        resultsHTML += `<li>${quizData.guidance[qId]}</li>`;
                    });
                    resultsHTML += `</ul>`;
                } else {
                    resultsHTML += `<p style="color: #15803d; font-weight: bold;">Great job! You answered all questions correctly.</p>`;
                }
                
                resultsDiv.innerHTML = resultsHTML;
                resultsDiv.style.display = 'block';
            });
        }
    }


    // --- 5. Table of Contents Scrollspy ---
    // (Same as previous version)
    const tocContainer = document.querySelector('.toc');
    const headings = document.querySelectorAll('main h3');
    if (tocContainer && headings.length > 0) {
        headings.forEach((heading, index) => {
            const id = `section-${index}`;
            heading.id = id;
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = heading.textContent;
            listItem.appendChild(link);
            tocContainer.appendChild(listItem);
        });
        const tocLinks = tocContainer.querySelectorAll('a');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const correspondingLink = tocContainer.querySelector(`a[href="#${id}"]`);
                if (entry.isIntersecting) {
                    tocLinks.forEach(link => link.parentElement.classList.remove('active'));
                    correspondingLink.parentElement.classList.add('active');
                }
            });
        }, { rootMargin: "0px 0px -80% 0px" });
        headings.forEach(heading => observer.observe(heading));
    }
});