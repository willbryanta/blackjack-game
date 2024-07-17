// DOM elements
const startBtn = document.querySelector('.start-button')
const bet = document.querySelector('#bet')
const playerCards = document.querySelector('.player-container')
const computerCards = document.querySelector('.computer-container')
const betInfo = document.querySelector('.balance-container')
const placeBetBtn = document.querySelector('.place-bet')
const balanceShow = document.querySelector('.balance')

// Action buttons
const hit = document.querySelector('.hit')
const stay = document.querySelector('.stay')

// All suit types
const cardSuits = 
[
    "hearts", "diamonds", "spades", "clubs"
]

// All card value types
const cardValues = [
    1,2,3,4,5,6,7,8,9,10, 'J', 'Q', 'K'
]

// Initialise empty deck
let deck = []

// Player balance starts at $1000
let playerBalance = 1000

// Initialise current bet
let currentBet;

// Valid or non-valid bet
let validBet = false;





// Functions
let init = () => {
    gameStart()
    populateDeck()
    shuffleDeck(deck)
    console.log(deck)

}

// 
let render = () => {
    computerTotal()
    playerTotal()
}

// Populates the deck array with all card combinations
let populateDeck = () => {

    // Combines values and suits into a 1D array with the use of flatMap()
    deck = cardValues.flatMap((value) => {

       return cardSuits.map((suit) => {
            return `${value} ${suit}`

        })
    })
}

// Checks whether the betted amount is valid (must be an integer, and balance must remain at atleast $0)
let checkBet = () => {

    // Convert string input to 
    currentBet = parseInt(bet.value)

    if(typeof(currentBet) === 'number' && (playerBalance - currentBet) >= 0){


        // Will only show actions once a valid bet has been placed
        hit.classList.toggle('hide')
        stay.classList.toggle('hide')

        // Re-calculate balance
        playerBalance = playerBalance - currentBet
        balanceShow.innerText = `Balance: ${playerBalance}`
        bet.value = 'wait for result'

    } else {

        bet.value = 'Invalid Bet'

    }
}

// Checks whether the player won Blackjack, in which case, the payout is instant
let checkBlackjack = () => {


}


let drawCards = () => {
    checkBet()
    checkBlackjack()





}

// Shuffle deck using the Fisher-Yates algorithm
let shuffleDeck = (deck) => {

    let i = deck.length, j, temp;

    while(--i > 0){
        j = Math.floor(Math.random()*(i+1))
        temp = deck[j]
        deck[j] = deck[i]
        deck[i] = temp
    }

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

