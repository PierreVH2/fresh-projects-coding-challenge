import { Component, signal } from '@angular/core';
import { FloorPlan } from './floor-plan/floor-plan';

@Component({
  selector: 'app-root',
  imports: [FloorPlan],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fresh-projects');

  handleRoomClick(roomName: string) {
    console.log('Clicked on room:', roomName);
  }
}
