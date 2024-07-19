// --------- Constants ---------

const SUITS = ["clubs", "diamonds", "hearts", "spades"];
const CARD_VALUES = [
  { face: 2, value: 2 },
  { face: 3, value: 3 },
  { face: 4, value: 4 },
  { face: 5, value: 5 },
  { face: 6, value: 6 },
  { face: 7, value: 7 },
  { face: 8, value: 8 },
  { face: 9, value: 9 },
  { face: 10, value: 10 },
  { face: "J", value: 10 },
  { face: "Q", value: 10 },
  { face: "K", value: 10 },
  { face: "A", value: 11 },
];

// --------- Variables ---------
let deck;
let player;
let computer;
let hasGameStarted;
let winner;
let message;
let sufficientFunds;

// --------- DOM elements ---------
const computerHandElement = document.querySelector("#computer-hand");
const playerHandElement = document.querySelector("#player-hand");
const newGameButton = document.querySelector("#new-game-button");
const dealHandButton = document.querySelector("#deal-hand-button");
const stayButton = document.querySelector("#stay-button");
const hitButton = document.querySelector("#hit-button");
const balanceDisplay = document.querySelector("#balance-display");
const balanceForm = document.querySelector("#balance-form");
const balanceAmountInput = document.querySelector("#balance-amount");
const messageElement = document.querySelector("#message");
const playerHandDisplay = document.querySelector("#player-hand-display");
const computerHandDisplay = document.querySelector("#computer-hand-display");

// --------- Start Game ---------
init();

// --------- Add Event Listeners ---------
newGameButton.addEventListener("click", init);
balanceForm.addEventListener("submit", handleSubmitBet);
hitButton.addEventListener("click", handleHit);
dealHandButton.addEventListener("click", handleDeal);
stayButton.addEventListener("click", handleStay);

// --------- Event Listeners ---------
function handleSubmitBet(event) {
  event.preventDefault();

  checkBalanceZero();
  renderMessage();

  if (winner || !sufficientFunds) {
    return;
  }

  startGame();
  updateBalance();
  checkPlayerWin();
  render();
}

function handleHit() {
  if (winner) {
    return;
  }

  player.hand.push(deck.pop());
  checkPlayerWin();

  if (player.handValue >= 22) {
    message = "You Lose!";
    winner = computer;
  }

  render();
}

function handleStay() {
  if (winner) {
    return;
  }

  while (computer.handValue <= 17) {
    computer.hand.push(deck.pop());
    checkComputerWin();
  }

  if (computer.handValue >= 22 || computer.handValue < player.handValue) {
    message = "You Win!";
    winner = player;
    player.balance += player.betAmount * 2;
  }
  render();
}

function handleDeal() {
  const balance = player.balance;
  init();
  player.balance = balance;
  renderBalance();
}

// --------- Functions ---------
function init() {
  deck = createDeck();

  player = {
    hand: [],
    get handValue() {
      return this.hand.reduce((total, card) => total + card.value, 0);
    },
    balance: 1000,
    betAmount: 0,
  };

  computer = {
    hand: [],
    get handValue() {
      return this.hand.reduce((total, card) => total + card.value, 0);
    },
  };

  hasGameStarted = false;
  winner = null;
  message = "";
  sufficientFunds = true;

  render();
}

function createDeck() {
  let deck = [];

  SUITS.forEach((suit) => {
    CARD_VALUES.forEach((value) => {
      deck.push({
        suit: suit,
        face: value.face,
        value: value.value,
      });
    });
  });

  return shuffleDeck(deck);
}

function shuffleDeck(deck) {
  let i = deck.length,
    j,
    temp;

  while (--i > 0) {
    j = Math.floor(Math.random() * (i + 1));
    temp = deck[j];
    deck[j] = deck[i];
    deck[i] = temp;
  }

  return deck;
}

function render() {
  renderHands();
  renderBalance();
  renderMessage();
}

