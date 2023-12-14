
document.getElementById('quizForm').addEventListener('submit', function (event) {
  event.preventDefault();

  let options = document.querySelectorAll('.answer-option');
  options.forEach(option => {
    option.classList.remove('correct-answer', 'wrong-answer');
  });

  let correctIndex = parseInt(document.getElementById('correctAnswer').value);
  options.forEach((option, index) => {
    if (index === correctIndex) {
      option.classList.add('correct-answer');
    } else {
      option.classList.add('wrong-answer');
    }
  });
});