import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Responsive {
  readonly width = signal(window.innerWidth);
  readonly height = signal(window.innerHeight);

  readonly orientation = computed<'portrait' | 'landscape'>(() =>
    this.width() / this.height() < 4/3 ? 'portrait' : 'landscape'
  );

  readonly breakpoint = computed<'mobile' | 'tablet' | 'desktop'>(() => {
    const size = Math.max(this.width(), this.height());
    if (size < 1024) return 'mobile';
    if (size < 1366) return 'tablet';
    return 'desktop';
  });

  constructor() {
    window.addEventListener('resize', () => {
      this.width.set(window.innerWidth);
      this.height.set(window.innerHeight);
    });
  }
}