function renderHands() {
  if (hasGameStarted === false) {
    playerHandElement.innerHTML = "";
    playerHandElement.append(createCardBackImage(), createCardBackImage());
    playerHandDisplay.textContent = `Player Hand: 0`;

    computerHandElement.innerHTML = "";
    computerHandElement.append(createCardBackImage());
    computerHandDisplay.textContent = `Computer Hand: 0`;

    return;
  }

  playerHandDisplay.textContent = `Player Hand: ${player.handValue}`;
  playerHandElement.innerHTML = "";
  player.hand.forEach((card) => {
    const cardImage = createCardImage(card);
    playerHandElement.appendChild(cardImage);
  });

  computerHandDisplay.textContent = `Computer Hand: ${computer.handValue}`;
  computerHandElement.innerHTML = "";
  computer.hand.forEach((card) => {
    const cardImage = createCardImage(card);
    computerHandElement.appendChild(cardImage);
  });
}

function createCardImage(card) {
  const cardImage = document.createElement("img");

  cardImage.alt = `${card.face}${card.suit} face is added`;
  cardImage.className = "card-image";
  cardImage.src = `cards/${card.suit}_${card.face}.png`;

  return cardImage;
}

function createCardBackImage() {
  const cardImage = document.createElement("img");

  cardImage.alt = `Black face is added`;
  cardImage.className = "card-image";
  cardImage.src = "cards/back_dark.png";

  return cardImage;
}

function renderBalance() {
  balanceDisplay.textContent = `Balance: ${player.balance}`;
}

function updateBalance() {
  player.betAmount = parseInt(balanceAmountInput.value);

  if (player.betAmount > player.balance) {
    balanceAmountInput.value = "";
    balanceAmountInput.placeholder = "Insufficient Funds";
    player.betAmount = 0;
    return;
  }

  player.balance = player.balance - player.betAmount;
}

function startGame() {
  if (hasGameStarted) return;

  player.hand = [deck.pop(), deck.pop()];
  computer.hand = [deck.pop()];
  hasGameStarted = true;
}

function checkPlayerWin() {
  if (player.handValue === 21) {
    if (player.hand.length === 2) {
      message = "You got BlackJack!";
      player.balance += player.betAmount * 1.5;
    } else {
      message = "You Win!";
      player.balance += player.betAmount * 2;
    }
    winner = player;
  }
}

function checkComputerWin() {
  if (computer.handValue > player.handValue && computer.handValue < 22) {
    message = "You lose!";
    winner = computer;
  } else if (computer.handValue === player.handValue) {
    message = "It's a tie!";
    player.balance += player.betAmount;
    return;
  }
}

function renderMessage() {
  messageElement.textContent = message;
}

function checkBalanceZero() {
  if (player.balance === 0) {
    message = "You have 0 funds, click 'New Game' to start again";
    sufficientFunds = false;
  }
}

// // DOM elements
// const startBtn = document.querySelector('.start-button')
// const bet = document.querySelector('#bet')
// const playerContainer = document.querySelector('.player-container')
// const playerCards = document.querySelectorAll('.card-player')
// const computerCards = document.querySelector('.computer-container')
// const betInfo = document.querySelector('.balance-container')
// const placeBetBtn = document.querySelector('.place-bet')
// const balanceShow = document.querySelector('.balance')

// const allCards = document.querySelector('.card-container')
// const computerCard = document.querySelector('.card-computer')
// const playerCard1 = document.querySelector('#player-card-1')
// const playerCard2 = document.querySelector('#player-card-2')
// const gameContainer = document.querySelector('.cards-and-bet')

// // Action buttons
// const hit = document.querySelector('.hit')
// const stay = document.querySelector('.stay')

// // Computer card values
// let computerCardValuesBack = document.querySelectorAll('.cardValue')
// let playerCardValuesBack = document.querySelectorAll('.cardValueP')

// // Elements to delete upon reset
// let elementsToRemove = document.querySelectorAll('toRemove')

