import { TestBed } from '@angular/core/testing';
import { Responsive } from './responsive';

describe('Given Responsive service', () => {
  let service: Responsive;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Responsive);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('and the window is resized', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });
      window.dispatchEvent(new Event('resize'));
    });

    it('should update width', () => {
      expect(service.width()).toBe(800);
    });

    it('should update height', () => {
      expect(service.height()).toBe(600);
    });
  });

  describe('and width / height ratio is less than 4:3', () => {
    beforeEach(() => {
      service.width.set(768);
      service.height.set(1024);
    });

    it('orientation should be portrait', () => {
      expect(service.orientation()).toBe('portrait');
    });
  });

  describe('and width / height ratio is equal to 4:3', () => {
    beforeEach(() => {
      service.width.set(800);
      service.height.set(600);
    });

    it('orientation should be landscape', () => {
      expect(service.orientation()).toBe('landscape');
    });
  });

  describe('and width / height ratio is greater than 4:3', () => {
    beforeEach(() => {
      service.width.set(1920);
      service.height.set(1080);
    });

    it('orientation should be landscape', () => {
      expect(service.orientation()).toBe('landscape');
    });
  });

  describe('and the largest dimension is less than 768', () => {
    beforeEach(() => {
      service.width.set(400);
      service.height.set(600);
    });

    it('breakpoint should be mobile', () => {
      expect(service.breakpoint()).toBe('mobile');
    });
  });

  describe('and the largest dimension is between 768 and 1023', () => {
    beforeEach(() => {
      service.width.set(600);
      service.height.set(900);
    });

    it('breakpoint should be tablet', () => {
      expect(service.breakpoint()).toBe('tablet');
    });
  });

  describe('and the largest dimension is 1024 or above', () => {
    beforeEach(() => {
      service.width.set(1024);
      service.height.set(768);
    });

    it('breakpoint should be desktop', () => {
      expect(service.breakpoint()).toBe('desktop');
    });
  });
});
