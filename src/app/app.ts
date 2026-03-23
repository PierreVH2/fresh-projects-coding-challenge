import { Component, computed, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FloorPlan } from './components/floor-plan/floor-plan';
import { ImageGallery } from './components/image-gallery/image-gallery';
import { HouseHeading } from './src/app/components/house-heading/house-heading';
import { HousesService } from './services/houses';
import { Responsive } from './services/responsive';

@Component({
  selector: 'app-root',
  imports: [FloorPlan, ImageGallery, TitleCasePipe, HouseHeading],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private housesService = inject(HousesService);
  private responsive = inject(Responsive);

  readonly scrollSpeed = 3;
  readonly autoScroll = signal(true);
  readonly sideBySide = computed(() => this.responsive.orientation() === 'landscape' && this.responsive.breakpoint() !== 'mobile');
  readonly isMobile = computed(() => this.responsive.breakpoint() === 'mobile');
  readonly activeRoomName = this.housesService.activeRoomName;
  readonly roomDescription = computed(() => this.housesService.activeRoom()?.description ?? '');

  private readonly house = this.housesService.house;

  readonly houseFloorPlan = computed(() => `${this.house()?.basePath}/${this.house()?.floorPlan}`);
  readonly houseThumbnail = computed(() => `${this.house()?.basePath}/${this.house()?.thumbnail}`);
  readonly houseAddress = computed(() => this.house()?.address ?? '');
  readonly housePrice = computed(() => this.house()?.price ?? '');
  readonly houseDescription = computed(() => this.house()?.description ?? '');
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
