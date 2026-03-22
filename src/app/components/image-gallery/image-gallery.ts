import { AfterViewInit, Component, computed, effect, ElementRef, inject, Injector, input, OnDestroy, output, signal, ViewChild } from '@angular/core';
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
  host: {
    '(mouseenter)': 'hovered = true',
    '(mouseleave)': 'hovered = false',
  }
})
export class ImageGallery implements AfterViewInit, OnDestroy {
  private injector = inject(Injector);
  private housesService = inject(HousesService);

  orientation = input.required<'horizontal' | 'vertical'>();
  autoScrollPxPerFrame = input(0);
  singleColMaxSize = input(768);
  scrollEnd = output<void>();

  readonly dimensions = signal<Dimensions>({ width: 0, height: 0 });
  readonly images = computed(() =>
    this.housesService.activeRoom()?.images?.map(i => `${this.housesService.house()?.basePath}/${i}`) ?? []
  );
  readonly roomName = computed(() => this.housesService.activeRoomName());
  readonly double = computed(() => {
    const dim = this.orientation() === 'horizontal' ? this.dimensions().width : this.dimensions().height;
    return this.images().length > 1 && dim >= this.singleColMaxSize();
  });

  @ViewChild('imageTrack') el!: ElementRef;
  private resizeObserver!: ResizeObserver;
  private rafId = 0;
  hovered = false;

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.dimensions.set({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    this.resizeObserver.observe(this.el.nativeElement);
    effect(() => {
      if (this.autoScrollPxPerFrame() > 0) this.startScroll();
      else this.stopScroll();
    }, { injector: this.injector });
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.stopScroll();
  }

  private startScroll() {
    this.stopScroll();
    const el: HTMLElement = this.el.nativeElement;
    let elapsedFrames = 0;
    const step = () => {
      if (!this.hovered) {
        const horizontal = this.orientation() === 'horizontal';
        const scrollMax = horizontal
          ? el.scrollWidth - el.clientWidth
          : el.scrollHeight - el.clientHeight;
        const pxPerFrame = this.autoScrollPxPerFrame();
        if (scrollMax <= 0) {
          const viewportSize = horizontal ? el.clientWidth : el.clientHeight;
          if (++elapsedFrames >= viewportSize / pxPerFrame) {
            elapsedFrames = 0;
            this.scrollEnd.emit();
          }
        } else {
          elapsedFrames = 0;
          const current = horizontal ? el.scrollLeft : el.scrollTop;
          const next = current + pxPerFrame;
          if (next >= scrollMax) {
            if (horizontal) el.scrollLeft = 0; else el.scrollTop = 0;
            this.scrollEnd.emit();
          } else {
            if (horizontal) el.scrollLeft = next; else el.scrollTop = next;
          }
        }
      }
      this.rafId = requestAnimationFrame(step);
    };
    this.rafId = requestAnimationFrame(step);
  }

  private stopScroll() { cancelAnimationFrame(this.rafId); }
}
