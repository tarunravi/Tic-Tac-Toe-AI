# Tic Tac Toe AI
In this personal project, I designed an AI to learn how to play the popular game Tic Tac Toe without any humans teaching it.  
This project has two primary components: Building the Tic Tac Toe game and adding the Tic Tac Toe AI

## Play/Train The AI
https://myworldrules.github.io/TicTacToeAI/

## Playing the Game
Initially, the AI is in generation 0, meaning the AI will just randomly move around.

* To place a piece, simply click on any open spot. 

* To train the AI, click on `Train A.I.` During this period, you will not be able to place a piece on the board. 

* To stop training the AI, click on `Play A.I.`

* To reset the current game, click on `Reset Game`

* To view the Q-Table values, click on `Show Values`

## Building the Tic Tac Toe Game

### Why I didn't use Pygame
In my Blackjack AI project, I used Pygame with Python. That implementation has a few major issues, the primary issue is that the application can't be deployed online. The only way one can play that is to download the code. The second issue is that Pygame is slow and clunky, which leads to longer AI train times. 

### Why I used Javascript
I decided to use JavaScript over Pygame for the primary reason, that it can be deployed online. This makes the game more accessible. JavaScript is also much faster than Pygame, which resulted in faster training times. 

## AI Learning Progression
The longer the AI trains for, the better it becomes. Generally, after the AI has trained for 10,000 games it becomes near impossible to beat the AI.

## How to AI Learns
The AI uses the Sarsamax (Q-learning) algorithm. After every move the AI makes, it updates its Q-table on how good that move is. The more games played, the better it is at valuing each board layout and each move on a board. 
