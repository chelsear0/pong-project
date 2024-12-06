window.onload = function () {
    const canvas = document.getElementById('pong');
    const ctx = canvas.getContext('2d');

    const paddleWidth = 10, paddleHeight = 100;
    const ballSize = 10;
    const paddleSpeed = 4; // Lowered paddle speed
    const botSpeed = 3;    // Lowered bot speed
    const maxScore = 7;    // Score limit to win a round
    const totalRounds = 3; // Total rounds to play

    let player1Score = 0;
    let player2Score = 0;
    let roundNumber = 1;
    let isBot = false;

    // Player 1 (Human)
    const player1 = {
        x: 0,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        color: 'white',
        dy: 0,
    };

    // Player 2 (Bot or Human)
    const player2 = {
        x: canvas.width - paddleWidth,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        color: 'white',
        dy: 0,
    };

    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: ballSize,
        speed: 3, 
        dx: 3,
        dy: 3,
    };

    // Draw paddles, ball, and score
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw paddles
        ctx.fillStyle = player1.color;
        ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
        ctx.fillStyle = player2.color;
        ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

        // Draw ball
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        drawScore();
        drawRound();

        if (!isBot) drawInstructions();
    }

    // Draw score at the top with a box outline
    function drawScore() {
        ctx.font = '32px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(player1Score, canvas.width / 4, 50);
        ctx.fillText(player2Score, (3 * canvas.width) / 4, 50);

        // Add a box outline for scores
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(canvas.width / 4 - 20, 20, 40, 40); // Player 1 box
        ctx.strokeRect((3 * canvas.width) / 4 - 20, 20, 40, 40); // Player 2 box
    }

    // Draw the current round number
    function drawRound() {
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Round: ${roundNumber} of ${totalRounds}`, canvas.width / 2 - 90, 30);
    }

    // Draw instructions for multiplayer mode
    function drawInstructions() {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText("Player 1: Arrow Keys | Player 2: W (Up), S (Down)", canvas.width / 2 - 150, canvas.height - 20);
    }

    function movePaddles() {
        player1.y += player1.dy;

        if (isBot) {
            if (ball.y < player2.y + player2.height / 2) {
                player2.y -= botSpeed;
            } else if (ball.y > player2.y + player2.height / 2) {
                player2.y += botSpeed;
            }
        } else {
            player2.y += player2.dy;
        }

        // Prevent paddles from going out of bounds
        player1.y = Math.max(0, Math.min(player1.y, canvas.height - player1.height));
        player2.y = Math.max(0, Math.min(player2.y, canvas.height - player2.height));
    }

    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.dy = -ball.dy;
        }

        if (
            ball.x - ball.radius < player1.x + player1.width &&
            ball.y > player1.y &&
            ball.y < player1.y + player1.height
        ) {
            ball.dx = -ball.dx;
        }

        if (
            ball.x + ball.radius > player2.x &&
            ball.y > player2.y &&
            ball.y < player2.y + player2.height
        ) {
            ball.dx = -ball.dx;
        }

        // Check if a player scored
        if (ball.x - ball.radius < 0) {
            player2Score++;
            checkRoundWinner();
            resetBall();
        }

        if (ball.x + ball.radius > canvas.width) {
            player1Score++;
            checkRoundWinner();
            resetBall();
        }
    }

    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = -ball.dx;
    }

    function checkRoundWinner() {
        if (player1Score === maxScore) {
            // Player 1 wins the round
            alert("Player 1 wins this round!");
            nextRound();
        } else if (player2Score === maxScore) {
            // Player 2 wins the round
            alert("Player 2 wins this round!");
            nextRound();
        }
    }

    function nextRound() {
        if (roundNumber < totalRounds) {
            roundNumber++;
            player1Score = 0;
            player2Score = 0;
            setTimeout(resetBall, 1000); // Reset ball after 1 second
        } else {
            // Game over
            let winner = player1Score > player2Score ? "Player 1" : "Player 2";
            alert(`${winner} wins the game!`);
            // Reset everything for new game or stop the game.
            roundNumber = 1;
            player1Score = 0;
            player2Score = 0;
        }
    }

    function handlePlayer1Movement(e) {
        if (e.key === 'ArrowUp') player1.dy = -paddleSpeed;
        if (e.key === 'ArrowDown') player1.dy = paddleSpeed;
    }

    function handlePlayer2Movement(e) {
        if (!isBot) {
            if (e.key === 'w' || e.key === 'W') player2.dy = -paddleSpeed;
            if (e.key === 's' || e.key === 'S') player2.dy = paddleSpeed;
        }
    }

    function stopPlayerMovement(e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player1.dy = 0;
        if (!isBot && (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S')) {
            player2.dy = 0;
        }
    }

    document.addEventListener('keydown', function (e) {
        handlePlayer1Movement(e);
        handlePlayer2Movement(e);
    });

    document.addEventListener('keyup', stopPlayerMovement);

    function startBotGame() {
        isBot = true;
        player2.color = 'red';
        player2.dy = 0;
    }

    function startMultiplayer() {
        isBot = false;
        player2.color = 'white';
    }

    function gameLoop() {
        draw();
        movePaddles();
        moveBall();
        requestAnimationFrame(gameLoop);
    }

    // Uncomment one of the modes to start
    // startBotGame(); // Uncomment for bot mode
    startMultiplayer(); // Uncomment for multiplayer mode

    gameLoop();
};
