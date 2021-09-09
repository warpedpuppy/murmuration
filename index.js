const app = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight, backgroundAlpha: 0, resolution: window.devicePixelRatio || 1,
});
document.querySelector("#canvas-shell").appendChild(app.view);

const container = new PIXI.ParticleContainer(),
      texture = PIXI.Texture.from("bmps/bird1.png"),
      secondTexture = PIXI.Texture.from("bmps/bird2.png")
      

let esto = this,
      config = {number: 1400},
      width,
      height,
      canvas,
      engine,
      birds,
      frame = 0,
      speed = 1.4,
      birdLineCount = 5,
      birdLineIndex = -1,
      z = {current: 1, target: 1},
      mouse = { x: 0.5, y: 0.5, z: 0.5},
      sprite = PIXI.Sprite.from("bmps/bird1.png");;

// for (let i = 0; i < 1; ++i)
// {
//     sprite = PIXI.Sprite.from("bmps/bird1.png");
//     container.addChild(sprite);
// }

const setTargets = function() {
    setInterval(function() {
        mouse.x = Math.random();
        mouse.y = Math.random();
        z.target = 0.5 + Math.random();
    }, 1000);
};
setTargets();

const createBirds = function() {
    birds = [];

    for (var i = 0; i < config.number; i++) {
        let bird = PIXI.Sprite.from("bmps/bird1.png");

        bird.flap = function() {
            if (Math.random()*100 < 50) { 
                if (bird.texture.textureCacheIds[0] === "bmps/bird1.png") {
                    bird.texture = secondTexture;
                } else {
                    bird.texture = texture;
                }

            } 
        }
        bird.deets = {
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
        };
        container.addChild(bird);
        birds.push(bird);
    }
};
createBirds();

app.stage.addChild(container)

const solveBirdMove = function(bird) {
    ['x', 'y', 'z'].forEach(function(key) {
        if (Math.abs(bird.deets.move[key]) > 0.003) {
            bird.deets.move[key] *= 0.99;
        }
    });

    if (frame % bird.deets.ownMove.t === 0) {
        bird.deets.ownMove.x = (0.5 - Math.random()) / 3;
        bird.deets.ownMove.y = (0.5 - Math.random()) / 3;
    }

    bird.deets.move.x += speed * (mouse.x - bird.deets.pos.x + bird.deets.ownMove.x) * bird.deets.speed;
    bird.deets.move.y += speed * (mouse.y - bird.deets.pos.y + bird.deets.ownMove.y) * bird.deets.speed;
    bird.deets.move.z += speed * (mouse.z - bird.deets.pos.z) * bird.deets.speed;
};

var drawBird = function (bird) {

    var pos = {
      x: bird.pos.x * width,
      y: bird.pos.y * height,
      z: bird.pos.z * 1.5
    };

    var size = (width + height) / 200 * pos.z * z.current;
    var atan = Math.atan2(bird.move.y * height, bird.move.x * width);

    engine.lineWidth = 1;

    var p = function (rad, customSize) {
      return {
        x: pos.x + Math.cos(atan + rad * Math.PI * 2) * size * customSize,
        y: pos.y + Math.sin(atan + rad * Math.PI * 2) * size * customSize
      };
    };

    addLinePath(bird, p(0.5, 1.3));


  };
  var addLinePath = function (bird, pos) {
    bird.lines[birdLineIndex * 2] = pos.x;
    bird.lines[birdLineIndex * 2 + 1] = pos.y;
  };

app.ticker.add((delta) => {

    birds.forEach(function(bird) {
        solveBirdMove(bird);
        // bird.deets.wing += 0.01 + bird.deets.wingAdd * 0.3 * speed;
        bird.flap();
        bird.x = (bird.deets.pos.x += bird.deets.move.x)*500;
        bird.y = (bird.deets.pos.y += bird.deets.move.y)*500;
        // bird.z = (bird.deets.pos.z += bird.deets.move.z );

    });
    // birdLineIndex = (birdLineIndex + 1) % birdLineCount;

    // birds.forEach(function (bird) {
    //     drawBird(bird);
    //   });

 
});
