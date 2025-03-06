import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeService } from '../three.service';

@Component({
  selector: 'app-rubiks-cube-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rubiks-cube-view.component.html',
  styleUrl: './rubiks-cube-view.component.css'
})
export class RubiksCubeViewComponent implements OnInit {
  @ViewChild('container', { static: true }) container!: ElementRef;

  constructor(private threeService: ThreeService) { }

  ngOnInit(): void {
    this.threeService.initializeScene(this.container);
  }
  rotateFront(){
    this.threeService.rotateFront(90);
  }
  rotateBack(){
    this.threeService.rotateBack(90);
  }
  rotateLeft(){
    this.threeService.rotateLeft(90);
  }
  rotateRight(){
    this.threeService.rotateRight(90);
  }
  rotateTop(){
    this.threeService.rotateTop(90);
  }
  rotateBottom(){
    this.threeService.rotateBottom(90);
  }
}
