# FreshProjects — Technical Assessment

An Angular 21 application that displays interactive floor plans for residential properties, allowing users to explore rooms and browse associated room images.

## Features

### Floor Plan Viewer
- Renders a floor plan image with SVG polygon overlays representing individual rooms
- Each room displays its name as a label, rotated 90° for rooms that are taller than they are wide
- Rooms highlight on hover (subtle grey) and when active (blue)
- Clicking a room selects it; clicking again deselects it

### Image Gallery
- Displays photos associated with the currently active room
- Can be used in a portrat (vertical scroll) or landscaope (horizontal scroll) layout
- Renders as a single column/row of images on smaller screeens and a double column/row on larger screens
  - NOTE: The horizontal double layout is currently broken and is disabled
- **Auto-scroll**: optional feature that smoothly scrolls through images at a configurable speed
  - Auto-scroll can be paused by hovering over the component
  - A signal is emitted when the scroll reaches the end of the track, this is currently used to advance to the next room


### Responsive Layout
- Side-by-side layout (floor plan left, gallery right) when the aspect ratio exceeds 4:3
- Stacked layout (floor plan above, gallery below) otherwise
- Floor plan scales to a maximum of 50% of the limiting dimension, with the gallery occupying the remaining space

### Room Cycling
- When no room is manually selected or hovered, the app automatically cycles through rooms, keeping the gallery content fresh

### Theming
- Global CSS custom properties for font, colours, and spacing, making the app straightforward to retheme

## Tech Stack

- **Angular 21** with standalone components and signal-based reactivity
- **TypeBox** for runtime validation of house manifest JSON
- **Vitest** for unit testing

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
ng serve
```

Then open [http://localhost:4200](http://localhost:4200) in your browser.

## Running Tests

```bash
ng test
```

Tests are written with Vitest and cover all services and components:

- `HousesService` — signal priority, manifest loading, active room resolution
- `Responsive` — orientation, breakpoint, and resize event handling
- `FloorPlan` component — region rendering, hover/click interactions, active room highlighting
- `ImageGallery` component — layout modes, image rendering, hover state
- `App` component — layout switching, room click handling, scroll end cycling, auto-scroll wiring

## Building

```bash
ng build
```

Build artifacts are output to the `dist/` directory.
