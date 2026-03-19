import { Component, computed, effect, inject, signal } from '@angular/core';
import { FloorPlan } from './components/floor-plan/floor-plan';
import { HousesService } from './services/houses';
import { ImageGallery } from './components/image-gallery/image-gallery';

@Component({
  selector: 'app-root',
  imports: [FloorPlan,ImageGallery],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor() {
    // Define the effect in the constructor or a service
    effect(() => {
      // This code runs initially, and every time 'this.count()' changes
      console.log('The hovered room is: ' + this.housesService.hoverRoomName()); 
    });
  }

  protected readonly title = signal('fresh-projects');

  housesService: HousesService = inject(HousesService);

  readonly house = this.housesService.house;
  readonly houseImage = computed(() => `${this.house()?.basePath}/${this.house()?.floorPlan}`);
  readonly houseRegions = computed(() => {
    const rooms = this.house()?.rooms;
    if (!rooms) return {};

    return Object.entries(rooms).reduce((acc, [name, room]) => ({
        ...acc,
        [name]: room.vertices
      }), {});
  });

  handleRoomClick(roomName: string) {
    console.log('Clicked on room:', roomName);
  }
}

