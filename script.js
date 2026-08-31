SCRIPT.JS

/* =====================================================
   PAGE CONTROL
===================================================== */
const pages = {
    intro: document.getElementById("intro"),
    game1: document.getElementById("game1"),
    game2: document.getElementById("game2"),
    game3: document.getElementById("game3"),
    questions: document.getElementById("questions"),
    letter: document.getElementById("letter")
};
function showPage(page) {
    Object.values(pages).forEach(item => {
        item.classList.remove("active");
    });
    page.classList.add("active");
}
/* =====================================================
   START
===================================================== */
function startExperience() {
    showPage(pages.game1);
    startHeartGame();
}
/* =====================================================
   GAME 1
   BẮT ĐỦ 8 TRÁI TIM
===================================================== */
const TOTAL_HEARTS = 8;
let heartScore = 0;
function startHeartGame() {
    heartScore = 0;
    document.getElementById("heartScore").textContent =
        "0 / 8";
    const area =
        document.getElementById("heartArea");
    area.innerHTML = "";
    createHeart();
}
function createHeart() {
    const area =
        document.getElementById("heartArea");
    const heart =
        document.createElement("div");
    heart.className = "heart";
    const maxX =
        area.clientWidth - 40;
    const maxY =
        area.clientHeight - 40;
    heart.style.left =
        Math.random() * maxX + "px";
    heart.style.top =
        Math.random() * maxY + "px";
    heart.addEventListener("click", () => {
        heartScore++;
        document.getElementById("heartScore")
            .textContent =
            heartScore + " / 8";
        heart.remove();
        if (heartScore >= TOTAL_HEARTS) {
            setTimeout(() => {
                showPage(pages.game2);
                startAvoidGame();
            }, 450);
        }
        else {
            createHeart();
        }
    });
    area.appendChild(heart);
}
/* =====================================================
   GAME 2
   NÉ ĐỦ 8 VẬT CẢN
===================================================== */
const avoidCanvas =
    document.getElementById("avoidCanvas");
const avoidCtx =
    avoidCanvas.getContext("2d");
