async function how_to_play(){
    const arrowUp = document.querySelector('.idx-arrow-up');
    const arrowDown = document.querySelector('.idx-arrow-down');
    const spaceBar = document.querySelector('.idx-space-bar');
    if (!arrowUp || !arrowDown || !spaceBar) {
        console.error('One or more key elements not found');
        return;
    }
    const highlightKey = (element) => {
        if (element) {
            element.style.backgroundColor = 'var(--neon-orange)';
        }
    };

    const unhighlightKey = (element) => {
        if (element) {
            element.style.backgroundColor = 'var(--neon-blue)';
        }
    };

    // Mouse event listeners
    [arrowUp, arrowDown, spaceBar].forEach((element) => {
        if (element) {
            element.addEventListener('mousedown', () => highlightKey(element));
            element.addEventListener('mouseup', () => unhighlightKey(element));
            element.addEventListener('mouseleave', () => unhighlightKey(element));
        }
    });

    // Keyboard event listeners
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp') {
			event.preventDefault();
            highlightKey(arrowUp);
        } else if (event.key === 'ArrowDown') {
			event.preventDefault();
            highlightKey(arrowDown);
        } else if (event.key === ' ') {
			event.preventDefault();
            highlightKey(spaceBar);
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowUp') {
            unhighlightKey(arrowUp);
        } else if (event.key === 'ArrowDown') {
            unhighlightKey(arrowDown);
        } else if (event.key === ' ') {
            unhighlightKey(spaceBar);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const hoverSound = new Audio('/static/hover_reem.mp3');
    
    hoverSound.addEventListener('canplaythrough', () => {
        console.log("Audio loaded successfully!");
    });

    hoverSound.addEventListener('error', (error) => {
        console.error("Error loading audio file:", error);
    });

    const gameModes = document.querySelectorAll('.idx-game-mode');

    gameModes.forEach(mode => {
        mode.addEventListener('mouseenter', () => {
            console.log('Sound playing...');
            if (hoverSound.readyState >= 4) {
                hoverSound.play().catch(error => console.log("Playback prevented: ", error));
            }
        });
    });
    document.addEventListener('click', () => {
        hoverSound.play().catch(error => console.log("Playback prevented by browser policy: ", error));
    });
});