// // All suit types
// const cardSuits = [ "♥", "◆", "♠", "♣" ]

// // All card value types
// const cardValues = [1,2,3,4,5,6,7,8,9,10, 'J', 'Q', 'K']

// // Initialise empty deck
// let deck = []

// // Player balance starts at $1000
// let playerBalance = 1000

// // Initialise current bet
// let currentBet

// // Array holding all cards drawn by either the computer or player
// let computerCardValues = []
// let playerCardValues = []

// // Take card iterator
// let cardNum = 0;

// // Player rolling total
// let rollingTotalP = 0;

// // Computer rolling total
// let rollingTotalC = 0;

// // Will change if the player draws cards
// let numPlayerCards = document.querySelectorAll('.card-player')

// // Will update based on the number of cards the dealer draws
// let numComputerCards = document.querySelectorAll('.card-computer')

// // Functions
// let init = () => {
//     gameStart()
//     populateDeck()
//     shuffleDeck(deck)
// }

// // Populates the deck array with all card combinations
// let populateDeck = () => {

//     // Combines values and suits into a 1D array with the use of flatMap()
//     deck = cardValues.flatMap((value) => {

//        return cardSuits.map((suit) => {
//             return `${value} ${suit}`

//         })
//     })
// }

// // Checks whether the betted amount is valid (must be an integer, and balance must remain at atleast $0)
// let checkBet = () => {

//     // Convert string input to number
//     currentBet = parseInt(bet.value)

//     if(typeof(currentBet) === 'number' && (playerBalance - currentBet) >= 0){

//         // Re-calculate balance
//         playerBalance = playerBalance - currentBet
//         balanceShow.innerText = `Balance: ${playerBalance}`
//         bet.value = 'wait for result'

//     } else {
//         bet.value = 'Invalid Bet'
//     }
// }

// // Checks whether the player won Blackjack, in which case, the payout is instant
// let checkBlackjack = () => {

//     if(playerCardValues.length === 2 && rollingTotalP === 21){
//         payoutBlackJack()
//         populateDeck()
//         shuffleDeck(deck)

//     }

//     // Some logic to reset the game

// }

// let payoutBlackJack = () => {
//     playerBalance += parseInt(currentBet) * (1 + 3/2)

//     updateBalance(playerBalance)
// }

// let drawCards = () => {

//     // Checks whether bet is valid
//     checkBet()

//     // Updates cards in player and computer card array
//     updateCardArrays()

//     // Update card UI
//     updateCardPlayerUI()

//     // Update computer card UI
//     updateCardComputerUI()

//     // Calculates player's total score
//     playerTotal()

//     // Calculates computer's total score
//     computerTotal()

//     // Checks whether player's gotten Blackjack
//     checkBlackjack()

//     // Flips one card for the dealer and two cards for the player
//     isFlipped()
// }

// // Update the computer and player cards with each card taken from the deck
// let updateCardArrays = () => {

//     for(let card = 0; card < numPlayerCards.length; card++){
//         playerCardValues[card] = deck[card]
//     }

//     for(let card = 0; card < numComputerCards.length; card++){
//         computerCardValues[card] = deck[deck.length - card - 1]

//         console.log(computerCardValues)

//     }
// }

// // Shuffle deck using the Fisher-Yates algorithm
// let shuffleDeck = (deck) => {

//     let i = deck.length, j, temp;

//     while(--i > 0){
//         j = Math.floor(Math.random()*(i+1))
//         temp = deck[j]
//         deck[j] = deck[i]
//         deck[i] = temp
//     }

// }

// // Calculates the player's total score
// let playerTotal = () => {

//     // Reset player rolling total, as code below calculates total of all cards in the player card array
//     rollingTotalP = 0;

//     for(let val = 0; val < playerCardValues.length; val++){

//         if(playerCardValues[val][0] === 'J' || playerCardValues[val][0] === 'Q' || playerCardValues[val][0] === 'K'){
//             rollingTotalP += 10;
//         } else {
//             rollingTotalP += parseInt(playerCardValues[val][0])
//         }
//     }

