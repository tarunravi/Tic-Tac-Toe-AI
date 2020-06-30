<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tic Tac Toe - By Tarun Ravi</title>
    <style>
        canvas {
            padding-bottom: 10px;
            padding-top: 10px;
            margin-left: auto;
            margin-right: auto;
            display: block;
        }

        #wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .button {
            background-color: #19bd9c;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;

        }
        .button2 {
            background-color: #2d3e52;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
        }
    </style>

</head>
<body onload="resizeCanvas();">
    <canvas id="canvas" ></canvas>
</body>

<body>

<script src="main.js"></script>
<div id="wrapper">
    <input type="button" class="button" value="Code / Directions"
           onclick="window.location.href = window.location.href = 'https://github.com/MyWorldRules/Tic-Tac-Toe-AI';"/>
    <input type="button" id = "trainAi" class="button" value="Train A.I." onclick="trainAI()"/>
    <input type="button" id = "playAI" class="button" value="Reset Game" onclick="playAI()"/>
    <input type="button" id = "showVal" class="button" value="Show Values" onclick="enableValues()"/>
    <input type="button" id = "Generation" class="button2" value="A.I. Generation: 0"/>

</div>

</body>
</html>

