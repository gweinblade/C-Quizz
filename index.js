

let quizData = [];

function loadQuestions() {
   /* fetch('csharp-questions.json')
        .then(response => response.json())
        .then(data => {
            quizData = data.questions;
            buildQuiz();
        })
        .catch(error => console.error('Error loading questions:', error));*/
}

function buildQuiz() {
    const output = [];
    const difficulty = document.getElementById('difficulty').value;

    quizData.forEach((questionData, questionNumber) => {
        if (difficulty === 'All' || questionData.level === difficulty) {
            const answers = [];

            for (letter in questionData.answers) {
                answers.push(
                    `<label class="answer">
                        <input type="radio" name="question${questionNumber}" value="${letter}">
                        ${letter} : ${questionData.answers[letter]}
                    </label>`
                );
            }

            output.push(
                `<div class="question">${questionData.question}</div>
                <div class="answers">${answers.join('')}</div>`
            );
        }
    });

    document.getElementById('quiz').innerHTML = output.join('');
}

function showResults() {
    const answerContainers = document.querySelectorAll('.answers');
    let numCorrect = 0;
    let totalQuestions = 0;

    quizData.forEach((questionData, questionNumber) => {
        const answerContainer = answerContainers[questionNumber];
        if (answerContainer) {
            totalQuestions++;
            const selector = `input[name=question${questionNumber}]:checked`;
            const userAnswer = (answerContainer.querySelector(selector) || {}).value;

            if (userAnswer === questionData.correctAnswer) {
                numCorrect++;
                answerContainer.style.color = 'green';
            } else {
                answerContainer.style.color = 'red';
            }
        }
    });

    document.getElementById('result').innerHTML = `${numCorrect} out of ${totalQuestions} correct`;
}

document.getElementById('difficulty').addEventListener('change', buildQuiz);
document.getElementById('submit').addEventListener('click', showResults);

// Load questions when the page loads
loadQuestions();