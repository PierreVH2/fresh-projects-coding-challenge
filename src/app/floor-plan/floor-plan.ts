import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-floor-plan',
  imports: [],
  templateUrl: './floor-plan.html',
  styleUrl: './floor-plan.css',
})
export class FloorPlan {
  image = input.required<string>();
  regions = input.required<Record<string, [number, number][]>>();
  roomClick = output<string>();

  objectEntries = Object.entries as (o: Record<string, [number, number][]>) => [string, [number, number][]][];

  toPoints(coords: [number, number][]): string {
    return coords.map(([x, y]) => `${x},${y}`).join(' ');
  }
}
