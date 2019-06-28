{
    'use strict'

    class DoubleLinkedList {
        constructor() {
            this.first = null;
            this.last = null;
        }

        push(value) {
            let pushed = new DoubleLinkedListNode(value);

            if (this.first === null && this.last === null) {
                this.first = pushed;
                this.last = pushed;
                return pushed;
            }

            if (this.first === this.last) {
                pushed.prev = this.first;
                this.first.next = pushed;
                this.last = pushed;
                return pushed;
            }

            this.last.next = pushed;
            pushed.prev = this.last;
            this.last = pushed;
            return pushed;
        }

        remove(node) {
            if (this.first === null && this.last === null) {
                return;
            }

            if (this.first === node && this.last === node) {
                this.first = null;
                this.last = null;
                return;
            }

            if (this.first === node) {
                this.first = node.next;
                this.first.prev = null;
                node.next = null;
                return
            }

            if (this.last === node) {
                if (this.first === node.prev) {
                    this.first.next = null;
                    this.last = this.first
                } else {
                    this.last = node.prev;
                    this.last.next = null;
                }
                node.prev = null;
                return;
            }

            let nodePrev = node.prev;
            let nodeNext = node.next;
            nodePrev.next = nodeNext;
            nodeNext.prev = nodePrev;
            node.prev = null;
            node.next = null;
        }
    }

    class DoubleLinkedListNode {
        constructor(value) {
            this.prev = null;
            this.next = null;
            this.value = value;
        }
    }

    class Game {
        constructor(_settings) {
            this.container = new Container();
            this.container.set('game', this);
            this.FPS = _settings.fps;
            this.gameOver = false;
            this.loop = this.loop.bind(this);
            this.setup(_settings);
        }

        setup(_settings) {
            this.container.set('maze', _settings.maze);
            this.container.set('canvas', new Canvas(this.container, _settings.canvasWidth, _settings.canvasHeight, _settings.canvasBackgroundColor));
            this.container.set('grid', new Grid(this.container, _settings.tileSize));
            this.container.get('grid').setup();
            this.container.set('pacman', new Pacman(this.container, _settings.pacmanX, _settings.pacmanY));
            this.container.set('blinky', new Blinky(this.container, _settings.blinkyX, _settings.blinkyY));
        }

        loop() {

            
            
            let intFn = function() {
                // if(!this.gameOver)
                    this.action();
            }.bind(this);

            return setInterval(intFn, 1000 / this.FPS);

            // intFn = intFn.bind(this);

            // let loopFn;

            // return loopFn = setInterval(function () {
            //     if (!this.gameOver)
            //         this.action();
            //     else
            //         clearInterval(loopFn);
            // }.bind(this), 1000 / this.FPS);

            // return loopFn;
            // let FPS = this.FPS;

            // return new Promise(function (resolve, reject) {
                
            //     let loopFn = setInterval(function () {
            //         if (!this.gameOver) {
            //             this.action();
            //         } else {
            //             clearInterval(loopFn);
            //             resolve();
            //         }
            //     }.bind(this), 1000 / FPS);
            // }).bind(this);
        }

        action() {
            let pacman = this.container.get('pacman');
            pacman.checkCollision();
            let canvas = this.container.get('canvas');
            canvas.eraseCharacters();
            //pacman move
            this.container.get('blinky').move();
            canvas.drawCharacters();
        }

        run() {
            let canvas = this.container.get('canvas');
            canvas.draw();
            return this.loop();
            // while(!this.gameOver) {
            //     if (this.gameOver) {
            //         clearInterval(loop);
            //         break;
            //     }
            // }
        }
    }

    class Canvas {
        constructor(_container, _width, _height, _backgroundColor) {
            this.container = _container;
            this.canvas = document.getElementById('canvas');
            this.ctx = this.canvas.getContext("2d");
            this.width = _width;
            this.height = _height;
            this.canvas.width = _width;
            this.canvas.height = _height;
            this.backgroundColor = _backgroundColor;
            // this.eraseSquare = this.eraseSquare.bind(this);
            // this.drawSquare = this.drawSquare.bind(this);
            // this.draw = this.draw.bind(this);
        }

        drawSquare(x, y, length, color) {
            console.log("draw");
            let ctx = this.ctx;
            ctx.beginPath();
            ctx.moveTo(x, y); // upper left
            ctx.lineTo(x + length, y); // uppper right
            ctx.lineTo(x + length, y + length); // bottom right
            ctx.lineTo(x, y + length); // bottom left 
            ctx.lineTo(x, y); // upper left  
            ctx.fillStyle = color;
            ctx.fill();
        }

        drawTileNPCs(row, col, pc) {
            let grid = this.container.get('grid');
            this.drawSquare(col * grid.tileSize, row * grid.tileSize, grid.tileSize, this.backgroundColor);
            let list = grid.grid[row][col];
            let node = list.first;

            while (node !== null) {
                let obj = node.value;
                node = node.next;
                if (pc === obj)
                    continue;
                obj.draw();
            }
        }

        clearCanvas() {
            let ctx = this.ctx;
            ctx.rect(0, 0, this.width, this.height);
            ctx.fillStyle = this.backgroundColor;
            ctx.fill();
        }

        eraseSquare(x, y, length) {
            let ctx = this.ctx;
            ctx.rect(x, y, length, length);
            ctx.fillStyle = this.backgroundColor;
            ctx.fill();
        }

        eraseCharacters() {
            this.container.get('pacman').erase();
            this.container.get('blinky').erase();
        }

        drawCharacters() {
            this.container.get('pacman').draw();
            this.container.get('blinky').draw();
        }

        draw() {
            this.clearCanvas();
            let grid = this.container.get('grid');
            let gridMatrix = grid.grid;
            for (let i = 0; i < grid.numberRows; i++) {
                for (let j = 0; j < grid.numberCols; j++) {
                    let list = gridMatrix[i][j];
                    let node = list.first;
                    while(node) {
                        node.value.draw();
                        node = node.next;
                    }
                }
            }
        }
    }

    class Container {
        constructor() {
            this.items = {};
        }

        get(name) {
            return this.items[name];
        }

        set(name, value) {
            this.items[name] = value;
        }
    }

    class Grid {
        constructor(_container, _tileSize) {
            this.container = _container;
            let maze = _container.get('maze');
            this.numberRows = maze.length;
            this.numberCols = maze[0].length;
            this.tileSize = _tileSize;
            this.width = this.numberCols * _tileSize;
            this.height = this.numberRows * _tileSize;
            this.grid;
            // this.setup();
        }

        setup() {
            this.grid = Array(this.numberRows);

            for (let i = 0; i < this.numberRows; i++) {
                this.grid[i] = Array(this.numberCols);
            }

            let maze = this.container.get('maze');
            let size = this.tileSize;

            for (let i = 0; i < this.numberRows; i++) {
                for (let j = 0; j < this.numberCols; j++) {
                    this.grid[i][j] = new DoubleLinkedList();
                    if (maze[i][j] === 1)
                        this.grid[i][j].push(new Wall(this.container, j * size, i * size));
                }
            }

            console.log(this.grid);
        }

        findTile(x, y) {
            if (x > this.width
                || y > this.height
                || x < 0
                || y < 0)
            {
                return null;
            }
            row = Math.floor(y / this.tileSize);
            col = Math.floor(x / this.tileSize);
            return this.grid[row][col];
        }

        getTileTopLeftX(col) {
            let size = this.tileSize;
            return col * size;
        }

        getTileTopLeftY(row) {
            let size = this.tileSize;
            return row * size;
        }

        getTileCenterX(col) {
            let size = this.tileSize
            return col * size + Math.floor(size / 2);
        }

        getTileCenterY(row) {
            let size = this.tileSize
            return row * size + Math.floor(size / 2);
        }

        getTile(row, col) {
            return this.grid[row][col];
        }

        setTile(obj) {
            let curTileList = obj.tileList;
            let row = Math.floor(obj.centerY / this.tileSize);
            let col = Math.floor(obj.centerX / this.tileSize);
            let list = this.grid[row][col];

            if (list != curTileList) {
                let curTileNode = obj.tileNode;
                if (curTileNode)
                    curTileList.remove(curTileNode);
                obj.tileList = list;
                obj.tileNode = list.push(obj);
                obj.tileRow = row;
                obj.tileCol = col;
            }
        }

    }

    class GameObject {
        constructor(_container, _x, _y, _width, _height) {
            this.container = _container;
            this.grid = _container.get('grid');
            this.x = _x;
            this.y = _y;
            this.centerX = _x + Math.floor(_width / 2);
            this.centerY = _y + Math.floor(_height / 2);
            this.width = _width;
            this.height = _height;
            this.tileList = null;
            this.tileNode = null;
            this.tileRow;
            this.tileCol;
            //this.grid.setTile(this);
        }

    }

    class Wall extends GameObject {
        constructor(_container, _x, _y) {
            let width = 10;
            let height = 10;
            super(_container, _x, _y, width, height);
            this.color = 'blue';
            this.draw = this.draw.bind(this);
        }

        draw() {
            this.container.get('canvas').drawSquare(this.x, this.y, this.width, this.color);
        }
    }

    class Character extends GameObject {
        constructor(_container, _x, _y, _width, _height, _speed, _direction) {
            super(_container, _x, _y, _width, _height);
            this.mazeMap = _container.get('maze');
            this.speed = _speed;
            this.directionsEnum = {RIGHT: 0, DOWN: 1, LEFT: 2, UP: 3};
            this.direction = this.directionsEnum[_direction];
            this.directionMatrix = [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}];
            this.grid.setTile(this);
        }

        move() {
            let dx = this.speed * this.directionMatrix[this.direction].x;
            let dy = this.speed * this.directionMatrix[this.direction].y;
            this.x += dx;
            this.centerX += dx;
            this.y += dy;
            this.centerY += dy;
            this.grid.setTile(this);
        }

        erase() {
            console.log("erase");
            let canvas = this.container.get('canvas');
            let grid = this.container.get('grid');
            canvas.drawTileNPCs(this.tileRow, this.tileCol, this);
            // canvas.eraseSquare(this.x, this.y, this.width);

            let centerX = this.centerX;
            let centerY = this.centerY;
            let tileCenterX = grid.getTileCenterX(this.tileCol);
            let tileCenterY = grid.getTileCenterY(this.tileRow);

            if (tileCenterX < centerX) {
                canvas.drawTileNPCs(this.tileRow, this.tileCol + 1, null);

            } else if (tileCenterX > centerX) {
                canvas.drawTileNPCs(this.tileRow, this.tileCol - 1, null);
            }    
            else if (tileCenterY < centerY)
                canvas.drawTileNPCs(this.tileRow + 1, this.tileCol, null);
            else if (tileCenterY > centerY)
                canvas.drawTileNPCs(this.tileRow - 1, this.tileCol, null);

        }


    }


    class Pacman extends Character {
        constructor(_container, _x, _y) {
            let speed = 4;
            let direction = 'LEFT';
            let width = 8;
            let height = 8;

            super(_container, _x, _y, width, height, speed, direction);

            this.color = 'yellow';
            this.statesEnum = {DEAD: 0, ALIVE: 1};
            this.state = this.statesEnum.ALIVE;
        }

        checkCollision() {
            let node = this.tileList.first;
            let alive = this.statesEnum.ALIVE;
            let obj;

            while(node !== null && this.state == alive) {
                obj = node.value;
                node = node.next;
                if (this === obj)
                    continue;
                obj.collision();
            }
        }

        calcMove() {
            let dir;

            let pressed = 0;

            if (FLAGS.LEFT) {
                dir = 'LEFT';
                pressed++;
            }

            if (FLAGS.RIGHT) {
                dir = 'RIGHT';
                pressed++;
            }

            if (FLAGS.DOWN) {
                dir = 'DOWN';
                pressed++;
            }

            if (FLAGS.UP){
                dir = 'UP';
                pressed++;
            }

            if (pressed)
                return this.directionsEnum[dir];

            return this.direction;
        }

        die() {
            this.state = this.statesEnum.DEAD;
        }

        draw() {
            this.container.get('canvas').drawSquare(this.x, this.y, this.width, this.color);
        }
    }

    class Ghost extends Character {
        constructor(_container, _x, _y, _direction, _pursuitState, _color) {
            let width = 8;
            let height = 8;
            let speed = 2;

            super(_container, _x, _y, width, height, speed, _direction);

            this.color = _color;
            this.pacman = this.container.get('pacman');
            this.basicStatesEnum = {NORMAL: 0, SCARED: 1, EYES: 2};
            this.pursuitStatesEnum = {SCATTER: 0, CHASE: 1, PEN: 2};
            this.basicState = this.basicStatesEnum.NORMAL;
            this.pursuitState = this.pursuitStatesEnum[_pursuitState];
            this.nextTile = {row: null, col: null, centerX: null, centerY: null};
            this.nextMove = {row: null, col: null, direction: null, centerX: null, centerY: null};
            this.getNextTile();
        }

        calcMove() {
            if (this.nextMove.row === null) {

                //this.getNextTile.call(this);
                this.getNextMove();
                // this.nextTileFlag = false;
                //return;
            }
                 
            // if (this.centerX == this.nextTile.centerX &&
            //     this.centerY == this.nextTile.centerY)
            //     this.direction = this.nextMove.direction;
                 

            // if (this.tileRow == this.nextTile.row 
            //     && this.tileCol == this.nextTile.col
            //     && !this.nextTileFlag) {
            //     // if centers equal then start moving
            //     if (this.centerX == this.nextTile.centerX
            //         && this.centerY == this.nextTile.centerY)
                    
            //         this.direction = this.nextMove.direction;
            //         this.nextTileFlag = true;
                
            // }
        }

        getNextTile() {
            this.nextTile.row = this.tileRow + this.directionMatrix[this.direction].y;
            this.nextTile.col = this.tileCol + this.directionMatrix[this.direction].x;
            this.nextTile.centerX = this.grid.getTileCenterX(this.nextTile.col);
            this.nextTile.centerY = this.grid.getTileCenterY(this.nextTile.row);
        }

        getNextMove() {
            let target = this.targetFunc();
            let dist = null;
            let dir = 'RIGHT';
            for (let i = 0; i <= 3; i++) {
                if (i == 1)
                    dir = 'DOWN';
                else if (i == 2)
                    dir = 'LEFT';
                else if (i == 3)
                    dir = 'UP';
                let row = this.nextTile.row + this.directionMatrix[this.directionsEnum[dir]].y;
                let col = this.nextTile.col + this.directionMatrix[this.directionsEnum[dir]].x;
                if (row == this.tileRow && col == this.tileCol)
                    continue;
                if (this.mazeMap[row][col] != 1 && this.mazeMap[row][col] != 3) {
                    let nextDist = this.tileDistance(row, col, target);
                    if (dist === null || nextDist < dist) {
                        this.nextMove.row = row;
                        this.nextMove.col = col;
                        this.nextMove.direction = i;
                        this.nextMove.centerX = this.grid.getTileCenterX(col);
                        this.nextMove.centerY = this.grid.getTileCenterY(row);
                        dist = nextDist;
                    }
                }
            }
        }

        tileDistance(row, col, target) {
            return Math.sqrt(Math.pow(col - target.col, 2) - Math.pow(row - target.row, 2));
        }

        move() {
            this.calcMove();

            let speed = this.speed;
            let nextTile = this.nextTile;
            let dx, dy, diff;

            if (this.direction == this.directionsEnum.RIGHT) {
                if (this.centerX >= nextTile.centerX - speed) {
                    diff = nextTile.centerX - this.centerX;
                    speed -= diff
                    this.x += diff;
                    this.centerX = nextTile.centerX;
                    this.direction = this.nextMove.direction;
                }
            } else if (this.direction == this.directionsEnum.DOWN) {
                if (this.centerY >= nextTile.centerY - speed) {
                    diff =  nextTile.centerY - this.centerY;
                    speed -= diff
                    this.y += diff;
                    this.centerY = nextTile.centerY;
                    this.direction = this.nextMove.direction;
                }
            } else if (this.direction == this.directionsEnum.LEFT) {
                if (this.centerX <= nextTile.centerX + speed) {
                    diff = this.centerX - nextTile.centerX;
                    speed -= diff;
                    this.x -= diff;
                    this.centerX = nextTile.centerX;
                    this.direction = this.nextMove.direction;
                }
            } else  {
                if (this.centerY <= nextTile.centerY + speed) {
                    diff = this.centerY - nextTile.centerY;
                    speed -= diff;
                    this.y -= diff;
                    this.centerY = nextTile.centerY;
                    this.direction = this.nextMove.direction;
                }
            }

            if (speed != 0) {
                dx = speed * this.directionMatrix[this.direction].x;
                dy = speed * this.directionMatrix[this.direction].y;
                this.x += dx;
                this.centerX += dx;
                this.y += dy;
                this.centerY += dy;
            }

            if (this.speed > speed) {
                this.nextTile.col = this.nextMove.col;
                this.nextTile.row = this.nextMove.row;
                this.nextTile.centerX = this.nextMove.centerX;
                this.nextTile.centerY = this.nextMove.centerY;
                this.nextMove.row = null;
            }

            this.grid.setTile(this);
        }

        collision() {
            return;
        }

        draw() {
            this.container.get('canvas').drawSquare(this.x, this.y, this.width, this.color);
        }
    }

    class Blinky extends Ghost {
        constructor(_container, _x, _y) {
            let direction = 'LEFT';
            let pursuitState = 'SCATTER';
            let color = 'red'

            super(_container, _x, _y, direction, pursuitState, color);
        }

        targetFunc() {
            let col = this.pacman.tileCol;
            let row = this.pacman.tileRow;
            return {row: row, col: col};
        }
    }

    class Pinky extends Ghost {
        constructor(_container, _x, _y) {
            let direction = 'UP';
            let pursuitState = 'PEN';

            super(_container, _x, _y, direction, pursuitState);
        }
    }

    const MAZE = [
      // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //0
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //1
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1], //3
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1], //4
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1], //5
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //6
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1], //7
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1], //8
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1], //9
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1], //10
        [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0], //11
        [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0], //12
        [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 3, 3, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0], //13
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1], //14
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], //15
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1], //16
        [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0], //17
        [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0], //18
        [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0], //19
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1], //20
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //21
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1], //22
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1], //23
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1], //24
        [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1], //25
        [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1], //26
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1], //27
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], //28
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], //29
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //30
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //31
    ];

    console.log(MAZE);

    let FLAGS = {
        leftDown: false,
        rightDown: false,
        upDown: false,
        downDown: false,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    };

    document.addEventListener('keydown', function(event) {
        let keycode = event.keyCode;

        if (keycode == FLAGS.LEFT)
            FLAGS.leftDown = true;

        if (keycode == FLAGS.RIGHT)
            FLAGS.rightDown = true;

        if (keycode == FLAGS.UP)
            FLAGS.upDown = true;

        if (keycode == FLAGS.DOWN)
            FLAGS.downDown = true;
    });

    document.addEventListener('keyup', function (event) {
        let keycode = event.keyCode;

        if (keycode == FLAGS.LEFT)
            FLAGS.leftDown = false;

        if (keycode == FLAGS.RIGHT)
            FLAGS.rightDown = false;

        if (keycode == FLAGS.UP)
            FLAGS.upDown = false;

        if (keycode == FLAGS.DOWN)
            FLAGS.downDown = false;
    });

    const SETTINGS = {
        canvasBackgroundColor: 'black',
        canvasWidth: 280,
        canvasHeight: 320,
        fps: 30,
        keyFlags: FLAGS,
        maze: MAZE,
        tileSize: 10,
        pacmanX: 136,
        pacmanY: 231,
        blinkyX: 136,
        blinkyY: 111
    };

    // let CANVAS_WIDTH = 0;
    // let CANVAS_HEIGHT = 0;
    // let FPS = 60;
    // let TILESIZE = 10;

    // let CONTAINER = new Container()

    // CONTAINER.set('canvas', new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT));
    // CONTAINER.set('maze', MAZE);

    let GAME = new Game(SETTINGS);

    GAME.run();

}
