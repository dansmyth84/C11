var cont = document.getElementById("cont");
var canvas = document.getElementById("canvas");

var board;
var lastupdate = Date.now();
var currentPlayer = 1; // Variable to track the current player's turn (Player 1 starts)

function loop() {
  let now = Date.now();
  requestAnimationFrame(() => loop(), canvas);
  let dt = (now - lastupdate) / 1000;
  lastupdate = Date.now();

  if (board) {
    board.resize(window.innerWidth, window.innerHeight);
    board.update(dt);
    board.draw();
  }
}
loop();

// Mouse
var input = {};
input.getMouse = function () {
  if (input[0] && !input[0].touch) {
    return input[0];
  }
};
canvas.addEventListener("click", function (e) {
  onevent("click", e.button, e.clientX, e.clientY, false);
});
canvas.addEventListener("mousedown", function (e) {
  onevent("press", e.button, e.clientX, e.clientY, false);
});
canvas.addEventListener("mousemove", function (e) {
  onevent("move", e.button, e.clientX, e.clientY, false);
});
canvas.addEventListener("mouseup", function (e) {
  onevent("release", e.button, e.clientX, e.clientY, false);
});
canvas.addEventListener("wheel", function (e) {
  if (board) board.scroll(e.deltaX, e.deltaY);
});
function onevent(func, id, x, y, t) {
  if (!input[id]) input[id] = { x: x, y: y };
  if (func === "press") {
    input[id] = { x: x, y: y, touch: t };
    if (board) board.press(id, x, y, t);
  } else if (func == "move") {
    let dx = x - input[id].x;
    let dy = y - input[id].y;
    input[id].x = x;
    input[id].y = y;
    if (board) board.move(id, x, y, dx, dy, t);
  } else if (func === "release" || func === "cancel") {
    input[id] = null;
    if (board && board[func]) {
      board[func](id, x, y, t);
    }

    // Toggle the current player's turn after each move
    currentPlayer = currentPlayer === 1 ? 2 : 1;
  }
}

// Touch
canvas.addEventListener("touchstart", function (e) {
  ontouch("press", e);
});
canvas.addEventListener("touchmove", function (e) {
  ontouch("move", e);
});
canvas.addEventListener("touchend", function (e) {
  ontouch("release", e);
});
canvas.addEventListener("touchcancel", function (e) {
  ontouch("cancel", e);
});
function ontouch(func, e) {
  let list = e.targetTouches;
  if (list.length === 0) list = e.changedTouches;
  for (let i = 0; i < list.length; i++) {
    let v = list[i];
    onevent(func, v.identifier, v.clientX, v.clientY, true);
  }
  e.preventDefault();
}

const intro = document.getElementById("intro");
const rules = document.getElementById("rules");
const content = document.getElementById("content");

var game = {};
game.playing = false;
game.difficulty = 4;
game.content = ["", ""];
game.tab = 0;
game.towin = 5;

game.toggle = function (event) {
  if (!intro.contains(event.target) && !rules.contains(event.target)) {
    if (rules.style.display == "block") {
      intro.style.display = "block";
      rules.style.display = "none";
    }
  }
};

game.intro = function () {
  intro.style.display = "block";
  rules.style.display = "none";
};

game.start = function () {
  let diff = document.getElementById("difficulty");
  game.difficulty = parseInt(diff.value);
  intro.style.display = "none";
  rules.style.display = "none";
  let side = document.getElementById("side");
  board.side = parseInt(side.value);

  let goals = document.getElementById("goals");
  game.towin = parseInt(goals.value);

  board.makeReady((board.side + 1) % 2, false);
  game.playing = true;

  // Toggle the current player's turn after starting the game
  currentPlayer = 1; // Set player 1 as the starting player
};

game.rules = function () {
  intro.style.display = "none";
  rules.style.display = "block";
};

game.showTab = function (current, index) {
  if (current) {
    let tabs = document.getElementsByClassName("tab");
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].style.color = tabs[i] == current ? "#fff" : "#000";
      tabs[i].style.backgroundColor = tabs[i] == current ? "#000" : "#ccc";
    }
  }
  game.tab = index;
  content.innerHTML = game.content[index];
};

document.addEventListener("click", function (event) {
  if (!game.playing) game.toggle(event);
});

let effects = {};
let sfx = [
  "clash",
  "piece",
  "ball_kicked",
  "crowd_noise",
  "end_of_game",
  "final_whistle",
  "goal",
  "start_game_whistle",
  "tackle",
];
for (let i = 0; i < sfx.length; i++) {
  let n = sfx[i];
  let snd = new Audio();
  snd.src = `sfx/${n}.mp3`;
  snd.load();
  snd.volume = 0;
  effects[n] = snd;
}

game.effect = function (n) {
  //if (ops.mute) return;
  let snd = effects[n];
  if (!snd) alert(n);
  snd = snd.cloneNode(true);
  if (snd.duration > 0 && !snd.paused) snd.currentTime = 0;
  snd.play();
  snd.volume = 1;
  return snd;
};

game.showTab(null, 0);
