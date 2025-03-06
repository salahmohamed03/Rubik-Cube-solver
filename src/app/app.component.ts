import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RubiksCubeViewComponent } from './rubiks-cube-view/rubiks-cube-view.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RubiksCubeViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'rubiks-cube';
}
