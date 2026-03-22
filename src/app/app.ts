import { Component, computed, inject, signal } from '@angular/core';
import { FloorPlan } from './components/floor-plan/floor-plan';
import { HousesService } from './services/houses';
import { ImageGallery } from './components/image-gallery/image-gallery';
import { Responsive } from './services/responsive';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [FloorPlan,ImageGallery,TitleCasePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  housesService: HousesService = inject(HousesService);
  responsive: Responsive = inject(Responsive);

  readonly scrollSpeed = 3;
  readonly sideBySide = computed(() => this.responsive.orientation() === 'landscape');

  readonly activeRoomName = this.housesService.activeRoomName;
  readonly house = this.housesService.house;
  readonly houseFloorPlan = computed(() => `${this.house()?.basePath}/${this.house()?.floorPlan}`);
  readonly houseRegions = computed(() => {
    const rooms = this.house()?.rooms;
    if (!rooms) {
      return {};
    }

    return Object.entries(rooms).reduce((acc, [name, room]) => ({
        ...acc,
        [name]: room.vertices
      }), {});
  });

  handleRoomClick(roomName: string) {
    this.housesService.clickedRoomName.update(
      (cur) => cur === roomName ? '' : roomName
    );
  }

  autoScroll = signal(true);

  handleScrollEnd() {
    this.housesService.defaultRoom.update((cur) => {
      const rooms = Object.keys(this.house()?.rooms ?? {});
      const idx = rooms.indexOf(cur);
      return rooms[(idx + 1) % rooms.length];
    });
  }
}

