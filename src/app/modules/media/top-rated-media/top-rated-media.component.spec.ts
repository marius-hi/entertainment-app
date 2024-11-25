import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRatedMediaComponent } from './top-rated-media.component';

describe('TopRatedMediaComponent', () => {
  let component: TopRatedMediaComponent;
  let fixture: ComponentFixture<TopRatedMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopRatedMediaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRatedMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
