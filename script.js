// Main JavaScript file for 25-words game
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded successfully!');
    
    // Initialize game variables
    let gameActive = false;
    let timeRemaining = 45; // 45 seconds timer
    let timerInterval;
    let wordCount = 25; // Initial word count
    const maxWordCount = 25; // Maximum word count
    
    // Audio elements
    const timerSound = new Audio('timer.mp3');
    const doneSound = new Audio('done.mp3');
    
    // DOM elements - Timer
    const timerElement = document.querySelector('.timer');
    const currentNumberElement = document.getElementById('current-number');
    const nextNumberElement = document.getElementById('next-number');
    
    // DOM elements - Word Counter
    const incrementBtn = document.getElementById('increment-btn');
    const decrementBtn = document.getElementById('decrement-btn');
    const currentCountElement = document.getElementById('current-count');
    const nextCountElement = document.getElementById('next-count');
    const fillElement = document.getElementById('fill');
    
    // Store the original height of the SVG
    const svgHeight = 375;
    
    // Initialize timer display
    function initializeTimerDisplay() {
        if (currentNumberElement && nextNumberElement) {
            // Reset content
            currentNumberElement.textContent = '45';
            nextNumberElement.textContent = '44';
            
            // Set initial styles
            currentNumberElement.style.transition = 'transform 300ms ease-in-out';
            nextNumberElement.style.transition = 'transform 300ms ease-in-out';
            
            currentNumberElement.style.transform = 'translateY(0)';
            nextNumberElement.style.transform = 'translateY(100%)';
        }
    }
    
    // Initialize counter display
    function initializeCounterDisplay() {
        if (currentCountElement && nextCountElement) {
            // Reset content
            currentCountElement.textContent = wordCount.toString();
            nextCountElement.textContent = (wordCount > 0) ? (wordCount - 1).toString() : '0';
            
            // Set initial styles
            currentCountElement.style.transition = 'transform 300ms ease-in-out';
            nextNumberElement.style.transition = 'transform 300ms ease-in-out';
            
            currentCountElement.style.transform = 'translateY(0)';
            nextCountElement.style.transform = 'translateY(100%)';
            
            // Initialize the fill element
            updateFillHeight(wordCount);
        }
    }
    
    // Initialize on page load
    initializeTimerDisplay();
    initializeCounterDisplay();
    
    // Function to update the fill height based on word count
    function updateFillHeight(count) {
        if (fillElement) {
            if (count === 0) {
                // When count is 0, hide the fill completely
                fillElement.setAttribute('height', 0);
                fillElement.setAttribute('y', svgHeight);
            } else {
                // Calculate the height percentage based on current count vs max count
                const heightPercentage = count / maxWordCount;
                
                // Calculate new height and y position
                const newHeight = svgHeight * heightPercentage;
                const yOffset = svgHeight - newHeight;
                
                // Set new attributes with transition
                fillElement.style.transition = 'height 0.3s ease-in-out, y 0.3s ease-in-out, fill 0.3s ease-in-out';
                fillElement.setAttribute('height', newHeight);
                fillElement.setAttribute('y', yOffset);
                
                // Update fill color based on count thresholds
                if (count <= 3) {
                    // Red when 3 or fewer words left
                    fillElement.setAttribute('fill', '#ef4444'); // bg-red-500
                } else if (count <= 6) {
                    // Orange when 6 or fewer words left
                    fillElement.setAttribute('fill', '#f97316'); // bg-orange-500
                } else if (count <= 10) {
                    // Yellow when 10 or fewer words left
                    fillElement.setAttribute('fill', '#eab308'); // bg-yellow-500
                } else {
                    // Default white
                    fillElement.setAttribute('fill', 'white');
                }
            }
        }
    }
    
    // Function to start the game
    function startGame() {
        if (gameActive) return;
        
        gameActive = true;
        timeRemaining = 45;
        console.log('Game started!');
        
        // Play the timer sound
        playTimerSound();
        
        // Reset the display
        initializeTimerDisplay();
        
        // Reset all paths to their original color
        resetTimerPaths();
        
        // Start the timer
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    // Function to play the timer sound
    function playTimerSound() {
        // Reset the timer sound to the beginning
        timerSound.currentTime = 0;
        
        // Play the timer sound
        timerSound.play().catch(e => {
            // Handle any errors (e.g., if user hasn't interacted with the page yet)
            console.log('Error playing timer sound:', e);
        });
    }
    
    // Function to play the done sound
    function playDoneSound() {
        // Reset the done sound to the beginning
        doneSound.currentTime = 0;
        
        // Play the done sound
        doneSound.play().catch(e => {
            console.log('Error playing done sound:', e);
        });
    }
    
    // Function to update the timer with animation
    function updateTimer() {
        if (gameActive && timeRemaining > 0) {
            // Update the corresponding path in the SVG
            const pathId = (45 - timeRemaining) + 1; // Convert to 1-45 range
            const pathElement = document.getElementById(pathId.toString());
            
            if (pathElement) {
                // Change the color of the path
                pathElement.setAttribute('fill', 'white');
                pathElement.setAttribute('fill-opacity', '1');
            }
            
            // Calculate next value
            const nextValue = timeRemaining - 1;
            
            // Update the display
            updateTimerDisplay(nextValue);
            
            // Update the counter
            timeRemaining = nextValue;
            
            // If time is up
            if (timeRemaining === 0) {
                // Play the done sound
                playDoneSound();
                
                setTimeout(endGame, 300); // Wait for animation to complete
            }
        }
    }
    
    // Function to update the timer display with animation
    function updateTimerDisplay(newValue) {
        if (currentNumberElement && nextNumberElement) {
            // Prepare the next number
            nextNumberElement.textContent = newValue;
            
            // Trigger animation
            currentNumberElement.style.transform = 'translateY(-100%)';
            nextNumberElement.style.transform = 'translateY(0)';
            
            // After animation completes, reset for next update
            setTimeout(() => {
                // Temporarily disable transitions
                currentNumberElement.style.transition = 'none';
                nextNumberElement.style.transition = 'none';
                
                // Swap the values and reset positions
                currentNumberElement.textContent = newValue;
                currentNumberElement.style.transform = 'translateY(0)';
                
                // Set up next number for next animation
                nextNumberElement.textContent = newValue > 0 ? newValue - 1 : 0;
                nextNumberElement.style.transform = 'translateY(100%)';
                
                // Re-enable transitions (using setTimeout to ensure style changes are applied first)
                setTimeout(() => {
                    currentNumberElement.style.transition = 'transform 300ms ease-in-out';
                    nextNumberElement.style.transition = 'transform 300ms ease-in-out';
                }, 20);
            }, 300);
        }
    }
    
    // Function to update the word counter display with animation
    function updateCounterDisplay(newValue) {
        if (currentCountElement && nextCountElement) {
            // Make sure next number is positioned below before animation
            nextCountElement.textContent = newValue;
            
            // Force browser to recognize the position
            window.getComputedStyle(nextCountElement).transform;
            
            // Trigger animation
            currentCountElement.style.transform = 'translateY(-100%)';
            nextCountElement.style.transform = 'translateY(0)';
            
            // Update the fill element
            updateFillHeight(newValue);
            
            // After animation completes, reset for next update
            setTimeout(() => {
                // Temporarily disable transitions
                currentCountElement.style.transition = 'none';
                nextCountElement.style.transition = 'none';
                
                // Reset positions and update value
                currentCountElement.textContent = newValue;
                currentCountElement.style.transform = 'translateY(0)';
                
                // Reset next number position
                nextCountElement.style.transform = 'translateY(100%)';
                
                // Force reflow before re-enabling transitions
                window.getComputedStyle(nextCountElement).transform;
                
                // Re-enable transitions after a small delay to ensure DOM updates
                setTimeout(() => {
                    currentCountElement.style.transition = 'transform 300ms ease-in-out';
                    nextCountElement.style.transition = 'transform 300ms ease-in-out';
                }, 20);
            }, 300);
        }
    }
    
    // Function to increment word count with animation
    function incrementWordCount() {
        if (wordCount < maxWordCount) { // Add an upper limit
            wordCount++;
            updateCounterDisplay(wordCount);
            
            // Visual feedback for button press
            if (incrementBtn) {
                incrementBtn.classList.add('active');
                setTimeout(() => incrementBtn.classList.remove('active'), 150);
            }
        }
    }
    
    // Function to decrement word count with animation
    function decrementWordCount() {
        if (wordCount > 0) { // Allow count to reach 0 (changed from > 1)
            wordCount--;
            updateCounterDisplay(wordCount);
            
            // Visual feedback for button press
            if (decrementBtn) {
                decrementBtn.classList.add('active');
                setTimeout(() => decrementBtn.classList.remove('active'), 150);
            }
        }
    }
    
    // Function to handle keyboard arrow keys
    function handleKeyDown(event) {
        // Check if we're not in an input field or textarea
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            if (event.key === 'ArrowUp') {
                event.preventDefault(); // Prevent page scrolling
                incrementWordCount();
            } else if (event.key === 'ArrowDown') {
                event.preventDefault(); // Prevent page scrolling
                decrementWordCount();
            }
        }
    }
    
    // Function to reset all timer paths to original color
    function resetTimerPaths() {
        for (let i = 1; i <= 45; i++) {
            const pathElement = document.getElementById(i.toString());
            if (pathElement) {
                pathElement.setAttribute('fill', 'white');
                pathElement.setAttribute('fill-opacity', '0.3');
            }
        }
    }
    
    // Function to end the game
    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        
        // Stop the timer sound
        timerSound.pause();
        timerSound.currentTime = 0;
        
        console.log('Game ended!');
    }
    
    // Event listeners - Timer
    if (timerElement) {
        timerElement.addEventListener('click', function() {
            startGame();
        });
    }
    
    // Event listeners - Word Counter
    if (incrementBtn) {
        incrementBtn.addEventListener('click', incrementWordCount);
    }
    
    if (decrementBtn) {
        decrementBtn.addEventListener('click', decrementWordCount);
    }
    
    // Add keyboard event listener for arrow keys
    document.addEventListener('keydown', handleKeyDown);
}); 