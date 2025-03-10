import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeService } from '../three.service';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-rubiks-cube-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rubiks-cube-view.component.html',
  styleUrl: './rubiks-cube-view.component.css'
})
export class RubiksCubeViewComponent implements OnInit {
  @ViewChild('container', { static: true }) container!: ElementRef;
  move: string = '';
  constructor(private threeService: ThreeService) { }

  ngOnInit(): void {
    this.threeService.initializeScene(this.container);
  }
  Fi(){
    this.threeService.rotateFront(90);
  }
  F(){
    this.threeService.rotateFront(-90);
  }
  B(){
    this.threeService.rotateBack(90);
  }
  Bi(){
    this.threeService.rotateBack(-90);
  }
  L(){
    this.threeService.rotateLeft(90);
  }
  Li(){
    this.threeService.rotateLeft(-90);
  }
  Ri(){
    this.threeService.rotateRight(90);
  }
  R(){
    this.threeService.rotateRight(-90);
  }
  Ui(){
    this.threeService.rotateTop(90);
  }
  U(){
    this.threeService.rotateTop(-90);
  }
  D(){
    this.threeService.rotateBottom(90);
  }
  Di(){
    this.threeService.rotateBottom(-90);
  }
  performMove(){
    this.threeService.performMove(this.move);
  }
  solve(){
    this.move = this.threeService.solveCube();
  }
  scrumble(){
    const scrumble = this.threeService.scrumbleCube();
    console.log(scrumble);
  }
}
