export class CubeService {
    cubeState:{
      front:string[][],
      back:string[][],
      top:string[][],
      bottom:string[][],
      left:string[][],
      right:string[][]
    }
    cubeStateCopy!:{
      front:string[][],
      back:string[][],
      top:string[][],
      bottom:string[][],
      left:string[][],
      right:string[][]
    }
    w11!:string;
    w12!:string;
    w13!:string;
    w21!:string;
    w23!:string;
    w31!:string;
    w32!:string;
    w33!:string;
    y11!:string;
    y12!:string;
    y13!:string;
    y21!:string;
    y23!:string;
    y31!:string;
    y32!:string;
    y33!:string;
    b11!:string;
    b12!:string;
    b13!:string;
    b21!:string;
    b23!:string;
    b31!:string;
    b32!:string;
    b33!:string;
    g11!:string;
    g12!:string;
    g13!:string;
    g21!:string;
    g23!:string;
    g31!:string;
    g32!:string;
    g33!:string;
    r11!:string;
    r12!:string;
    r13!:string;
    r21!:string;
    r23!:string;
    r31!:string;
    r32!:string;
    r33!:string;
    o11!:string;
    o12!:string;
    o13!:string;
    o21!:string;
    o23!:string;
    o31!:string;
    o32!:string;
    o33!:string;

    constructor() {
      this.cubeState = {
        front:[
          ['Gry', 'Gy', 'Gyo'],
          ['Gr', 'G', 'Go'],
          ['Gwr', 'Gw', 'Gow']
        ],
        back: [
          ['Boy', 'By', 'Byr'],
          ['Bo', 'B', 'Br'],
          ['Bwo', 'Bw', 'Brw']
        ],
        top: [
          ['Yrb', 'Yb', 'Ybo'],
          ['Yr', 'Y', 'Yo'],
          ['Ygr', 'Yg', 'Yog']
        ],
        bottom: [
          ['Wrg', 'Wg', 'Wgo'],
          ['Wr', 'W', 'Wo'],
          ['Wbr', 'Wb', 'Wob']
        ],
        left: [
          ['Rby', 'Ry', 'Ryg'],
          ['Rb', 'R', 'Rg'],
          ['Rwb', 'Rw', 'Rgw']
        ],
        right: [
          ['Ogy', 'Oy', 'Oyb'],
          ['Og', 'O', 'Ob'],
          ['Owg', 'Ow', 'Obw']
        ]
      };
      this.updateCubeState();
      this.updateCubeState(this.cubeStateCopy);
    }
    updateCubeState(cubeState = this.cubeState): void {
      this.w11 = cubeState.bottom[0][0][0].toLowerCase();
      this.w12 = cubeState.bottom[0][1][0].toLowerCase();
      this.w13 = cubeState.bottom[0][2][0].toLowerCase();
      this.w21 = cubeState.bottom[1][0][0].toLowerCase();
      this.w23 = cubeState.bottom[1][2][0].toLowerCase();
      this.w31 = cubeState.bottom[2][0][0].toLowerCase();
      this.w32 = cubeState.bottom[2][1][0].toLowerCase();
      this.w33 = cubeState.bottom[2][2][0].toLowerCase();
      this.y11 = cubeState.top[0][0][0].toLowerCase();
      this.y12 = cubeState.top[0][1][0].toLowerCase();
      this.y13 = cubeState.top[0][2][0].toLowerCase();
      this.y21 = cubeState.top[1][0][0].toLowerCase();
      this.y23 = cubeState.top[1][2][0].toLowerCase();
      this.y31 = cubeState.top[2][0][0].toLowerCase();
      this.y32 = cubeState.top[2][1][0].toLowerCase();
      this.y33 = cubeState.top[2][2][0].toLowerCase();
      this.b11 = cubeState.back[0][0][0].toLowerCase();
      this.b12 = cubeState.back[0][1][0].toLowerCase();
      this.b13 = cubeState.back[0][2][0].toLowerCase();
      this.b21 = cubeState.back[1][0][0].toLowerCase();
      this.b23 = cubeState.back[1][2][0].toLowerCase();
      this.b31 = cubeState.back[2][0][0].toLowerCase();
      this.b32 = cubeState.back[2][1][0].toLowerCase();
      this.b33 = cubeState.back[2][2][0].toLowerCase();
      this.g11 = cubeState.front[0][0][0].toLowerCase();
      this.g12 = cubeState.front[0][1][0].toLowerCase();
      this.g13 = cubeState.front[0][2][0].toLowerCase();
      this.g21 = cubeState.front[1][0][0].toLowerCase();
      this.g23 = cubeState.front[1][2][0].toLowerCase();
      this.g31 = cubeState.front[2][0][0].toLowerCase();
      this.g32 = cubeState.front[2][1][0].toLowerCase();
      this.g33 = cubeState.front[2][2][0].toLowerCase();
      this.r11 = cubeState.left[0][0][0].toLowerCase();
      this.r12 = cubeState.left[0][1][0].toLowerCase();
      this.r13 = cubeState.left[0][2][0].toLowerCase();
      this.r21 = cubeState.left[1][0][0].toLowerCase();
      this.r23 = cubeState.left[1][2][0].toLowerCase();
      this.r31 = cubeState.left[2][0][0].toLowerCase();
      this.r32 = cubeState.left[2][1][0].toLowerCase();
      this.r33 = cubeState.left[2][2][0].toLowerCase();
      this.o11 = cubeState.right[0][0][0].toLowerCase();
      this.o12 = cubeState.right[0][1][0].toLowerCase();
      this.o13 = cubeState.right[0][2][0].toLowerCase();
      this.o21 = cubeState.right[1][0][0].toLowerCase();
      this.o23 = cubeState.right[1][2][0].toLowerCase();
      this.o31 = cubeState.right[2][0][0].toLowerCase();
      this.o32 = cubeState.right[2][1][0].toLowerCase();
      this.o33 = cubeState.right[2][2][0].toLowerCase();
    }
    printCube(): void {
      const cubeState = this.cubeState;
      console.log('Top:', cubeState.top);
      console.log('Front:', cubeState.front);
      console.log('Bottom:', cubeState.bottom);
      console.log('Back:', cubeState.back);
      console.log('Left:', cubeState.left);
      console.log('Right:', cubeState.right);
    }
    private rotateFace(face:string[][]){
      let temp = face[0][2];
      face[0][2] = face[0][0];
      face[0][0] = face[2][0];
      face[2][0] = face[2][2];
      face[2][2] = temp;
      temp = face[0][1];
      face[0][1] = face[1][0];
      face[1][0] = face[2][1];
      face[2][1] = face[1][2];
      face[1][2] = temp;
    }
    rotateTop(times:number,cubeState = this.cubeState) {
      for (let i = 0; i < times; i++) {
        this.rotateFace(cubeState.top);
        const temp = cubeState.front[0];
        cubeState.front[0] = cubeState.right[0];
        cubeState.right[0] = cubeState.back[0];
        cubeState.back[0] = cubeState.left[0];
        cubeState.left[0] = temp;
      }
      this.printAll()
      return cubeState;

    }
    rotateFront(times:number,cubeState = this.cubeState) {
      for (let i = 0; i < times; i++) {
        let temp = cubeState.front[0][0];
        cubeState.front[0][0] = cubeState.front[0][2];
        cubeState.front[0][2] = cubeState.front[2][2];
        cubeState.front[2][2] = cubeState.front[2][0];
        cubeState.front[2][0] = temp;
        temp = cubeState.front[0][1];
        cubeState.front[0][1] = cubeState.front[1][2];
        cubeState.front[1][2] = cubeState.front[2][1];
        cubeState.front[2][1] = cubeState.front[1][0];
        cubeState.front[1][0] = temp;
        // Store the state of the affected rows/columns
        const topRow = [...cubeState.top[2]].reverse();
        const rightCol = cubeState.right.map(row => row[0]);
        const bottomRow = [...cubeState.bottom[0]].reverse();
        const leftCol = cubeState.left.map(row => row[2])

        for (let i = 0; i < 3; i++) {
          cubeState.top[2][i] = rightCol[i];
        }
        for (let i = 0; i < 3; i++) {
          cubeState.right[i][0] = bottomRow[i];
        }
        for (let i = 0; i < 3; i++) {
          cubeState.bottom[0][i] = leftCol[i];
        }
        for (let i = 0; i < 3; i++) {
          cubeState.left[i][2] = topRow[i];
        }
    }

    this.printAll()
    return cubeState;


  }
    rotateRight(times:number,cubeState = this.cubeState) {
      for(let i = 0; i < times; i++) {
        let temp = cubeState.right[0][0];
        cubeState.right[0][0] = cubeState.right[0][2];
        cubeState.right[0][2] = cubeState.right[2][2];
        cubeState.right[2][2] = cubeState.right[2][0];
        cubeState.right[2][0] = temp;
        temp = cubeState.right[0][1];
        cubeState.right[0][1] = cubeState.right[1][2];
        cubeState.right[1][2] = cubeState.right[2][1];
        cubeState.right[2][1] = cubeState.right[1][0];
        cubeState.right[1][0] = temp;
        const topCol = cubeState.top.map(row => row[2]);
        const frontCol = cubeState.front.map(row => row[2]);
        const bottomCol = cubeState.bottom.map(row => row[2]).reverse();
        const backCol = cubeState.back.map(row => row[0]).reverse();
        for (let i = 0; i < 3; i++) {
          cubeState.top[i][2] = backCol[i];
          cubeState.front[i][2] = topCol[i];
          cubeState.bottom[i][2] = frontCol[i];
          cubeState.back[i][0] = bottomCol[i];
        }
      }

      this.printAll()
      return cubeState;


    }
    rotateBottom(times: number,cubeState = this.cubeState) {
      for (let i = 0; i < times; i++) {
        let temp = cubeState.bottom[0][0];
        cubeState.bottom[0][0] = cubeState.bottom[0][2];
        cubeState.bottom[0][2] = cubeState.bottom[2][2];
        cubeState.bottom[2][2] = cubeState.bottom[2][0];
        cubeState.bottom[2][0] = temp;
        temp = cubeState.bottom[0][1];
        cubeState.bottom[0][1] = cubeState.bottom[1][2];
        cubeState.bottom[1][2] = cubeState.bottom[2][1];
        cubeState.bottom[2][1] = cubeState.bottom[1][0];
        cubeState.bottom[1][0] = temp;
        const temp2 = cubeState.front[2];
        cubeState.front[2] = cubeState.right[2];
        cubeState.right[2] = cubeState.back[2];
        cubeState.back[2] = cubeState.left[2];
        cubeState.left[2] = temp2;
      }

      this.printAll()
      return cubeState;
    }

