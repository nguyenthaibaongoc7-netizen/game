/* =====================================================
   CHUYỂN TRANG
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
    Object.values(pages).forEach(function(item) {
        item.classList.remove("active");
    });

    page.classList.add("active");
}


/* =====================================================
   BẮT ĐẦU
===================================================== */

function startExperience() {
    showPage(pages.game1);
    startHeartGame();
}


/* =====================================================
   GAME 1
   BẮT 8 TRÁI TIM
===================================================== */

const TOTAL_HEARTS = 8;

let heartScore = 0;

function startHeartGame() {

    heartScore = 0;

    document.getElementById("heartScore").textContent = "0 / 8";

    const area = document.getElementById("heartArea");

    area.innerHTML = "";

    createHeart();
}


function createHeart() {

    const area = document.getElementById("heartArea");

    const heart = document.createElement("div");

    heart.className = "heart";

    const maxX = Math.max(10, area.clientWidth - 45);
    const maxY = Math.max(10, area.clientHeight - 45);

    heart.style.left =
        Math.random() * maxX + "px";

    heart.style.top =
        Math.random() * maxY + "px";


    heart.addEventListener("click", function() {

        heartScore++;

        document.getElementById("heartScore").textContent =
            heartScore + " / 8";

        heart.remove();


        if (heartScore >= TOTAL_HEARTS) {

            setTimeout(function() {

                showPage(pages.game2);

                startAvoidGame();

            }, 500);

        } else {

            createHeart();

        }

    });


    area.appendChild(heart);
}


/* =====================================================
   GAME 2
   NÉ 8 VẬT CẢN
===================================================== */

const avoidCanvas =
    document.getElementById("avoidCanvas");

const avoidCtx =
    avoidCanvas.getContext("2d");


let avoidPlayer;

let avoidObstacle;

let avoidCount = 0;

let avoidGameRunning = false;

let avoidAnimation;

let avoidSpawnTimer = 0;

const TOTAL_OBSTACLES = 8;


/* =====================================================
   RESIZE CANVAS
===================================================== */

function resizeAvoidCanvas() {

    const rect =
        avoidCanvas.getBoundingClientRect();

    avoidCanvas.width = rect.width;
    avoidCanvas.height = rect.height;

}


/* =====================================================
   BẮT ĐẦU GAME 2
===================================================== */

function startAvoidGame() {

    resizeAvoidCanvas();

    avoidCount = 0;

    avoidObstacle = null;

    avoidSpawnTimer = 0;

    avoidGameRunning = true;


    document.getElementById("avoidScore").textContent =
        "0 / 8";


    document
        .getElementById("retryMessage")
        .classList.remove("show");


    avoidPlayer = {

        x:
            avoidCanvas.width / 2 - 20,

        y:
            avoidCanvas.height - 60,

        width: 40,

        height: 40,

        speed: 6

    };


    cancelAnimationFrame(avoidAnimation);

    avoidAnimation =
        requestAnimationFrame(avoidLoop);

}


/* =====================================================
   VẼ NGƯỜI CHƠI
===================================================== */

function drawAvoidPlayer() {

    avoidCtx.fillStyle = "#213b4a";

    avoidCtx.fillRect(
        avoidPlayer.x,
        avoidPlayer.y,
        avoidPlayer.width,
        avoidPlayer.height
    );

}


/* =====================================================
   TẠO VẬT CẢN
===================================================== */

