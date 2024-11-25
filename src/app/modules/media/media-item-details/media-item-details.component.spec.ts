import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaItemDetailsComponent } from './media-item-details.component';

describe('MediaItemDetailsComponent', () => {
  let component: MediaItemDetailsComponent;
  let fixture: ComponentFixture<MediaItemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaItemDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
