document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const pauseButton = document.getElementById('pause-button');
    const resumeButton = document.getElementById('resume-button');
    const resetButton = document.getElementById('reset-button');
    const timeDisplay = document.getElementById('time');
    
    const rows = 8;
    const cols = 8;
    let timer = 300; // 5 minutes
    let timerInterval;
    let gamePaused = false;

    class Piece {
        constructor(type, x, y, direction = null) {
            this.type = type;
            this.x = x;
            this.y = y;
            this.direction = direction; // Direction could be 'N', 'E', 'S', 'W'
        }

        move(dx, dy) {
            const newX = this.x + dx;
            const newY = this.y + dy;
            if (this.isValidMove(newX, newY)) {
                this.x = newX;
                this.y = newY;
            }
        }

        rotate() {
            const directions = ['N', 'E', 'S', 'W'];
            const currentIndex = directions.indexOf(this.direction);
            this.direction = directions[(currentIndex + 1) % 4];
        }

        isValidMove(x, y) {
            return x >= 0 && x < 8 && y >= 0 && y < 8; // Ensure the move stays within the board
        }
    }

    class Titan extends Piece {
        constructor(x, y) {
            super('titan', x, y);
        }
    }

    class Cannon extends Piece {
        constructor(x, y, direction) {
            super('cannon', x, y, direction);
        }

        fire() {
            // Implement bullet logic
        }
    }

    class Ricochet extends Piece {
        constructor(x, y, direction) {
            super('ricochet', x, y, direction);
        }

        deflect(bullet) {
            // Change bullet direction based on ricochet direction
        }
    }

    class SemiRicochet extends Piece {
        constructor(x, y, direction) {
            super('semi_ricochet', x, y, direction);
        }

        deflect(bullet) {
            // Change bullet direction based on semi-ricochet direction
        }
    }

    class Tank extends Piece {
        constructor(x, y) {
            super('tank', x, y);
        }

        withstand(bullet) {
            // Logic for tank withstanding a bullet
        }
    }

    let pieces = [
        new Titan(0, 0),
        new Cannon(7, 0, 'E'),
        new Ricochet(2, 2, 'N'),
        new SemiRicochet(5, 5, 'S'),
        new Tank(4, 4)
    ];

    function initBoard() {
        board.innerHTML = '';
        for (let i = 0; i < rows * cols; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = cell-${Math.floor(i / 8)}-${i % 8};
            board.appendChild(cell);
        }

        pieces.forEach(piece => {
            const cell = document.querySelector(#cell-${piece.x}-${piece.y});
            cell.innerHTML = <div class="${piece.type}"></div>;
        });
    }

    function updateBoard() {
        document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = '');

        pieces.forEach(piece => {
            const cell = document.querySelector(#cell-${piece.x}-${piece.y});
            cell.innerHTML = <div class="${piece.type}"></div>;
        });
    }

    function movePiece(piece, dx, dy) {
        piece.move(dx, dy);
        updateBoard();
    }

    function rotatePiece(piece) {
        piece.rotate();
        updateBoard();
    }

    class Bullet {
        constructor(x, y, direction) {
            this.x = x;
            this.y = y;
            this.direction = direction;
        }

        move() {
            switch (this.direction) {
                case 'N': this.y -= 1; break;
                case 'E': this.x += 1; break;
                case 'S': this.y += 1; break;
                case 'W': this.x -= 1; break;
            }
        }

        isWithinBounds() {
            return this.x >= 0 && this.x < 8 && this.y >= 0 && this.y < 8;
        }
    }

    function fireCannon(cannon) {
        let bullet = new Bullet(cannon.x, cannon.y, cannon.direction);

        while (bullet.isWithinBounds()) {
            bullet.move();

            pieces.forEach(piece => {
                if (piece.x === bullet.x && piece.y === bullet.y) {
                    if (piece.type === 'titan') {
                        alert('Game Over! Titan destroyed.');
                        resetGame();
                    } else if (piece.type === 'tank') {
                        piece.withstand(bullet);
                        return;
                    } else if (piece.type === 'ricochet' || piece.type === 'semi_ricochet') {
                        piece.deflect(bullet);
                    }
                }
            });
        }
    }

    function resetGame() {
        clearInterval(timerInterval);
        timer = 300;
        timeDisplay.textContent = timer;
        gamePaused = false;
        initBoard();
        startTimer();
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            if (!gamePaused) {
                timer--;
                timeDisplay.textContent = timer;
                if (timer <= 0) {
                    clearInterval(timerInterval);
                    alert('Time is up! Game over.');
                }
            }
        }, 1000);
    }

    pauseButton.addEventListener('click', () => {
        gamePaused = true;
    });

    resumeButton.addEventListener('click', () => {
        gamePaused = false;
    });

    resetButton.addEventListener('click', resetGame);

    document.addEventListener('keydown', (event) => {
        const selectedPiece = pieces[1]; // Assuming player 1 controls the cannon for simplicity
        switch(event.key) {
            case 'ArrowUp':
                movePiece(selectedPiece, -1, 0);
                break;
            case 'ArrowDown':
                movePiece(selectedPiece, 1, 0);
                break;
            case 'ArrowLeft':
                movePiece(selectedPiece, 0, -1);
                break;
            case 'ArrowRight':
                movePiece(selectedPiece, 0, 1);
                break;
            case 'r':
                rotatePiece(selectedPiece);
                break;
            case 'f':
                if (selectedPiece.type === 'cannon') {
                    fireCannon(selectedPiece);
                }
                break;
        }
    });

    initBoard();
    startTimer();
});