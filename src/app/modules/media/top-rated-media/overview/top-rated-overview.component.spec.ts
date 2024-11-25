import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRatedOverviewComponent } from './top-rated-overview.component';

describe('TopRatedOverviewComponent', () => {
  let component: TopRatedOverviewComponent;
  let fixture: ComponentFixture<TopRatedOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopRatedOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRatedOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
