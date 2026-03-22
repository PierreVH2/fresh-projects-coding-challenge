import { AfterViewInit, Component, computed, ElementRef, Injector, inject, input, OnDestroy, output, signal, ViewChild, effect } from '@angular/core';
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
  housesService: HousesService = inject(HousesService);

  readonly dimensions = signal<Dimensions>({ width: 0, height: 0 });
  singleColMaxSize = input(768);
  orientation = input.required<'horizontal' | 'vertical'>();
  autoScrollPxPerFrame = input(0);
  scrollEnd = output<void>();

  @ViewChild('imageTrack') el!: ElementRef;
  private resizeObserver!: ResizeObserver;
  private rafId = 0;
  hovered = false;

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver((entries) => {
      this.dimensions.set({
        width: entries[0]?.contentRect.width ?? 0,
        height: entries[0]?.contentRect.height ?? 0,
      });
    });
    this.resizeObserver.observe(this.el.nativeElement);
    effect(() => {
      if (this.autoScrollPxPerFrame() > 0) {
        this.startScroll();
      }
      else {
        this.stopScroll();
      }
    }, { injector: this.injector });
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect?.();
    this.stopScroll();
  }

  private startScroll() {
    this.stopScroll();
    const el: HTMLElement = this.el.nativeElement;
    let elapsedFrames = 0;
    const step = () => {
      if (!this.hovered) {
        const portrait = this.orientation() === 'horizontal';
        const scrollMax = portrait
          ? el.scrollWidth - el.clientWidth
          : el.scrollHeight - el.clientHeight;
        const pxPerFrame = this.autoScrollPxPerFrame();

        if (scrollMax <= 0) {
          const viewportSize = portrait ? el.clientWidth : el.clientHeight;
          const framesNeeded = viewportSize / pxPerFrame;
          if (++elapsedFrames >= framesNeeded) {
            elapsedFrames = 0;
            this.scrollEnd.emit();
          }
        } else {
          elapsedFrames = 0;
          const current = portrait ? el.scrollLeft : el.scrollTop;
          const next = current + pxPerFrame;
          if (next >= scrollMax) {
            if (portrait) el.scrollLeft = 0; else el.scrollTop = 0;
            this.scrollEnd.emit();
          } else {
            if (portrait) el.scrollLeft = next; else el.scrollTop = next;
          }
        }
      }
      this.rafId = requestAnimationFrame(step);
    };
    this.rafId = requestAnimationFrame(step);
  }

  private stopScroll() {
    cancelAnimationFrame(this.rafId);
  }

  readonly images = computed(() => this.housesService.activeRoom()?.images?.map((i) => `${this.housesService.house()?.basePath}/${i}`) ?? []);
  readonly roomName = computed(() => this.housesService.activeRoomName() ?? '');

  readonly double = computed(() => {
    const criticalDimension = this.orientation() === 'horizontal' ? this.dimensions().width : this.dimensions().height;
    return this.images().length > 1 && criticalDimension >= this.singleColMaxSize();
  });
}
