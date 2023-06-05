var sheet = new Image();
sheet.src = "gfx/sheetb.png";

var msgs = {};
var gfx = ["blocked","corner","goal","saved"];
for (let i = 0; i < gfx.length; i++) {
  let n = gfx[i];
  let img = new Image();
  img.src = "gfx/"+n+".png";
  msgs[n] = img;
}

const markings = "#fff"
const black = "#51a602";
const white = "#62bd18";
const linew = 1/16;

const squares = [
  "A1","B1","C1","D1","E1","F1","G1","H1",
  "A2","B2","C2","D2","E2","F2","G2","H2",
  "A3","B3","C3","D3","E3","F3","G3","H3",
  "A4","B4","C4","D4","E4","F4","G4","H4",
  "A5","B5","C5","D5","E5","F5","G5","H5",
  "A6","B6","C6","D6","E6","F6","G6","H6",
  "A7","B7","C7","D7","E7","F7","G7","H7",
  "A8","B8","C8","D8","E8","F8","G8","H8"
];

const subsB = [ 8, 4, 4 ];
const formationsB =
[
  [
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    6,  0,  4,  2,  8,  4,  0,  6,
    0,  0,  2, 10,  2,  2,  0,  0,
    0,  0,  0, 12,  0,  0,  0,  0
  ],
  [
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  2,  0,  0,  0,
    0,  0,  2,  4,  2,  2,  0,  0,
    0,  6,  8, 12, 10,  8,  6,  0
  ],
  [
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  6,  0,  2,  6,  0,  0,
    0,  0, 10,  8,  8,  4,  0,  0,
    0,  0,  2, 12,  2,  2,  0,  0
  ]
];

const subsW = [ 7, 3, 3 ];
const formationsW =
[
  [
    0,  0,  0, 11,  0,  0,  0,  0,
    0,  0,  1,  9,  1,  1,  0,  0,
    5,  0,  3,  1,  7,  3,  0,  5,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0
  ],
  [
    0,  5,  7, 11,  9,  7,  5,  0,
    0,  0,  1,  3,  1,  1,  0,  0,
    0,  0,  0,  0,  1,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0
  ],
  [
    0,  0,  1, 11,  1,  1,  0,  0,
    0,  0,  9,  7,  7,  3,  0,  0,
    0,  0,  5,  0,  1,  5,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0
  ]
];

class Board {
  constructor(canvas) {
    this.canvas = canvas;
    this.pos = new Position();
    this.movelist = [''];
    this.commentary = [];
    this.lastmove = 1;
    this.side = 1;
  }
  
  resize(w, h) {    
    if (w != this.w || h != this.h) {
      this.w = this.canvas.width = w;
      this.h = this.canvas.height = h;
      this.s = Math.min(w, h);

      let n = 9;
      if (this.w > this.h)
        n = 8;
      let q = this.s/n;
      let tabs = document.getElementsByClassName("tab");
      for (let i = 0; i < tabs.length; i++)
        tabs[i].style.height = q+"px";

      let canvas = this.canvas;
      let panel = document.getElementById("panel");
      let wready = document.getElementById("wready");
      let bready = document.getElementById("bready");
      if (this.w > this.h) {
        let left = q*9+"px";
        let width = this.w - q*9+"px";
        let height = q+"px";
        canvas.style.top = "0px";
        panel.style.left = left;
        panel.style.top = q+"px";
        panel.style.width = width;
        panel.style.height = (this.h - q*2)+"px";
        content.style.top = q+"px";
        content.style.width = width;
        content.style.height = (this.h - q*3)+"px";
        wready.style.left = left;
        wready.style.top = (this.h - q)+"px";
        wready.style.width = width;
        wready.style.height = height;
        bready.style.left = left;
        bready.style.top = "0px";
        bready.style.width = width;
        bready.style.height = height;
      } else {
        let width = this.w+"px";
        let height = q+"px";
        canvas.style.top = q+"px";
        panel.style.left = "0px";
        panel.style.top = q*10+"px";
        panel.style.width = width;
        panel.style.height = (this.h - q*8 - q*2)+"px";
        content.style.top = q+"px";
        content.style.width = width;
        content.style.height = (this.h - q*8 - q*3)+"px";
        wready.style.left = "0px";
        wready.style.top = q*9+"px";
        wready.style.width = width;
        wready.style.height = height;
        bready.style.left = "0px";
        bready.style.top = "0px";
        bready.style.width = width;
        bready.style.height = height;
      }
      wready.style.height = q+"px";
      bready.style.height = q+"px";
    }
  }
  
