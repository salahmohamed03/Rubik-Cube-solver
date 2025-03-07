export class CubeService {
    cubeState:{
      front:string[][],
      back:string[][],
      top:string[][],
      bottom:string[][],
      left:string[][],
      right:string[][]
    }
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
    }
    printCube(): void {
      console.log('Top:', this.cubeState.top);
      console.log('Front:', this.cubeState.front);
      console.log('Bottom:', this.cubeState.bottom);
      console.log('Back:', this.cubeState.back);
      console.log('Left:', this.cubeState.left);
      console.log('Right:', this.cubeState.right);
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
    rotateTop(times:number) {
      for (let i = 0; i < times; i++) {
        this.rotateFace(this.cubeState.top);
        const temp = this.cubeState.front[0];
        this.cubeState.front[0] = this.cubeState.right[0];
        this.cubeState.right[0] = this.cubeState.back[0];
        this.cubeState.back[0] = this.cubeState.left[0];
        this.cubeState.left[0] = temp;
      }
    }
    rotateFront(times:number) {
      for (let i = 0; i < times; i++) {
        let temp = this.cubeState.front[0][0];
        this.cubeState.front[0][0] = this.cubeState.front[0][2];
        this.cubeState.front[0][2] = this.cubeState.front[2][2];
        this.cubeState.front[2][2] = this.cubeState.front[2][0];
        this.cubeState.front[2][0] = temp;
        temp = this.cubeState.front[0][1];
        this.cubeState.front[0][1] = this.cubeState.front[1][2];
        this.cubeState.front[1][2] = this.cubeState.front[2][1];
        this.cubeState.front[2][1] = this.cubeState.front[1][0];
        this.cubeState.front[1][0] = temp;
        // Store the state of the affected rows/columns
        const topRow = [...this.cubeState.top[2]].reverse();
        const rightCol = this.cubeState.right.map(row => row[0]);
        const bottomRow = [...this.cubeState.bottom[0]].reverse();
        const leftCol = this.cubeState.left.map(row => row[2])

        for (let i = 0; i < 3; i++) {
          this.cubeState.top[2][i] = rightCol[i];
        }
        for (let i = 0; i < 3; i++) {
          this.cubeState.right[i][0] = bottomRow[i];
        }
        for (let i = 0; i < 3; i++) {
          this.cubeState.bottom[0][i] = leftCol[i];
        }
        for (let i = 0; i < 3; i++) {
          this.cubeState.left[i][2] = topRow[i];
        }
    }
  }
    rotateRight(times:number) {
      for(let i = 0; i < times; i++) {
        let temp = this.cubeState.right[0][0];
        this.cubeState.right[0][0] = this.cubeState.right[0][2];
        this.cubeState.right[0][2] = this.cubeState.right[2][2];
        this.cubeState.right[2][2] = this.cubeState.right[2][0];
        this.cubeState.right[2][0] = temp;
        temp = this.cubeState.right[0][1];
        this.cubeState.right[0][1] = this.cubeState.right[1][2];
        this.cubeState.right[1][2] = this.cubeState.right[2][1];
        this.cubeState.right[2][1] = this.cubeState.right[1][0];
        this.cubeState.right[1][0] = temp;
        const topCol = this.cubeState.top.map(row => row[2]);
        const frontCol = this.cubeState.front.map(row => row[2]);
        const bottomCol = this.cubeState.bottom.map(row => row[2]).reverse();
        const backCol = this.cubeState.back.map(row => row[0]).reverse();
        for (let i = 0; i < 3; i++) {
          this.cubeState.top[i][2] = backCol[i];
          this.cubeState.front[i][2] = topCol[i];
          this.cubeState.bottom[i][2] = frontCol[i];
          this.cubeState.back[i][0] = bottomCol[i];
        }
      }
    }
    rotateBottom(times: number) {
      for (let i = 0; i < times; i++) {
        let temp = this.cubeState.bottom[0][0];
        this.cubeState.bottom[0][0] = this.cubeState.bottom[0][2];
        this.cubeState.bottom[0][2] = this.cubeState.bottom[2][2];
        this.cubeState.bottom[2][2] = this.cubeState.bottom[2][0];
        this.cubeState.bottom[2][0] = temp;
        temp = this.cubeState.bottom[0][1];
        this.cubeState.bottom[0][1] = this.cubeState.bottom[1][2];
        this.cubeState.bottom[1][2] = this.cubeState.bottom[2][1];
        this.cubeState.bottom[2][1] = this.cubeState.bottom[1][0];
        this.cubeState.bottom[1][0] = temp;
        const temp2 = this.cubeState.front[2];
        this.cubeState.front[2] = this.cubeState.right[2];
        this.cubeState.right[2] = this.cubeState.back[2];
        this.cubeState.back[2] = this.cubeState.left[2];
        this.cubeState.left[2] = temp2;
      }
    }

    rotateBack(times: number) {
      for (let i = 0; i < times; i++) {
        let temp = this.cubeState.back[0][2];
        this.cubeState.back[0][2] = this.cubeState.back[0][0];
        this.cubeState.back[0][0] = this.cubeState.back[2][0];
        this.cubeState.back[2][0] = this.cubeState.back[2][2];
        this.cubeState.back[2][2] = temp;
        temp = this.cubeState.back[0][1];
        this.cubeState.back[0][1] = this.cubeState.back[1][0];
        this.cubeState.back[1][0] = this.cubeState.back[2][1];
        this.cubeState.back[2][1] = this.cubeState.back[1][2];
        this.cubeState.back[1][2] = temp;
        const topRow = [...this.cubeState.top[0]].reverse();
        const rightCol = this.cubeState.right.map(row => row[2])
        const bottomRow = [...this.cubeState.bottom[2]].reverse();
        const leftCol = this.cubeState.left.map(row => row[0]);

        for (let i = 0; i < 3; i++) {
          this.cubeState.left[i][0] = topRow[i];
          this.cubeState.top[0][i] = rightCol[i];
          this.cubeState.right[i][2] = bottomRow[i];
          this.cubeState.bottom[2][i] = leftCol[i];
        }
      }
    }

    rotateLeft(times: number) {
      for (let i = 0; i < times; i++) {
        let temp = this.cubeState.left[0][2];
        this.cubeState.left[0][2] = this.cubeState.left[0][0];
        this.cubeState.left[0][0] = this.cubeState.left[2][0];
        this.cubeState.left[2][0] = this.cubeState.left[2][2];
        this.cubeState.left[2][2] = temp;
        temp = this.cubeState.left[0][1];
        this.cubeState.left[0][1] = this.cubeState.left[1][0];
        this.cubeState.left[1][0] = this.cubeState.left[2][1];
        this.cubeState.left[2][1] = this.cubeState.left[1][2];
        this.cubeState.left[1][2] = temp;
        const topCol = this.cubeState.top.map(row => row[0])
        const backCol = this.cubeState.back.map(row => row[2]).reverse()
        const bottomCol = this.cubeState.bottom.map(row => row[0]).reverse();
        const frontCol = this.cubeState.front.map(row => row[0])

        for (let i = 0; i < 3; i++) {
          this.cubeState.back[i][2] = bottomCol[i];
          this.cubeState.bottom[i][0] = frontCol[i];
          this.cubeState.front[i][0] = topCol[i];
          this.cubeState.top[i][0] = backCol[i];
      }
    }
  }

}
