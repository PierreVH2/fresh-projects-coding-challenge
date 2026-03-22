import { AfterViewInit, Component, computed, ElementRef, inject, input, OnDestroy, signal, ViewChild } from '@angular/core';
import { HousesService } from '../../services/houses';

interface Dimensions {
  width: number;
  height: number;
}

@Component({
  selector: 'app-image-gallery',
  imports: [],
  templateUrl: './image-gallery.html',
  styleUrl: './image-gallery.css',
})
export class ImageGallery implements AfterViewInit, OnDestroy {

  readonly dimensions = signal<Dimensions>({
    width: 0,
    height: 0,
  });
  singleColMaxSize = input(768);

  @ViewChild('imageTrack') el!: ElementRef;
  private resizeObserver!: ResizeObserver;

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver((entries) => {
      this.dimensions.set({
        width: entries[0]?.contentRect.width ?? 0,
        height: entries[0]?.contentRect.height ?? 0,
      });
    });
    this.resizeObserver.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
  }
  
  housesService: HousesService = inject(HousesService);

  orientation = input.required<'landscape' | 'portrait'>();

  readonly images = computed(() => this.housesService.activeRoom()?.images?.map((i) => `${this.housesService.house()?.basePath}/${i}`) ?? []);
  readonly roomName = computed(() => this.housesService.hoverRoomName() ?? '');

  readonly double = computed(() => {
    const criticalDimension = this.orientation() === 'portrait' ? this.dimensions().width : this.dimensions().height;
    return this.images().length > 1 && criticalDimension >= this.singleColMaxSize();
  });
}