  update(dt) {
    if (this.redraw)
      return;
    let q = this.queue;
    if (q) {
      if (q.time == null)
        q.time = 0;
      else
        q.time += dt;
      let r = q.time/0.25;
      if (r >= 1) {
        this.queue = null;
        this.make(q.sq, q.dest);
      } else {
        let p1 = this.squareToPos(q.sq);
        let p2 = this.squareToPos(q.dest);
        q.x = (p2[0] - p1[0])*r + p1[0];
        q.y = (p2[1] - p1[1])*r + p1[1];
      }
      return;
    }
    if (this.pos.stm != this.side && this.pos.ready) {
      this.reply();
    }
  }
  
  mouseToLocal(mx, my) {
    let s = this.s;
    let n = 9;
    if (this.w > this.h)
      n = 8;
    else
      my -= s/9;
    let q = s/n;
    let sc = 1 - 1/n/2;
    let lx = (mx - q/4)/sc/(s/n);
    let ly = (my - q/4)/sc/(s/n);
    let sq = this.posToSquare(lx, ly);
    return { x: lx, y: ly, sq: sq };
  }
  
  posToSquare(lx, ly) {
    let tx = Math.floor(lx);
    let ty = Math.floor(ly);
    if (this.side == 0)
      ty = 7 - ty;
    let sq = undefined;
    if (tx === 8) {
      if (ty == 0 || ty == 7)
        sq = -(7 - ty)/7 - 1;
    } else {
      if (ty >= 0 && ty <= 7)
        if (tx >= 0 && tx <= 7)
          sq = (7 - ty)*8 + tx;
    }
    return sq;
  }
  
  squareToPos(sq) {
    if (sq < -2 || sq > 63) return;
    let x = sq%8;
    let y = 7 - (sq - x)/8;
    if (sq < 0) {
      x = 8;
      y = 7 - (-sq - 1)*7;
    }
    if (this.side == 0)
      y = 7 - y;
    return [ x, y ];
  }
  
  getPiece(sq) {
    let g = this.grab;
    if (g && g.sq == sq)
      return g;
    let pt = this.squareToPos(sq);
    let p = this.pos.getPiece(sq);
    if (p && pt) return { piece:p, x:pt[0], y:pt[1], sq:sq };
  }
  
  press(id, x, y) {
    if (this.queue)
      return;
    let pos = this.pos;
    pos.msg = null;
    
    let lp = this.mouseToLocal(x, y);
    if (this.selected) {
      let sq = this.posToSquare(lp.x, lp.y);
      for (let i = 0; i < pos.moves.length; i++) {
        if (pos.moves[i] <= 0 && -pos.moves[i] == sq) {
          this.selected = null;
          let q = this.getPiece(pos.bsq);
          this.queue = q;
          q.dest = sq;
          q.pass = true;
          return;
        }
      }
    }
    
    this.touch = id;
    this.grab = this.getPiece(lp.sq);

    this.selected = null;
    if (this.grab && this.grab.sq == pos.bsq)
      this.selected = this.grab.sq;
  }
  
