import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HousesService } from './houses';

const MANIFEST_URL = '/houses/2428742422/manifest.json';

const mockManifest = {
  id: '1',
  address: '1 Test St',
  basePath: '/houses/1',
  floorPlan: 'plan.jpg',
  rooms: {
    kitchen: { vertices: [[0.1, 0.1], [0.5, 0.1], [0.5, 0.5], [0.1, 0.5]] as [number,number][], images: ['a.jpg'] },
    lounge:  { vertices: [[0.5, 0.1], [0.9, 0.1], [0.9, 0.5], [0.5, 0.5]] as [number,number][], images: [] },
  }
};

describe('HousesService', () => {
  let service: HousesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HousesService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(HousesService);
    http = TestBed.inject(HttpTestingController);
    TestBed.tick();
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    http.expectOne(MANIFEST_URL).flush(mockManifest);
    expect(service).toBeTruthy();
  });

  describe('and the manifest has not yet loaded', () => {
    it('house should be undefined', () => {
      expect(service.house()).toBeUndefined();
      http.expectOne(MANIFEST_URL).flush(mockManifest);
    });

    it('activeRoom should be undefined', () => {
      expect(service.activeRoom()).toBeUndefined();
      http.expectOne(MANIFEST_URL).flush(mockManifest);
    });
  });

  describe('and the manifest has loaded', () => {
    beforeEach(() => {
      http.expectOne(MANIFEST_URL).flush(mockManifest);
    });

    it('house should return the manifest', () => {
      expect(service.house()).toEqual(mockManifest);
    });

    describe('and no room signals are set', () => {
      it('activeRoomName should be empty', () => {
        expect(service.activeRoomName()).toBe('');
      });

      it('activeRoom should be undefined', () => {
        expect(service.activeRoom()).toBeUndefined();
      });
    });

    describe('and only defaultRoom is set', () => {
      beforeEach(() => service.defaultRoom.set('kitchen'));

      it('activeRoomName should be the defaultRoom', () => {
        expect(service.activeRoomName()).toBe('kitchen');
      });

      it('activeRoom should return the matching room', () => {
        expect(service.activeRoom()).toEqual(mockManifest.rooms.kitchen);
      });
    });

    describe('and only hoverRoomName is set', () => {
      beforeEach(() => service.hoverRoomName.set('lounge'));

      it('activeRoomName should be the hovered room', () => {
        expect(service.activeRoomName()).toBe('lounge');
      });
    });

    describe('and both hoverRoomName and defaultRoom are set', () => {
      beforeEach(() => {
        service.defaultRoom.set('kitchen');
        service.hoverRoomName.set('lounge');
      });

      it('activeRoomName should prefer hoverRoomName over defaultRoom', () => {
        expect(service.activeRoomName()).toBe('lounge');
      });
    });

    describe('and clickedRoomName is set', () => {
      beforeEach(() => {
        service.defaultRoom.set('kitchen');
        service.hoverRoomName.set('lounge');
        service.clickedRoomName.set('kitchen');
      });

      it('activeRoomName should prefer clickedRoomName over hoverRoomName', () => {
        expect(service.activeRoomName()).toBe('kitchen');
      });

      it('activeRoom should return the clicked room', () => {
        expect(service.activeRoom()).toEqual(mockManifest.rooms.kitchen);
      });
    });

    describe('and activeRoomName does not match any room', () => {
      beforeEach(() => service.clickedRoomName.set('nonexistent'));

      it('activeRoom should be undefined', () => {
        expect(service.activeRoom()).toBeUndefined();
      });
    });
  });
});
