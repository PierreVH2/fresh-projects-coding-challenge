import { Component, computed, inject, input } from '@angular/core';
import { HousesService } from '../../services/houses';

@Component({
  selector: 'app-image-gallery',
  imports: [],
  templateUrl: './image-gallery.html',
  styleUrl: './image-gallery.css',
})
export class ImageGallery {
  housesService: HousesService = inject(HousesService);

  readonly images = computed(() => this.housesService.hoveredRoom()?.images?.map((i) => `${this.housesService.house()?.basePath}/${i}`) ?? []);
  readonly roomName = computed(() => this.housesService.hoverRoomName() ?? '');
}
