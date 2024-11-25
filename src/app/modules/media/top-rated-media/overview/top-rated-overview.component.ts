import { Component, Input, OnInit } from '@angular/core';
import { MediaType } from '../../../../app.routes';

@Component({
  selector: 'app-top-rated-overview',
  imports: [],
  templateUrl: './top-rated-overview.component.html',
  standalone: true,
  styleUrl: './top-rated-overview.component.scss'
})
export class TopRatedOverviewComponent implements OnInit {
  @Input() mediaType!:MediaType;

  public ngOnInit():void {
    console.log('L15 - ngOnInit', this.mediaType);
  }
}