  move(id, x, y, dx, dy) {
    if (this.touch != id) return;
    let g = this.grab;
    if (g) {
      let lp = this.mouseToLocal(x, y);
      g.x = lp.x - 1/2;
      g.y = lp.y - 1/2;
    }
  }
  
  scroll(dx, dy) {
    
  }
  
  release(id, x, y) {
    if (this.touch != id) return;
    let lp = this.mouseToLocal(x, y);
    let g = this.grab;
    if (g && lp) {
      if (g.piece%2 == this.side)
        this.make(g.sq, lp.sq);
    }
    this.grab = null;
  }
  
  make(fromsq, tosq) {
    if (fromsq === undefined || tosq === undefined)
      return;
    let pos = this.pos;
    let wasReady = pos.ready;
    let nmoves = pos.movecount;
    let isPass = fromsq == pos.bsq;
    let isShot = isPass && goals[pos.stm][tosq];
    let isGain = (pos.bsq == tosq || (pos.bsq == -1 && center[tosq]));
    let isTackle = (!isPass && pos.data[tosq]);
    let side = (pos.stm == 0) ? "Black" : "White";
    let kind = "moves";
    if (isShot)
      kind = "shoots";
    else if (isPass)
      kind = "passes";
    let pts = pos.bscore + pos.wscore;
    // invalid move
    if (!pos.make(fromsq, tosq))
      return;
    if (wasReady) {
      let list = this.movelist;
      let move = squares[fromsq]+"-"+squares[tosq];
      if (nmoves == this.lastmove)
        list[list.length - 1] += " "+move;
      else
        list.push(move);
      this.lastmove = nmoves;
      
      let cmt = this.commentary;
      cmt.push(side+" "+kind+" "+move+"<br>");
      if (isGain)
        cmt.push(side+" gains posession<br>");
      let dt = (pos.bscore + pos.wscore) - pts;
      if (dt == 2)
        cmt.push(side+" checkmates!<br>");
      else if (dt == 1)
        cmt.push(side+" scores!<br>");
      
      this.sync();

      if (!pos.ready) {
        this.movelist = [''];
        this.commentary = [];
        this.lastmove = 1;
        if (pos.bscore >= game.towin || pos.wscore >= game.towin) {
          game.effect("end_of_game");
          game.intro();
        } else {
          this.halfTime();
        }
        //game.effect("clash");
        game.effect("goal");
      } else {
        if (isPass)
          game.effect("ball_kicked");
        else if (isTackle)
          game.effect("tackle");
        else
          game.effect("piece");
      }
    }
    this.redraw = true;
  }
  
  sync() {
    let out = "";
    let list = this.movelist;
    out += "<table>";
    for (let i = 0; i < list.length; i += 2) {
      let n = (Math.floor(i/2) + 1);
      out += "<tr>";
      out += "<td style='width:10%'>"+n+".</td>";
      out += "<td style='width:45%'>"+list[i]+"</td>";
      let reply = ""
      if (i + 1 < list.length)
        reply += list[i + 1];
      out += "<td style='width:45%'>"+reply+"</td>";
      out += "</tr>";
    }
    out += "</table>";
    
    game.content[0] = out;
    game.content[1] = "<div style='padding:1em'>"+this.commentary.join("")+"</div>";
    
    content.innerHTML = game.content[game.tab];
    content.scrollTop = content.scrollHeight;
  }
  
  reply() {
    let pos = this.pos;
    if (pos.stm != this.side && pos.ready) {
      let move = pos.getBestMove();
      if (move != null) {
        let q = this.getPiece(move.from);
        this.queue = q;
        q.dest = move.to;
        q.pass = move.pass;
      }
      //this.make(move.from, move.to);
    }
  }
  
  halfTime() {
    this.wready = false;
    this.bready = false;
    let b1 = document.getElementById("wready");
    let b2 = document.getElementById("bready");
    b1.disabled = false;
    b2.disabled = false;
    // opponent ready
    this.makeReady((this.side + 1)%2, true);
  }
  
