import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef, signal, computed } from '@angular/core';
import { FloorPlan } from './floor-plan';
import { HousesService } from '../../services/houses';

const mockHoverRoomName = signal('');
const mockActiveRoomName = computed(() => mockHoverRoomName());

const mockHousesService: Partial<HousesService> = {
  hoverRoomName: mockHoverRoomName,
  activeRoomName: mockActiveRoomName,
};

const wideRoom: [number, number][] = [[0, 0], [0.8, 0], [0.8, 0.2], [0, 0.2]];
const tallRoom: [number, number][] = [[0, 0], [0.2, 0], [0.2, 0.8], [0, 0.8]];

describe('Given FloorPlan component', () => {
  let component: FloorPlan;
  let componentRef: ComponentRef<FloorPlan>;
  let fixture: ComponentFixture<FloorPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorPlan],
      providers: [{ provide: HousesService, useValue: mockHousesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FloorPlan);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    mockHoverRoomName.set('');
    componentRef.setInput('image', '/test/plan.jpg');
    componentRef.setInput('regions', {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('and an image is provided', () => {
    it('should render the image with the correct src', () => {
      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.src).toContain('/test/plan.jpg');
    });
  });

  describe('and regions are provided', () => {
    beforeEach(() => {
      componentRef.setInput('regions', { kitchen: wideRoom, hallway: tallRoom });
      fixture.detectChanges();
    });

    it('should render a polygon for each region', () => {
      const polygons = fixture.nativeElement.querySelectorAll('polygon');
      expect(polygons.length).toBe(2);
    });

    it('should render a text label for each region', () => {
      const texts = fixture.nativeElement.querySelectorAll('text');
      expect(texts.length).toBe(2);
    });

    it('should set the points attribute on each polygon', () => {
      const polygons: NodeListOf<SVGPolygonElement> = fixture.nativeElement.querySelectorAll('polygon');
      polygons.forEach(p => expect(p.getAttribute('points')).toBeTruthy());
    });

    describe('and a room is wider than it is tall', () => {
      it('should not rotate the text label', () => {
        const texts: NodeListOf<SVGTextElement> = fixture.nativeElement.querySelectorAll('text');
        const kitchenText = Array.from(texts).find(t => t.textContent?.trim() === 'Kitchen');
        expect(kitchenText?.getAttribute('transform')).toBeNull();
      });
    });

    describe('and a room is taller than it is wide', () => {
      it('should apply a rotate transform to the text label', () => {
        const texts: NodeListOf<SVGTextElement> = fixture.nativeElement.querySelectorAll('text');
        const hallwayText = Array.from(texts).find(t => t.textContent?.trim() === 'Hallway');
        expect(hallwayText?.getAttribute('transform')).toContain('rotate(-90');
      });
    });
  });

  describe('and a room is clicked', () => {
    beforeEach(() => {
      componentRef.setInput('regions', { kitchen: wideRoom });
      fixture.detectChanges();
    });

    it('should emit roomClick with the room name', () => {
      const emitted: string[] = [];
      component.roomClick.subscribe((name: string) => emitted.push(name));
      fixture.nativeElement.querySelector('polygon').dispatchEvent(new Event('click'));
      expect(emitted).toEqual(['kitchen']);
    });
  });

  describe('and the mouse enters a room', () => {
    beforeEach(() => {
      componentRef.setInput('regions', { kitchen: wideRoom });
      fixture.detectChanges();
    });

    it('should set hoverRoomName on HousesService', () => {
      fixture.nativeElement.querySelector('polygon').dispatchEvent(new Event('mouseenter'));
      expect(mockHoverRoomName()).toBe('kitchen');
    });
  });

  describe('and the mouse leaves a room', () => {
    beforeEach(() => {
      componentRef.setInput('regions', { kitchen: wideRoom });
      mockHoverRoomName.set('kitchen');
      fixture.detectChanges();
    });

    it('should clear hoverRoomName on HousesService', () => {
      fixture.nativeElement.querySelector('polygon').dispatchEvent(new Event('mouseleave'));
      expect(mockHoverRoomName()).toBe('');
    });
  });

  describe('and a room is the active room', () => {
    beforeEach(() => {
      componentRef.setInput('regions', { kitchen: wideRoom });
      mockHoverRoomName.set('kitchen');
      fixture.detectChanges();
    });

    it('should apply the active class to the matching polygon', () => {
      const polygon: SVGPolygonElement = fixture.nativeElement.querySelector('polygon');
      expect(polygon.classList).toContain('active');
    });
  });

  describe('and no room is active', () => {
    beforeEach(() => {
      componentRef.setInput('regions', { kitchen: wideRoom });
      fixture.detectChanges();
    });

    it('should not apply the active class to any polygon', () => {
      const polygon: SVGPolygonElement = fixture.nativeElement.querySelector('polygon');
      expect(polygon.classList).not.toContain('active');
    });
  });
});