let avoidGameRunning = false;
let avoidPlayer;
let avoidObstacle = null;
let avoidCount = 0;
let avoidObstacleTimer = 0;
let avoidAnimation;
let leftPressed = false;
let rightPressed = false;
function resizeAvoidCanvas() {
    const rect =
        avoidCanvas.getBoundingClientRect();
    avoidCanvas.width =
        rect.width;
    avoidCanvas.height =
        rect.height;
}
/* ================= START ================= */
function startAvoidGame() {
    resizeAvoidCanvas();
    avoidCount = 0;
    avoidObstacle = null;
    avoidObstacleTimer = 0;
    avoidGameRunning = true;
    document.getElementById("avoidScore")
        .textContent = "0 / 8";
    document.getElementById("retryMessage")
        .classList.remove("show");
    avoidPlayer = {
        x:
            avoidCanvas.width / 2 - 20,
        y:
            avoidCanvas.height - 55,
        width: 40,
        height: 40,
        speed: 6
    };
    cancelAnimationFrame(avoidAnimation);
    avoidAnimation =
        requestAnimationFrame(avoidLoop);
}
/* ================= DRAW PLAYER ================= */
function drawAvoidPlayer() {
    avoidCtx.fillStyle =
        "#213b4a";
    avoidCtx.fillRect(
        avoidPlayer.x,
        avoidPlayer.y,
        avoidPlayer.width,
        avoidPlayer.height
    );
}
/* ================= CREATE OBSTACLE ================= */
function createAvoidObstacle() {
    const size = 32;
    avoidObstacle = {
        x:
            Math.random() *
            (avoidCanvas.width - size),
        y: -size,
        width: size,
        height: size,
        speed: 3.5
    };
}
/* ================= DRAW OBSTACLE ================= */
function drawAvoidObstacle() {
    if (!avoidObstacle) return;
    avoidCtx.fillStyle =
        "#8eafbd";
    avoidCtx.fillRect(
        avoidObstacle.x,
        avoidObstacle.y,
        avoidObstacle.width,
        avoidObstacle.height
    );
}
/* ================= COLLISION ================= */
function checkCollision(a, b) {
    return (
        a.x <
        b.x + b.width &&
        a.x + a.width >
        b.x &&
        a.y <
        b.y + b.height &&
        a.y + a.height >
        b.y
    );
}
/* ================= LOOP ================= */
function avoidLoop() {
    if (!avoidGameRunning) return;
    avoidCtx.clearRect(
        0,
        0,
        avoidCanvas.width,
        avoidCanvas.height
    );
    /* PLAYER */
    if (leftPressed) {
        avoidPlayer.x -=
            avoidPlayer.speed;
    }
    if (rightPressed) {
        avoidPlayer.x +=
            avoidPlayer.speed;
    }
    /* LIMIT */
    if (avoidPlayer.x < 0) {
        avoidPlayer.x = 0;
    }
    if (
        avoidPlayer.x +
        avoidPlayer.width >
        avoidCanvas.width
    ) {
        avoidPlayer.x =
            avoidCanvas.width -
            avoidPlayer.width;
    }
    /* CREATE */
    if (!avoidObstacle) {
        avoidObstacleTimer++;
        if (avoidObstacleTimer > 30) {
            createAvoidObstacle();
            avoidObstacleTimer = 0;
        }
    }
    /* MOVE */
    if (avoidObstacle) {
        avoidObstacle.y +=
            avoidObstacle.speed;
        /* COLLISION */
        if (
            checkCollision(
                avoidPlayer,
                avoidObstacle
            )
        ) {
            loseAvoidGame();
            return;
        }
        /* SUCCESSFUL DODGE */
        if (
            avoidObstacle.y >
            avoidCanvas.height
        ) {
            avoidCount++;
            document.getElementById("avoidScore")
                .textContent =
                avoidCount + " / 8";
            avoidObstacle = null;
            if (avoidCount >= 8) {
                avoidGameRunning = false;
                setTimeout(() => {
                    showPage(pages.game3);
                    startBallGame();
                }, 500);
                return;
            }
        }
    }
    drawAvoidPlayer();
    drawAvoidObstacle();
    avoidAnimation =
        requestAnimationFrame(avoidLoop);
}
/* ================= LOSE ================= */
function loseAvoidGame() {
    avoidGameRunning = false;
    cancelAnimationFrame(avoidAnimation);
    document.getElementById("retryMessage")
        .classList.add("show");
}
/* ================= RETRY ================= */
function restartAvoidGame() {
    startAvoidGame();
}
/* =====================================================
   CONTROLS
===================================================== */
document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
        leftPressed = true;
    }
    if (event.key === "ArrowRight") {
        rightPressed = true;
    }
});
document.addEventListener("keyup", event => {
    if (event.key === "ArrowLeft") {
        leftPressed = false;
    }
    if (event.key === "ArrowRight") {
        rightPressed = false;
    }
});
function setupControl(button, direction) {
    button.addEventListener(
        "touchstart",
        event => {
            event.preventDefault();
            if (direction === "left") {
                leftPressed = true;
            } else {
                rightPressed = true;
            }
        },
        { passive: false }
    );
    button.addEventListener(
        "touchend",
        event => {
            event.preventDefault();
            if (direction === "left") {
                leftPressed = false;
            } else {
                rightPressed = false;
            }
        },
        { passive: false }
    );
    button.addEventListener(
        "mousedown",
        () => {
            if (direction === "left") {
                leftPressed = true;
            } else {
                rightPressed = true;
            }
        }
    );
    button.addEventListener(
        "mouseup",
        () => {
            if (direction === "left") {
                leftPressed = false;
            } else {
                rightPressed = false;
            }
        }
    );
}
setupControl(
    document.getElementById("leftButton"),
    "left"
);
setupControl(
    document.getElementById("rightButton"),
    "right"
);
/* =====================================================
   GAME 3
   ĐẬP BÓNG
===================================================== */
const ballCanvas =
    document.getElementById("ballCanvas");
