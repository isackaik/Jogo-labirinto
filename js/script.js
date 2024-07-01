(function () {
    var cnv = document.querySelector("canvas");
    var ctx = cnv.getContext("2d");

    var WIDTH = cnv.width, HEIGHT = cnv.height;

    var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
    var mvLeft = mvUp = mvRight = mvDown = false;

    var tileSize = 32;
    var tileSrcSize = 96;

    var img = new Image();
    img.src = "img/img.png";
    img.addEventListener("load", function () {
        requestAnimationFrame(loop, cnv);
    }, false);

    var walls = []

    var player = {
        x: tileSize + 2,
        y: tileSize + 2,
        width: 24,
        height: 32,
        speed: 3,
        srcX: 0,
        srcY: tileSrcSize,
        countAnim: 0
    };

    var maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    for (var row in maze) {
        for (var column in maze[row]) {
            var tile = maze[row][column];
            if (tile === 1) {
                var wall = {
                    x: tileSize * column,
                    y: tileSize * row,
                    width: tileSize,
                    height: tileSize
                };
                walls.push(wall);
            }
        }
    }

    function blockRectangle(player, wall) {
        var distX = (player.x + player.width / 2) - (wall.x + wall.width / 2);
        var distY = (player.y + player.height / 2) - (wall.y + wall.height / 2);

        var sumWidth = (player.width + wall.width) / 2;
        var sumHeight = (player.height + wall.height) / 2;

        if (Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight) {
            var overlapX = sumWidth - Math.abs(distX);
            var overlapY = sumHeight - Math.abs(distY);
            if (overlapX > overlapY) {
                player.y = distY > 0 ? player.y + overlapY : player.y - overlapY;
            } else {
                player.x = distX > 0 ? player.x + overlapX : player.x - overlapX;
            }
        }
    }

    window.addEventListener("keydown", keydownHandler, false);
    window.addEventListener("keyup", keyupHandler, false);

    function keydownHandler(e) {
        var key = e.keyCode;
        switch (key) {
            case LEFT:
                mvLeft = true;
                break;
            case RIGHT:
                mvRight = true;
                break;
            case UP:
                mvUp = true;
                break;
            case DOWN:
                mvDown = true;
                break;
        }
    }

    function keyupHandler(e) {
        var key = e.keyCode;
        switch (key) {
            case LEFT:
                mvLeft = false;
                break;
            case RIGHT:
                mvRight = false;
                break;
            case UP:
                mvUp = false;
                break;
            case DOWN:
                mvDown = false;
                break;
        }
    }

    function update() {
        if (mvLeft && !mvRight) {
            player.x -= player.speed;
            player.srcY = tileSrcSize + player.height * 2;
        } else if (mvRight && !mvLeft) {
            player.x += player.speed;
            player.srcY = tileSrcSize + player.height * 3;
        }
        if (mvUp && !mvDown) {
            player.y -= player.speed;
            player.srcY = tileSrcSize + player.height * 1;
        } else if (mvDown && !mvUp) {
            player.y += player.speed;
            player.srcY = tileSrcSize + player.height * 0;
        }

        if(mvLeft || mvRight || mvUp || mvDown){
            player.countAnim++;

            if(player.countAnim >= 40){
                player.countAnim = 0;
            }
            player.srcX = Math.floor(player.countAnim/5) * player.width;
        } else {
            player.srcX = 0;
            player.countAnim = 0;
        }

        for (var i in walls) {
            var wall = walls[i];
            blockRectangle(player, wall);
        }

    }

    function render() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.save();
        for (var row in maze) {
            for (var column in maze[row]) {
                var tile = maze[row][column];
                var x = column * tileSize;
                var y = row * tileSize;

                ctx.drawImage(
                    img, tile * tileSrcSize, 0, tileSize, tileSize, x, y, tileSize, tileSize
                );
            }
        }

        ctx.drawImage(
            img,
            player.srcX,
            player.srcY,
            player.width,
            player.height,
            player.x,
            player.y,
            player.width,
            player.height
        );
        ctx.restore();
    }

    function loop() {
        update();
        render();
        requestAnimationFrame(loop, cnv);
    }

}());