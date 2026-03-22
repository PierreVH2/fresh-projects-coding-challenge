import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, computed, Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { App } from './app';
import { HousesService } from './services/houses';
import { Responsive } from './services/responsive';
import { FloorPlan } from './components/floor-plan/floor-plan';
import { ImageGallery } from './components/image-gallery/image-gallery';

@Component({ selector: 'app-floor-plan', template: '', standalone: true })
class MockFloorPlan {
  @Input() image = '';
  @Input() regions: Record<string, [number, number][]> = {};
}

@Component({ selector: 'app-image-gallery', template: '', standalone: true })
class MockImageGallery {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() autoScrollPxPerFrame = 0;
}

const mockHouse = signal<any>(undefined);
const mockClickedRoomName = signal('');
const mockHoverRoomName = signal('');
const mockDefaultRoom = signal('');
const mockActiveRoomName = computed(() =>
  mockClickedRoomName() || mockHoverRoomName() || mockDefaultRoom()
);

const mockHousesService: Partial<HousesService> = {
  house: mockHouse,
  clickedRoomName: mockClickedRoomName,
  hoverRoomName: mockHoverRoomName,
  defaultRoom: mockDefaultRoom,
  activeRoomName: mockActiveRoomName,
};

const mockWidth = signal(1024);
const mockHeight = signal(768);

const mockResponsive: Partial<Responsive> = {
  orientation: computed(() => mockWidth() >= mockHeight() ? 'landscape' : 'portrait'),
  width: mockWidth,
  height: mockHeight,
};

describe('Given App component', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: HousesService, useValue: mockHousesService },
        { provide: Responsive, useValue: mockResponsive },
      ],
    })
    .overrideComponent(App, {
      remove: { imports: [FloorPlan, ImageGallery] },
      add: { imports: [MockFloorPlan, MockImageGallery] },
    })
    .compileComponents();

    mockHouse.set(undefined);
    mockClickedRoomName.set('');
    mockHoverRoomName.set('');
    mockDefaultRoom.set('');
    mockWidth.set(1024);
    mockHeight.set(768);

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('and the screen is landscape', () => {
    beforeEach(() => {
      mockWidth.set(1024);
      mockHeight.set(768);
      fixture.detectChanges();
    });

    it('should apply the side-by-side class to the container', () => {
      const container: HTMLElement = fixture.nativeElement.querySelector('.app-container');
      expect(container.classList).toContain('side-by-side');
    });

    it('should pass vertical orientation to image-gallery', () => {
      const gallery = fixture.debugElement.query(By.directive(MockImageGallery)).componentInstance as MockImageGallery;
      expect(gallery.orientation).toBe('vertical');
    });
  });

  describe('and the screen is portrait', () => {
    beforeEach(() => {
      mockWidth.set(768);
      mockHeight.set(1024);
      fixture.detectChanges();
    });

    it('should not apply the side-by-side class to the container', () => {
      const container: HTMLElement = fixture.nativeElement.querySelector('.app-container');
      expect(container.classList).not.toContain('side-by-side');
    });

    it('should pass horizontal orientation to image-gallery', () => {
      const gallery = fixture.debugElement.query(By.directive(MockImageGallery)).componentInstance as MockImageGallery;
      expect(gallery.orientation).toBe('horizontal');
    });
  });

  describe('and the house manifest is loaded', () => {
    beforeEach(() => {
      mockHouse.set({
        id: '1',
        address: '1 Test St',
        basePath: '/houses/1',
        floorPlan: 'plan.jpg',
        rooms: {
          kitchen: { vertices: [[0.1, 0.1], [0.5, 0.5]], images: [] },
          lounge:  { vertices: [[0.5, 0.1], [0.9, 0.5]], images: [] },
        }
      });
      fixture.detectChanges();
    });

    it('should pass the floor plan image url to floor-plan', () => {
      const floorPlan = fixture.debugElement.query(By.directive(MockFloorPlan)).componentInstance as MockFloorPlan;
      expect(floorPlan.image).toBe('/houses/1/plan.jpg');
    });

    describe('and a room is clicked', () => {
      it('should set clickedRoomName to the clicked room', () => {
        component.handleRoomClick('kitchen');
        expect(mockClickedRoomName()).toBe('kitchen');
      });

      describe('and the same room is clicked again', () => {
        it('should clear clickedRoomName', () => {
          component.handleRoomClick('kitchen');
          component.handleRoomClick('kitchen');
          expect(mockClickedRoomName()).toBe('');
        });
      });
    });

    describe('and scrollEnd is triggered', () => {
      beforeEach(() => mockDefaultRoom.set('kitchen'));

      it('should advance defaultRoom to the next room', () => {
        component.handleScrollEnd();
        expect(mockDefaultRoom()).toBe('lounge');
      });

      describe('and the last room is active', () => {
        beforeEach(() => mockDefaultRoom.set('lounge'));

        it('should wrap defaultRoom back to the first room', () => {
          component.handleScrollEnd();
          expect(mockDefaultRoom()).toBe('kitchen');
        });
      });
    });
  });

  describe('and autoScroll is enabled', () => {
    beforeEach(() => {
      component.autoScroll.set(true);
      fixture.detectChanges();
    });

    it('should pass scrollSpeed as autoScrollPxPerFrame to image-gallery', () => {
      const gallery = fixture.debugElement.query(By.directive(MockImageGallery)).componentInstance as MockImageGallery;
      expect(gallery.autoScrollPxPerFrame).toBe(component.scrollSpeed);
    });
  });

  describe('and autoScroll is disabled', () => {
    beforeEach(() => {
      component.autoScroll.set(false);
      fixture.detectChanges();
    });

    it('should pass 0 as autoScrollPxPerFrame to image-gallery', () => {
      const gallery = fixture.debugElement.query(By.directive(MockImageGallery)).componentInstance as MockImageGallery;
      expect(gallery.autoScrollPxPerFrame).toBe(0);
    });

    it('should uncheck the checkbox', () => {
      const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
      expect(checkbox.checked).toBe(false);
    });
  });

  describe('and the active room name changes', () => {
    it('should display the active room name in the heading', () => {
      mockHoverRoomName.set('kitchen');
      fixture.detectChanges();
      const heading: HTMLElement = fixture.nativeElement.querySelector('.image-gallery-heading');
      expect(heading.textContent?.trim()).toBe('Kitchen');
    });
  });
});
