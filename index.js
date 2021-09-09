

var Birds = function() {

    const app = new PIXI.Application({
        width: window.innerWidth, height: window.innerHeight, backgroundAlpha: 0, resolution: window.devicePixelRatio || 1,
    });

    document.querySelector("#canvas-shell").appendChild(app.view);


    
    const container = new PIXI.ParticleContainer(),
          texture = PIXI.Texture.from("bmps/bird1.png"),
          secondTexture = PIXI.Texture.from("bmps/bird2.png"),
          birdGraphics = [];

    app.stage.addChild(container)

    app.ticker.add(() => {
        frame++;
        z.current += (z.target - z.current) / 100;
        clear();
        renderBirds();
        request();
    });

    

    let esto = this,
        config = {number: 2000},
        width,
        height,
        canvas,
        // engine,
        birds,
        frame = 0,
        speed = 1.4,
        birdLineCount = 5,
        birdLineIndex = -1,
        z = {current: 1, target: 1},
        mouse = { x: 0.5, y: 0.5, z: 0.5};

    const prepare = function() {
        canvas = document.getElementsByTagName('canvas')[0];
        // engine = canvas.getContext('2d');

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

    };

    window.addEventListener('resize', e => {
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
    })

    const request = function() {
        window.requestAnimationFrame(tick);
    };

    const solveBirdMove = function(bird) {
        ['x', 'y', 'z'].forEach(function(key) {
            if (Math.abs(bird.move[key]) > 0.003) {
                bird.move[key] *= 0.99;
            }
        });

        if (frame % bird.ownMove.t === 0) {
            bird.ownMove.x = (0.5 - Math.random()) / 3;
            bird.ownMove.y = (0.5 - Math.random()) / 3;
        }

        bird.move.x += speed * (mouse.x - bird.pos.x + bird.ownMove.x) * bird.speed;
        bird.move.y += speed * (mouse.y - bird.pos.y + bird.ownMove.y) * bird.speed;
        bird.move.z += speed * (mouse.z - bird.pos.z) * bird.speed;
    };

    const applyPath = function(pathStack) {
        // engine.moveTo(pathStack[0].x, pathStack[0].y);

        for (var i = 1; i < pathStack.length; i++) {
            // engine.lineTo(pathStack[i].x, pathStack[i].y);
        }
    };
    const deg2rad = function (degree) {
        return degree * (Math.PI / 180)
      }
    const drawBird = function(bird, i) {
        // engine.fillStyle = 'rgba(0,0,0,.3)';

        var pos = {
            x: bird.pos.x * width,
            y: bird.pos.y * height,
            z: bird.pos.z * 1.5
        };

        var size = (width + height) / 200 * pos.z * z.current;
        var atan = Math.atan2(bird.move.y * height, bird.move.x * width);

        // engine.lineWidth = 1;

        var p = function(rad, customSize) {
            return {
                x: pos.x + Math.cos(atan + rad * Math.PI * 2) * size * customSize,
                y: pos.y + Math.sin(atan + rad * Math.PI * 2) * size * customSize
            };
        };

        addLinePath(bird, p(0.5, 1.3));

        // engine.beginPath();

        birdGraphics[i].x = pos.x;
        birdGraphics[i].y = pos.y;
        birdGraphics[i].flap();
        // birdGraphics[i].rotation = deg2rad(atan)

        applyPath([
            p(0, 1.2),
            p(0.01, 0.9),
            p(0.05, 0.7),

            p(0.47, 0.9),
            p(0.45, 1.5),
            p(0.47, 1.2),
            p(0.5, 1.5),
            p(0.52, 1.2),
            p(0.55, 1.5),
            p(0.53, 0.9),

            p(-0.25, 0.5),
            p(-0.05, 0.7),
            p(-0.01, 0.9),
            p(0, 1.2)
        ]);

        // engine.fill();

        var wingWave = Math.sin(bird.wing);
        var wingAdd = wingWave * 0.1;
        var wingPositiveWave = (wingWave + 1) / 2;

        // engine.beginPath();

        //wings
        applyPath([
            p(0, 0.5),

            p(-0.15, wingPositiveWave),
            p(-0.25, -1 + 3 * wingPositiveWave),

            p(-0.4, 0.5),
            p(0, 0)
        ]);

        // engine.fill();

    };

    const addLinePath = function(bird, pos) {
        bird.lines[birdLineIndex * 2] = pos.x;
        bird.lines[birdLineIndex * 2 + 1] = pos.y;
    };

    const renderBirds = function() {
        birds.forEach(function(bird) {
            solveBirdMove(bird);
            bird.wing += 0.1 + bird.wingAdd * 0.3 * speed;
            bird.pos.x += bird.move.x;
            bird.pos.y += bird.move.y;
            bird.pos.z += bird.move.z;
        });

        birdLineIndex = (birdLineIndex + 1) % birdLineCount;

        birds.forEach(function(bird, i) {
            drawBird(bird, i);
        });
    };

    const clear = function() {
        // // engine.clearRect(0, 0, width, height);
    };



    const tick = function() {
       
    };

    const createBirds = function() {
        birds = [];

        for (var i = 0; i < config.number; i++) {
            let b = new PIXI.Sprite(texture);
            b.alpha = 0.3;
            b.wingVal = 1;
            b.flap = function () {
                if(Math.random() * 100 < 50) {
                    if (this.wingVal === 1) {
                        this.texture = secondTexture;
                        this.wingVal = 2;
                    } else {
                        this.texture = texture;
                        this.wingVal = 1;
                    }
                }
            }
            birdGraphics.push(b)
            container.addChild(b)
            birds.push({
                wing: Math.random(),
                wingAdd: Math.random(),
                speed: (0.2 + Math.random() * 0.8) / 2000,
                pos: {
                    x: 0.25 + Math.random() * 0.5,
                    y: 0.25 + Math.random() * 0.5,
                    z: Math.random()
                },
                move: {
                    x: (0.5 - Math.random()) / 100,
                    y: (0.5 - Math.random()) / 100,
                    z: 0
                },
                moveCache: {
                    x: 0,
                    y: 0
                },
                ownMove: {
                    t: 20 + Math.random() * 100 | 0,
                    x: 0,
                    y: 0
                },
                tar: {
                    x: 0.5,
                    y: 0.5
                },
                lines: new Float32Array(birdLineCount * 2)
            });
        }
    };

    var registerMouse = function() {
        setInterval(function() {
            mouse.x = Math.random();
            mouse.y = Math.random();
            z.target = 0.5 + Math.random();
        }, 1000);
    };

    this.run = function() {
        registerMouse();
        prepare();
        createBirds();
        tick();
    }
};

var b = new Birds();
b.run();
