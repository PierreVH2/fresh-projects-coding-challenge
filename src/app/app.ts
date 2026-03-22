import { Component, computed, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FloorPlan } from './components/floor-plan/floor-plan';
import { ImageGallery } from './components/image-gallery/image-gallery';
import { HousesService } from './services/houses';
import { Responsive } from './services/responsive';

@Component({
  selector: 'app-root',
  imports: [FloorPlan, ImageGallery, TitleCasePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private housesService = inject(HousesService);
  private responsive = inject(Responsive);

  readonly scrollSpeed = 3;
  readonly autoScroll = signal(true);
  readonly sideBySide = computed(() => this.responsive.orientation() === 'landscape');
  readonly activeRoomName = this.housesService.activeRoomName;

  private readonly house = this.housesService.house;

  readonly houseFloorPlan = computed(() => `${this.house()?.basePath}/${this.house()?.floorPlan}`);
  readonly houseRegions = computed(() => {
    const rooms = this.house()?.rooms;
    if (!rooms) return {};
    return Object.entries(rooms).reduce((acc, [name, room]) => ({
      ...acc,
      [name]: room.vertices
    }), {});
  });

  handleRoomClick(roomName: string) {
    this.housesService.clickedRoomName.update(cur => cur === roomName ? '' : roomName);
  }

  handleScrollEnd() {
    this.housesService.defaultRoom.update(cur => {
      const rooms = Object.keys(this.house()?.rooms ?? {});
      const idx = rooms.indexOf(cur);
      return rooms[(idx + 1) % rooms.length];
    });
  }
}