function createAvoidObstacle() {

    const size = 34;

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


/* =====================================================
   VẼ VẬT CẢN
===================================================== */

function drawAvoidObstacle() {

    if (!avoidObstacle) {
        return;
    }

    avoidCtx.fillStyle = "#8eafbd";

    avoidCtx.fillRect(
        avoidObstacle.x,
        avoidObstacle.y,
        avoidObstacle.width,
        avoidObstacle.height
    );

}


/* =====================================================
   KIỂM TRA VA CHẠM
===================================================== */

function checkCollision(player, obstacle) {

    return (

        player.x <
        obstacle.x + obstacle.width

        &&

        player.x + player.width >
        obstacle.x

        &&

        player.y <
        obstacle.y + obstacle.height

        &&

        player.y + player.height >
        obstacle.y

    );

}


/* =====================================================
   GAME LOOP
===================================================== */

function avoidLoop() {

    if (!avoidGameRunning) {
        return;
    }


    avoidCtx.clearRect(
        0,
        0,
        avoidCanvas.width,
        avoidCanvas.height
    );


    /* DI CHUYỂN */

    if (leftPressed) {

        avoidPlayer.x -=
            avoidPlayer.speed;

    }

    if (rightPressed) {

        avoidPlayer.x +=
            avoidPlayer.speed;

    }


    /* GIỚI HẠN */

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


    /* TẠO VẬT CẢN */

    if (!avoidObstacle) {

        avoidSpawnTimer++;

        if (avoidSpawnTimer >= 35) {

            createAvoidObstacle();

            avoidSpawnTimer = 0;

        }

    }


    /* DI CHUYỂN VẬT CẢN */

    if (avoidObstacle) {

        avoidObstacle.y +=
            avoidObstacle.speed;


        /* VA CHẠM */

        if (
            checkCollision(
                avoidPlayer,
                avoidObstacle
            )
        ) {

            loseAvoidGame();

            return;

        }


        /* NÉ THÀNH CÔNG */

        if (
            avoidObstacle.y >
            avoidCanvas.height
        ) {

            avoidCount++;

            document
                .getElementById("avoidScore")
                .textContent =
                avoidCount + " / 8";


            avoidObstacle = null;


            /* ĐỦ 8 */

            if (avoidCount >= TOTAL_OBSTACLES) {

                avoidGameRunning = false;

                cancelAnimationFrame(
                    avoidAnimation
                );


                setTimeout(function() {

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


/* =====================================================
   THUA GAME 2
===================================================== */

function loseAvoidGame() {

    avoidGameRunning = false;

    cancelAnimationFrame(
        avoidAnimation
    );

    document
        .getElementById("retryMessage")
        .classList.add("show");

}


/* =====================================================
   CHƠI LẠI GAME 2
===================================================== */

function restartAvoidGame() {

    startAvoidGame();

}


/* =====================================================
   ĐIỀU KHIỂN GAME 2
===================================================== */

let leftPressed = false;

let rightPressed = false;


/* BÀN PHÍM */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "ArrowLeft") {

            leftPressed = true;

        }

        if (event.key === "ArrowRight") {

            rightPressed = true;

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        if (event.key === "ArrowLeft") {

            leftPressed = false;

        }

        if (event.key === "ArrowRight") {

            rightPressed = false;

        }

    }
);


/* NÚT TRÁI */

function setupHoldButton(
    button,
    direction
) {

    function press(event) {

        if (event) {
            event.preventDefault();
        }

        if (direction === "left") {

            leftPressed = true;

        } else {

            rightPressed = true;

        }

    }


    function release(event) {

        if (event) {
            event.preventDefault();
        }

        if (direction === "left") {

            leftPressed = false;

        } else {

            rightPressed = false;

        }

    }


    button.addEventListener(
        "touchstart",
        press,
        { passive: false }
    );

    button.addEventListener(
        "touchend",
        release,
        { passive: false }
    );

    button.addEventListener(
        "touchcancel",
        release,
        { passive: false }
    );


    button.addEventListener(
        "mousedown",
        press
    );

    button.addEventListener(
        "mouseup",
        release
    );

    button.addEventListener(
        "mouseleave",
        release
    );

}


setupHoldButton(
    document.getElementById("leftButton"),
    "left"
);

setupHoldButton(
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


const TOTAL_BALLS = 12;

let balls = [];

let ballsHit = 0;

let ballGameRunning = false;


/* =====================================================
   RESIZE
===================================================== */

function resizeBallCanvas() {

    const rect =
        ballCanvas.getBoundingClientRect();

    ballCanvas.width = rect.width;
    ballCanvas.height = rect.height;

}


/* =====================================================
   START GAME 3
===================================================== */

function startBallGame() {

    resizeBallCanvas();

    balls = [];

    ballsHit = 0;

    ballGameRunning = true;


    document.getElementById("ballScore").textContent =
        "0 / 12";


    for (
        let i = 0;
        i < TOTAL_BALLS;
        i++
    ) {

        createBall();

    }


    drawBalls();

}


/* =====================================================
   TẠO BÓNG
===================================================== */

function createBall() {

    const radius = 22;

    let newBall;

    let safe = false;


    while (!safe) {

        newBall = {

            x:
                radius +
                Math.random() *
                (
                    ballCanvas.width -
                    radius * 2
                ),

            y:
                radius +
                Math.random() *
                (
                    ballCanvas.height -
                    radius * 2
                ),

            radius: radius

        };


        safe = true;


        for (const existingBall of balls) {

            const distance =
                Math.sqrt(

                    Math.pow(
                        newBall.x -
                        existingBall.x,
                        2
                    )

                    +

                    Math.pow(
                        newBall.y -
                        existingBall.y,
                        2
                    )

                );


            if (
                distance <
                radius * 2.5
            ) {

                safe = false;

                break;

            }

        }

    }


    balls.push(newBall);

}


/* =====================================================
   VẼ BÓNG
===================================================== */

function drawBalls() {

    if (!ballGameRunning) {
        return;
    }


    ballCtx.clearRect(
        0,
        0,
        ballCanvas.width,
        ballCanvas.height
    );


    ballCtx.fillStyle = "#213b4a";


    balls.forEach(function(ball) {

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


/* =====================================================
   ĐẬP BÓNG
===================================================== */

function hitBall(x, y) {

    if (!ballGameRunning) {
        return;
    }


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
                )

                +

                Math.pow(
                    y - ball.y,
                    2
                )

            );


        if (
            distance <=
            ball.radius
        ) {

            balls.splice(i, 1);

            ballsHit++;


            document
                .getElementById("ballScore")
                .textContent =
                ballsHit + " / 12";


            drawBalls();


            if (
                ballsHit >=
                TOTAL_BALLS
            ) {

                ballGameRunning = false;


                setTimeout(function() {

                    showPage(
                        pages.questions
                    );

                }, 500);

            }


            return;

        }

    }

}


/* =====================================================
   TOUCH GAME 3
===================================================== */

ballCanvas.addEventListener(
    "touchstart",
    function(event) {

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


/* =====================================================
   CLICK GAME 3
===================================================== */

ballCanvas.addEventListener(
    "click",
    function(event) {

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
   CÂU HỎI → THƯ
===================================================== */

function showLetter() {

    showPage(pages.letter);

}


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
    "resize",
    function() {

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
