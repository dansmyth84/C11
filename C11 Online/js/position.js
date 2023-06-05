const initial64 = [
  0,  3,  5,  11, 9,  5,  3,  0, // white
  0,  0,  1,  1,  1,  1,  0,  0,
  0,  0,  0,  7,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,
  6,  0,  4,  2,  8,  4,  0,  6,
  0,  0,  2, 10,  2,  2,  0,  0,
  0,  0,  0, 12,  0,  0,  0,  0  // black
];

const mailbox120 = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1,  0,  1,  2,  3,  4,  5,  6,  7, -1,
  -1,  8,  9, 10, 11, 12, 13, 14, 15, -1,
  -1, 16, 17, 18, 19, 20, 21, 22, 23, -1,
  -1, 24, 25, 26, 27, 28, 29, 30, 31, -1,
  -1, 32, 33, 34, 35, 36, 37, 38, 39, -1,
  -1, 40, 41, 42, 43, 44, 45, 46, 47, -1,
  -1, 48, 49, 50, 51, 52, 53, 54, 55, -1,
  -1, 56, 57, 58, 59, 60, 61, 62, 63, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
];

const mailbox64 = [
  21, 22, 23, 24, 25, 26, 27, 28,
  31, 32, 33, 34, 35, 36, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48,
  51, 52, 53, 54, 55, 56, 57, 58,
  61, 62, 63, 64, 65, 66, 67, 68,
  71, 72, 73, 74, 75, 76, 77, 78,
  81, 82, 83, 84, 85, 86, 87, 88,
  91, 92, 93, 94, 95, 96, 97, 98
];

const attacks120 =
[
  null,
  [ 1, 9, 11 ],
  [ 1, -11, -9 ],
  [ 1, -21, -19, -12, -8, 8, 12, 19, 21 ],
  [ 1, -21, -19, -12, -8, 8, 12, 19, 21 ],
  [ 8, -11, -9, 9, 11 ],
  [ 8, -11, -9, 9, 11 ],
  [ 8, -10, -1, 1, 10 ],
  [ 8, -10, -1, 1, 10 ],
  [ 8, -11, -10, -9, -1, 1, 9, 10, 11 ],
  [ 8, -11, -10, -9, -1, 1, 9, 10, 11 ],
  [ 1, -11, -10, -9, -1, 1, 9, 10, 11 ],
  [ 1, -11, -10, -9, -1, 1, 9, 10, 11 ],
];

const rattacks120 =
[
  null,
  [ 1, -11, -9 ],
  [ 1, 9, 11 ],
  [ 1, -21, -19, -12, -8, 8, 12, 19, 21 ],
  [ 1, -21, -19, -12, -8, 8, 12, 19, 21 ],
  [ 8, -11, -9, 9, 11 ],
  [ 8, -11, -9, 9, 11 ],
  [ 8, -10, -1, 1, 10 ],
  [ 8, -10, -1, 1, 10 ],
  [ 8, -11, -10, -9, -1, 1, 9, 10, 11 ],
  [ 8, -11, -10, -9, -1, 1, 9, 10, 11 ],
  [ 1, -11, -10, -9, -1, 1, 9, 10, 11 ],
  [ 1, -11, -10, -9, -1, 1, 9, 10, 11 ],
];

const goals =
[
  { '3':0, '4':7 },
  { '59':56, '60':63 },
];

const center = {
  '27': true, '28': true, '35': true, '36': true,
}

class Position {
  constructor(that) {
    if (that == null) {
      this.init = [];
      this.data = [];
      for (let i = 0; i < 64; i++)
        this.data[i] = initial64[i];
      for (let i = 0; i < 64; i++)
        this.data[i + 64] = i;
      this.bsq = -1;
      this.stm = 1;
      this.movecount = 1;
      this.ballPickedUp = false;
      this.ballPosition = 27;
      this.move = true;
      this.pass = true;
      this.ready = false;
      this.wsub = 7;
      this.bsub = 8;
      this.wscore = 0;
      this.bscore = 0;
      this.reset(false);
    } else {
      this.load(that);
    }
  }

