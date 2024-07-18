// DOM elements
const startBtn = document.querySelector('.start-button')
const bet = document.querySelector('#bet')
const playerCards = document.querySelectorAll('.card-player')
const computerCards = document.querySelector('.computer-container')
const betInfo = document.querySelector('.balance-container')
const placeBetBtn = document.querySelector('.place-bet')
const balanceShow = document.querySelector('.balance')


const allCards = document.querySelector('.flex-container')
const computerCard = document.querySelector('.card-computer')
const playerCard1 = document.querySelector('#player-card-1')
const playerCard2 = document.querySelector('#player-card-2')

// Action buttons
const hit = document.querySelector('.hit')
const stay = document.querySelector('.stay')

// Computer card values
const computerCardValuesBack = document.querySelectorAll('.cardValue')
const playerCardValuesBack = document.querySelectorAll('.cardValueP')

// All suit types
const cardSuits = [ "♥", "◆", "♠", "♣" ]

// All card value types
const cardValues = [1,2,3,4,5,6,7,8,9,10, 'J', 'Q', 'K']

// Initialise empty deck
let deck = []

// Player balance starts at $1000
let playerBalance = 1000

// Initialise current bet
let currentBet;

// Array holding all cards drawn by either the computer or player
let computerCardValues = []
let playerCardValues = []

// Take card iterator
let cardNum = 0;

// Player rolling total
let rollingTotalP = 0;

// Computer rolling total
let rollingTotalC = 0;

// Will change if the player draws cards
let numPlayerCards = document.querySelectorAll('.card-player')

// Will update based on the number of cards the dealer draws
let numComputerCards = document.querySelectorAll('.card-computer')


// Functions
let init = () => {
    gameStart()
    populateDeck()
    shuffleDeck(deck)

}

// 
let render = () => {
    updateCards()
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

    rollingTotalP = 21;

    if(playerCardValues.length === 2 && rollingTotalP === 21){
        payoutBlackJack()
    }

    // Some logic to reset the game
}

let payoutBlackJack = () => {
    playerBalance += parseInt(currentBet) * (1 + 3/2)

    updateBalance(playerBalance)
}


let drawCards = () => {
    checkBet()
    updateCardArrays()
    checkBlackjack()
    playerTotal()
    computerTotal()


    isFlipped()
}

// Update the computer and player cards with each card taken from the deck
let updateCardArrays = () => {

    for(let card = 0; card < numPlayerCards.length; card++){
        playerCardValues[card] = deck[card]
    }

    for(let card = 0; card < numComputerCards.length; card++){
        computerCardValues[card] = deck[deck.length - card - 1]

    }
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

    for(let val = 0; val < playerCardValues.length; val++){

        if(playerCardValues[val][0] === 'J' || playerCardValues[val][0] === 'Q' || playerCardValues[val][0] === 'K'){
            rollingTotalP += 10;
        } else {
            rollingTotalP += parseInt(playerCardValues[val][0])
        }
    }

    return rollingTotalP

}

// Calculates the computer's total score
let computerTotal = () => {

    for(let val = 0; val < computerCardValues.length; val++){

        if(playerCardValues[val][0] === 'J' || playerCardValues[val][0] === 'Q' || playerCardValues[val][0] === 'K'){
            rollingTotalP += 10;
        } else {
            rollingTotalP += parseInt(computerCardValues[val][0])
        }
    }
    return rollingTotalC

}


// UI Logic
// Unhides all elements on the page and hides the start button
let gameStart = () => {

    startBtn.classList.add('hide')
    allCards.classList.toggle('hide')
    betInfo.classList.toggle('hide')
}

let isFlipped = () => {

    computerCard.classList.add('is-flipped')
    playerCard1.classList.add('is-flipped')
    playerCard2.classList.add('is-flipped')

}

let updateBalance = (newBalance) => {
    balanceShow.innerText = `Balance: ${newBalance}`
}


// Handlers
startBtn.addEventListener('click', init)
placeBetBtn.addEventListener('click', drawCards)