  makeReadyEx(side) {
    if (this.side == 0)
      side = (side + 1)%2;
    this.makeReady(side, true);
  }
  
  makeReady(side, shuffle) {
    if (side == 0)
      this.bready = true;
    else
      this.wready = true;
    // rotate
    let pos = this.pos;
    if (shuffle && this.side != side) {
      let form = (side == 1) ? formationsB : formationsW;
      let n = Math.floor(Math.random()*form.length);
      let item = form[n];
      if (side == 1) {
        for (let i = 32; i < 64; i++)
          pos.data[i] = item[i];
      } else {
        for (let i = 0; i < 32; i++)
          pos.data[i] = item[i];
      }
      // substitute
      pos.wsub = subsW[n];
      pos.bsub = subsB[n];
    }
    // kickoff
    if (this.side == side)
      game.effect("start_game_whistle");
    // buttons
    let b1 = document.getElementById("bready");
    let b2 = document.getElementById("wready");
    if (this.side == 0) {
      let b3 = b1;
      b1 = b2;
      b2 = b3;
    }
    b1.disabled = this.bready;
    b2.disabled = this.wready;
    // begin
    if (this.wready && this.bready)
      if (pos.start())
        this.reply();
  }
  
  draw() {
    if (!sheet || !sheet.complete || sheet.naturalHeight == 0)
      return;
    
    let n = 9;
    if (this.w > this.h)
      n = 8;
    let q = this.s/n;
    let sc = 1 - 1/n/2;
    
    let ctx = this.canvas.getContext("2d");

    ctx.resetTransform();
    ctx.clearRect(0, 0, this.w, this.h);
    
    ctx.fillStyle = black;
    ctx.fillRect(0, 0, this.w, this.h);
    
    ctx.scale(sc, sc);
    ctx.translate(q/4, q/4);
    
    ctx.fillStyle = black;
    ctx.fillRect(-q/16, -q/16, q*8 + q/8, q*8 + q/8);
    ctx.fillStyle = white;
    for (let r = 0; r <= 7; r++) {
      for (let f = 0; f <= 7; f++) {
        if ((r + f)%2 == 0)
          ctx.fillRect(r*q, f*q, q, q);
      }
    }
    
    ctx.lineWidth = q*linew;
    ctx.strokeStyle = markings;
    ctx.fillStyle = markings;
    ctx.beginPath();
    ctx.moveTo(0, q*4);
    ctx.lineTo(q*8, q*4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(q*4, q*4, q*1 - q*linew/2, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(q*4, q*4, q/8, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(q*0, q*0, q/4, 0, Math.PI/2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(q*8, q*0, q/4, Math.PI/2, -Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(q*0, q*8, q/4, -Math.PI/2, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(q*8, q*8, q/4, -Math.PI, -Math.PI/2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.rect(0, 0, q*8, q*8);
    ctx.stroke();

    let off = linew*q/2;
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(q*3, off);
    ctx.lineTo(q*3, -q/4 + off);
    ctx.lineTo(q*5, -q/4 + off);
    ctx.lineTo(q*5, off);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(q*3, q*8 - off);
    ctx.lineTo(q*3, q*8 + q/4 - off);
    ctx.lineTo(q*5, q*8 + q/4 - off);
    ctx.lineTo(q*5, q*8 - off);
    ctx.stroke();

    let pos = this.pos;
    ctx.fillStyle = "#fff";
    ctx.font = Math.ceil(q)+"px 'Helvetica'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(pos.bscore, q*8 + q/2, q*3 + q/2);
    ctx.fillText(pos.wscore, q*8 + q/2, q*4 + q/2);

    if (pos.ready) {
      ctx.fillStyle = "#fff";
      ctx.font = Math.ceil(q/4)+"px 'Helvetica'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      let pt = this.squareToPos((pos.stm == 0) ? -2 : -1);
      if (pos.nmoves > 0)
        ctx.fillText("MOVE", pt[0]*q + q*(2/3), pt[1]*q + q/2 - q/4);

      let out = "";
      if (pos.npasses > 0 && pos.nshots > 0)
        out += "PASS/SHOOT";
      else if (pos.npasses > 0)
        out += "PASS";
      else if (pos.nshots > 0)
        out += "SHOOT";
      ctx.fillText(out, pt[0]*q + q*(2/3), pt[1]*q + q/2 + q/4);
    }

    let cx = 3.5;
    let cy = 3.5;
    let sx = 0;
    let sy = 4;
    let bsq = pos.bsq;
    if (bsq >= 0) {
      cx = bsq%8;
      cy = (bsq - cx)/8;
      let p = this.getPiece(bsq);
      if (p) {
        cx = p.x;
        cy = p.y + 0.25;
        if (p.piece%2 == 0)
          sx ++;
      }
      let c = this.queue;
      if (c && (c.pass || c.sq == bsq)) {
        cx = c.x;
        cy = c.y + 0.25;
      }
      if (!this.grab && this.selected) {
        ctx.strokeStyle = "#000";
        let opt = [];
        for (let i = 0; i < pos.moves.length; i++)
          if (pos.moves[i] <= 0)
            opt.push(-pos.moves[i]);
        
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < opt.length; i++) {
          let pt = this.squareToPos(opt[i]);
          ctx.fillRect(pt[0]*q, pt[1]*q, q, q);
        }
        ctx.globalAlpha = 1;
      }
    }

    let qq = q*1;
    ctx.save();
    ctx.translate(q/2, q/2);
    ctx.translate(-qq/2, -qq/2);
    
    let iw = sheet.width;
    let ih = sheet.height;
    let tw = iw/3;
    let th = ih/5;
    let start = 63;
    let end = -1;
    let step = -1;
    if (this.side == 0) {
      start = 0;
      end = 64;
      step = 1;
    }
    for (let i = start; i != end; i += step) {
      let p = this.getPiece(i);
      if (p && p.piece > 0) {
        let px = p.x;
        let py = p.y;
        let g = this.grab;
        if (g && g.sq == i && !pos.move && pos.bsq == i) {
          let pt = this.squareToPos(i);
          px = pt[0];
          py = pt[1];
        }
        let c = this.queue;
        if (c && c.sq == i && !c.pass) {
          px = c.x;
          py = c.y;
        }
        let sx = (p.piece - 1)%3;
        let sy = (p.piece - 1 - sx)/3;
        //ctx.drawImage(sheet, sx*tw, sy*th, tw, th, px*q, py*q, q, q);
        ctx.drawImage(sheet, sx*tw, sy*th, tw, th, px*q, py*q, qq, qq);
      }
    }

    if (!pos.ready) {
      for (let i = 1; i <= 2; i++) {
        let p = this.getPiece(-i);
        if (p) {
          let sx = (p.piece - 1)%3;
          let sy = (p.piece - 1 - sx)/3;
          //ctx.drawImage(sheet, sx*tw, sy*th, tw, th, p.x*q, p.y*q, q, q);
          ctx.drawImage(sheet, sx*tw, sy*th, tw, th, p.x*q, p.y*q, qq, qq);
        }
      }
    }
    //ctx.drawImage(sheet, sx*tw, sy*th, tw, th, cx*q, cy*q, q, q);
    ctx.drawImage(sheet, sx*tw, sy*th, tw, th, cx*q, cy*q, qq, qq);

    this.redraw = false;

    ctx.restore();

    if (pos.msg) {
      let img = msgs[pos.msg];
      let dw = q*6;
      let dh = q*3;
      ctx.drawImage(img, 0, 0, img.width, img.height, 3.5*q - dw/2 + q/2, 3.5*q - dh/2 + q/2, dw, dh);
    }
  }
};

board = new Board(canvas);