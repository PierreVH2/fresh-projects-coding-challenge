import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseHeading } from './house-heading';

describe('HouseHeading', () => {
  let component: HouseHeading;
  let fixture: ComponentFixture<HouseHeading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseHeading],
    }).compileComponents();

    fixture = TestBed.createComponent(HouseHeading);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('thumbnail', 'thumb.jpg');
    fixture.componentRef.setInput('heading', 'Test Heading');
    fixture.componentRef.setInput('subheading', 'Test Subheading');
    fixture.componentRef.setInput('description', 'Test Description');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
