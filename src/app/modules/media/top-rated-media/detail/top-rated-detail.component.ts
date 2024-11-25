import { Component, Input, OnInit } from '@angular/core';
import { MediaType } from '../../../../app.routes';

@Component({
  selector: 'top-rated-detail',
  imports: [],
  templateUrl: './top-rated-detail.component.html',
  standalone: true,
  styleUrl: './top-rated-detail.component.scss'
})
export class TopRatedDetailComponent implements OnInit {
  @Input() mediaType!:MediaType;

  public ngOnInit():void {
    console.log('L15 - ngOnInit', this.mediaType);
  }
}
