var redPiece;
var obstacle;

//JSON object for GameArea
var GameArea = {
    canvas : document.createElement("canvas"), //create canvas in html doc
    start : function() {
        this.canvas.width = 1550;
        this.canvas.height = 725;
        this.context = this.canvas.getContext("2d");
        this.frameNum = 0;

        // dir(document.body) = NodeList(4) [canvas, text, div#root, text]
        //document.body.appendChild(this.canvas) can also be used but the = [canvas, text, div#root, text]
        document.body.appendChild(this.canvas);
        this.interval = setInterval(updateGameArea, 15); //Calls updateGameArea every 15ms
    },
    clear: function() {
        //TODO: understand this
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    refresh: function() {
        location.reload();
    }
}

// Create the objects
function startGame() {
    GameArea.start();
    redPiece = new component(35, 35, "red", 10, 80);
    obstacle = new component(10, 300, "brown", 500, 0);
}

// Define the component properties
function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function() {
        GameArea.context.fillStyle = color;
        GameArea.context.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function(otherobj) {
        var myLeft = this.x;
        var myRight = this.x + (this.width);
        var myTop = this.y;
        var myBottom = this.y + (this.height);
        var otherLeft = otherobj.x;
        var otherRight = otherobj.x + (otherobj.width);
        var otherTop = otherobj.y;
        var otherBottom = otherobj.y + (otherobj.height);
        var crash = true;
        // Avoiding from crashing from the left, right, bottom and top
        if ((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || (myLeft > otherRight)) {
             return false;
        }
        //Doesn't work
        else if (myBottom == GameArea.canvas.height || myTop == 0) {
            return true
        }
        else {
            return crash;
        }
    }
}

function everyinterval(n) {
    if ((GameArea.frameNum / n) % 1 == 0) {return true;}
    return false;
}

obstacles = []
// Update GameArea based on conditions
function updateGameArea() {
    var x, y;

    // Check if any obstacle crashes
    for(let i = 0; i < obstacles.length; i+=1) {
        if (redPiece.crashWith(obstacles[i])) {
            GameArea.refresh();
        }
    }
    GameArea.clear();
    GameArea.frameNum += 1;

    // Generate random obstacles
    if (GameArea.frameNum == 1 || everyinterval(150)) {
        x = GameArea.canvas.width;
        minY = 50;
        maxY = 500;

        // y is always between 50-500
        y = Math.floor(Math.random() * (maxY - minY + 1) + minY);
        minGap = 50;
        maxGap = 500;

        // gap is always between 50-500
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        obstacles.push(new component(10, y, "green", x, 0));
        obstacles.push(new component(10, x - y - gap, "green", x, y + gap));
    }
    for (let i = 0; i < obstacles.length; i+=1) {
        obstacles[i].update();

        // Blue obstacles at the speed of -2 frames/15ms
        obstacles[i].x -= 2;
    }
    redPiece.newPos();
    redPiece.update();
}

// Control the redPiece with keyboard
window.addEventListener("keydown", movePiece, false);

function movePiece(key) {
    switch(key.keyCode) {
        case 37: //left
            redPiece.speedX = -1
        break;
        case 38: //down
            redPiece.speedY = -2.2
        break;
        case 39: //right
            redPiece.speedX = 1
        break;
        case 40: //up
            redPiece.speedY = 2.2
        break;
    }
}
