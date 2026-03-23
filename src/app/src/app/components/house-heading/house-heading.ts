import { Component, input } from '@angular/core';

@Component({
  selector: 'app-house-heading',
  imports: [],
  templateUrl: './house-heading.html',
  styleUrl: './house-heading.css',
})
export class HouseHeading {
  thumbnail = input.required<string>();
  heading = input.required<string>();
  subheading = input.required<string>();
  description = input.required<string>();
}
