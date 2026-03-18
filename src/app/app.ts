import { Component, computed, inject, signal } from '@angular/core';
import { FloorPlan } from './components/floor-plan/floor-plan';
import { HousesService } from './services/houses';

@Component({
  selector: 'app-root',
  imports: [FloorPlan],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fresh-projects');

  housesService: HousesService = inject(HousesService);

  readonly house = this.housesService.house.value;
  readonly houseImage = computed(() => `${this.house()?.basePath}/${this.house()?.floorPlan}`);

  handleRoomClick(roomName: string) {
    console.log('Clicked on room:', roomName);
  }
}

