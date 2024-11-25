import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRatedDetailComponent } from './top-rated-detail.component';

describe('TopRatedDetailComponent', () => {
  let component: TopRatedDetailComponent;
  let fixture: ComponentFixture<TopRatedDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopRatedDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRatedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
