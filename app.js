// DOM elements
const startBtn = document.querySelector('.start-button')
const bet = document.querySelector('#bet')
const playerContainer = document.querySelector('.player-container')
const playerCards = document.querySelectorAll('.card-player')
const computerCards = document.querySelector('.computer-container')
const betInfo = document.querySelector('.balance-container')
const placeBetBtn = document.querySelector('.place-bet')
const balanceShow = document.querySelector('.balance')

const allCards = document.querySelector('.card-container')
const computerCard = document.querySelector('.card-computer')
const playerCard1 = document.querySelector('#player-card-1')
const playerCard2 = document.querySelector('#player-card-2')
const gameContainer = document.querySelector('.cards-and-bet')

// Action buttons
const hit = document.querySelector('.hit')
const stay = document.querySelector('.stay')

// Computer card values
let computerCardValuesBack = document.querySelectorAll('.cardValue')
let playerCardValuesBack = document.querySelectorAll('.cardValueP')

// Elements to delete upon reset
let elementsToRemove = document.querySelectorAll('toRemove')

// All suit types
const cardSuits = [ "♥", "◆", "♠", "♣" ]

// All card value types
const cardValues = [1,2,3,4,5,6,7,8,9,10, 'J', 'Q', 'K']

// Initialise empty deck
let deck = []

// Player balance starts at $1000
let playerBalance = 1000

// Initialise current bet
let currentBet

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

    // Convert string input to number
    currentBet = parseInt(bet.value)

    if(typeof(currentBet) === 'number' && (playerBalance - currentBet) >= 0){

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

    if(playerCardValues.length === 2 && rollingTotalP === 21){
        payoutBlackJack()
        populateDeck()
        shuffleDeck(deck)

    }

    // Some logic to reset the game

}

let payoutBlackJack = () => {
    playerBalance += parseInt(currentBet) * (1 + 3/2)

    updateBalance(playerBalance)
}


let drawCards = () => {

    // Checks whether bet is valid
    checkBet()

    // Updates cards in player and computer card array
    updateCardArrays()

    // Update card UI
    updateCardPlayerUI()

    // Update computer card UI
    updateCardComputerUI()

    // Calculates player's total score
    playerTotal()

    // Calculates computer's total score
    computerTotal()

    // Checks whether player's gotten Blackjack
    checkBlackjack()

    // Flips one card for the dealer and two cards for the player
    isFlipped()
}

// Update the computer and player cards with each card taken from the deck
let updateCardArrays = () => {

    for(let card = 0; card < numPlayerCards.length; card++){
        playerCardValues[card] = deck[card]
    }

    for(let card = 0; card < numComputerCards.length; card++){
        computerCardValues[card] = deck[deck.length - card - 1]

        console.log(computerCardValues)

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

    // Reset player rolling total, as code below calculates total of all cards in the player card array
    rollingTotalP = 0;

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

        if(computerCardValues[val][0] === 'J' || computerCardValues[val][0] === 'Q' || computerCardValues[val][0] === 'K'){
            rollingTotalC += 10;
        } else {
            rollingTotalC += parseInt(computerCardValues[val][0])
        }
    }
    return rollingTotalC

}

let check21Player = () => {
    if(rollingTotalP === 21){
        setTimeout((element) => {
            elementsToRemove.forEach(() => {
                element.remove()
            }, 2000)
        })

    }


    // softReset()
}

let checkLosePlayer = () => {
    if(rollingTotalP >= 22){

    }
}

let check21Computer = () => {

}

let checkLoseComputer = () => {

}



// Resets everything except balance
let softReset = () => {

}

// Reset's everything
let HardReset = () => {

}

let overlay = () => {


}

// Calculates new totals and updates player's array
let hitCard = () => {
    addCardToPlayer()
    updateCardArrays()
    playerTotal()
    updateCardPlayerUI()
    isFlipped()
    check21Player()
    checkLosePlayer()

}

let stayCard = () => {
    addCardToComputer()
    updateCardArrays()
    computerTotal()
    updateCardComputerUI()
    isFlipped()
    check21Computer()
    checkOver21Computer()
}


// UI Logic
// Unhides all elements on the page and hides the start button
let gameStart = () => {

    startBtn.classList.add('hide')
    allCards.classList.remove('hide')
    betInfo.classList.remove('hide')
}

let isFlipped = () => {

    for (let card = 0; card < numComputerCards.length; card++){
        numComputerCards[card].classList.add('is-flipped')
    } 

    for (let card = 0; card < numPlayerCards.length; card++){
        numPlayerCards[card].classList.add('is-flipped')
    }    
}

let updateBalance = (newBalance) => {
    balanceShow.innerText = `Balance: ${newBalance}`
}

let addCardToPlayer = () => {
    let newCard = document.createElement('div')
    newCard.classList.add('card', 'card-player', 'is-flipped', 'toRemove')
    newCard.id = numPlayerCards.length + 1

    newCard.innerHTML = `
    <div class="thefront">Front</div>
    <div class="theback">
        <div class="cardValueP"></div>
    </div>`

    playerContainer.appendChild(newCard)
    numPlayerCards = document.querySelectorAll('.card-player')
}

let addCardToComputer = () => {
    let newCard = document.createElement('div')
    newCard.classList.add('card', 'card-computer', 'is-flipped','toRemove')

    newCard.innerHTML = `
    <div class="thefront">Front</div>
    <div class="theback">
        <div class="cardValue"></div>
    </div>`

    computerCards.appendChild(newCard)
    numComputerCards = document.querySelectorAll('.card-computer')
}

let updateCardPlayerUI = () => {

    playerCardValuesBack = document.querySelectorAll('.cardValueP')

    for(let val = 0; val < playerCardValuesBack.length; val++){
        playerCardValuesBack[val].innerText = playerCardValues[val]

    }

}

let updateCardComputerUI = () => {

    computerCardValuesBack = document.querySelectorAll('.cardValue')

    for(let val = 0; val < computerCardValuesBack.length; val++){
        computerCardValuesBack[val].innerText = computerCardValues[val]
    }
}


// Handlers
startBtn.addEventListener('click', init)
placeBetBtn.addEventListener('click', drawCards)
hit.addEventListener('click', hitCard)
stay.addEventListener('click', stayCard)