const ballCtx =
    ballCanvas.getContext("2d");
let balls = [];
let ballsHit = 0;
const TOTAL_BALLS = 12;
let ballGameRunning = false;
function resizeBallCanvas() {
    const rect =
        ballCanvas.getBoundingClientRect();
    ballCanvas.width =
        rect.width;
    ballCanvas.height =
        rect.height;
}
/* ================= START ================= */
function startBallGame() {
    resizeBallCanvas();
    ballsHit = 0;
    balls = [];
    ballGameRunning = true;
    document.getElementById("ballScore")
        .textContent = "0 / 12";
    for (
        let i = 0;
        i < TOTAL_BALLS;
        i++
    ) {
        createBall();
    }
    drawBalls();
}
/* ================= CREATE BALL ================= */
function createBall() {
    const radius = 20;
    balls.push({
        x:
            radius +
            Math.random() *
            (ballCanvas.width -
             radius * 2),
        y:
            radius +
            Math.random() *
            (ballCanvas.height -
             radius * 2),
        radius: radius
    });
}
/* ================= DRAW ================= */
function drawBalls() {
    if (!ballGameRunning) return;
    ballCtx.clearRect(
        0,
        0,
        ballCanvas.width,
        ballCanvas.height
    );
    ballCtx.fillStyle =
        "#213b4a";
    balls.forEach(ball => {
        ballCtx.beginPath();
        ballCtx.arc(
            ball.x,
            ball.y,
            ball.radius,
            0,
            Math.PI * 2
        );
        ballCtx.fill();
    });
}
/* ================= HIT BALL ================= */
function hitBall(x, y) {
    if (!ballGameRunning) return;
    for (
        let i = balls.length - 1;
        i >= 0;
        i--
    ) {
        const ball = balls[i];
        const distance =
            Math.sqrt(
                Math.pow(
                    x - ball.x,
                    2
                ) +
                Math.pow(
                    y - ball.y,
                    2
                )
            );
        if (distance <= ball.radius) {
            balls.splice(i, 1);
            ballsHit++;
            document.getElementById("ballScore")
                .textContent =
                ballsHit + " / 12";
            drawBalls();
            if (
                ballsHit >= TOTAL_BALLS
            ) {
                ballGameRunning = false;
                setTimeout(() => {
                    showPage(
                        pages.questions
                    );
                }, 500);
            }
            return;
        }
    }
}
/* ================= TOUCH ================= */
ballCanvas.addEventListener(
    "touchstart",
    event => {
        event.preventDefault();
        const rect =
            ballCanvas.getBoundingClientRect();
        const touch =
            event.touches[0];
        const x =
            touch.clientX -
            rect.left;
        const y =
            touch.clientY -
            rect.top;
        hitBall(x, y);
    },
    { passive: false }
);
/* ================= MOUSE ================= */
ballCanvas.addEventListener(
    "click",
    event => {
        const rect =
            ballCanvas.getBoundingClientRect();
        const x =
            event.clientX -
            rect.left;
        const y =
            event.clientY -
            rect.top;
        hitBall(x, y);
    }
);
/* =====================================================
   QUESTIONS
===================================================== */
function showLetter() {
    showPage(pages.letter);
}
/* =====================================================
   RESIZE
===================================================== */
window.addEventListener(
    "resize",
    () => {
        if (
            pages.game2.classList.contains("active")
        ) {
            resizeAvoidCanvas();
        }
        if (
            pages.game3.classList.contains("active")
        ) {
            resizeBallCanvas();
            drawBalls();
        }
    }
);
