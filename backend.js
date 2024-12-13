const selectors = {
    boardContainer: document.querySelector('.Bcontainer'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win'),
  };
  
  const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
  };
  
  const shuffle = (array) => {
    const clonedArray = [...array];
    for (let i = clonedArray.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [clonedArray[i], clonedArray[randomIndex]] = [clonedArray[randomIndex], clonedArray[i]];
    }
    return clonedArray;
  };
  
  const pickRandom = (array, items) => {
    const clonedArray = [...array];
    return Array.from({ length: items }, () => clonedArray.splice(Math.floor(Math.random() * clonedArray.length), 1)[0]);
  };
  
  const generateGame = () => {
    const dimensions = parseInt(selectors.board.getAttribute('data-dimension'), 10);
  
    if (dimensions % 2 !== 0) {
      throw new Error('The dimensions of the board must be an even number.');
    }
  
    const fruitEmojis = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥭', '🍑', '🍊'];
    const picks = pickRandom(fruitEmojis, (dimensions * dimensions) / 2);
    const items = shuffle([...picks, ...picks]);
  
    const cards = `
      <div class="board" style="grid-template-columns: repeat(${dimensions}, auto);">
        ${items
          .map(
            (item) => `
              <div class="card">
                <div class="card-front"></div>
                <div class="card-back">${item}</div>
              </div>
            `,
          )
          .join('')}
      </div>
    `;
  
    selectors.boardContainer.innerHTML = cards;
  };
  
  const startGame = () => {
    state.gameStarted = true;
    selectors.start.classList.add('disabled');
  
    state.loop = setInterval(() => {
      state.totalTime++;
      selectors.moves.innerText = `${state.totalFlips} moves`;
      selectors.timer.innerText = `Time: ${state.totalTime} sec`;
    }, 1000);
  };
  
  const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach((card) => {
      card.classList.remove('flipped');
    });
    state.flippedCards = 0;
  };
  
  const flipCard = (card) => {
    if (!state.gameStarted) startGame();
  
    if (state.flippedCards < 2 && !card.classList.contains('flipped')) {
      card.classList.add('flipped');
      state.flippedCards++;
      state.totalFlips++;
    }
  
    if (state.flippedCards === 2) {
      const flippedCards = document.querySelectorAll('.flipped:not(.matched)');
      if (flippedCards[0].querySelector('.card-back').innerText === flippedCards[1].querySelector('.card-back').innerText) {
        flippedCards[0].classList.add('matched');
        flippedCards[1].classList.add('matched');
      }
      setTimeout(() => {
        flipBackCards();
      }, 1000);
    }
  
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
      setTimeout(() => {
        selectors.boardContainer.classList.add('flipped');
        document.getElementById('win').style.display = "flex";
        selectors.win.innerHTML = `
            You Won!<br>
            With <span class="highlight">${state.totalFlips}</span> moves<br>
            In <span class="highlight">${state.totalTime}</span> seconds
        `;
        clearInterval(state.loop);
      }, 1000);
    }
  };
  
  const attachEventListeners = () => {
    document.addEventListener('click', (event) => {
      const eventTarget = event.target;
      const eventParent = eventTarget.parentElement;
  
      if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
        flipCard(eventParent);
      } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
        startGame();
      }
    });
  };
  
  generateGame();
  attachEventListeners();
  