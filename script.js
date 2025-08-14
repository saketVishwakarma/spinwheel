const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
let players = [];
let startAngle = 0;
let spinTimeout = null;
let spinAngle = 0;
let spinTime = 0;
let spinTimeTotal = 0;

// Add Player
document.getElementById('addPlayer').addEventListener('click', () => {
    const name = document.getElementById('playerName').value.trim();
    if (name && !players.includes(name)) {
        players.push(name);
        document.getElementById('playerName').value = '';
        updatePlayerList();
    }
});

// Update Player List
function updatePlayerList() {
    document.getElementById('playerList').innerHTML = "Players: " + players.join(', ');
}

// Go to Spin Page
document.getElementById('startGame').addEventListener('click', () => {
    if (players.length === 0) {
        alert("Add at least one player!");
        return;
    }
    document.getElementById('page1').style.display = 'none';
    document.getElementById('page2').style.display = 'block';
    drawWheel();
});

// Draw Wheel with Arrow
function drawWheel() {
    if (players.length === 0) return;

    const arc = Math.PI * 2 / players.length;
    ctx.clearRect(0, 0, 400, 400);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    // Draw wheel segments
    for (let i = 0; i < players.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = i % 2 === 0 ? "#E5FFCC" : "#99FFCC";
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, angle, angle + arc, false);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "18px Arial";
        ctx.fillText(players[i], 180, 10);
        ctx.restore();
    }

    // Draw pointer arrow (3D effect)
    ctx.beginPath();
    ctx.moveTo(200, 5);  // top point
    ctx.lineTo(185, 40); // bottom left
    ctx.lineTo(215, 40); // bottom right
    ctx.closePath();

    // Arrow shading
    const gradient = ctx.createLinearGradient(185, 5, 215, 40);
    gradient.addColorStop(0, "darkred");
    gradient.addColorStop(1, "red");
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Spin Wheel
document.getElementById('spinBtn').addEventListener('click', () => {
    if (players.length === 0) {
        alert("No players left!");
        return;
    }
    spinAngle = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 4000;
    rotateWheel();
});

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    const spinAngleIncrement = spinAngle - (spinTime / spinTimeTotal) * spinAngle;
    startAngle += spinAngleIncrement * Math.PI / 180;
    drawWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    const degrees = startAngle * 180 / Math.PI + 90;
    const arc = 360 / players.length;
    const index = Math.floor((360 - (degrees % 360)) / arc);
    const selectedPlayer = players[index];
    document.getElementById('result').innerText = `🎉 Selected: ${selectedPlayer}`;

    // 🎊 Confetti (fixed intensity)
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Remove player
    players.splice(index, 1);

    if (players.length > 0) {
        drawWheel();
    } else {
        // Game over
        ctx.clearRect(0, 0, 400, 400);
        document.getElementById('result').innerText = "🏆 All players selected!";
        document.getElementById('spinBtn').style.display = 'none';

        // Restart button
        const restartBtn = document.createElement('button');
        restartBtn.className = 'btn start-btn';
        restartBtn.innerText = '🔄 Restart Game';
        restartBtn.onclick = restartGame;
        document.getElementById('page2').appendChild(restartBtn);
    }
}

// Restart Game
function restartGame() {
    players = [];
    document.getElementById('playerName').value = '';
    document.getElementById('playerList').innerText = '';
    document.getElementById('spinBtn').style.display = 'inline-block';
    document.getElementById('result').innerText = '';

    // Go back to page 1
    document.getElementById('page1').style.display = 'block';
    document.getElementById('page2').style.display = 'none';

    // Remove Restart button
    const restartBtn = document.querySelector('#page2 .start-btn');
    if (restartBtn) restartBtn.remove();
}
