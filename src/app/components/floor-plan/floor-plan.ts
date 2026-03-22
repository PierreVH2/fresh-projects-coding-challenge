import { KeyValuePipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { HousesService } from '../../services/houses';

@Component({
  selector: 'app-floor-plan',
  imports: [KeyValuePipe],
  templateUrl: './floor-plan.html',
  styleUrl: './floor-plan.css',
  standalone: true,
})
export class FloorPlan {
  housesService: HousesService = inject(HousesService);

  image = input.required<string>();
  regions = input.required<Record<string, [number, number][]>>();
  roomClick = output<string>();

  readonly regionsArray = computed(
    () => Object.entries(this.regions()).reduce<Record<string, { points: string; cx: number; cy: number; rotate: boolean }>>((accum, [name, coords]) => {
      const xs = coords.map(([x]) => x);
      const ys = coords.map(([, y]) => y);
      const w = Math.max(...xs) - Math.min(...xs);
      const h = Math.max(...ys) - Math.min(...ys);
      return {
        ...accum,
        [name]: {
          points: this.toPoints(coords),
          cx: xs.reduce((s, x) => s + x, 0) / coords.length,
          cy: ys.reduce((s, y) => s + y, 0) / coords.length,
          rotate: h > w,
        }
      };
    }, {})
  );

  private toPoints(coords: [number, number][]): string {
    return coords.map(([x, y]) => `${x},${y}`).join(' ');
  }

  readonly activeRoomName = computed(() => this.housesService.activeRoomName());

  onMouseRoomEnter(room: string): void {
    this.housesService.hoverRoomName.set(room);
  }

  onMouseRoomLeave(): void {
    this.housesService.hoverRoomName.set('');
  }
}
