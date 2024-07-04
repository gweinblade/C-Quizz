let quizData = [];

function loadQuestions() {
    fetch('./csharp-questions.json')
        .then(response => response.json())
        .then(data => {
            quizData = data.questions;
            buildQuiz();
        })
        .catch(error => console.error('Error loading questions:', error));
}

function buildQuiz() {
    const output = [];
    const difficulty = document.getElementById('difficulty').value;

    quizData.forEach((questionData, questionNumber) => {
        if (difficulty === 'All' || questionData.level === difficulty) {
            const answers = [];
            const isMultiSelect = Array.isArray(questionData.correctAnswer);

            for (letter in questionData.answers) {
                answers.push(
                    `<p>
                        <label>
                            <input type="${isMultiSelect ? 'checkbox' : 'radio'}" name="question${questionNumber}" value="${letter}" />
                            <span>${letter}: ${questionData.answers[letter]}</span>
                        </label>
                    </p>`
                );
            }

            output.push(
                `<div class="card question-card">
                    <div class="card-content">
                        <span class="card-title question">${questionData.question}</span>
                        <div class="answers">${answers.join('')}</div>
                    </div>
                </div>`
            );
        }
    });

    document.getElementById('quiz').innerHTML = output.join('');
    M.updateTextFields();
}

function showResults() {
    const answerContainers = document.querySelectorAll('.answers');
    let numCorrect = 0;
    let totalQuestions = 0;

    quizData.forEach((questionData, questionNumber) => {
        const answerContainer = answerContainers[questionNumber];
        if (answerContainer) {
            totalQuestions++;
            const isMultiSelect = Array.isArray(questionData.correctAnswer);
            const selector = `input[name=question${questionNumber}]:checked`;
            const userAnswers = Array.from(answerContainer.querySelectorAll(selector)).map(el => el.value);

            const isCorrect = isMultiSelect
                ? arraysEqual(userAnswers.sort(), questionData.correctAnswer.sort())
                : userAnswers[0] === questionData.correctAnswer;

            if (isCorrect) {
                numCorrect++;
                answerContainer.style.color = '#2196F3';
            } else {
                answerContainer.style.color = 'red';
            }
        }
    });

    document.getElementById('result').innerHTML = `
        <span class="blue-text">${numCorrect}</span> out of <span class="blue-text">${totalQuestions}</span> correct
    `;
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
    loadQuestions();
});

document.getElementById('difficulty').addEventListener('change', buildQuiz);
document.getElementById('submit').addEventListener('click', showResults);