  isLegalMove(move) {
    const source = move.source;
    const target = move.target;
    const piece = this.board[source];
    const targetPiece = this.board[target];
  
    if (piece === null) {
      return false;
    }
  
    if (piece.color === this.turn && this.ballPickedUp) {
      // ... original implementation of isLegalMove ...
    } else if (piece.color === this.turn && !this.ballPickedUp) {
      // The first move must be to the center square and take possession of the ball
      if (target === this.ballPosition) {
        this.ballPickedUp = true;
        this.ballPosition = null;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
    
  load(that) {
    for (let k in that)
      this[k] = that[k];
    this.init = [];
    this.data = [];
    for (let i = 0; i < that.data.length; i++)
      this.data[i] = that.data[i];
    for (let i = 0; i < that.init.length; i++)
      this.init[i] = that.init[i];
    this.moves = null;
    if (that.moves) {
      this.moves = [];
      for (let i = 0; i < that.moves.length; i++)
        this.moves[i] = that.moves[i];
    }
  }
  
  start() {
    for (let i = 0; i < 64; i++)
      this.init[i] = this.data[i];
    this.ready = this.reset(false);
    return this.ready;
  }

  iterate(offsets, fromsq, func, ...args) {
    let to120 = mailbox64[fromsq];
    let steps = offsets[0];
    for (let j = 1; j < offsets.length; j++) {
      let offset120 = offsets[j];
      let from120 = to120;
      for (let i = 0; i < steps; i++) {
        from120 = from120 + offset120;
        let tosq = mailbox120[from120];
        if (tosq == -1)
          break;
        if (func.bind(this)(tosq, ...args))
          return tosq;
        if (this.data[tosq] > 0)
          break;
      }
    }
  }
  
  isPiece(on, piece) {
    return this.data[on] == piece;
  }

  attacked(tosq, stm) {
    if (stm === undefined)
      stm = (this.stm + 1)%2;
    let to120 = mailbox64[tosq];
    for (let p = 2 - stm; p <= 12; p += 2)
      if (this.iterate(rattacks120[p], tosq, this.isPiece, p))
        return true;
    return false;
  }

  genMove(tosq, fromsq, list) {
    let p2 = this.data[tosq];
    if (p2 == 0 || this.stm != p2%2) {
      let p1 = this.data[fromsq];
      if (p1 <= 2) {
        if (tosq%8 == fromsq%8) {
          if (p2 > 0) return;
        } else {
          if (p2 == 0) return;
        }
      }
      let ksq = this.ksq
      if (ksq == fromsq)
        ksq = tosq;
      this.data[fromsq] = 0;
      this.data[tosq] = p1;
      if (!this.attacked(ksq))
        list.push(fromsq + tosq*64);
      this.data[fromsq] = p1;
      this.data[tosq] = p2;
    }
  }

  sendPass(tosq, fromsq, list) {
    if (fromsq != this.bsq || fromsq == tosq)
      return;
    let p1 = this.data[fromsq];
    let p2 = this.data[tosq];
    if (goals[this.stm][tosq] !== undefined || (p2 > 0 && p1%2 == p2%2))
      list.push(-tosq);
  }

  receivePass(tosq, fromsq, list) {
    if (tosq != this.bsq || fromsq == tosq)
      return;
    if (list.indexOf(-fromsq) >= 0)
      return;
    let p1 = this.data[fromsq];
    let p2 = this.data[tosq];
    if (p2 > 0 && p1%2 == p2%2)
      list.push(-fromsq);
  }

  genFrom(fromsq, func, ...args) {
    let p1 = this.data[fromsq];
    if (p1 == 0 || p1%2 != this.stm)
      return;
    if (p1 <= 2) {
      let advance = 8;
      if (this.stm == 0)
        advance = -8;
      let tosq = fromsq + advance;
      func.bind(this)(tosq, fromsq, ...args);
      if (this.data[tosq] == 0 && this.data[fromsq + 64] == fromsq)
        func.bind(this)(tosq + advance, fromsq, ...args);
    }
    this.iterate(attacks120[p1], fromsq, func, fromsq, ...args);
  }

  genMoves() {
    let list = [];
    if (this.move && this.valid)
      for (let sq = 0; sq < 64; sq++)
        this.genFrom(sq, this.genMove, list);

    let bsq = this.bsq;
    if (this.pass && this.valid) {
      if (bsq != -1)
        this.genFrom(bsq, this.sendPass, list);
      for (let sq = 0; sq < 64; sq++)
        if (sq != bsq)
          this.genFrom(sq, this.receivePass, list);
    }
    return list;
  }
  
  findPiece(id, j) {
    if (j === undefined)
      j = 0;
    for (let i = j; i < 64; i++)
      if (this.data[i] == id)
        return i;
  }
  
  squareName(sq) {
    let sx = sq%8;
    let sy = (sq - sx)/8;
    return String.fromCharCode(65 + sx)+(sy + 1);
  }
  
  makeMove(fromsq, tosq) {
    let moves = this.moves;
    let valid = false;
    for (let i = 0; i < moves.length; i ++) {
      let move = moves[i];
      if (move <= 0) continue;
      let from = move%64;
      let to = (move - from)/64;
      if (from == fromsq && to == tosq) {
        valid = true;
        break;
      }
    }
    if (!valid)
      return false;

    let p1 = this.data[fromsq];
    let p2 = this.data[tosq];
    if (p1 <= 2) {
      this.data[tosq + 64] = this.data[fromsq + 64];
      this.data[fromsq + 64] = 0;
      // promotion
      if (tosq <= 7 || tosq >= 56)
        p1 = this.promo || (p1 + 8);
    }
    this.data[fromsq] = 0;
    this.data[tosq] = p1;
    this.move = false;
    this.ply = this.ply + 1
    
    if (this.bsq == -1 && center[tosq]) {
      this.bsq = tosq;
    } else if (this.bsq == fromsq) {
      this.bsq = tosq;
    }
    if (this.bsq == tosq && goals[this.stm][tosq] !== undefined)
      this.kickoff((this.stm + 1)%2, 1);
    else
      this.reset(true);

    return true;
  }
  
  makeMoveOrPass(move) {
    if (move <= 0)
      return this.makePass(this.bsq, -move);
    let fromsq = move%64;
    let tosq = (move - fromsq)/64;
    return this.makeMove(fromsq, tosq);// || this.makePass(fromsq, tosq);
  }

  kickoff(stm, pts) {
    let opp = (stm + 1)%2;
    if (pts) {
      if (opp == 0)
        this.bscore += pts;
      else
        this.wscore += pts;
    }
    let orig = this.init;
    for (let i = 0; i < orig.length; i++)
      this.data[i] = orig[i];
    for (let i = 64; i <= 127; i++)
      this.data[i] = i - 64;
    this.stm = stm;
    this.movecount = 1;
    this.move = true;
    this.pass = true;
    this.ready = false;
    this.change = pts;
    this.bsq = -1;
    this.ply = 0;
    this.reset(false);
  }
  
  getBestMove() {
    if (!this.ready || this.moves.length == 0)
      return;
    let pass = false;
    let move = search.best(this, game.difficulty);
    if (move != null) {
      let fromsq = move%64;
      let tosq = (move - fromsq)/64;
      if (move <= 0) {
        fromsq = this.bsq;
        tosq = -move;
        pass = true;
      }
      return { from: fromsq, to: tosq, pass: pass };
    }
  }

  makePass(fromsq, tosq) {
    let moves = this.moves;
    let valid = false;
    for (let i = 0; i < moves.length; i ++) {
      if (-moves[i] == tosq) {
        valid = true;
        break;
      }
    }
    if (!valid || this.bsq != fromsq)
      return false;

    this.bsq = tosq;
    this.pass = false;
    this.ply = this.ply + 1;
     
    let p1 = this.data[fromsq];
    let srcs = this.squareName(fromsq);
    let dest = this.squareName(tosq);
    let side = (p1%2 == 1) ? "White" : "Black";
    let csq = goals[this.stm][tosq];
    if (csq !== undefined) {
      let p2 = this.data[tosq];
      let keeper = (p2 > 0) && (p2%2 != p1%2);
      this.data[fromsq] = 0;
      let pinned = this.attacked(this.ksq);
      let disco = this.attacked(this.opp);
      this.data[fromsq] = p1;
      let r = Math.random()*3 + 1;
      r = Math.floor(r);
      if (!keeper || r == 1) {
        this.msg = "goal";
        this.kickoff((this.stm + 1)%2, 1);
      } else if (!pinned && !disco && this.data[csq] == 0 && r == 2) {
        this.msg = "corner";
        let p1 = this.data[fromsq];
        this.data[fromsq] = 0;
        this.data[csq] = p1;
        this.bsq = csq;
        this.move = true;
        this.pass = true;
      } else {
        this.msg = "saved";
      }
    }
    this.reset(true);
    
    return true;
  }
  
  getPiece(sq) {
    if (sq === -1)
      return this.wsub;
    else if (sq === -2)
      return this.bsub;
    else
      return this.data[sq];
  }
  
  setPiece(sq, p) {
    if (sq === -1)
      this.wsub = p;
    else if (sq === -2)
      this.bsub = p;
    else
      this.data[sq] = p;
  }
  
  make(fromsq, tosq) {
    this.msg = null;
    if (tosq == fromsq)
      return false;
    if (!this.ready) {
      let p1 = this.getPiece(fromsq);
      // stay in own half on first move
      if (this.movecount == 1 && p1%2 == 0 && tosq >= 0 && tosq <= 31) return false;
      if (this.movecount == 1 && p1%2 == 1 && tosq >= 0 && tosq >= 32) return false;
      // stay in own half after first move
      if (p1%2 == 0 && tosq >= 0 && tosq <= 31 && this.movecount > 1) return false;
      if (p1%2 == 1 && tosq >= 0 && tosq >= 32 && this.movecount > 1) return false;
      // keep center clear
      if (center[tosq]) return false;
      // king must in goal
      if (p1 >= 11 && goals[(p1 + 1)%2][tosq] === undefined) return false;
      let p2 = this.getPiece(tosq);
      // pieces must be of the same color
      if (p2 > 0 && p1%2 != p2%2) return false;
      // subs can only replace other pieces
      if (fromsq < 0 && p2 === 0) return false;
      // pawns can only be replaced after scoring
      if (p1 == 1 || p1 == 2 || p2 == 1 || p2 == 2) {
        if (fromsq < 0 || tosq < 0) {
          if (p1%2 == 0 && this.bscore == 0) return false;
          if (p1%2 == 1 && this.wscore == 0) return false;
        }
      }
      this.setPiece(fromsq, p2);
      this.setPiece(tosq, p1);
      return true;
    } else {
      return this.makeMove(fromsq, tosq) || this.makePass(fromsq, tosq);
    }
  }

  reset(swap) {
    let k1 = this.findPiece(11);
    let k2 = this.findPiece(12);
    if (this.stm != 1) {
      let tmp = k1;
      k1 = k2;
      k2 = tmp;
    }
    this.ksq = k1;
    this.opp = k2;
    this.check = k2 && this.attacked(k2, this.stm);
    this.valid = k1 && k2 && (!this.move || !this.check);
    let moves = this.genMoves();
    this.moves = moves;

    this.nshots = 0;
    this.npasses = 0;
    this.nmoves = 0;
    for (let i = 0; i < moves.length; i++) {
      let move = moves[i];
      if (move <= 0)
        if (goals[this.stm][ -move ] !== undefined)          
          this.nshots ++;
        else
          this.npasses ++;
      else
        this.nmoves ++;
    }

    if (this.valid) {
      if (moves.length == 0) {
        if (swap) {
          this.stm = (this.stm + 1)%2;
          this.movecount ++;
          this.move = true;
          this.pass = true;
          return this.reset(false);
        } 
      }
    }
    if (this.move && moves.length == 0) {
      let opp = (this.stm + 1)%2;
      if (this.attacked(this.ksq, opp)) {
        // Checkmate
        this.kickoff(this.stm, 2);
      } else {
        // Stalemate
        this.kickoff(this.stm, 0);
      }
    }
    return this.valid;
  }
}