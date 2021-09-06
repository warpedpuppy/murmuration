// HTML CSS JSResult Skip Results Iframe
var Birds = function () {
  var esto = this;

  var config = {
    number: 700
  };

  var width;
  var height;

  var canvas;
  var engine;

  var birds;
  var frame = 0;

  var speed = 1.4;
  var birdLineCount = 5;
  var birdLineIndex = -1;

  var bgTop;
  var bgBot;

  var z = {
    current: 1,
    target: 1
  };

  var mouse = {
    x: 0.5,
    y: 0.5,
    z: 0.5
  };

  var prepare = function () {
    canvas = document.getElementsByTagName('canvas')[0];
    engine = canvas.getContext('2d');

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    bgTop = engine.createLinearGradient(0, 0, 0, height / 2);
    bgTop.addColorStop(0, '#000');
    bgTop.addColorStop(1, '#110');

    bgBot = engine.createLinearGradient(0, height / 2, 0, height);
    bgBot.addColorStop(0, '#000');
    bgBot.addColorStop(1, '#001');
    
  };

  window.addEventListener('resize', e => {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
  })

  var request = function () {
    window.requestAnimationFrame(tick);
  };

  var solveBirdMove = function (bird) {
    ['x', 'y', 'z'].forEach(function (key) {
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

  var applyPath = function (pathStack) {
    engine.moveTo(pathStack[0].x, pathStack[0].y);

    for (var i = 1; i < pathStack.length; i ++) {
      engine.lineTo(pathStack[i].x, pathStack[i].y);
    }
  };

  var drawBird = function (bird) {
    engine.fillStyle = 'rgba(0,0,0,.3)';

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

    engine.beginPath();

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

    engine.fill();

    var wingWave = Math.sin(bird.wing);
    var wingAdd = wingWave * 0.1;
    var wingPositiveWave = (wingWave + 1) / 2;

    engine.beginPath();

    //wings
    applyPath([
      p(0, 0.5),

      p(-0.15, wingPositiveWave),
      p(-0.25, -1 + 3 * wingPositiveWave),

      p(-0.4, 0.5),
      p(0, 0)
    ]);

    engine.fill();

  };

  var addLinePath = function (bird, pos) {
    bird.lines[birdLineIndex * 2] = pos.x;
    bird.lines[birdLineIndex * 2 + 1] = pos.y;
  };

  var renderBirds = function () {
    birds.forEach(function (bird) {
      solveBirdMove(bird);
      bird.wing += 0.1 + bird.wingAdd * 0.3 * speed;
      bird.pos.x += bird.move.x;
      bird.pos.y += bird.move.y;
      bird.pos.z += bird.move.z;
    });

    birdLineIndex = (birdLineIndex + 1) % birdLineCount;

    birds.forEach(function (bird) {
      drawBird(bird);
    });
  };

  var clear = function () {
    engine.clearRect(0, 0, width, height);
  };

  var drawBg = function () {
    engine.fillStyle = bgTop;
    engine.fillRect(0, 0, width, height / 2);

    engine.fillStyle = bgBot;
    engine.fillRect(0, height / 2, width, height);
  };

  var tick = function () {
    frame++;
    z.current += (z.target - z.current) / 100;
    clear();
    renderBirds();
    request();
  };

  var createBirds = function () {
    birds = [];

    for (var i = 0; i < config.number; i++) {
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

  var registerMouse = function () {
    setInterval(function () {
      mouse.x = Math.random();
      mouse.y = Math.random();
      z.target = 0.5 + Math.random();
    }, 1000);
  };

  this.run = function () {
    registerMouse();
    prepare();
    createBirds();
    tick();
  }
};

var b = new Birds();
b.run();



// Resources1× 0.5× 0.25×Rerun