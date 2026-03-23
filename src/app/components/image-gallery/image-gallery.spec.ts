import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef, signal, computed } from '@angular/core';
import { ImageGallery } from './image-gallery';
import { HouseManifest, HousesService } from '../../services/houses';

const mockHouse = signal<HouseManifest>({
  id: '1',
  address: '1 Test St',
  basePath: '/houses/1',
  floorPlan: 'plan.jpg',
  thumbnail: 'thumb.jpg',
  description: 'description',
  price: 'R50 pm',
  rooms: {
    kitchen: { vertices: [], images: ['a.jpg', 'b.jpg'], description: 'description' },
  }
});
const activeRoomName = signal<string>('');

const mockHousesService: Partial<HousesService> = {
  hoverRoomName: signal(''),
  clickedRoomName: signal(''),
  defaultRoom: signal(''),
  activeRoomName: computed(() => activeRoomName()),
  house: mockHouse,
  activeRoom: computed(() => {
    const house = mockHouse();
    const name = mockHousesService.activeRoomName!();
    return house?.rooms[name];
  }),
};

describe('Given ImageGallery component', () => {
  let component: ImageGallery;
  let componentRef: ComponentRef<ImageGallery>;
  let fixture: ComponentFixture<ImageGallery>;
  let housesService: HousesService;

  beforeEach(async () => {
    (window as any).ResizeObserver = class {
      observe() { }
      disconnect() { }
    };

    await TestBed.configureTestingModule({
      imports: [ImageGallery],
      providers: [{ provide: HousesService, useValue: mockHousesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageGallery);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    housesService = TestBed.inject(HousesService);
    componentRef.setInput('orientation', 'horizontal');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('and orientation is horizontal', () => {
    beforeEach(() => {
      componentRef.setInput('orientation', 'horizontal');
      fixture.detectChanges();
    });

    it('should apply the horizontal class to the track', () => {
      const track: HTMLElement = fixture.nativeElement.querySelector('.image-track');
      expect(track.classList).toContain('horizontal');
    });

    describe('and the track width is below singleColMaxSize', () => {
      beforeEach(() => {
        component.dimensions.set({ width: 400, height: 400 });
        fixture.detectChanges();
      });

      it('should apply the single class', () => {
        const track: HTMLElement = fixture.nativeElement.querySelector('.image-track');
        expect(track.classList).toContain('single');
      });
    });
  });

  describe('and orientation is vertical', () => {
    beforeEach(() => {
      componentRef.setInput('orientation', 'vertical');
      fixture.detectChanges();
    });

    it('should apply the vertical class to the track', () => {
      const track: HTMLElement = fixture.nativeElement.querySelector('.image-track');
      expect(track.classList).toContain('vertical');
    });

    describe('and the track height is below singleColMaxSize', () => {
      beforeEach(() => {
        component.dimensions.set({ width: 400, height: 400 });
        fixture.detectChanges();
      });

      it('should apply the single class', () => {
        const track: HTMLElement = fixture.nativeElement.querySelector('.image-track');
        expect(track.classList).toContain('single');
      });
    });

    describe('and the track height is above singleColMaxSize and there are multiple images', () => {
      beforeEach(() => {
        component.dimensions.set({ width: 800, height: 800 });
        activeRoomName.set('kitchen');
        fixture.detectChanges();
      });

      it('should apply the double class', () => {
        const track: HTMLElement = fixture.nativeElement.querySelector('.image-track');
        expect(track.classList).toContain('double');
      });
    });
  });

  describe('and there are no images', () => {
    beforeEach(() => {
      activeRoomName.set('');
      fixture.detectChanges();
    });

    it('should render no img elements', () => {
      const imgs = fixture.nativeElement.querySelectorAll('img');
      expect(imgs.length).toBe(0);
    });
  });

  describe('and images are available', () => {
    beforeEach(() => {
      activeRoomName.set('kitchen');
      fixture.detectChanges();
    });

    it('should render an img for each image', () => {
      const imgs = fixture.nativeElement.querySelectorAll('img');
      expect(imgs.length).toBe(2);
    });

    it('should prefix each image src with the basePath', () => {
      const imgs: NodeListOf<HTMLImageElement> = fixture.nativeElement.querySelectorAll('img');
      expect(imgs[0].src).toContain('/houses/1/a.jpg');
      expect(imgs[1].src).toContain('/houses/1/b.jpg');
    });
  });

  describe('and the user hovers over the component', () => {
    it('should set hovered to true', () => {
      fixture.nativeElement.dispatchEvent(new Event('mouseenter'));
      expect(component.hovered).toBeTruthy();
    });
  });

  describe('and the user moves the mouse away from the component', () => {
    it('should set hovered to false on mouseleave', () => {
      fixture.nativeElement.dispatchEvent(new Event('mouseenter'));
      fixture.nativeElement.dispatchEvent(new Event('mouseleave'));
      expect(component.hovered).toBeFalsy();
    });
  });
});
