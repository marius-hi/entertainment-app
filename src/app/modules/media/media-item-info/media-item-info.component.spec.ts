import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaItemInfoComponent } from './media-item-info.component';

describe('MediaItemInfoComponent', () => {
  let component: MediaItemInfoComponent;
  let fixture: ComponentFixture<MediaItemInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaItemInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaItemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