    rotateBack(times: number,cubeState = this.cubeState) {
      for (let i = 0; i < times; i++) {
        let temp = cubeState.back[0][2];
        cubeState.back[0][2] = cubeState.back[0][0];
        cubeState.back[0][0] = cubeState.back[2][0];
        cubeState.back[2][0] = cubeState.back[2][2];
        cubeState.back[2][2] = temp;
        temp = cubeState.back[0][1];
        cubeState.back[0][1] = cubeState.back[1][0];
        cubeState.back[1][0] = cubeState.back[2][1];
        cubeState.back[2][1] = cubeState.back[1][2];
        cubeState.back[1][2] = temp;
        const topRow = [...cubeState.top[0]].reverse();
        const rightCol = cubeState.right.map(row => row[2])
        const bottomRow = [...cubeState.bottom[2]].reverse();
        const leftCol = cubeState.left.map(row => row[0]);

        for (let i = 0; i < 3; i++) {
          cubeState.left[i][0] = topRow[i];
          cubeState.top[0][i] = rightCol[i];
          cubeState.right[i][2] = bottomRow[i];
          cubeState.bottom[2][i] = leftCol[i];
        }
      }
      this.printAll()
      return cubeState;



    }
    rotateLeft(times: number,cubeState = this.cubeState) {
      for (let i = 0; i < times; i++) {
        let temp = cubeState.left[0][2];
        cubeState.left[0][2] = cubeState.left[0][0];
        cubeState.left[0][0] = cubeState.left[2][0];
        cubeState.left[2][0] = cubeState.left[2][2];
        cubeState.left[2][2] = temp;
        temp = cubeState.left[0][1];
        cubeState.left[0][1] = cubeState.left[1][0];
        cubeState.left[1][0] = cubeState.left[2][1];
        cubeState.left[2][1] = cubeState.left[1][2];
        cubeState.left[1][2] = temp;
        const topCol = cubeState.top.map(row => row[0])
        const backCol = cubeState.back.map(row => row[2]).reverse()
        const bottomCol = cubeState.bottom.map(row => row[0]).reverse();
        const frontCol = cubeState.front.map(row => row[0])

        for (let i = 0; i < 3; i++) {
          cubeState.back[i][2] = bottomCol[i];
          cubeState.bottom[i][0] = frontCol[i];
          cubeState.front[i][0] = topCol[i];
          cubeState.top[i][0] = backCol[i];
      }
    }

    this.printAll()
    return cubeState;
;
  }
  perform(move:string,cubeState = this.cubeStateCopy){
    for (let i = 0; i < move.length; i++) {
      switch (move[i]) {
        case 'U':
          this.cubeStateCopy=this.rotateTop(1,this.cubeStateCopy);
          break;
        case 'u':
          this.cubeStateCopy=this.rotateTop(3,this.cubeStateCopy);
          break;
        case 'F':
          this.cubeStateCopy=this.rotateFront(3,this.cubeStateCopy);
          break;
        case 'f':
          this.cubeStateCopy=this.rotateFront(1,this.cubeStateCopy);
          break;
        case 'R':
          this.cubeStateCopy=this.rotateRight(3,this.cubeStateCopy);
          break;
        case 'r':
          this.cubeStateCopy=this.rotateRight(1,this.cubeStateCopy);
          break;
        case 'B':
          this.cubeStateCopy=this.rotateBack(1,this.cubeStateCopy);
          break;
        case 'b':
          this.cubeStateCopy=this.rotateBack(3,this.cubeStateCopy);
          break;
        case 'L':
          this.cubeStateCopy=this.rotateLeft(1,this.cubeStateCopy);
          break;
        case 'l':
          this.cubeStateCopy=this.rotateLeft(3,this.cubeStateCopy);
          break;
        case 'D':
          this.cubeStateCopy=this.rotateBottom(3,this.cubeStateCopy);
          break;
        case 'd':
          this.cubeStateCopy=this.rotateBottom(1,this.cubeStateCopy);
          break
      }
      this.updateCubeState(this.cubeStateCopy);
    }
  }
  scramble(){
    const moves = ['U', 'u', 'F', 'f', 'R', 'r', 'B', 'b', 'L', 'l', 'D', 'd'];
    let scramble = '';
    for (let i = 0; i < 20; i++) {
      scramble += moves[Math.floor(Math.random() * 12)];
    }
    return scramble;
  }
  printAll(){
    this.cubeStateCopy = JSON.parse(JSON.stringify(this.cubeState));
    this.updateCubeState(this.cubeStateCopy);
    let s = '';
    s += this.w11
    s += this.w12
    s += this.w13
    s += this.w21
    s += this.w23
    s += this.w31
    s += this.w32
    s += this.w33
    s += this.y11
    s += this.y12
    s += this.y13
    s += this.y21
    s += this.y23
    s += this.y31
    s += this.y32
    s += this.y33
    s += this.b11
    s += this.b12
    s += this.b13
    s += this.b21
    s += this.b23
    s += this.b31
    s += this.b32
    s += this.b33
    s += this.g11
    s += this.g12
    s += this.g13
    s += this.g21
    s += this.g23
    s += this.g31
    s += this.g32
    s += this.g33
    s += this.r11
    s += this.r12
    s += this.r13
    s += this.r21
    s += this.r23
    s += this.r31
    s += this.r32
    s += this.r33
    s += this.o11
    s += this.o12
    s += this.o13
    s += this.o21
    s += this.o23
    s += this.o31
    s += this.o32
    s += this.o33
    console.log(s);
  }
  solve_white_cross(){
    let n = 2;
    let s = '';
    do
    {
      if (this.w12 === 'w')
      {
        if (this.g32 === 'r') { s+="ffUll"; this.perform("ffUll"); }
        else if (this.g32 === 'o') {s+="ffurr"; this.perform("ffurr"); }
        else if (this.g32 === 'b') {s+="ffuubb"; this.perform("ffuubb"); }
      }
      if (this.w21 === 'w')
      {
        if (this.r32 === 'g') {s+="lluff"; this.perform("lluff"); }
        else if (this.r32 === 'o') {s+="lluurr"; this.perform("lluurr"); }
        else if (this.r32 === 'b') {s+="llUbb"; this.perform("llUbb"); }
      }
      if (this.w32 === 'w')
      {
        if (this.b32 === 'g') { s += "bbuuff"; this.perform("bbuuff"); }
        else if (this.b32 === 'o') { s += "bbUrr"; this.perform("bbUrr"); }
        else if (this.b32 === 'r') { s += "bbull"; this.perform("bbull"); }
      }
      if (this.w23 === 'w')
      {
        if (this.o32 === 'g') { s += "rrUff"; this.perform("rrUff"); }
        else if (this.o32 === 'r') { s += "rrUUll"; this.perform("rrUUll"); }
        else if (this.o32 === 'b') { s += "rrubb"; this.perform("rrubb"); }
      }
      if (this.g12 === 'w')
      {
        if (this.y32 === 'g') { s += "urFR"; this.perform("urFR"); }
        else if (this.y32 === 'r') { s += "fLF"; this.perform("fLF"); }
        else if (this.y32 === 'o') { s += "Frf"; this.perform("Frf"); }
        else if (this.y32 === 'b') { s += "uRbr"; this.perform("uRbr"); }
      }
      if (this.g21 === 'w')
      {
        if (this.r23 === 'g') { s += "dLD"; this.perform("dLD"); }
        else if (this.r23 === 'r') { s += "L"; this.perform("L"); }
        else if (this.r23 === 'o') { s += "FFrFF"; this.perform("FFrFF"); }
        else if (this.r23 === 'b') { s += "DLd"; this.perform("DLd"); }
      }
      if (this.g32 === 'w')
      {
        if (this.w12 === 'g') { s += "dLD"; this.perform("dLD"); }
        else if (this.w12 === 'r') { s += "L"; this.perform("L"); }
        else if (this.w12 === 'o') { s += "FFrFF"; this.perform("FFrFF"); }
        else if (this.w12 === 'b') { s += "DLd"; this.perform("DLd"); }
      }
      if (this.g23 === 'w')
      {
        if (this.o21 === 'g') { s += "Drd"; this.perform("Drd"); }
        else if (this.o21 === 'r') { s += "FFLFF"; this.perform("FFLFF"); }
        else if (this.o21 === 'o') { s += "r"; this.perform("r"); }
        else if (this.o21 === 'b') { s += "drD"; this.perform("drD"); }
      }
      if (this.y12 === 'w')
      {
        if (this.b12 === 'g') { s += "UUFF"; this.perform("UUFF"); }
        else if (this.b12 === 'r') { s += "ull"; this.perform("ull"); }
        else if (this.b12 === 'o') { s += "URR"; this.perform("URR"); }
        else if (this.b12 === 'b') { s += "bb"; this.perform("bb"); }
      }
      if (this.y21 === 'w')
      {
        if (this.r12 === 'g') { s += "uFF"; this.perform("uFF"); }
        else if (this.r12 === 'r') { s += "ll"; this.perform("ll"); }
        else if (this.r12 === 'o') { s += "UURR"; this.perform("UURR"); }
        else if (this.r12 === 'b') { s += "DLd"; this.perform("DLd"); }
      }
      if (this.y32 === 'w')
      {
        if (this.g12 === 'g') { s += "FF"; this.perform("FF"); }
        else if (this.g12 === 'r') { s += "Ull"; this.perform("Ull"); }
        else if (this.g12 === 'o') { s += "uRR"; this.perform("uRR"); }
        else if (this.g12 === 'b') { s += "UUbb"; this.perform("UUbb"); }
      }
      if (this.y23 === 'w')
      {
        if (this.o12 === 'g') { s += "UFF"; this.perform("UFF"); }
        else if (this.o12 === 'r') { s += "UUll"; this.perform("UUll"); }
        else if (this.o12 === 'o') { s += "RR"; this.perform("RR"); }
        else if (this.o12 === 'b') { s += "ubb"; this.perform("ubb"); }
      }
      if (this.r12 === 'w')
      {
        if (this.y21 === 'g') { s += "Lfl"; this.perform("Lfl"); }
        else if (this.y21 === 'r') { s += "ufLF"; this.perform("ufLF"); }
        else if (this.y21 === 'o') { s += "uFrf"; this.perform("uFrf"); }
        else if (this.y21 === 'b') { s += "lBL"; this.perform("lBL"); }
      }
      if (this.r21 === 'w')
      {
        if (this.b23 === 'g') { s += "ddBdd"; this.perform("ddBdd"); }
        else if (this.b23 === 'r') { s += "dBD"; this.perform("dBD"); }
        else if (this.b23 === 'o') { s += "DBd"; this.perform("DBd"); }
        else if (this.b23 === 'b') { s += "B"; this.perform("B"); }
      }
      if (this.r32 === 'w')
      {
        if (this.w21 === 'g') { s += "lf"; this.perform("lf"); }
        else if (this.w21 === 'r') { s += "lDfd"; this.perform("lDfd"); }
        else if (this.w21 === 'o') { s += "ldfD"; this.perform("ldfD"); }
        else if (this.w21 === 'b') { s += "LB"; this.perform("LB"); }
      }
      if (this.r23 === 'w')
      {
        if (this.g21 === 'g') { s += "f"; this.perform("f"); }
        else if (this.g21 === 'r') { s += "Dfd"; this.perform("Dfd"); }
        else if (this.g21 === 'o') { s += "dfD"; this.perform("dfD"); }
        else if (this.g21 === 'b') { s += "ddfdd"; this.perform("ddfdd"); }
      }
      if (this.b12 === 'w')
      {
        if (this.y12 === 'g') { s += "UrFR"; this.perform("UrFR"); }
        else if (this.y12 === 'r') { s += "Blb"; this.perform("Blb"); }
        else if (this.y12 === 'o') { s += "bRB"; this.perform("bRB"); }
        else if (this.y12 === 'b') { s += "URbr"; this.perform("URbr"); }
      }
      if (this.b21 === 'w')
      {
        if (this.o23 === 'g') { s += "ddbdd"; this.perform("ddbdd"); }
        else if (this.o23 === 'r') { s += "dbD"; this.perform("dbD"); }
        else if (this.o23 === 'o') { s += "R"; this.perform("R"); }
        else if (this.o23 === 'b') { s += "dRD"; this.perform("dRD"); }
      }
      if (this.b32 === 'w')
      {
        if (this.w32 === 'g') { s += "bdlD"; this.perform("bdlD"); }
        else if (this.w32 === 'r') { s += "bl"; this.perform("bl"); }
        else if (this.w32 === 'o') { s += "BR"; this.perform("BR"); }
        else if (this.w32 === 'b') { s += "bDld"; this.perform("bDld"); }
      }
      if (this.b23 === 'w')
      {
        if (this.r21 === 'g') { s += "llfll"; this.perform("llfll"); }
        else if (this.r21 === 'r') { s += "l"; this.perform("l"); }
        else if (this.r21 === 'o') { s += "DBd"; this.perform("DBd"); }
        else if (this.r21 === 'b') { s += "Dld"; this.perform("Dld"); }
      }
      if (this.o12 === 'w')
      {
        if (this.y23 === 'g') { s += "rFR"; this.perform("rFR"); }
        else if (this.y23 === 'r') { s += "UfLF"; this.perform("UfLF"); }
        else if (this.y23 === 'o') { s += "UFrf"; this.perform("UFrf"); }
        else if (this.y23 === 'b') { s += "Rbr"; this.perform("Rbr"); }
      }
      if (this.o21 === 'w')
      {
        if (this.g23 === 'g') { s += "F"; this.perform("F"); }
        else if (this.g23 === 'r') { s += "DFd"; this.perform("DFd"); }
        else if (this.g23 === 'o') { s += "dFD"; this.perform("dFD"); }
        else if (this.g23 === 'b') { s += "ddFdd"; this.perform("ddFdd"); }
      }
      if (this.o32 === 'w')
      {
        if (this.w23 === 'g') { s += "RF"; this.perform("RF"); }
        else if (this.w23 === 'r') { s += "RDFd"; this.perform("RDFd"); }
        else if (this.w23 === 'o') { s += "RdFD"; this.perform("RdFD"); }
        else if (this.w23 === 'b') { s += "rb"; this.perform("rb"); }
      }
      if (this.o23 === 'w')
      {
        if (this.b21 === 'g') { s += "DRd"; this.perform("DRd"); }
        else if (this.b21 === 'r') { s += "dbD"; this.perform("dbD"); }
        else if (this.b21 === 'o') { s += "Dbd"; this.perform("Dbd"); }
        else if (this.b21 === 'b') { s += "b"; this.perform("b"); }
      }
    } while (n-- > 0);
    return s;
  }
  solve_white_corners(){
    let s = '';
    while (this.g33 !== 'g' || this.w13 !== 'w' || this.g31 !== 'g' || this.w11 !== 'w' || this.b31 !== 'b' || this.w33 !== 'w' || this.b33 !== 'b' || this.w31 !== 'w')
			{
				if (this.g13 === 'w')
				{
					if (this.o11 === 'o') { s += "fuF"; this.perform("fuF"); }
					else if (this.o11 === 'b') { s += "Bub"; this.perform("Bub"); }
					else if (this.o11 === 'r') { s += "Luul"; this.perform("Luul"); }
					else if (this.o11 === 'g') { s += "UluL"; this.perform("UluL"); }
				}
				if (this.y33 === 'w')
				{
					if (this.o11 === 'o') { s += "uBUUbuBUb"; this.perform("uBUUbuBUb"); }
					else if (this.o11 === 'b') { s += "UlUULLUUl"; this.perform("UlUULLUUl"); }
					else if (this.o11 === 'r') { s += "UlUULUluL"; this.perform("UlUULUluL"); }
					else if (this.o11 === 'g') { s += "RUUruRUr"; this.perform("RUUruRUr"); }
				}
				if (this.o11 === 'w')
				{
					if (this.g13 === 'o') { s += "uBUb"; this.perform("uBUb"); }
					else if (this.g13 === 'b') { s += "UbUB"; this.perform("UbUB"); }
					else if (this.g13 === 'r') { s += "lUL"; this.perform("lUL"); }
					else if (this.g13 === 'g') { s += "RUr"; this.perform("RUr"); }
				}
				if (this.g13 === 'w' || this.y33 === 'w' || this.o11 === 'w' || this.o13 === 'w' || this.y13 === 'w' || this.b11 === 'w' ||
					this.b13 === 'w' || this.y11 === 'w' || this.r11 === 'w' || this.r13 === 'w' || this.y31 === 'w' || this.g11 === 'w')
				{
					if (this.g13 !== 'w' && this.y33 !== 'w' && this.o11 !== 'w')
					{ s += "U"; this.perform("U"); }
				}
				else
				{
					if (this.g33 !== 'g' || this.w13 !== 'w') { s += "Rur"; this.perform("Rur"); continue; }
					if (this.g31 !== 'g' || this.w11 !== 'w') { s += "luL"; this.perform("luL"); continue; }
					if (this.b31 !== 'b' || this.w33 !== 'w') { s += "BUb"; this.perform("BUb"); continue; }
					if (this.b33 !== 'b' || this.w31 !== 'w') { s += "Luul"; this.perform("Luul"); continue; }
				}
			}
      return s;
  }
  solve_middle_layer(){
    let s = '';
    while (this.g23 !== 'g' || this.o21 !== 'o' || this.o23 !== 'o' || this.b21 !== 'b' ||
      this.b23 !== 'b' || this.r21 !== 'r' || this.r23 !== 'r' || this.g21 !== 'g')
        {
          if (this.g12 === 'o' && this.y32 === 'g') { s += "UUrFRfRUr"; this.perform("UUrFRfRUr"); }
          if (this.g12 === 'o' && this.y32 === 'b') { s += "RbrBruR"; this.perform("RbrBruR"); }
          if (this.g12 === 'g' && this.y32 === 'r') { s += "ufLFlFUf"; this.perform("ufLFlFUf"); }
          if (this.g12 === 'g' && this.y32 === 'o') { s += "UFrfRfuF"; this.perform("UFrfRfuF"); }
          if (this.g12 === 'r' && this.y32 === 'b') { s += "lBLbLUl"; this.perform("lBLbLUl"); }
          if (this.g12 === 'r' && this.y32 === 'g') { s += "UULflFluL"; this.perform("UULflFluL"); }
          if (this.g12 === 'b' && this.y32 === 'o') { s += "UbRBrBUb"; this.perform("UbRBrBUb"); }
          if (this.g12 === 'b' && this.y32 === 'r') { s += "uBlbLbuB"; this.perform("uBlbLbuB"); }
          if (this.g12 === 'y' || this.y32 === 'y')
          {
            if (this.o12 !== 'y' && this.y23 !== 'y') { s += "U"; this.perform("U"); continue; }
            else if (this.b12 !== 'y' && this.y12 !== 'y') { s += "UU"; this.perform("UU"); continue; }
            else if (this.r12 !== 'y' && this.y21 !== 'y') { s += "u"; this.perform("u"); continue; }
          }
          else continue;
          if (this.g23 !== 'g' || this.o21 !== 'o' || this.o23 !== 'o' || this.b21 !== 'b' ||
            this.b23 !== 'b' || this.r21 !== 'r' || this.r23 !== 'r' || this.g21 !== 'g')
          {
            if (this.g23 !== 'g' && this.o21 !== 'o') { s += "RurFrfR"; this.perform("RurFrfR"); continue; }
            if (this.o23 !== 'o' && this.b21 !== 'b') { s += "BubRbrB"; this.perform("BubRbrB"); continue; }
            if (this.b23 !== 'b' && this.r21 !== 'r') { s += "LulBlbL"; this.perform("LulBlbL"); continue; }
            if (this.r23 !== 'r' && this.g21 !== 'g') { s += "FufLflF"; this.perform("FufLflF"); continue; }
          }
        }
        return s;
  }
  OLL(){
    let s = '';
    while (!(this.y11 === this.y12 && this.y12 === this.y13 && this.y21 === this.y23 && this.y31 === this.y32))
      {

        if (this.y12 === 'y' && this.y21 === 'y' && this.y23 === 'y' && this.y32 === 'y') // cross
        {
          if (this.y11 === 'y' && this.y13 === 'y' && this.g13 === 'y') { s += "RRDruuRdruur"; this.perform("RRDruuRdruur"); break; }//23
          else if (this.y13 === 'y' && this.y33 === 'y' && this.g11 === 'y') { s += "LFrflFRf"; this.perform("LFrflFRf"); break; }//24
          else if (this.y11 === 'y' && this.y33 === 'y' && this.o13 === 'y') { s += "rFRbrfRB"; this.perform("rFRbrfRB"); break; }//25
          else if (this.y11 === 'y' && this.b11 === 'y' && this.g11 === 'y') { s += "ruRuruuR"; this.perform("ruRuruuR"); break; }//26
          else if (this.y11 === 'y' && this.o13 === 'y' && this.r13 === 'y' && this.g13 === 'y') { s += "luuLUlUL"; this.perform("luuLUlUL"); break; }//27
          else if (this.o13 === 'y' && this.g11 === 'y' && this.g13 === 'y' && this.r11 === 'y') { s += "RUURRuRRuRRUUR"; this.perform("RUURRuRRuRRUUR"); break; }//22
          else if (this.r11 === 'y' && this.r13 === 'y' && this.o11 === 'y' && this.o13 === 'y') { s += "RUrURurURUUr"; this.perform("RUrURurURUUr"); break; }//21
        }
        else if (this.y21 === 'y' && this.y23 === 'y') // line
        {
          if (this.y31 === 'y' && this.o13 === 'y' && this.g13 === 'y') { s += "FURUUruRUrf"; this.perform("FURUUruRUrf"); break; }//13
          else if (this.y33 === 'y' && this.g11 === 'y' && this.b11 === 'y' && this.r11 === 'y') { s += "rFRUrfRFuf"; this.perform("rFRUrfRFuf"); break; }//14
          else if (this.y33 === 'y' && this.b13 === 'y' && this.r13 === 'y') { s += "urUURUrFURurfR"; this.perform("urUURUrFURurfR"); break; }//15
          else if (this.y13 === 'y' && this.g11 === 'y' && this.o11 === 'y' && this.r11 === 'y') { s += "LFlRUruLfl"; this.perform("LFlRUruLfl"); break; }//16
          else if (this.y13 === 'y' && this.y33 === 'y' && this.g11 === 'y' && this.b13 === 'y') { s += "RUrurFRf"; this.perform("RUrurFRf"); break; }//33
          else if (this.y13 === 'y' && this.y33 === 'y') { s += "FRUruf"; this.perform("FRUruf"); break; }//45
          else if (this.y11 === 'y' && this.y13 === 'y' && this.g11 !== 'y') { s += "UURUrubrFRfB"; this.perform("UURUrubrFRfB"); break; }//34
          else if (this.y11 === 'y' && this.y13 === 'y' && this.g11 === 'y') { s += "ururFRfUR"; this.perform("ururFRfUR"); break; }//46
          else if (this.y31 === 'y' && this.y13 === 'y' && this.r11 === 'y') { s += "UULfluLUFul"; this.perform("UULfluLUFul"); break; }//39
          else if (this.y11 === 'y' && this.y33 === 'y' && this.b11 === 'y' && this.b12 === 'y') { s += "rFRUrufUR"; this.perform("rFRUrufUR"); break; }//40
          else if (this.g11 === 'y' && this.g12 === 'y' && this.g13 === 'y' && this.b11 === 'y') { s += "URUURRuRurUUFRf"; this.perform("URUURRuRurUUFRf"); break; }//55
          else if (this.r11 === 'y' && this.r13 === 'y' && this.o11 === 'y' && this.o13 === 'y') { s += "FRUruRfLFrfl"; this.perform("FRUruRfLFrfl"); break; }//56
          else if (this.r11 === 'y' && this.r13 === 'y') { s += "UUFURurURurf"; this.perform("UUFURurURurf"); break; }//51
          else if (this.r13 === 'y' && this.o11 === 'y' && this.b11 === 'y' && this.b13 === 'y') { s += "UruRurUfUFR"; this.perform("UruRurUfUFR"); break; }//52
          else if (this.y11 === 'y' && this.y13 === 'y' && this.y31 === 'y' && this.y33 === 'y') { s += "RUruLrFRfl"; this.perform("RUruLrFRfl"); break; }//57
        }
        else if (this.y12 === 'y' && this.y21 === 'y') // L
        {
          if (this.y11 === 'y' && this.r13 === 'y' && this.g13 === 'y' && this.o13 === 'y') { s += "rffLFlFR"; this.perform("rffLFlFR"); break; }//5
          else if (this.y11 === 'y' && this.b11 === 'y' && this.g11 === 'y' && this.o11 === 'y') { s += "ULffrfRfl"; this.perform("ULffrfRfl"); break; }//6
          else if (this.y31 === 'y' && this.b13 === 'y' && this.g13 === 'y' && this.o13 === 'y') { s += "LFrFRffl"; this.perform("LFrFRffl"); break; }//7
          else if (this.r11 === 'y' && this.y13 === 'y' && this.o11 === 'y' && this.g11 === 'y') { s += "URUUrUUrFRf"; this.perform("URUUrUUrFRf"); break; }//8
          else if (this.r11 === 'y' && this.y33 === 'y' && this.g11 === 'y') { s += "RUrurFRRUruf"; this.perform("RUrurFRRUruf"); break; }//9
          else if (this.b13 === 'y' && this.y33 === 'y' && this.r13 === 'y') { s += "uRUrUrFRfRUUr"; this.perform("uRUrUrFRfRUUr"); break; }//10
          else if (this.y13 === 'y' && this.r13 === 'y' && this.g13 === 'y' && this.b13 === 'y') { s += "LFrFrDRdRffl"; this.perform("LFrFrDRdRffl"); break; }//11
          else if (this.y31 === 'y' && this.r11 === 'y' && this.o11 === 'y' && this.b11 === 'y') { s += "UUFRUrufUFRUruf"; this.perform("UUFRUrufUFRUruf"); break; }//12
          else if (this.y11 === 'y' && this.y13 === 'y' && this.y33 === 'y' && this.y31 === 'y') { s += "LFrflRURur"; this.perform("LFrflRURur"); break; }//28
          else if (this.y33 === 'y' && this.y13 === 'y' && this.g11 === 'y') { s += "UrFRfRUUrufuF"; this.perform("UrFRfRUUrufuF"); break; }//29
          else if (this.y31 === 'y' && this.y33 === 'y' && this.r11 === 'y' && this.o13 === 'y') { s += "FrFRRuruRUrff"; this.perform("FrFRRuruRUrff"); break; }//30
          else if (this.y11 === 'y' && this.y13 === 'y' && this.r13 === 'y') { s += "UruFURurfR"; this.perform("UruFURurfR"); break; }//31
          else if (this.y11 === 'y' && this.y31 === 'y' && this.g13 === 'y') { s += "LUfulULFl"; this.perform("LUfulULFl"); break; }//32
          else if (this.y33 === 'y' && this.r13 === 'y' && this.y11 === 'y') { s += "UURUURRFRfRUUr"; this.perform("UURUURRFRfRUUr"); break; }//35
          else if (this.y31 === 'y' && this.y13 === 'y' && this.g13 === 'y') { s += "UluLulULULflF"; this.perform("UluLulULULflF"); break; }//36
          else if (this.y11 === 'y' && this.y33 === 'y' && this.g11 === 'y') { s += "FrfRURur"; this.perform("FrfRURur"); break; }//37
          else if (this.y31 === 'y' && this.y13 === 'y' && this.b13 === 'y') { s += "RUrURururFRf"; this.perform("RUrURururFRf"); break; }//38
          else if (this.y31 === 'y' && this.y33 === 'y' && this.b13 === 'y' && this.b11 === 'y') { s += "RUrURUUrFRUruf"; this.perform("RUrURUUrFRUruf"); break; }//41
          else if (this.y13 === 'y' && this.y33 === 'y' && this.r11 === 'y') { s += "UrURUUrufUFUR"; this.perform("UrURUUrufUFUR"); break; }//42
          else if (this.y11 === 'y' && this.y13 === 'y' && this.g11 === 'y' && this.g13 === 'y') { s += "rufUFR"; this.perform("rufUFR"); break; }//43
          else if (this.y11 === 'y' && this.y31 === 'y' && this.o11 === 'y' && this.o13 === 'y') { s += "FURurf"; this.perform("FURurf"); break; }//44
          else if (this.b13 === 'y' && this.b11 === 'y' && this.r13 === 'y' && this.o11 === 'y') { s += "UfluLUluLUF"; this.perform("UfluLUluLUF"); break; }//47
          else if (this.r11 === 'y' && this.r13 === 'y' && this.g13 === 'y' && this.b11 === 'y') { s += "FRUruRUruf"; this.perform("FRUruRUruf"); break; }//48
          else if (this.r11 === 'y' && this.g11 === 'y' && this.g13 === 'y' && this.o13 === 'y') { s += "uRbRRFRRBrrfR"; this.perform("uRbRRFRRBrrfR"); break; }//49
          else if (this.b13 === 'y' && this.g11 === 'y' && this.o11 === 'y' && this.o13 === 'y') { s += "rFRRbRRfRRBr"; this.perform("rFRRbRRfRRBr"); break; }//50
          else if (this.r11 === 'y' && this.r13 === 'y' && this.o11 === 'y' && this.o13 === 'y') { s += "UUlbRbrBRbrBBL"; this.perform("UUlbRbrBRbrBBL"); break; }//53
          else if (this.b13 === 'y' && this.b11 === 'y' && this.g11 === 'y' && this.g13 === 'y') { s += "ULFrFRfrFRffl"; this.perform("ULFrFRfrFRffl"); break; }//54
        }
        else if (this.y12 !== 'y' && this.y21 !== 'y' && this.y23 !== 'y' && this.y32 !== 'y') // dot
        {
          if (this.r11 === 'y' && this.r12 === 'y' && this.o11 === 'y' && this.o13 === 'y') { s += "RUURRFRfUUrFRf"; this.perform("RUURRFRfUUrFRf"); break; }//1
          else if (this.r11 === 'y' && this.r13 === 'y' && this.g13 === 'y' && this.b11 === 'y') { s += "FRUrufBULulb"; this.perform("FRUrufBULulb"); break; }//2
          else if (this.y31 === 'y' && this.g13 === 'y' && this.b13 === 'y' && this.o13 === 'y') { s += "UFURurfUFRUruf"; this.perform("UFURurfUFRUruf"); break; }//3
          else if (this.r11 === 'y' && this.g11 === 'y' && this.y33 === 'y' && this.b11 === 'y') { s += "UFURurfuFRUruf"; this.perform("UFURurfuFRUruf"); break; }//4
          else if (this.y11 === 'y' && this.r13 === 'y' && this.y33 === 'y' && this.b11 === 'y') { s += "RUrUrFRfUUrFRf"; this.perform("RUrUrFRfUUrFRf"); break; }//17
          else if (this.y11 === 'y' && this.g11 === 'y' && this.g13 === 'y' && this.y13 === 'y') { s += "UUFRUrUfUUfLFl"; this.perform("UUFRUrUfUUfLFl"); break; }//18
          else if (this.y11 === 'y' && this.r13 === 'y' && this.o11 === 'y' && this.y13 === 'y') { s += "rUUFRUruffUUFR"; this.perform("rUUFRUruffUUFR"); break; }//19
          else if (this.y11 === 'y' && this.y13 === 'y' && this.y33 === 'y' && this.y31 === 'y') { s += "RlBRBrbRRllFRfl"; this.perform("RlBRBrbRRllFRfl"); break; }//20
        }
        s += "U"; this.perform("U");
      }
      return s;
  }
  PLL(){
    let s = '';
    if (!(this.g11 === this.g12 && this.g12 === this.g13 && this.g13 === this.g33 && this.r11 === this.r12 && this.r12 === this.r13 && this.r13 === this.r33))
      while (true)
      {
        if (this.g11 === this.g12 && this.g12 === this.g13 && this.r11 === this.r12 && this.r12 === this.r13) { break; }
        if ((this.r11 === this.r13 && this.g11 === this.g13 && this.o11 === this.o13 && this.r12 === this.o11 && this.g11 === this.b12)) { s += "RRUURUURRUURRUURUURR"; this.perform("RRUURUURRUURRUURUURR"); break; }// H perm
        if (this.r11 === this.r13 && this.b11 === this.b13 && this.o11 === this.o13 && this.b12 === this.r11 && this.r12 === this.o11) { s += "RRuruRURURuR"; this.perform("RRuruRURURuR"); break; }// UA perm
        if (this.r11 === this.r13 && this.b11 === this.b13 && this.o11 === this.o13 && this.b12 === this.o11 && this.o12 === this.r11) { s += "rUrururURURR"; this.perform("rUrururURURR"); break; }// Ub perm
        if ((this.r11 === this.r13 && this.b11 === this.b13 && this.o11 === this.o13 && this.g11 === this.g13 && this.o12 === this.g11 && this.b11 === this.r12)) { s += "ruRRURUruRURuRur"; this.perform("ruRRURUruRURuRur"); break; }// Z perm
        if (this.g11 === this.g12 && this.r13 === this.r12 && this.b11 === this.b13) { s += "rFrBBRfrBBRR"; this.perform("rFrBBRfrBBRR"); break; }// Aa perm
        if (this.r11 === this.r12 && this.b13 === this.b12 && this.g11 === this.g13) { s += "RbRFFrBRFFRR"; this.perform("RbRFFrBRFFRR"); break; }// Ab perm
        if (this.g11 === this.b13 && this.g13 === this.b11 && this.r11 === this.o13 && this.o11 === this.r13 && this.o12 === this.g13 && this.g12 === this.o13) { s += "RbrFRBrfRBrFRbrf"; this.perform("RbrFRBrfRBrFRbrf"); break; }// E perm
        if (this.g11 === this.g12 && this.g12 === this.g13 && this.r11 === this.o13 && this.r13 === this.o12) { s += "rURuRRfuFURFrfRRu"; this.perform("rURuRRfuFURFrfRRu"); break; } // F perm
        if (this.g11 === this.g13 && this.o13 === this.o12 && this.o12 === this.r11 && this.o11 === this.r12) { s += "UUFFDrUruRdFFlUL"; this.perform("UUFFDrUruRdFFlUL"); break; } // Ga perm
        if (this.r11 === this.r13 && this.b11 === this.b12 && this.b12 === this.g13 && this.r12 === this.o13) { s += "RRdFuFUfDRRBub"; this.perform("RRdFuFUfDRRBub"); break; } // Gc perm
        if (this.r11 === this.r13 && this.o11 === this.o12 && this.g13 === this.b11 && this.g11 === this.b12) { s += "RUrffdLulUlDff"; this.perform("RUrffdLulUlDff"); break; } // Gd perm
        if (this.r11 === this.r13 && this.o13 === this.o12 && this.b11 === this.g13 && this.g12 === this.o11) { s += "ruRUdRRUrURuRuRRD"; this.perform("ruRUdRRUrURuRuRRD"); break; } // Gb perm
        if (this.g11 === this.g12 && this.g12 === this.g13 && this.r11 === this.r12 && this.o11 === this.o12) { s += "rUlUURurUURL"; this.perform("rUlUURurUURL"); break; } // Ja perm
        if (this.r11 === this.r12 && this.r12 === this.r13 && this.g12 === this.g13 && this.b13 === this.b12) { s += "RUUruRUUlUruL"; this.perform("RUUruRUUlUruL"); break; } // Jb perm
        if (this.r13 === this.r12 && this.o13 === this.o12 && this.g12 === this.g13 && this.b13 === this.b12 && this.g11 === this.b13 && this.r13 === this.o11) { s += "LuRUUlUrLuRUUlUr"; this.perform("LuRUUlUrLuRUUlUr"); break; } // Na perm
        if (this.r11 === this.r12 && this.o11 === this.o12 && this.g11 === this.g12 && this.b11 === this.b12 && this.g13 === this.b11 && this.o13 === this.r11) { s += "rUlUURuLrUlUURuL"; this.perform("rUlUURuLrUlUURuL"); break; } // Nb perm
        if (this.g11 === this.g13 && this.o11 === this.o12 && this.o13 === this.r11 && this.g12 === this.r13) { s += "LUUlUULfluLULFll"; this.perform("LUUlUULfluLULFll"); break; } // Ra perm
        if (this.g11 === this.g13 && this.r13 === this.r12 && this.r11 === this.o13 && this.g12 === this.o11) { s += "rUURUUrFRUrurfRR"; this.perform("rUURUUrFRUrurfRR"); break; } // Rb perm
        if (this.r11 === this.r13 && this.g11 === this.g12 && this.b13 === this.b12) { s += "RUrurFRRuruRUrf"; this.perform("RUrurFRRuruRUrf"); break; } // T perm
        if (this.g11 === this.g12 && this.r13 === this.r12 && this.o11 !== this.o13 && this.b11 !== this.b13 && this.g13 === this.o12) { s += "RUUrDRuRuRURRDruRdd"; this.perform("RUUrDRuRuRURRDruRdd"); break; } // V perm
        if (this.g11 === this.g12 && this.r13 === this.o11 && this.o13 === this.o12) { s += "FRuruRUrfRUrurFRf"; this.perform("FRuruRUrfRUrurFRf"); break; }// Y perm
        s += "U"; this.perform("U");
      }
    while (!(this.g11 === this.g12 && this.g12 === this.g13 && this.g13 === this.g33 && this.r11 === this.r12 && this.r12 === this.r13 && this.r13 === this.r33)) { s += "U"; this.perform("U"); }
    return s;
  }
  solve(){
    let s = '';
    this.cubeStateCopy = JSON.parse(JSON.stringify(this.cubeState));
    this.updateCubeState(this.cubeStateCopy);
    s += this.solve_white_cross();
    s += this.solve_white_corners();
    s += this.solve_middle_layer();
    s += this.OLL();
    s += this.PLL();
    return s;
  }
  reverseMoves(moves:string){
    let reversed = '';
    for (let i = moves.length - 1; i >= 0; i--) {
      if(moves[i] === ' ') continue;
      const move = moves[i];
      if (move === move.toUpperCase()) {
        reversed += move.toLowerCase();
      } else {
        reversed += move.toUpperCase();
      }
    }
    return reversed;
  }

}

