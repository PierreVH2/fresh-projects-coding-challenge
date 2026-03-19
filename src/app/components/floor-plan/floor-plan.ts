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
    () => Object.entries(this.regions()).reduce<Record<string,string>>((accum, [name, coord]) => ({
      ...accum,
      [name]: this.toPoints(coord)
    }),
    {},
  ));

  private toPoints(coords: [number, number][]): string {
    return coords.map(([x, y]) => `${x},${y}`).join(' ');
  }

  onMouseRoomEnter(room: string): void {
    this.housesService.hoverRoomName.set(room);
  }

  onMouseRoomLeave(): void {
    this.housesService.hoverRoomName.set('');
  }
}
