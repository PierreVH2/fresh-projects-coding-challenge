import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FloorPlan } from './floor-plan/floor-plan';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FloorPlan],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fresh-projects');
}
