const wordInput = document.getElementById('text');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const settingsForm = document.getElementById('settings-form');
const endGame = document.getElementById('end-game-container');
let difficultySelect = document.getElementById('difficulty');

let randomWord;
let score = 0;
let time = 10;
let timeInterval;
let difficulty = 'medium';
difficultySelect.value = difficulty;
//Focusing on the input fiels on start
wordInput.focus();

//Reaching to an API to fetch random words
async function fetchRandomWord() {
  const numberOfWordsToFetch = 50;
  const apiUrl = `https://random-word-api.herokuapp.com/word?number=${numberOfWordsToFetch}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch random words');
    }

    const data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomWord = data[randomIndex];
    return randomWord;
  } catch (error) {
    console.error(error);
  }
}

const updateWordDisplay = (word) => {
  const words = document.getElementById('word');
  words.textContent = word;
};

const updateTime = () => {
  time--;
  timeEl.innerHTML = time + 's';

  if (time === 0) {
    clearInterval(timeInterval);

    gameOver();
  }
};


const startGame = () => {
  timeInterval = setInterval(updateTime, 1000);
};

const updateScore = () => {
  score++;
  scoreEl.innerHTML = score;
};

const gameOver = () => {
  endGame.innerHTML = `
    <h1>Time ran out!</h1>
    <p>Your final score: ${score} </p>
    <button onclick='location.reload()'>Play Again</button>
    `;
  endGame.style.display = 'flex';
};

wordInput.addEventListener('input', async (e) => {
  const insertedWord = e.target.value;
  const currentWord = document.getElementById('word').textContent;

  if (!timeInterval) {
    startGame();
  }

  if (insertedWord === currentWord) {
    const newWord = await fetchRandomWord();
    updateWordDisplay(newWord);
    updateScore();

    e.target.value = '';

    if (difficulty === 'hard') {
      time += 1;
    } else if (difficulty === 'medium') {
      time += 3;
    } else {
      time += 5;
    }

    updateTime();
  }
});

settingsForm.addEventListener('change', (e) => {
  difficulty = e.target.value;
});

fetchRandomWord().then((initialWord) => {
  updateWordDisplay(initialWord);
});
