// DOM elements
const startBtn = document.querySelector('.start-button')
const bet = document.querySelector('.bet')
const playerCards = document.querySelector('.player-container')
const computerCards = document.querySelector('.computer-container')
const betInfo = document.querySelector('.balance-container')
const placeBetBtn = document.querySelector('.place-bet')

const deckValues = 
    [
        // All possible cards suits
        {suits: ["hearts", "diamonds", "spades", "clubs"]},

        // All possible card values in a deck
        {values: [1,2,3,4,5,6,7,8,9,10, 'Jack', 'Queen', 'King']},
    ]


// Functions
let init = () => {
    gameStart()

}

// 
let render = () => {
    computerTotal()
    playerTotal()
}

// Populates the deck array with all card combinations
let populateDeck = () => {

}

// Calculates the player's total score
let playerTotal = () => {

}

// Calculates the computer's total score
let computerTotal = () => {

}


// UI Logic
// Unhides all elements on the page and hides the start button
let gameStart = () => {

    startBtn.classList.add('hide')
    playerCards.classList.toggle('hide')
    computerCards.classList.toggle('hide')
    betInfo.classList.toggle('hide')
}



// Handlers
startBtn.addEventListener('click', init)
placeBetBtn.addEventListener('click', drawCards)