//     return rollingTotalP
// }

// // Calculates the computer's total score
// let computerTotal = () => {

//     for(let val = 0; val < computerCardValues.length; val++){

//         if(computerCardValues[val][0] === 'J' || computerCardValues[val][0] === 'Q' || computerCardValues[val][0] === 'K'){
//             rollingTotalC += 10;
//         } else {
//             rollingTotalC += parseInt(computerCardValues[val][0])
//         }
//     }
//     return rollingTotalC

// }

// let check21Player = () => {
//     if(rollingTotalP === 21){
//         setTimeout((element) => {
//             elementsToRemove.forEach(() => {
//                 element.remove()
//             }, 2000)
//         })

//     }

//     // softReset()
// }

// let checkLosePlayer = () => {
//     if(rollingTotalP >= 22){

//     }
// }

// let check21Computer = () => {

// }

// let checkLoseComputer = () => {

// }

// // Resets everything except balance
// let softReset = () => {

// }

// // Reset's everything
// let HardReset = () => {

// }

// let overlay = () => {

// }

// // Calculates new totals and updates player's array
// let hitCard = () => {
//     addCardToPlayer()
//     updateCardArrays()
//     playerTotal()
//     updateCardPlayerUI()
//     isFlipped()
//     check21Player()
//     checkLosePlayer()

// }

// let stayCard = () => {
//     addCardToComputer()
//     updateCardArrays()
//     computerTotal()
//     updateCardComputerUI()
//     isFlipped()
//     check21Computer()
//     checkOver21Computer()
// }

// // UI Logic
// // Unhides all elements on the page and hides the start button
// let gameStart = () => {

//     startBtn.classList.add('hide')
//     allCards.classList.remove('hide')
//     betInfo.classList.remove('hide')
// }

// let isFlipped = () => {

//     for (let card = 0; card < numComputerCards.length; card++){
//         numComputerCards[card].classList.add('is-flipped')
//     }

//     for (let card = 0; card < numPlayerCards.length; card++){
//         numPlayerCards[card].classList.add('is-flipped')
//     }
// }

// let updateBalance = (newBalance) => {
//     balanceShow.innerText = `Balance: ${newBalance}`
// }

// let addCardToPlayer = () => {
//     let newCard = document.createElement('div')
//     newCard.classList.add('card', 'card-player', 'is-flipped', 'toRemove')
//     newCard.id = numPlayerCards.length + 1

//     newCard.innerHTML = `
//     <div class="thefront">Front</div>
//     <div class="theback">
//         <div class="cardValueP"></div>
//     </div>`

//     playerContainer.appendChild(newCard)
//     numPlayerCards = document.querySelectorAll('.card-player')
// }

// let addCardToComputer = () => {
//     let newCard = document.createElement('div')
//     newCard.classList.add('card', 'card-computer', 'is-flipped','toRemove')

//     newCard.innerHTML = `
//     <div class="thefront">Front</div>
//     <div class="theback">
//         <div class="cardValue"></div>
//     </div>`

//     computerCards.appendChild(newCard)
//     numComputerCards = document.querySelectorAll('.card-computer')
// }

// let updateCardPlayerUI = () => {

//     playerCardValuesBack = document.querySelectorAll('.cardValueP')

//     for(let val = 0; val < playerCardValuesBack.length; val++){
//         playerCardValuesBack[val].innerText = playerCardValues[val]

//     }
// }

// let updateCardComputerUI = () => {

//     computerCardValuesBack = document.querySelectorAll('.cardValue')

//     for(let val = 0; val < computerCardValuesBack.length; val++){
//         computerCardValuesBack[val].innerText = computerCardValues[val]
//     }
// }

// // Handlers
// startBtn.addEventListener('click', init)
// placeBetBtn.addEventListener('click', drawCards)
// hit.addEventListener('click', hitCard)
// stay.addEventListener('click', stayCard)
