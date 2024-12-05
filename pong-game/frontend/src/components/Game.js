import React, { useEffect, useRef } from "react";
import "./Game.css";

const Game = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set up canvas dimensions
    canvas.width = 800;
    canvas.height = 400;

    // Paddle and Ball Configurations
    const paddleWidth = 10;
    const paddleHeight = 80;
    const ballRadius = 10;

    let paddle1Y = canvas.height / 2 - paddleHeight / 2;
    let paddle2Y = paddle1Y;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballDX = 2;
    let ballDY = 2;

    // Draw Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw paddles
      ctx.fillStyle = "white";
      ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
      ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();

      // Ball movement
      ballX += ballDX;
      ballY += ballDY;

      // Ball-wall collision
      if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballDY *= -1;
      }

      // Reset ball if it goes off-screen
      if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballDX *= -1;
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return <canvas ref={canvasRef} className="gameCanvas"></canvas>;
};

export default Game;
