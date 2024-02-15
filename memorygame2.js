document.addEventListener('DOMContentLoaded', () =>{
    const cardsContainer = document.getElementById('cards');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const scoreDisplay = document.getElementById('score');
    const clickCounter = document.getElementById('clickCounter');
    

    let cardsArray = []; // Array to hold card data
    let firstCard = null;
    let secondCard = null;
    let flippedCards = 0;
    let score = 0;
    let clickCount = 0;
    
    

    

    // Images array
    const imagesArray = ['baseball.png', 'baseball.png', 'frisbee.png', 'frisbee.png', 'golf.png', 'golf.png', 'soccer.png', 'soccer.png', 'tennis.png', 'tennis.png','basketball.png', 'basketball.png', 'football.png', 'football.png', 'Hockey.png', 'Hockey.png', 'softball.png', 'softball.png', 'vball.png', 'vball.png'];

    // Function to start or restart the game
    function startGame() {
        cardsArray = generateRandomImagesArray();
        shuffleCards();
        renderCards();
        score = 0;
        updateScore();
        clickCount = 0;
        updateClickCounter();
        startBtn.style.display = 'none';
        restartBtn.style.display = 'inline-block';
        canFlip = true;
    }

    // Function to render cards
    function renderCards() {
        cardsContainer.innerHTML = '';
        cardsArray.forEach((image, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            const frontFace = document.createElement('div');
            frontFace.classList.add('face');
            frontFace.textContent = 'PICK ME!';
            const backFace = document.createElement('div');
            backFace.classList.add('face', 'back');
            const img = document.createElement('img');
            img.src = image; // Set the src attribute to the image filename
            backFace.appendChild(img);
            card.appendChild(frontFace);
            card.appendChild(backFace);
            card.dataset.index = index; // Store the index for matching
            card.addEventListener('click', handleCardClick);
            cardsContainer.appendChild(card);
        });
    }

    // Function to handle card click
function handleCardClick() {
    // Check if flipping is allowed and if the clicked card is not already matched or flipped
    if (!canFlip || this.classList.contains('matched') || this.classList.contains('flip')) {
        return;
    }

    // Flip the clicked card
    this.classList.add('flip');

    // Check if it's the first or second card being flipped
    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        canFlip = false; // Prevent further flipping until the comparison is complete
        checkMatch();
    }

    clickCount++;
    updateClickCounter();
}


function checkMatch() {
    const index1 = parseInt(firstCard.dataset.index);
    const index2 = parseInt(secondCard.dataset.index);

    if (cardsArray[index1] === cardsArray[index2]) {
        // Add matched class
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        // Increment score and flipped count
        score += 100;
        flippedCards += 2;
        updateScore();

        // Check if game is over
        if(flippedCards === cardsArray.length) {
            endGame();
        }

        // Reset firstCard and secondCard for the next pair
        firstCard = null;
        secondCard = null;
        // Allow flipping again
        canFlip = true;
    } else {
        // Flip cards back after 1 second
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            
            // Allow flipping again
            canFlip = true;

            // Reset firstCard and secondCard
            firstCard = null;
            secondCard = null;

        }, 1000);
    }
}

     

  
 

    // Function to end the game
    function endGame() {
        canFlip = false;
        startBtn.style.display = 'inline-block';
        restartBtn.style.display = 'none';

        // Check if the current score is the lowest
        const lowestScore = parseInt(localStorage.getItem('lowestScore')) || Infinity;
        if (score < lowestScore) {
            localStorage.setItem('lowestScore', score);
        }

        // Show alert with the lowest score
        alert(`Congratulations! You have won the game!\nYour lowest score: ${localStorage.getItem('lowestScore')}`);
    }

    // Function to update the score display
    function updateScore() {
        document.getElementById('score').textContent = score; 
      }

    // Function to update the click counter display
    function updateClickCounter() {
        clickCounter.textContent = `Clicks: ${clickCount}`;
    }

    // Function to generate an array of random images
    function generateRandomImagesArray() {
        const images = [];
        const numCards = 20; // Fixed number of cards
        for (let i = 0; i < numCards; i++) {
            images.push(imagesArray[i % imagesArray.length]); // Cycle through the imagesArray to create pairs
        }
        return imagesArray.slice(0,20); // Duplicate the images to get pairs
    }

    function shuffleCards() {
        // Fisher-Yates shuffle algorithm
        for (let i = cardsArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
        }
      }
      

    // Event listeners for buttons
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
});